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
        <nav id="navbar-nav" className="container-fluid navbar  main-navbar">
          <div className="navbar-row row justify-content-between">
            <div>
              <div className="inline">
                <span className="navbar-title">&lt;Insert Cool Title Here&gt;</span>
                <div className="inline navbar-left-container">
                    <span id="navbar-date-range-option" onClick={this.toggleDisplayDateRange.bind(this)} className="navbar-item">date range</span>
                    <span className="navbar-item">categorize</span>
                    <span className="navbar-item">prediction</span>
                </div>
              </div>
            </div>
            <div className="flex-grow-1 navbar-right-container">
              <OnlineSlider setIsOnline={this.props.setIsOnline} online={this.props.online} />
              <span className="navbar-refresh-wrapper">
                <FiRefreshCw className="navbar-refresh" size="2rem"/>
              </span>
            </div>
          </div>
        </nav>
        <DateRangeForm ref={this.dateRangeForm} active={this.state.displayDateRange} startDate={this.props.startDate} endDate={this.props.endDate} callback={this.setDateRange.bind(this)}/>
      </div>
    );
  };
}