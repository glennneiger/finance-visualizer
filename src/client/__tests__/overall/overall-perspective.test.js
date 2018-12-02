import React from "react";
import renderer from "react-test-renderer";
import SVGPieChart from "react-svg-piechart";

import OverallPerspective from "../../scripts/overall/overall-perspective";
import PerspectiveNavbar from "../../scripts/utility/perspective-navbar";
describe("initialize",()=>{
  
  let summaryData;

  beforeAll(()=>{
    console.error = jest.fn();
    console.log = jest.fn();
  });

  beforeEach(()=>{
    let categories = [{title:"Title Numero Uno",value: 27,percentage: "1%", color:"#0399c2"},
                      {title:"Title Numero Dos",value: 88, percentage: "2%", color:"#00b0a9"},
                      {title:"Title Numero Tres",value: 1083,percentage: "97%", color:"#4dbb60"}
                     ];
    summaryData = {
      categories:categories, 
      formattedMonthlyTotal: "32,233", 
      formattedTotal: "390", 
      formattedYearlyTotal: "283,992,948",
      currencySymbol: "&#$^$*"};
      
  });

  it("Should display the loading screen when loading",()=>{
    let domTree = renderer.create(<OverallPerspective loading={true} summaryData={summaryData} summaryError={null}/>);
    let loadingDiv = domTree.root.find((element)=>element.props.id === "overall-perspective-loading");
    expect(loadingDiv.props.className).toEqual(expect.stringContaining("perspective-loading"));

    domTree = renderer.create(<OverallPerspective loading={false} summaryData={summaryData} summaryError={null}/>);
    loadingDiv = domTree.root.find((element)=>element.props.id === "overall-perspective-loading");
    expect(loadingDiv.props.className).toEqual(expect.stringContaining("hidden"));
  });

  it("Should change PerspectiveNavbars display when toggleOverallNavbar is called",()=>{
    let domTree = renderer.create(<OverallPerspective loading={false} summaryData={summaryData} summaryError={null}/>);
    let menu = domTree.root.findByType(PerspectiveNavbar);
    expect(menu.props.opened).toBe(false);

    menu.props.toggleDisplay();
    expect(menu.props.opened).toBe(true);
  });

  it("Should populate the Legend with the titles and colors provided through props",()=>{
    let domTree = renderer.create(<OverallPerspective loading={false} summaryData={summaryData} summaryError={null} />);
    let legend = domTree.root.findByProps({id:"overall-perspective-legend"});
    
    legend.children.forEach((listItem,listItemIndex)=>{
      let title = listItem.find((child)=>child.props.className==="overall-perspective-key-title");
      let color = listItem.find((child)=>child.props.className==="overall-perspective-key-color");
      expect(title.children[0]).toEqual(summaryData.categories[listItemIndex].title);
      expect(color.props.style.backgroundColor).toEqual(summaryData.categories[listItemIndex].color);
    });
  });

  it("Should populate the Results section with values provided through the props",()=>{
    let domTree = renderer.create(<OverallPerspective loading={false} summaryData={summaryData} summaryError={null} />);
    let total = domTree.root.findByProps({id:"overall-perspective-formatted-total"});
    let monthlyTotal = domTree.root.findByProps({id:"overall-perspective-formatted-monthly"});
    let yearlyTotal = domTree.root.findByProps({id:"overall-perspective-formatted-yearly"});

    expect(total.children[0]).toEqual(summaryData.currencySymbol + summaryData.formattedTotal);
    expect(monthlyTotal.children[0]).toEqual(summaryData.currencySymbol + summaryData.formattedMonthlyTotal);
    expect(yearlyTotal.children[0]).toEqual(summaryData.currencySymbol + summaryData.formattedYearlyTotal);
  });

  it("Should put correct values into the piechart",()=>{
    let domTree = renderer.create(<OverallPerspective loading={false} summaryData={summaryData} summaryError={null} />);
    let pieChart = domTree.root.findByType(SVGPieChart);
    expect(pieChart.props.data).toEqual(summaryData.categories);
  });

  it("Should display error when data is missing",()=>{
    let domTree = renderer.create(<OverallPerspective loading={false} summaryError={null} />);
    expect(domTree.root.findAllByType(SVGPieChart).length).toBe(0);
    expect(domTree.root.findByProps({className:"alert alert-danger"}).children[0]).toEqual("Unable to display summary information");
  });

  it("Should display error when invalid data is provided",()=>{
    let domTree = renderer.create(<OverallPerspective loading={false} summaryData={null} summaryError={null} />);
    expect(domTree.root.findAllByType(SVGPieChart).length).toBe(0);
    expect(domTree.root.findByProps({className:"alert alert-danger"}).children[0]).toEqual("Unable to display summary information");
  });
});