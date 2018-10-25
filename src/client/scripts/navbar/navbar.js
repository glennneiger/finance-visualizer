import "../../styles/navbar.scss"
import React from 'react';

import OnlineSlider from "./online-slider";
import DateRangeForm from "./date-range"

export class NavBar extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {displayDateRange:false};
    this.dateRangeForm = React.createRef();
  }

  toggleDisplayDateRange = function(event){
    this.setState((prevState)=>({displayDateRange:!prevState.displayDateRange}));
    this.dateRangeForm.current.resetAll();
  }
  setDateRange = function(startDate,endDate){
    this.props.setDateRange(startDate,endDate);
    this.setState({displayDateRange:false});
  }
  render(props) {
    return (
      <div>
        <nav id="navbar-nav" className="container-fluid navbar  main-navbar">
          <div className="row">
            <div className="col-lg-10 col-xs-12 vert-align">
              <div className="inline">
                  <span className="navbar-title">&lt;Insert Cool Title Here&gt;</span>
              </div>
              <div className="inline navbar-left-container-wrapper">
                <ul id="navbar-left-container"> 
                  <li className="navbar-item navbar-text">refresh</li>
                  <li onClick={this.toggleDisplayDateRange.bind(this)} className="navbar-item navbar-text">date range</li>
                  <li className="navbar-item navbar-text">categorize</li>
                  <li className="navbar-item navbar-text">prediction</li>
                </ul>
              </div>
            </div>
            <OnlineSlider setIsOnline={this.props.setIsOnline} online={this.props.online} />
          </div>
        </nav>
        <DateRangeForm ref={this.dateRangeForm} active={this.state.displayDateRange} startDate={this.props.startDate} endDate={this.props.endDate} callback={this.setDateRange.bind(this)}/>
      </div>
    );
  };
}