import React from 'react';
import SVGPieChart from "react-svg-piechart";

import PerspectiveNavbar from '../utility/perspective-navbar';

import '../../styles/overall-perspective.scss';
import {addTextToPieChart} from './overall-perspective-logic.js';
import $ from "jquery";

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
    if(data){
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
    } else{
      return "";
    }
  }
  render(){
    return this.renderOrDisplayError();
  }

  componentDidMount(){
    addTextToPieChart(".overall-perspective-chart");
  }

  renderOrDisplayError(){
    try{
      let loadingClass = this.props.loading ? 'perspective-loading' : 'hidden';
      let contentClass = (this.props.loading ? 'hidden' : "overall-perspective-content");  
      let response = (
        <div className="perspective">
        <PerspectiveNavbar opened={this.state.navbarOpened} toggleDisplay={this.toggleOverallNavbar.bind(this)} title="Summary"/>
        <div id="overall-perspective-loading" className={loadingClass + " flex-fill"}>
          <span>.</span><span>.</span><span>.</span>
        </div>
        <div id="overall-perspective-content" className={contentClass + " container"}>
          <div className="row align-items-center" style={{width:"100%", height:"100%"}}>
            <div className="overall-perspective-key col-sm-3">
              <div>Legend</div>
              <div>
                <ul id="overall-perspective-legend" style={{paddingLeft:"10px"}}>
                  {this.generateKey(this.props.summaryData.categories)}
                </ul>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="overall-perspective-chart">
                <SVGPieChart data={this.props.summaryData.categories} expandSize={1} viewBoxSize={75} strokeWidth={.5} expandOnHover/>
              </div>
            </div>
            <div className="overall-perspective-summary col-sm-3">
              <div>Results</div>
              <div>
                <div>
                  <div>
                    <div>Total:</div>
                    <div id="overall-perspective-formatted-total">{"" + this.props.summaryData.currencySymbol + this.props.summaryData.formattedTotal}</div>
                  </div>
                  <div>
                    <div>Monthly:</div>
                    <div id="overall-perspective-formatted-monthly">{"" + this.props.summaryData.currencySymbol + this.props.summaryData.formattedMonthlyTotal}</div>
                  </div>
                  <div>
                    <div>Yearly:</div>
                    <div id="overall-perspective-formatted-yearly">{"" + this.props.summaryData.currencySymbol + this.props.summaryData.formattedYearlyTotal}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
      return response;
    } catch(error){
      console.error(error);
      return (<div className="alert alert-danger" role="alert">Unable to display summary information</div>);
    }
  }
}