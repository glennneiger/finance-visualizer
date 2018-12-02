import React from "react";
import renderer from "react-test-renderer";

import PerspectiveNavbar from "../../scripts/utility/perspective-navbar";

describe("Perspective Navbar",()=>{

  it("Should display hamburger menu based on props",()=>{
    let mockToggleFunction = jest.fn();
    let domTree = renderer.create(<PerspectiveNavbar opened={false} toggleDisplay={mockToggleFunction}/>);
    let menu = domTree.root.find((element)=> {
        return "className" in element.props ? element.props.className.includes("perspective-navbar-hamburger-container") : false;
    });

    let titleElement = domTree.root.find((element)=> {
        return "className" in element.props ? element.props.className.includes("perspective-navbar-title") : false;
    });

    expect(domTree.root.children[0].props.className).toEqual(expect.stringContaining("perspective-navbar-container-closed"));
    expect(menu.props.className).not.toEqual(expect.stringContaining("perspective-navbar-hamburger-container-opened"));
    expect(titleElement.props.className).toEqual(expect.stringContaining("perspective-navbar-invisible"));
    menu.props.onClick();
    expect(mockToggleFunction).toBeCalledTimes(1);
  });

  it("Should hide hamburger menu based on props",()=>{
    let mockToggleFunction = jest.fn();
    let domTree = renderer.create(<PerspectiveNavbar opened={true} toggleDisplay={mockToggleFunction}/>);
    let menu = domTree.root.find((element)=> {
      return "className" in element.props ? element.props.className.includes("perspective-navbar-hamburger-container") : false;
    });
    let titleElement = domTree.root.find((element)=> {
      return "className" in element.props ? element.props.className.includes("perspective-navbar-title") : false;
    });

    expect(domTree.root.children[0].props.className).not.toEqual(expect.stringContaining("perspective-navbar-container-closed"));
    expect(menu.props.className).toEqual(expect.stringContaining("perspective-navbar-hamburger-container-opened"));
    expect(titleElement.props.className).toEqual(expect.stringContaining("perspective-navbar-visible"));
    menu.props.onClick();
    expect(mockToggleFunction).toBeCalledTimes(1);
  });

  it("Should display the title",()=>{
    let expectedTitle = "abdkslebfiuwobdj";
    let domTree = renderer.create(<PerspectiveNavbar opened={true} title={expectedTitle}/>);
    let titleElement = domTree.root.find((element)=> {
      return "className" in element.props ? element.props.className.includes("perspective-navbar-title") : false;
    });
    expect(titleElement.children[0].children[0]).toEqual(expectedTitle);
  })

  it("Should hide menu item titles when menu is collapsed",()=>{
    let domTree = renderer.create(<PerspectiveNavbar opened={true}/>);
    let navItems = domTree.root.findAll((element)=> {
      return "className" in element.props ? element.props.className.includes("perspective-navbar-item ") : false;
    });
    navItems.forEach((navItem)=>{expect(navItem.props.className).toEqual(expect.stringContaining("perspective-navbar-visible"));});

    domTree = renderer.create(<PerspectiveNavbar opened={false}/>);
    navItems = domTree.root.findAll((element)=> {
      return "className" in element.props ? element.props.className.includes("perspective-navbar-item ") : false;
    });
    navItems.forEach((navItem)=>{expect(navItem.props.className).toEqual(expect.stringContaining("perspective-navbar-invisible"));});
  });
});