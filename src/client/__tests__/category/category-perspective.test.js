import React from "react";
import renderer from "react-test-renderer";

import CategoryPerspective from "../../scripts/category/category-perspective";
describe("Category Perspective",()=>{
  describe("initialize",()=>{

    it("Should display the loading screen when loading",()=>{
      let domTree = renderer.create(<CategoryPerspective loading={true}/>);
      let loadingDiv = domTree.root.find((element)=>element.props.id === "category-perspective-loading");
      expect(loadingDiv.props.className).toEqual(expect.stringContaining("perspective-loading"));

      domTree = renderer.create(<CategoryPerspective loading={false}/>);
      loadingDiv = domTree.root.find((element)=>element.props.id === "category-perspective-loading");
      expect(loadingDiv.props.className).toEqual(expect.stringContaining("hidden"));
    });  
  });
});