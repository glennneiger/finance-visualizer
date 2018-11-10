import App from "../scripts/app";
import NavBar from "../scripts/navbar/navbar";
import OverallPerspective from "../scripts/overall/overall-perspective";
import CategoryPerspective from "../scripts/category/category-perspective";

import renderer from "react-test-renderer";
import React from "react";
import moment from "moment";
import { promises } from "fs";


describe("The Application react component",()=>{
  it("Should load child components with default values", ()=>{
    const domTree = renderer.create(<App/>);
    const app = domTree.root.findByType(App);
    const navBarElement = domTree.root.findByType(NavBar);
    const overallPerspElement = domTree.root.findByType(OverallPerspective);
    const categoryPerspElement = domTree.root.findByType(CategoryPerspective);

    expect(navBarElement.props.online).toEqual(false);
    expect(navBarElement.props.startDate).toEqual(moment().startOf('day'));
    expect(navBarElement.props.endDate).toEqual(moment().startOf('day'));
    expect(navBarElement.props.setIsOnline).toEqual(app.instance.setIsOnline);
    expect(navBarElement.props.setDateRange).toEqual(app.instance.setDateRange);

    expect(overallPerspElement.props.loading).toEqual(true);

    expect(categoryPerspElement.props.loading).toEqual(true);
  });
  
  it("Should scale inner perspectives based on width property",async ()=>{
    const domTree = renderer.create(<App/>);
    const app = domTree.root.findByType(App);
    const overallPerspElement = domTree.root.findByType(OverallPerspective);
    const categoryPerspElement = domTree.root.findByType(CategoryPerspective);
    expect(overallPerspElement.parent.props.style.width).toBe("50%");
    expect(categoryPerspElement.parent.props.style.width).toBe("50%");

    let newWidth = 27;
    await app.instance.setChildWidth(newWidth);
    domTree.update(<App/>);
    expect(overallPerspElement.parent.props.style.width).toBe(newWidth + "%");
    expect(categoryPerspElement.parent.props.style.width).toBe((100-newWidth)+"%");
  });

  it("Should force a minimum width of 5%",async ()=>{
    const domTree = renderer.create(<App/>);
    const app = domTree.root.findByType(App);
    const overallElement = domTree.root.findByType(OverallPerspective);
    const categoryElement = domTree.root.findByType(CategoryPerspective);
    
    await app.instance.setChildWidth(0);
    expect(overallElement.parent.props.style.width).toBe("5%");
    expect(categoryElement.parent.props.style.width).toBe("95%");
  });

  it("Should not allow a negative width",async ()=>{
    const domTree = renderer.create(<App/>);
    const app = domTree.root.findByType(App);
    const overallElement = domTree.root.findByType(OverallPerspective);
    const categoryElement = domTree.root.findByType(CategoryPerspective);
    
    await app.instance.setChildWidth(-5);
    expect(overallElement.parent.props.style.width).toBe("5%");
    expect(categoryElement.parent.props.style.width).toBe("95%");
  });

  it("Should force a maximum width of 95%",async ()=>{
    const domTree = renderer.create(<App/>);
    const app = domTree.root.findByType(App);
    const overallElement = domTree.root.findByType(OverallPerspective);
    const categoryElement = domTree.root.findByType(CategoryPerspective);
    
    await app.instance.setChildWidth(100);
    expect(overallElement.parent.props.style.width).toBe("95%");
    expect(categoryElement.parent.props.style.width).toBe("5%");
  });

  it("Should not allow a width greater than 100%",async ()=>{
    const domTree = renderer.create(<App/>);
    const app = domTree.root.findByType(App);
    const overallElement = domTree.root.findByType(OverallPerspective);
    const categoryElement = domTree.root.findByType(CategoryPerspective);
    
    await app.instance.setChildWidth(105);
    expect(overallElement.parent.props.style.width).toBe("95%");
    expect(categoryElement.parent.props.style.width).toBe("5%");
  });

  it("Should allow setting isOnline status, and update child components accordingly",async ()=>{
    const domTree = renderer.create(<App/>);
    const app = domTree.root.findByType(App);
    const navBar = domTree.root.findByType(NavBar);
    expect(navBar.props.online).toBe(false);

    await app.instance.setIsOnline(true);
    expect(navBar.props.online).toBe(true);
    await app.instance.setIsOnline(false);
    expect(navBar.props.online).toBe(false);
  });

  it("Should allow setting the dateRange, and inform child components on update",async ()=>{
    const domTree = renderer.create(<App/>);
    const app = domTree.root.findByType(App);
    const navBar = domTree.root.findByType(NavBar);

    const startDate = moment().add(2,"days");
    const endDate = moment().add(4,"days");
    await app.instance.setDateRange(startDate,endDate);
    expect(app.instance.state.startDate).toBe(startDate);
    expect(app.instance.state.endDate).toBe(endDate);
    expect(navBar.props.startDate).toBe(startDate);
    expect(navBar.props.endDate).toBe(endDate);
  });

  it("Should not allow dateRange to be set with endDate before startDate",async ()=>{
    const domTree = renderer.create(<App/>);
    const app = domTree.root.findByType(App);

    const startDate = moment().add(2,"days");
    const endDate = moment();
    await app.instance.setDateRange(startDate,endDate);
    expect(app.instance.state.startDate).toBe(startDate);
    expect(app.instance.state.endDate).toBe(startDate);
  });
}); 