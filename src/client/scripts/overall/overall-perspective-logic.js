import $ from "jquery";


export function addTextToPieChart(pieChartSelector){
  let checkExist = setInterval(function() {
    if ($(pieChartSelector).find("svg").length) {
       console.log("Exists!");
       clearInterval(checkExist);
       rawAddTextToPieChart(pieChartSelector);
    } else{
      console.log("LIES");
    }
 }, 100);
}

//NOTE that this function assumes all pie chart slices are convex
function rawAddTextToPieChart(pieChartSelector){
  let pieSlices = $(pieChartSelector).find("svg path");
  pieSlices.each((index,element)=>{
    let title = $(element).find("title")[0].textContent;
    let pathString = $(element).attr("d").trim();
    let commandStrings = pathString.split(/(?=[LMCAz])/); //a list of path commands to draw this pie chart slice
    commandStrings.forEach((item,index)=>commandStrings[index] = item.trim());
    let pathCoordinates = [];
    commandStrings.forEach((str)=>{
      //convert path 'd' string to a list of parameters
      let key = str[0];
      str = str.substr(1,str.length-1);
      let commandParameters = str.replace(/\n/g, ",").split(",");
      commandParameters.forEach((item,index)=>commandParameters[index] = item.trim());
      //last 2 coordinates in path parameters are always the x/y coordinates
      if(commandParameters.length >= 2){
        pathCoordinates.push({
          x:Number(commandParameters[commandParameters.length-2]),
          y:Number(commandParameters[commandParameters.length-1])
        });
      }
    });
    let minX = pathCoordinates.reduce(((min,element)=>Math.min(min,element.x)),Number.MAX_SAFE_INTEGER);
    let maxX = pathCoordinates.reduce(((max,element)=>Math.max(max,element.x)),Number.MIN_SAFE_INTEGER);
    let minY = pathCoordinates.reduce(((min,element)=>Math.min(min,element.y)),Number.MAX_SAFE_INTEGER);
    let maxY = pathCoordinates.reduce(((max,element)=>Math.max(max,element.y)),Number.MIN_SAFE_INTEGER);
    drawTextOnSVG(minX,(minY+maxY)/2,title,$(pieChartSelector + " > svg"));
  });

  function drawTextOnSVG(startX,startY,text,svgElement){
    let textEl = $(document.createElementNS('http://www.w3.org/2000/svg', 'text')).attr("x",startX).attr("y",startY).text(text);
    textEl.css({'font-size': "0.4rem"});
    textEl.appendTo(svgElement)
  }
}