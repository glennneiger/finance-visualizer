import React from "react";
import renderer from "react-test-renderer";

import OverallPerspective from "../../scripts/overall/overall-perspective";

describe("initialize",()=>{

  it("Should display the loading screen when loading",()=>{
    let domTree = renderer.create(<OverallPerspective loading={true}/>);
    let loadingDiv = domTree.root.find((element)=>element.props.id === "overall-perspective-loading");
    expect(loadingDiv.props.className).toEqual("overall-loading");

    domTree = renderer.create(<OverallPerspective loading={false}/>);
    loadingDiv = domTree.root.find((element)=>element.props.id === "overall-perspective-loading");
    expect(loadingDiv.props.className).toEqual("hidden");
  });
});