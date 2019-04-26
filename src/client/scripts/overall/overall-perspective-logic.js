import $ from "jquery";

//NOTE that this function assumes all pie chart slices are convex
export function addTextToPieChart(pieChartSelector) {
  let pieSlices = $(pieChartSelector).find("svg path");
  $(pieChartSelector).find("svg text").remove();//remove old text
  pieSlices.each((index, element) => {
    let title = $(element).find("title")[0].textContent;
    let pathString = $(element).attr("d").trim();
    let commandStrings = pathString.split(/(?=[LMCAz])/); //a list of path commands to draw this pie chart slice
    commandStrings.forEach((item, index) => commandStrings[index] = item.trim());
    let pathCoordinates = [];
    let isLargeSection = false;
    commandStrings.forEach((str) => {
      //convert path 'd' string to a list of parameters
      let key = str[0];
      str = str.substr(1, str.length - 1);
      let commandParameters = str.replace(/\n/g, ",").split(",");
      commandParameters.forEach((item, index) => commandParameters[index] = item.trim());

      //if it's the curve command 'A', then find the 'large-arc-flag'. 0:convex, 1: conconcave
      if (commandParameters.length > 4) {
        let largeArcAndSweepFlags = commandParameters[2].split(" ");
        isLargeSection = Number(largeArcAndSweepFlags[1]) == 1;
      }
      //last 2 coordinates in path parameters are always the x/y coordinates
      if (commandParameters.length >= 2) {
        pathCoordinates.push({
          x: Number(commandParameters[commandParameters.length - 2]),
          y: Number(commandParameters[commandParameters.length - 1])
        });
      }
    });
    let center = pathCoordinates.shift();
    _drawTextOnSVG(pathCoordinates, center, title, isLargeSection, $(pieChartSelector + " > svg"));

  });
}
export function _drawTextOnSVG(pathCoordinates, center, text, isLargeSection, svgElement) {
  let radius = center.x;
  let adjustedCoordinates = pathCoordinates.map((original) => ({ x: original.x - center.x, y: original.y - center.y }));
  if (isLargeSection) {
    adjustedCoordinates = adjustedCoordinates.map((original) => ({ x: original.x * -1, y: original.y * -1 }));
  }
  let lowestX = Math.min(adjustedCoordinates[0].x, adjustedCoordinates[1].x); //uses to favor the left side of the pie slice more.  2/3 favor for left x.
  let dirVector = { x: (adjustedCoordinates[0].x + adjustedCoordinates[1].x + lowestX * 2) / 4, y: (adjustedCoordinates[0].y + adjustedCoordinates[1].y) / 2 };
  let magnitude = Math.sqrt((dirVector.x * dirVector.x) + (dirVector.y * dirVector.y));
  let dirUnitVector = { x: dirVector.x / magnitude, y: dirVector.y / magnitude };

  let offsetMag = (dirUnitVector.x - 1) * -0.5; //1 on the left, 0 on the right, 0.5 on the top and bottom.
  offsetMag = Math.sqrt(offsetMag) * 0.7 + 0.2; //sqrt is so it's higher on the top and lower on the bottom.
  let startPos = { x: (dirUnitVector.x * offsetMag * radius) + radius, y: (dirUnitVector.y * offsetMag * radius) + radius };

  let textEl = $(document.createElementNS('http://www.w3.org/2000/svg', 'text')).attr("x", startPos.x).attr("y", startPos.y).text(text);
  textEl.css({ 'font-size': "0.28rem", "pointer-events": "none" });
  textEl.appendTo(svgElement)
}