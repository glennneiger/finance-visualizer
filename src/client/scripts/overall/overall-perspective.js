import React from 'react';
import SVGPieChart from "react-svg-piechart";

import PerspectiveNavbar from '../perspective-navbar';

import '../../styles/overall-perspective.scss';

export default class OverallPerspective extends React.Component{

  constructor(props){
    super(props);
    this.state = {navbarOpened:false};
  }
  toggleOverallNavbar(){
    return new Promise((resolve,reject)=>{
      this.setState((previousState)=>
      ({navbarOpened:!previousState.navbarOpened})
      ,resolve);
    });
  }

  generateKey(data){
    let response = [];
    for(let i = 0;i<data.length;i++){
      response.push(
        <li key={data[i].title} className="overall-perspective-key-item">
          <div className="overall-perspective-title-and-key">
            <div className="overall-perspective-key-color" style={{backgroundColor:data[i].color}}/>
            <span className="overall-perspective-key-title">{data[i].title}</span>
          </div>
          {/*<span className="overall-perspective-key-percent">{data[i].percentage}</span>*/}
        </li>);
    }
    return response;
  }
  render(){
    let loadingClass = this.props.loading ? 'perspective-loading' : 'hidden';
    let contentClass = this.props.loading ? 'hidden' : "overall-perspective-content";
    let data = this.props.sumByCategory.map((entry,index) => {
      entry["color"] = this.props.colorPalette[index].main;
      return entry;
    })
    return(
      <div className="perspective" >
        <PerspectiveNavbar opened={this.state.navbarOpened} toggleDisplay={this.toggleOverallNavbar.bind(this)} title="Summary"/>
        <div id="overall-perspective-loading" className={loadingClass + " flex-fill"}>
          <span>.</span><span>.</span><span>.</span>
        </div>
        <div id="overall-perspective-content" className={contentClass}>
          <div className="overall-perspective-key">
            <ul style={{paddingLeft:"10px"}}>
              {this.generateKey(data)}
            </ul>
          </div>
          <div className="overall-perspective-chart">
            <SVGPieChart data={data} expandSize={1} viewBoxSize={75} strokeWidth={.5} expandOnHover/>
          </div>
          <div className="overall-perspective-summary">
            <div>
              <div>Total Amount Spent</div>
              <div>Estimated Monthly Spending</div>
              <div>Estimated Yearly Spending</div>
            </div>
            <div>
              <div>$</div>
              <div>$</div>
              <div>$</div>
            </div>
            <span className="overall-perspective-totals">
              <div>{this.props.sumByCategory.formattedTotal}</div>
              <div>{this.props.sumByCategory.formattedMonthlyTotal}</div>
              <div>{this.props.sumByCategory.formattedYearlyTotal}</div>
            </span>
          </div>
        </div>
      </div>
    );
  }
}