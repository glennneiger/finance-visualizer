import React from "react";
import renderer from "react-test-renderer";

import OverallPerspective from "../../scripts/overall/overall-perspective";
import PerspectiveNavbar from "../../scripts/perspective-navbar";
describe("initialize",()=>{

  it("Should display the loading screen when loading",()=>{
    let domTree = renderer.create(<OverallPerspective loading={true}/>);
    let loadingDiv = domTree.root.find((element)=>element.props.id === "overall-perspective-loading");
    expect(loadingDiv.props.className).toEqual(expect.stringContaining("perspective-loading"));

    domTree = renderer.create(<OverallPerspective loading={false}/>);
    loadingDiv = domTree.root.find((element)=>element.props.id === "overall-perspective-loading");
    expect(loadingDiv.props.className).toEqual(expect.stringContaining("hidden"));
  });

  it("Should change PerspectiveNavbars display when toggleOverallNavbar is called",()=>{
    let domTree = renderer.create(<OverallPerspective loading={true}/>);
    let menu = domTree.root.findByType(PerspectiveNavbar);
    expect(menu.props.opened).toBe(false);

    menu.props.toggleDisplay();
    expect(menu.props.opened).toBe(true);
  });

});