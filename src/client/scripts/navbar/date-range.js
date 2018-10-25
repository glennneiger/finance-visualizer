import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';


export default class DateRangeForm extends React.Component{

    constructor(props){
      super(props);
      this.state = {
        visible: this.props.active,
        start:{date: this.props.startDate, visible: false, displayName: "Start Date",error:false},
        end:{date: this.props.endDate, visible: false, displayName: "End Date",error:false},
      }
    }

    resetAll = () => {
      this.setState({
        visible: this.props.active,
        start:{date: this.props.startDate, visible: false, displayName: "Start Date",error:false},
        end:{date: this.props.endDate, visible: false, displayName: "End Date",error:false},
      });
    }

    setDate = (key,date) => {
      this.setState((previousState)=>{
        let changes = Object.assign(previousState);
        changes[key].date = date;
        changes[key].visible = false;

        let startDate = key === 'start' ? date : changes.start.date;
        let endDate = key === 'end' ? date : changes.end.date;
        changes.start.error = !this.validateStartDate(startDate);
        changes.end.error = !this.validateEndDate(startDate,endDate);
        return changes;
      });
    }

    toggleVisibility = (key) => {
      this.setState((previousState) =>{
        let previousDatePicker = previousState[key];
        let response = {};
        response[key] = Object.assign(previousDatePicker);
        response[key].visible = !previousDatePicker.visible;
        response[key].error = false;
        return response;
      });
    }

    clearError = (key,event) =>{
      console.log("focus");
      this.setState( (previousState)=>{
        let response = Object.assign(previousState);
        response[key].error = false;
        return response;
      });
    }

    apply = (event) =>{
      if(this.validate(this.state.start.date,this.state.end.date)){
        this.props.callback(this.state.start.date,this.state.end.date);
        return;
      }
    }

    validate = (startDate,endDate) => this.validateStartDate(startDate) && this.validateEndDate(startDate,endDate);

    validateStartDate = (startDate)=> startDate != null && moment.isMoment(startDate);
    
    validateEndDate = (startDate,endDate)=> (endDate != null && moment.isMoment(endDate) && endDate.isSameOrAfter(startDate));

    render(){
      let displayClass = this.props.active ? "navbar-date-container" : "navbar-date-container-disabled";
      return (
        <div className={displayClass}>
            <DateSelector name="start" visible={this.state.start.visible} date={this.state.start.date} 
              setDate={this.setDate} toggleVisibility={this.toggleVisibility} displayName={this.state.start.displayName}
              error={this.state.start.error}/>
            <DateSelector name="end" visible={this.state.end.visible} date={this.state.end.date} 
              setDate={this.setDate} toggleVisibility={this.toggleVisibility} displayName={this.state.end.displayName}
              error={this.state.end.error} onFocus={this.clearError}/>
            <button className="navbar-date-apply" onClick={this.apply}>Apply</button>
        </div>
      );
  }
}

const DateSelector = (props) => {
  let buttonClass = props.error ? 'navbar-date-button-error' : 'navbar-date-button';
  return(
    <div className="navbar-date-subcontainer">
      <div className="navbar-date-labelblock">
        <label className="navbar-date-label">{props.displayName}:</label>
        <button className={buttonClass} onClick={(event) => props.toggleVisibility(props.name)}>{props.date.format('M/D/YYYY')}</button>
      </div>
      {props.visible ? (
        <div className="navbar-date-picker">
          <DatePicker inline peekNextMonth={false} selected={props.date} 
            onSelect={(date)=>props.setDate(props.name,date)} 
            />
        </div>) : ''
      }
    </div>
  );
}
