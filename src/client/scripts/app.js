import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';

import React from 'react';
import moment from 'moment';
import NavBar from "./navbar/navbar";
import OverallPerspective from "./overall/overall-perspective.js";
import CategoryPerspective from "./category/category-perspective.js";

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      online:false, 
      startDate:moment().startOf('day'), 
      endDate:moment().startOf('day'),
      loading:true,
      overallPerspectiveWidth:50
    };
  }

  setIsOnline = (isOnline) => {
    return new Promise((resolve,reject)=>{
      this.setState(()=>({online:isOnline}),resolve);
    });
  }

  setDateRange = (startDate, endDate) => {
    return new Promise((resolve,reject) =>{
      this.setState(()=>{
        return {
          startDate:startDate,
          endDate: endDate.isSameOrAfter(startDate) ? endDate : startDate
        }
      },resolve);
    });
  }

  setChildWidth(width){
    return new Promise((resolve,reject)=>{
      this.setState(()=>{
        return {
          overallPerspectiveWidth:Math.min(95,Math.max(5,width))
        };
      },resolve);
    });
  }

  render() {
    return (
      <div className="container-fluid app-base h-100 d-flex flex-column">
        <div>
          <NavBar setIsOnline={this.setIsOnline} online={this.state.online} startDate={this.state.startDate} endDate={this.state.endDate} setDateRange={this.setDateRange}/>
        </div>
        <div className="row flex-grow-1">
          <div className="app-content-left" style={{width: this.state.overallPerspectiveWidth + "%"}}>
            <OverallPerspective loading={this.state.loading}/>
          </div>
          <div className = "app-content-right" style= {{width:(100-this.state.overallPerspectiveWidth) + "%"}}>
            <CategoryPerspective loading={this.state.loading}/>
          </div>
        </div>
      </div>
    );
  }
}