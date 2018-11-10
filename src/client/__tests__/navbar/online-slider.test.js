import React from "react";
import renderer from "react-test-renderer";

import OnlineSlider from "../../scripts/navbar/online-slider";

describe("OnlineSlider",()=>{

  it("Should display correct class when online",()=>{
    const domTree = renderer.create(<OnlineSlider online={true}/>);
    const toggleWrapper = domTree.root.find((element)=>element.props.id === "navbar-slider-wrapper");
    expect(toggleWrapper.children[0].props.className).toBe("navbar-slider-on");
  });

  it("Should display correct class when offline",()=>{
    const domTree = renderer.create(<OnlineSlider online={false}/>);
    const toggleWrapper = domTree.root.find((element)=>element.props.id === "navbar-slider-wrapper");
    expect(toggleWrapper.children[0].props.className).toBe("navbar-slider-off");
  });

  it("Should notify callback when online status is changed",()=>{
    const mockSetIsOnline = jest.fn();
    const domTree = renderer.create(<OnlineSlider online={false} setIsOnline={mockSetIsOnline}/>);
    const statusContainer = domTree.root.find((element)=>element.props.id === "navbar-status-container");
    
    statusContainer.props.onClick();
    expect(mockSetIsOnline).toHaveBeenCalledTimes(1);
  })
});