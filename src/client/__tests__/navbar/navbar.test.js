import NavBar from "../../scripts/navbar/navbar";
import OnlineSlider from "../../scripts/navbar/online-slider";
import DateRangeForm from "../../scripts/navbar/date-range";

import renderer from "react-test-renderer";
import React from "react";
import moment from "moment";

jest.mock("../../scripts/navbar/date-range");

describe("navbar",()=>{
  describe("Initialization",()=>{

    it("Should initialize the correct state.",()=>{
      const nav = renderer.create(<NavBar/>);
      expect(nav.root.instance.state.displayDateRange).toBe(false);
    });

    it("Should populate OnlineSlider",()=>{
      const mockSetIsOnline = jest.fn(()=>{});
      let nav = renderer.create(<NavBar setIsOnline={mockSetIsOnline} online={true}/>);
      let slider = nav.root.findByType(OnlineSlider);

      expect(slider.props.setIsOnline).toBe(mockSetIsOnline);
      expect(slider.props.online).toEqual(true);

      nav = renderer.create(<NavBar setIsOnline={mockSetIsOnline} online={false}/>);
      slider = nav.root.findByType(OnlineSlider);
      expect(slider.props.online).toEqual(false);
    });

    it("Should populate DateRangeForm",async ()=>{
      const mockSetDateRange = ()=>{};
      const startDate = moment();
      const endDate = moment().add(17,"days");
      const nav = renderer.create(<NavBar startDate={startDate} endDate={endDate}/>);
      const dateRangeForm = nav.root.findByType(DateRangeForm);
      expect(dateRangeForm.props.active).toBe(false);
      expect(dateRangeForm.props.callback).toBeInstanceOf(Function); //functionality is tested in different describe block.

      await new Promise((resolve,reject)=>{
        nav.root.instance.setState({displayDateRange:true},resolve);
      });
      expect(dateRangeForm.props.active).toBe(true);
    });
  });

  describe("Date Range Option",()=>{
    it("Should toggle the display of the date range component, and reset the dateRangeForm's state",async ()=>{
      const nav = renderer.create(<NavBar startDate={moment()} endDate={moment()}/>);
      const dateRangeOptionElement = nav.root.find((item)=>{return item.props.id === "navbar-date-range-option"});
      const dateRangeFormElement = nav.root.findByType(DateRangeForm);
      expect(nav.root.instance.state.displayDateRange).toBe(false);
      const mockResetAll = jest.fn();
      DateRangeForm.prototype.resetAll = mockResetAll;

      await dateRangeOptionElement.props.onClick();      
      expect(nav.root.instance.state.displayDateRange).toBe(true);
      expect(mockResetAll).toHaveBeenCalledTimes(1);
    });

    it("Should set the date of the date range function when the date form component has been used",async ()=>{
      const parentSetDateRange = jest.fn();
      const nav = renderer.create(<NavBar setDateRange={parentSetDateRange}/>);
      const dateRangeForm = nav.root.findByType(DateRangeForm);
      nav.root.instance.toggleDisplayDateRange();
      expect(nav.root.instance.state.displayDateRange).toEqual(true);

      const startDate = moment();
      const endDate = moment().add(1,"days");
      await dateRangeForm.props.callback(startDate,endDate);

      expect(parentSetDateRange).toHaveBeenCalledTimes(1);
      expect(parentSetDateRange).toHaveBeenCalledWith(startDate,endDate);
      expect(nav.root.instance.state.displayDateRange).toEqual(false);
    });
  });
});