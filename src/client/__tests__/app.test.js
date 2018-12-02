import App from "../scripts/app";
import NavBar from "../scripts/navbar/navbar";
import OverallPerspective from "../scripts/overall/overall-perspective";
import CategoryPerspective from "../scripts/category/category-perspective";
import ResizeEvent from "../scripts/utility/resize-logic";

import renderer from "react-test-renderer";
import React from "react";
import moment from "moment";
import { promises } from "fs";
import waitForExpect from "wait-for-expect";

jest.mock("../scripts/overall/overall-perspective");
jest.mock("../scripts/utility/resize-logic");
jest.mock("../scripts/service/transaction-service")


describe("The Application react component",()=>{
  beforeAll(()=>{
    console.error = jest.fn();
    console.log = jest.fn();
  });
  
  it("Should load child components with default values", ()=>{
    const domTree = renderer.create(<App resizeBarWidth={1}/>);
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
    const domTree = renderer.create(<App resizeBarWidth={1}/>);
    const app = domTree.root.findByType(App);
    const overallPerspElement = domTree.root.findByType(OverallPerspective);
    const categoryPerspElement = domTree.root.findByType(CategoryPerspective);
    expect(overallPerspElement.parent.props.style.width).toBe("50%");
    expect(categoryPerspElement.parent.props.style.width).toBe("49%");

    let newWidth = 27;
    await app.instance.setChildWidth(newWidth);
    domTree.update(<App resizeBarWidth={1} />);
    expect(overallPerspElement.parent.props.style.width).toBe(newWidth + "%");
    expect(categoryPerspElement.parent.props.style.width).toBe((100-newWidth-1)+"%");
  });

  it("Should force a minimum width of 5%",async ()=>{
    const domTree = renderer.create(<App resizeBarWidth={1}/>);
    const app = domTree.root.findByType(App);
    const overallElement = domTree.root.findByType(OverallPerspective);
    const categoryElement = domTree.root.findByType(CategoryPerspective);

    await app.instance.setChildWidth(0);
    expect(overallElement.parent.props.style.width).toBe("5%");
    expect(categoryElement.parent.props.style.width).toBe("94%");
  });

  it("Should not allow a negative width",async ()=>{
    const domTree = renderer.create(<App resizeBarWidth={1}/>);
    const app = domTree.root.findByType(App);
    const overallElement = domTree.root.findByType(OverallPerspective);
    const categoryElement = domTree.root.findByType(CategoryPerspective);

    await app.instance.setChildWidth(-5);
    expect(overallElement.parent.props.style.width).toBe("5%");
    expect(categoryElement.parent.props.style.width).toBe("94%");
  });

  it("Should force a maximum width of 95%",async ()=>{
    const domTree = renderer.create(<App resizeBarWidth={1}/>);
    const app = domTree.root.findByType(App);
    const overallElement = domTree.root.findByType(OverallPerspective);
    const categoryElement = domTree.root.findByType(CategoryPerspective);

    await app.instance.setChildWidth(100);
    expect(overallElement.parent.props.style.width).toBe("95%");
    expect(categoryElement.parent.props.style.width).toBe("4%");
  });

  it("Should not allow a width greater than 100%",async ()=>{
    const domTree = renderer.create(<App resizeBarWidth={1}/>);
    const app = domTree.root.findByType(App);
    const overallElement = domTree.root.findByType(OverallPerspective);
    const categoryElement = domTree.root.findByType(CategoryPerspective);

    await app.instance.setChildWidth(105);
    expect(overallElement.parent.props.style.width).toBe("95%");
    expect(categoryElement.parent.props.style.width).toBe("4%");
  });

  it("Should allow setting isOnline status, and update child components accordingly",async ()=>{
    const domTree = renderer.create(<App resizeBarWidth={1}/>);
    const app = domTree.root.findByType(App);
    const navBar = domTree.root.findByType(NavBar);
    expect(navBar.props.online).toBe(false);

    await app.instance.setIsOnline(true);
    expect(navBar.props.online).toBe(true);
    await app.instance.setIsOnline(false);
    expect(navBar.props.online).toBe(false);
  });

  it("Should allow setting the dateRange, and inform child components on update",async ()=>{
    const domTree = renderer.create(<App resizeBarWidth={1}/>);
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
    const domTree = renderer.create(<App resizeBarWidth={1}/>);
    const app = domTree.root.findByType(App);

    const startDate = moment().add(2,"days");
    const endDate = moment();
    await app.instance.setDateRange(startDate,endDate);
    expect(app.instance.state.startDate).toBe(startDate);
    expect(app.instance.state.endDate).toBe(startDate);
  });

  it("Should load Overall Perspective with 'summary data' and 'summary error'",async ()=>{
    let domTree = renderer.create(<App resizeBarWidth={1}/>);
    let overallPersp = domTree.root.findByType(OverallPerspective);
    await domTree.root.instance.setState({transactionSummary:"thedata",transactionSummaryError:"theerror"});
    expect(overallPersp.props.summaryData).toBe("thedata");
    expect(overallPersp.props.summaryError).toEqual("theerror");
  });

  it("Should load data when app starts",()=>{
    let mockLoadSummary = jest.fn();
    let domTree = renderer.create(<App resizeBarWidth={1}/>);
    domTree.root.instance.loadSummaryByCategory = mockLoadSummary;
    domTree.root.instance.finishedInitialLoad = false;

    domTree.root.instance.componentDidMount();
    expect(mockLoadSummary).toBeCalledTimes(1);
  });

  it("Should correctly set state during startResize",async ()=>{
    let domTree = renderer.create(<App resizeBarWidth={1}/>);
    let app = domTree.root.instance;
    let resizeEvent = await app.startResize();
    expect(app.state.resizeFunction).toBe(resizeEvent.resize);
    expect(app.state.resizeEndFunction).toBe(resizeEvent.end);
  });

  it("Should notify resize logic module when mouse moves",async()=>{
    let domTree = renderer.create(<App resizeBarWidth={1}/>);
    let app = domTree.root.instance;
    
    let mockResize = jest.fn();
    let mockEnd = jest.fn();
    let mockEvent = {test:"event"};
    await new Promise((resolve)=>{app.setState({resizeFunction:mockResize, resizeEndFunction:mockEnd},resolve)});
    let appBase = domTree.root.children[0];

    expect(mockResize).toBeCalledTimes(0);
    appBase.props.onMouseMove(mockEvent);
    expect(mockResize).toBeCalledTimes(1);
    expect(mockResize).toBeCalledWith(mockEvent);

    expect(mockEnd).toBeCalledTimes(0);
    appBase.props.onMouseUp();
    expect(mockEnd).toBeCalledTimes(1);
  });

  describe("loadSummaryByCategory",async ()=>{
    
    it("Should set state correctly in happy case", async ()=>{
      let mockLoadData = jest.fn((input)=>{
        return input();
      });
      let mockTransServiceFn = jest.fn(()=>{
        return new Promise((resolve)=>{
          resolve({categories:[
            {title:"tit1", value: "val1", percentage: "percent1"},
            {title:"tit2", value: "val2", percentage: "percent2"}
          ]});
        })
      });

      let expectedResponse = {categories:[
        {title:"tit1", value: "val1", percentage: "percent1", color:"#0399c2"},
        {title:"tit2", value: "val2", percentage: "percent2", color:"#00b0a9"}
      ]};

      let startDate = moment();
      let endDate = moment();

      let domRoot = renderer.create(<App resizeBarWidth={1} />);
      let app = domRoot.root.instance;

      await waitForExpect(()=>{
        expect(app.state.loading).toEqual(false);
        expect(app.finishedInitialLoad).toEqual(true);
      });
      app.transactionService.mocks.getTransactionSummaryByDateRange = mockTransServiceFn;
      app.loadData = mockLoadData;

      await app.loadSummaryByCategory(startDate,endDate);
      expect(app.state.transactionSummary).toEqual(expectedResponse);
      expect(mockLoadData).toBeCalledTimes(1);
      expect(mockTransServiceFn).toBeCalledWith(startDate,endDate);
    });

    it("Should set transactionSummaryError when loading fails/returns an error",async ()=>{
      let mockLoadData = jest.fn((input)=>{
        return input();
      });
      let failureMessage = "I AM KING SIMBA!!!";
      let mockTransServiceFn = jest.fn(()=>{
        return new Promise((resolve,reject)=>{
          reject(failureMessage);
        })
      });

      let startDate = moment();
      let endDate = moment();
      let domRoot = renderer.create(<App resizeBarWidth={1} />);
      let app = domRoot.root.instance;

      await waitForExpect(()=>{
        expect(app.state.loading).toEqual(false);
        expect(app.finishedInitialLoad).toEqual(true);
      });
      app.transactionService.mocks.getTransactionSummaryByDateRange = mockTransServiceFn;
      app.loadData = mockLoadData;

      await app.loadSummaryByCategory(startDate,endDate);
      expect(app.state.transactionSummaryError).toEqual(failureMessage);
      expect(app.state.transactionSummary).toEqual(null);
      expect(mockLoadData).toBeCalledTimes(1);
      expect(mockTransServiceFn).toBeCalledWith(startDate,endDate);   
     });
  });

  describe("LoadData",()=>{
    it("Should set 'loading' state to true during load",async ()=>{
      const domRoot = renderer.create(<App resizeBarWidth={1}/>);
      const app = domRoot.root.instance;
      let wasLoading = false;
      const checkForLoading = jest.fn(()=>{wasLoading = app.state.loading});
      await app.loadData(checkForLoading);
      expect(checkForLoading).toBeCalledTimes(1);
      expect(wasLoading).toEqual(true);
      expect(app.state.loading).toEqual(false);
    });

    it("Should return correct response in happy case",async ()=>{
      const domRoot = renderer.create(<App resizeBarWidth={1}/>);
      const app = domRoot.root.instance;
      let expectedResponse = "SCAR is a TRAITOR!!!";
      const successFunction = jest.fn(()=>new Promise((resolve,reject)=>{
        resolve(expectedResponse);
      }));
      let response = await app.loadData(successFunction);
      expect(successFunction).toBeCalledTimes(1);
      expect(response).toEqual(expectedResponse);
    });

    it("Should reset 'loading' property and return null when loading fails",async ()=>{
      const domRoot = renderer.create(<App resizeBarWidth={1}/>);
      const app = domRoot.root.instance;
      let wasLoading = false;
      const failFunction = jest.fn(()=>new Promise((resolve,reject)=>{
        wasLoading = app.state.loading;
        reject();
      }));
      let response = await app.loadData(failFunction);
      expect(failFunction).toBeCalledTimes(1);
      expect(wasLoading).toEqual(true);
      expect(app.state.loading).toEqual(false);
      expect(response).toEqual(null);
    });
  });
}); 