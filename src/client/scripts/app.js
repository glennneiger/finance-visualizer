import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';

import React from 'react';
import moment from 'moment';

import NavBar from "./navbar/navbar";
import OverallPerspective from "./overall/overall-perspective.js";
import CategoryPerspective from "./category/category-perspective.js";
import TransactionService from "./service/transaction-service";

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      online:false, 
      startDate:moment().startOf('day'), 
      endDate:moment().startOf('day'),
      loading:true,
      overallPerspectiveWidth:50,
      transactionSummary:[],
      transactionSummaryError:null
    };
    this.transactionService = new TransactionService();
    this.colorWheel = [
      {main:"#0399c2", sub:["0399c2"]},
      {main:"#00b0a9", sub:["00b0a9"]},
      {main:"#4dbb60", sub:["4dbb60"]},
      {main:"#c6b500", sub:["c6b500"]},
      {main:"#00a5bd", sub:["00a5bd"]},
      {main:"#00b789", sub:["00b789"]},
      {main:"#8cbb34", sub:["8cbb34"]},
      {main:"#ffa600", sub:["ffa600"]}
    ];
  }

  setIsOnline = (isOnline) => {
    return new Promise((resolve,reject)=>{
      this.setState(()=>({online:isOnline}),resolve);
    });
  }

  setDateRange = async (startDate, endDate) => {
    await new Promise((resolve,reject) =>{
      this.setState(()=>{
        return {
          startDate: startDate,
          endDate: endDate.isSameOrAfter(startDate) ? endDate : startDate
        }
      },resolve);
    });

    await this.loadSummaryByCategory(startDate,endDate);
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

  /**
   * Generic way to load data.  Shouldn't be used outside this class.
   * @param {*} loadFunction the function which loads the data to be retrieved.  The function must return a promise, and its response will be returned.
   */
  async loadData(loadFunction){
    await new Promise((resolve,reject)=>{
      this.setState({loading:true},resolve);
    });
    let response = await loadFunction();
    console.log(response);
    await new Promise((resolve,reject)=>{
      this.setState({loading:false},resolve);
    });
    return response;
  }
  
  async loadSummaryByCategory(startDate,endDate){
    let response = await this.loadData(
      ()=>{
        return this.transactionService.getTransactionSummaryByDateRange(startDate,endDate).catch(
        (error)=>{
          this.setState({transactionSummaryError:error});
          return null;
        });
      });
    await new Promise((resolve,reject)=>this.setState({transactionSummary:response},resolve));
    console.log(this.state.transactionSummary);
  }

  componentDidMount(){
    this.loadSummaryByCategory(this.state.startDate,this.state.endDate);
  }

  render() {
    return (
      <div className="container-fluid app-base h-100 d-flex flex-column">
        <div>
          <NavBar setIsOnline={this.setIsOnline} online={this.state.online} startDate={this.state.startDate} endDate={this.state.endDate} setDateRange={this.setDateRange}/>
        </div>
        <div className="perspective-container">
          <div className="app-content-left" style={{width: this.state.overallPerspectiveWidth + "%"}}>
            <OverallPerspective loading={this.state.loading} sumByCategory={this.state.transactionSummary} summaryError={this.state.transactionSummaryError} colorPalette={this.colorWheel}/>
          </div>
          <div className = "app-content-right" style= {{width:(100-this.state.overallPerspectiveWidth) + "%"}}>
            <CategoryPerspective loading={this.state.loading}/>
          </div>
        </div>
      </div>
    );
  }
}