import DateRangeForm, {DateSelector} from "../../scripts/navbar/date-range";

import React from "react";
import renderer from "react-test-renderer";
import moment from "moment";
import DatePicker from "react-datepicker";
import { appendFileSync } from "fs";

describe("Date Range Form React Component",()=>{
  describe("Initialization",()=>{
    it("Should load default state from props and passes state to children",()=>{
      const startDate = moment().subtract(12,'d');
      const endDate = moment();
      const rootTree = renderer.create(<DateRangeForm active={true} startDate={startDate} endDate={endDate}/>);
      const dateRangeForm = rootTree.root.findByType(DateRangeForm);    

      expect(dateRangeForm.instance.state.visible).toBe(true);
      expect(dateRangeForm.instance.state.start).toEqual({date: startDate, visible: false, error:false});
      expect(dateRangeForm.instance.state.end).toEqual({date: endDate, visible: false, error:false});

    });

    it("Should initially render child components with props from its state",()=>{
      const callback = ()=>{};
      const startDate = moment().subtract(12,'d');
      const endDate = moment();
      const rootTree = renderer.create(<DateRangeForm active={true} startDate={startDate} endDate={endDate} callback={callback}/>);
      const dateRangeForm = rootTree.root.findByType(DateRangeForm);
      const startDateInput = dateRangeForm.children[0].children[0];
      const endDateInput = dateRangeForm.children[0].children[1];

      expect(startDateInput.props.visible).toEqual(false);
      expect(startDateInput.props.date).toEqual(startDate);
      expect(startDateInput.props.setDate).toBe(dateRangeForm.instance.setDate);
      expect(startDateInput.props.toggleVisibility).toBe(dateRangeForm.instance.toggleVisibility);
      expect(startDateInput.props.displayName).toBe("Start Date");
      expect(startDateInput.props.error).toBe(false);

      expect(endDateInput.props.visible).toEqual(false);
      expect(endDateInput.props.date).toEqual(endDate);
      expect(endDateInput.props.setDate).toBe(dateRangeForm.instance.setDate);
      expect(endDateInput.props.toggleVisibility).toBe(dateRangeForm.instance.toggleVisibility);
      expect(endDateInput.props.displayName).toBe("End Date");
      expect(endDateInput.props.error).toBe(false);
    });

    it("Should update child components with props from its state",async ()=>{
      const callback = ()=>{};

      const rootTree = renderer.create(<DateRangeForm active={true} startDate={moment()} endDate={moment()} callback={callback}/>);
      let dateRangeForm = rootTree.root.findByType(DateRangeForm);
      const startDate = moment().subtract(12,'d');
      const endDate = moment().subtract(4,'d');
      await new Promise((resolve,reject)=>{
        dateRangeForm.instance.setState({
          start:{
            date: startDate, visible: true, error:true
          },
          end:{
            date: endDate, visible: true,error:true
          }
        },resolve);
      });
      const startDateInput = dateRangeForm.children[0].children[0];
      const endDateInput = dateRangeForm.children[0].children[1];

      expect(startDateInput.props.visible).toEqual(true);
      expect(startDateInput.props.date).toEqual(startDate);
      expect(startDateInput.props.error).toBe(true);

      expect(endDateInput.props.visible).toEqual(true);
      expect(endDateInput.props.date).toEqual(endDate);
      expect(endDateInput.props.error).toBe(true);
    });
  });
  describe("setDate",()=>{
    it("Should set the date of the specified date selector, and hide it. [setDate]",async ()=>{
      const originalDate = moment();
      const newDate = moment().subtract(87,'days');
      const domTree = renderer.create(<DateRangeForm active={true} startDate={originalDate} endDate={originalDate}/>);
      const dateRangeForm = domTree.root;

      await new Promise((resolve,reject)=>{dateRangeForm.instance.setState(
        (previousState)=>{
          let response = Object.assign(previousState);
          response.start.visible = true;
          response.end.visible = true;
          return previousState;
        },resolve)});

      expect(dateRangeForm.instance.state.start.visible).toBe(true);
      await dateRangeForm.instance.setDate("start",newDate);
      
      expect(dateRangeForm.instance.state.start.visible).toBe(false);
      expect(dateRangeForm.instance.state.start.date).toBe(newDate);
      expect(dateRangeForm.instance.state.end.visible).toBe(true);
      expect(dateRangeForm.instance.state.end.date).toBe(originalDate);
      
      await dateRangeForm.instance.setDate("end",newDate);
      expect(dateRangeForm.instance.state.end.visible).toBe(false);
      expect(dateRangeForm.instance.state.end.date).toBe(newDate);
    });

    it("Should mark an error for startDate when validateState is false [setDate]",async ()=>{
      const originalDate = moment();
      const newDate = moment().subtract(87,'days');
      const domTree = renderer.create(<DateRangeForm active={true} startDate={originalDate} endDate={originalDate}/>);
      const dateRangeForm = domTree.root;

      let mockValidate = jest.fn(date => false);
      dateRangeForm.instance.validateStartDate = mockValidate;

      expect(dateRangeForm.instance.state.start.error).toBe(false);
      await dateRangeForm.instance.setDate("start",newDate);
      
      expect(dateRangeForm.instance.state.start.date).toBe(newDate);
      expect(dateRangeForm.instance.state.start.error).toBe(true);
      expect(dateRangeForm.instance.state.end.error).toBe(false);
      expect(mockValidate.mock.calls.length).toBe(1);
      expect(mockValidate.mock.calls[0][0]).toBe(newDate);
    });

    it("Should mark an error for endDate when validateState is false [setDate]",async ()=>{
      const startDate = moment();
      const newDate = moment().add(87,'days');
      const domTree = renderer.create(<DateRangeForm active={true} startDate={startDate} endDate={moment()}/>);
      const dateRangeForm = domTree.root;

      let mockValidate = jest.fn(date => false);
      dateRangeForm.instance.validateEndDate = mockValidate;

      expect(dateRangeForm.instance.state.end.error).toBe(false);
      await dateRangeForm.instance.setDate("end",newDate);
      
      expect(dateRangeForm.instance.state.end.date).toBe(newDate);
      expect(dateRangeForm.instance.state.end.error).toBe(true);
      expect(dateRangeForm.instance.state.start.error).toBe(false);
      expect(mockValidate.mock.calls.length).toBe(1);
      expect(mockValidate.mock.calls[0][0]).toBe(startDate);
      expect(mockValidate.mock.calls[0][1]).toBe(newDate);
    });

    it("Should clear existing errors for startDate when validateState is true [setDate]", async ()=>{
      const originalDate = moment();
      const newDate = moment().subtract(87,'days');
      const domTree = renderer.create(<DateRangeForm active={true} startDate={originalDate} endDate={originalDate}/>);
      const dateRangeForm = domTree.root;

      await new Promise((resolve,reject)=>{dateRangeForm.instance.setState(
        (previousState)=>{
          let response = Object.assign(previousState);
          response.start.error = true;
          response.end.error = true;
          return previousState;
        },resolve)});

      const mockValidate = jest.fn(()=>true);
      dateRangeForm.instance.validateStartDate = mockValidate;
      expect(dateRangeForm.instance.state.start.error).toBe(true);
      await dateRangeForm.instance.setDate("start",newDate);
      
      expect(dateRangeForm.instance.state.start.date).toBe(newDate);
      expect(dateRangeForm.instance.state.end.date).toBe(originalDate);
      expect(dateRangeForm.instance.state.start.error).toBe(false);
      expect(mockValidate.mock.calls.length).toBe(1);
      expect(mockValidate.mock.calls[0][0]).toBe(newDate);
    });

    it("Should clear existing errors for endDate when validateState is true [setDate]", async ()=>{
      const startDate = moment();
      const newDate = moment().subtract(87,'days');
      const domTree = renderer.create(<DateRangeForm active={true} startDate={startDate} endDate={moment()}/>);
      const dateRangeForm = domTree.root;

      await new Promise((resolve,reject)=>{dateRangeForm.instance.setState(
        (previousState)=>{
          let response = Object.assign(previousState);
          response.start.error = true;
          response.end.error = true;
          return previousState;
        },resolve)});

      const mockValidate = jest.fn(()=>true);
      dateRangeForm.instance.validateEndDate = mockValidate;
      expect(dateRangeForm.instance.state.end.error).toBe(true);
      await dateRangeForm.instance.setDate("end",newDate);
      
      expect(dateRangeForm.instance.state.end.date).toBe(newDate);
      expect(dateRangeForm.instance.state.start.date).toBe(startDate);
      expect(dateRangeForm.instance.state.end.error).toBe(false);
      expect(mockValidate.mock.calls.length).toBe(1);
      expect(mockValidate.mock.calls[0][0]).toBe(startDate);
      expect(mockValidate.mock.calls[0][1]).toBe(newDate);
    });
  });

  describe("toggleVisibility",()=>{
    it("Should toggle the visibility of the specified date picker [toggleVisibility]",async ()=>{
      const domTree = renderer.create(<DateRangeForm active={true} startDate={moment()} endDate={moment()}/>);
      const dateRangeForm = domTree.root;
      const startDateInput = dateRangeForm.children[0].children[0];
      const endDateInput = dateRangeForm.children[0].children[1];

      expect(startDateInput.props.visible).toBe(false);
      expect(endDateInput.props.visible).toBe(false);

      await dateRangeForm.instance.toggleVisibility("start");
      expect(startDateInput.props.visible).toBe(true);

      await dateRangeForm.instance.toggleVisibility("start");
      expect(startDateInput.props.visible).toBe(false);

      await dateRangeForm.instance.toggleVisibility("end");
      expect(endDateInput.props.visible).toBe(true);

      await dateRangeForm.instance.toggleVisibility("end");
      expect(endDateInput.props.visible).toBe(false);
    });

    it("The toggleVisibility method should mark the specified date as 'error' when hiding it if the date is invalid [toggleVisibility]",async ()=>{
      const startDate = moment().subtract(10,'d');
      const endDate = moment().add(11,'d');
      const domTree = renderer.create(<DateRangeForm active={true} startDate={startDate} endDate={endDate}/>);
      const dateRangeForm = domTree.root;
      const startDateInput = dateRangeForm.children[0].children[0];
      const endDateInput = dateRangeForm.children[0].children[1];
      const mockValidateStart = jest.fn(()=>{return false});
      const mockValidateEnd = jest.fn(()=>{return false});

      dateRangeForm.instance.validateStartDate = mockValidateStart;

      expect(startDateInput.props.visible).toEqual(false);
      expect(dateRangeForm.instance.state.start.error).toEqual(false);
      expect(startDateInput.props.error).toEqual(false);
      await dateRangeForm.instance.toggleVisibility("start"); //display dateInput.
      await dateRangeForm.instance.toggleVisibility("start"); //hide dateInput.
      
      expect(dateRangeForm.instance.state.start.error).toEqual(true);
      expect(mockValidateStart.mock.calls.length).toEqual(2);
      expect(mockValidateStart.mock.calls[0][0]).toBe(startDate);
      expect(mockValidateStart.mock.calls[1][0]).toBe(startDate);

      dateRangeForm.instance.validateEndDate = mockValidateEnd;
      expect(endDateInput.props.visible).toEqual(false);
      expect(dateRangeForm.instance.state.end.error).toEqual(false);
      expect(endDateInput.props.error).toEqual(false);
      await dateRangeForm.instance.toggleVisibility("end"); //display dateInput.
      await dateRangeForm.instance.toggleVisibility("end"); //hide dateInput.
      
      expect(dateRangeForm.instance.state.end.error).toEqual(true);
      expect(mockValidateEnd.mock.calls.length).toEqual(2);
      mockValidateEnd.mock.calls.forEach((params)=>{
        expect(params[0]).toBe(startDate);
        expect(params[1]).toBe(endDate);
      });
    });

    it("Should clear any errors associated to the specified date picker when displaying, regarless of error state [toggleVisibility]",async()=>{
      const startDate = moment().subtract(10,'d');
      const endDate = moment().add(11,'d');
      const domTree = renderer.create(<DateRangeForm active={true} startDate={startDate} endDate={endDate}/>);
      const dateRangeForm = domTree.root;
      const startDateInput = dateRangeForm.children[0].children[0];
      const endDateInput = dateRangeForm.children[0].children[1];
      const mockValidateStart = jest.fn(()=>{return false});
      const mockValidateEnd = jest.fn(()=>{return false});

      dateRangeForm.instance.validateStartDate = mockValidateStart;

      expect(startDateInput.props.visible).toEqual(false);
      expect(dateRangeForm.instance.state.start.error).toEqual(false);
      expect(startDateInput.props.error).toEqual(false);
      await dateRangeForm.instance.toggleVisibility("start"); //display dateInput.
      
      expect(dateRangeForm.instance.state.start.error).toEqual(false);
      expect(mockValidateStart.mock.calls.length).toEqual(1);
      expect(mockValidateStart.mock.calls[0][0]).toBe(startDate);

      dateRangeForm.instance.validateEndDate = mockValidateEnd;
      expect(endDateInput.props.visible).toEqual(false);
      expect(dateRangeForm.instance.state.end.error).toEqual(false);
      expect(endDateInput.props.error).toEqual(false);
      await dateRangeForm.instance.toggleVisibility("end"); //display dateInput.
      
      expect(dateRangeForm.instance.state.end.error).toEqual(false);
      expect(mockValidateEnd.mock.calls.length).toEqual(1);
      expect(mockValidateEnd.mock.calls[0][0]).toBe(startDate);
      expect(mockValidateEnd.mock.calls[0][1]).toBe(endDate);
    });
  });

  describe("resetAll",()=>{
    it("Should reset state based on passed props [resetAll]",async ()=>{
      const domTree = renderer.create(<DateRangeForm active={true} startDate={moment().subtract(10,'d')} endDate={moment().add(11,'d')}/>);
      const dateRangeForm = domTree.root;
      const originalState = Object.assign(dateRangeForm.instance.state);
      
      await new Promise((resolve,reject)=>{
        dateRangeForm.instance.setState({
          visible: !originalState.visible,
          start:{
            date: originalState.start.date.add(1,'d'),
            visible: !originalState.start.visible, 
            error: !originalState.start.error
          },
          end:{            
            date: originalState.end.date.add(1,'d'),
            visible: !originalState.end.visible, 
            error: !originalState.end.error
          },
        },resolve);
      });
      expect(JSON.stringify(originalState)).not.toEqual(JSON.stringify(dateRangeForm.instance.state));
      await dateRangeForm.instance.resetAll();
      expect(JSON.stringify(originalState)).toEqual(JSON.stringify(dateRangeForm.instance.state));
    });
  });

  describe("apply",()=>{
    it("Should notify callback when apply is called [apply]",async ()=>{
      const callback = jest.fn(()=>{});
      const domTree = renderer.create(<DateRangeForm active={true} startDate={moment()} endDate={moment()} callback={callback}/>);
      const dateRangeForm = domTree.root;
      const startDate = moment().subtract(10,'d');
      const endDate = moment().add(11,'d');

      await new Promise((resolve,reject)=>{
        dateRangeForm.instance.setState((previousState)=>{
          let response = Object.assign(previousState);
          response.start.date = startDate;
          response.end.date = endDate;
          return response;
        },resolve);
      });

      dateRangeForm.instance.apply();
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][0]).toBe(startDate);
      expect(callback.mock.calls[0][1]).toBe(endDate);
    });

    it("Should not notify callback when apply is called but the current date range is invalid [apply]",()=>{
      const callback = jest.fn(()=>{});
      const mockValidate = jest.fn(()=>false);
      const domTree = renderer.create(<DateRangeForm active={true} startDate={moment()} endDate={moment()} callback={callback}/>);
      const dateRangeForm = domTree.root;
      dateRangeForm.instance.validate = mockValidate;

      dateRangeForm.instance.apply();
      expect(callback.mock.calls.length).toBe(0);
    });
  });

  describe("validate",()=>{
    it("Should fail when validateStart or validateEnd fails",()=>{
      const domTree = renderer.create(<DateRangeForm active={true} startDate={moment()} endDate={moment()} />);
      const mockFail = jest.fn(()=>false);
      const mockSuccess = jest.fn(()=>true);

      domTree.root.instance.validateStartDate = mockFail;
      domTree.root.instance.validateEndDate = mockSuccess;
      expect(domTree.root.instance.validate()).toBe(false);

      domTree.root.instance.validateStartDate = mockSuccess;
      domTree.root.instance.validateEndDate = mockFail;
      expect(domTree.root.instance.validate()).toBe(false);
    });

    it("Should succeed when validateStart and validateEnd succeed",()=>{
      const domTree = renderer.create(<DateRangeForm active={true} startDate={moment()} endDate={moment()} />);
      const mockValidateStart = jest.fn(()=>true);
      const mockValidateEnd = jest.fn(()=>true);
      const startDate = moment();
      const endDate = moment();

      domTree.root.instance.validateStartDate = mockValidateStart;
      domTree.root.instance.validateEndDate = mockValidateEnd;
      expect(domTree.root.instance.validate(startDate,endDate)).toBe(true);
      expect(mockValidateStart.mock.calls[0][0]).toBe(startDate);
      expect(mockValidateEnd.mock.calls[0][0]).toBe(startDate);
      expect(mockValidateEnd.mock.calls[0][1]).toBe(endDate);
    });
  });

  describe("validate date functions",()=>{
    it("validateStartDate should only succeed when startDate is valid",()=>{
      let dateRangeForm = new DateRangeForm({});
      expect(dateRangeForm.validateStartDate(null)).toBe(false);
      expect(dateRangeForm.validateStartDate("pie")).toBe(false);
      expect(dateRangeForm.validateStartDate(moment())).toBe(true);
    });

    it("validateEndDate should only succeed when endDate is valid",()=>{
      let dateRangeForm = new DateRangeForm({});
      expect(dateRangeForm.validateEndDate(moment(),null)).toBe(false);
      expect(dateRangeForm.validateEndDate(null,null)).toBe(false);
      expect(dateRangeForm.validateEndDate(moment(),"hi")).toBe(false);
      expect(dateRangeForm.validateEndDate(moment(),moment().subtract(1,"second"))).toBe(false);
      expect(dateRangeForm.validateEndDate(null,moment())).toBe(true);
      expect(dateRangeForm.validateEndDate(moment(),moment())).toBe(true);
      expect(dateRangeForm.validateEndDate('hi',moment())).toBe(true);
      expect(dateRangeForm.validateEndDate(moment(),moment().add(1,"second"))).toBe(true);
    });
  });

  describe("dateSelector",()=>{
    it("Should display the correct label",()=>{
      const expectedLabel = "hello my name is Al";
      const domTree = renderer.create(<DateSelector error={false} displayName={expectedLabel} name="start" date={moment()} visible={false} setDate={()=>{}}/>);
      const labelElement = domTree.root.findByType("label");
      expect(labelElement.props.children[0]).toEqual(expectedLabel);
    });

    it("Should use the error styling when the props indicate an error state",()=>{
      let domTree = renderer.create(<DateSelector error={true} displayName={'disN'} name="start" date={moment()} visible={false} setDate={()=>{}}/>);
      let buttonElement = domTree.root.findByType("button");
      expect(buttonElement.props.className).toEqual("navbar-date-button-error");

      domTree = renderer.create(<DateSelector error={false} displayName={'disN'} name="start" date={moment()} visible={false} setDate={()=>{}}/>);
      buttonElement = domTree.root.findByType("button");
      expect(buttonElement.props.className).toEqual("navbar-date-button");
    });

    it("Should call toggleVisibility when its button is clicked",()=>{
      const mockToggleVisibility = jest.fn(()=>{});
      const name = "start";
      const domTree = renderer.create(<DateSelector error={false} displayName={'disN'} name={name} date={moment()} visible={false} setDate={()=>{}}
        toggleVisibility={mockToggleVisibility}/>);
      const buttonElement = domTree.root.findByType("button");

      buttonElement.props.onClick(); //'simulate' a click
      expect(mockToggleVisibility.mock.calls.length).toBe(1);
      expect(mockToggleVisibility.mock.calls[0][0]).toEqual(name);
    });

    it("Should display the formatted selected date as the button text",()=>{
      const referenceDate = moment();
      let domTree = renderer.create(<DateSelector error={false} displayName={'disN'} name="start" date={referenceDate} visible={false} setDate={()=>{}}/>);
      let buttonElement = domTree.root.findByType("button");
      expect(buttonElement.props.children).toEqual(referenceDate.format('M/D/YYYY'));
    });

    it("Should display the date picker based on the props",()=>{
      const referenceDate = moment().add(7,'d');
      let domTree = renderer.create(<DateSelector error={true} displayName={'disN'} name="start" date={moment()} visible={false} setDate={()=>{}}/>);

      expect(domTree.root.findAllByType(DatePicker).length).toEqual(0);

      const selectorName = "start";
      domTree = renderer.create(<DateSelector error={false} displayName={'disN'} name={selectorName} date={referenceDate} 
        visible={true} setDate={()=>{}}/>);
      let datePicker = domTree.root.findByType(DatePicker);

      expect("inline" in datePicker.props).toEqual(true);
      expect(datePicker.props.selected).toEqual(referenceDate);
    });

    it("Should call 'setDate' when a date has been selected",()=>{
      const referenceDate = moment().add(7,'d');
      const mockSetDate = jest.fn(()=>{});
      const selectorName = "start";
      const domTree = renderer.create(<DateSelector error={false} displayName={'disN'} name={selectorName} date={referenceDate} 
        visible={true} setDate={mockSetDate}/>);
      let datePicker = domTree.root.findByType(DatePicker);

      let selectedDate = moment().subtract(103,'d');
      expect(datePicker.props.selected).toEqual(referenceDate);
      datePicker.props.onSelect(selectedDate);
      expect(mockSetDate.mock.calls.length).toEqual(1);
      expect(mockSetDate.mock.calls[0][0]).toEqual(selectorName);
      expect(mockSetDate.mock.calls[0][1]).toEqual(selectedDate);
    });
  });
});