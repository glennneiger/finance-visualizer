import "../../styles/navbar.scss"

import React from 'react';
import OnlineSlider from "./online-slider";
import DateRangeForm from "./date-range";
import { FiRefreshCw } from "react-icons/fi";

export default class NavBar extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {displayDateRange:false};
    this.dateRangeForm = React.createRef();
  }

  toggleDisplayDateRange = function(event){
    return new Promise((resolve,reject)=>{
      this.setState(
        (prevState)=>{
          let response = {displayDateRange:!prevState.displayDateRange}
          this.dateRangeForm.current.resetAll();
          return response;      
        },
        resolve
      );
    });
  }

  setDateRange = function(startDate,endDate){
    return new Promise(async (resolve,reject)=>{
      await this.props.setDateRange(startDate,endDate);
      this.setState({displayDateRange:false},resolve);
    });
  }
  
  render(props) {
    return (
      <div>
        <nav id="navbar-nav" className="main-navbar navbar navbar-expand-md" style={{padding:0}}>
            <button className="navbar-toggler perspective-navbar-hamburger-container" style={{position:"relative"}} data-toggle="collapse" data-target="#mainNav">
              <div></div>
              <div></div>
              <div></div>
            </button>
            <div className="navbar-header">
              <span className="navbar-title" >&lt;Insert Cool Title Here&gt;</span>
            </div>
            <div className="collapse navbar-collapse" id="mainNav">
              <div className="navbar-nav" style={{height:"100%"}}>
                  <span id="navbar-date-range-option" onClick={this.toggleDisplayDateRange.bind(this)} className="nav-item nav-link navbar-item" data-toggle="collapse" data-target="#mainNav.show">date range</span>
                  <span className="nav-item nav-link navbar-item" data-toggle="collapse" data-target="#mainNav.show">categorize</span>
                  <span className="nav-item nav-link navbar-item" data-toggle="collapse" data-target="#mainNav.show">prediction</span>
              </div>
            </div>
        </nav>
        <DateRangeForm ref={this.dateRangeForm} active={this.state.displayDateRange} startDate={this.props.startDate} endDate={this.props.endDate} callback={this.setDateRange.bind(this)}/>
      </div>
    );
  };
}