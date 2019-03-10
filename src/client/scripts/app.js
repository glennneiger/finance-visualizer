import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from "jquery";

import React from 'react';
import moment from 'moment';

import NavBar from "./navbar/navbar";
import OverallPerspective from "./overall/overall-perspective.js";
import CategoryPerspective from "./category/category-perspective.js";
import TransactionService from "./service/transaction-service";
import ResizeBar from "./utility/resize-bar";

import ResizeEvent from "./utility/resize-logic";

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.detailsAvailableTimeout = null;
    this.state = {
      activeCategory:"",
      online:false, 
      startDate:moment().startOf('day'), 
      endDate:moment().startOf('day'),
      loading:true,
      overallPerspectiveWidth:50,
      transactionDetails: {},
      transactionSummary:[],
      transactionSummaryError:null,
      showDetails:false,
      resizeFunction:()=>{},
      resizeEndFunction: ()=>{}

    };
    this.transactionService = new TransactionService();
    this.finishedInitialLoad = false;
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
    this.DEFAULT_ROW_COUNT = 50;
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
    if(this.state.activeCategory){
      this.loadTransactionsForCategory(this.state.activeCategory);
    }
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
    try{
      await new Promise((resolve,reject)=>{
        this.setState({loading:true},resolve);
      });
      let response = await loadFunction();
      await new Promise((resolve,reject)=>{
        this.setState({loading:false},resolve);
      });
      return response;
    } catch(error){
      console.error(error);
      return null;
    }
  }
  
  async loadSummaryByCategory(startDate,endDate){
    this.setState({loading:true});
    let loadTrans = ()=>{
      return this.transactionService.getTransactionSummaryByDateRange(startDate,endDate).catch(
      (error)=>{
        console.error(error);
        this.setState({transactionSummary:null,transactionSummaryError:error});
        return null;
      });
    };
    let response = await this.loadData(loadTrans);
    if(response){
      response.categories = response.categories.map((entry,index) => {
        entry["color"] = this.colorWheel[index].main;
        return entry;
      });
      await new Promise((resolve,reject)=>this.setState({transactionSummaryError:null,transactionSummary:response},resolve));
    }
  }

  async loadTransactionsForCategory(category){
    this.setState({loading:true});
    let loadTrans = ()=>{
      return this.transactionService.getTransactionDetailsForCategory(category).catch(
      (error)=>{
        console.error(error);
        this.setState({transactionDetails:null,transactionDetailsError:error});
        return null;
      });
    };
    let response = await this.loadData(loadTrans);
    if(response){
      await new Promise((resolve,reject)=>this.setState({transactionDetailsError:null,transactionDetails:response},resolve));
    }
  }

  startResize(){
    let resizeEvent = new ResizeEvent(this.setChildWidth.bind(this));
    if(this.detailsAvailableTimeout){
      clearTimeout(this.detailsAvailableTimeout);
      this.setState({contentWidthTransition:false});
    }
    return new Promise((resolve,reject)=>{
      this.setState(
      {resizeFunction:resizeEvent.resize.bind(resizeEvent),
        resizeEndFunction:resizeEvent.end.bind(resizeEvent)
      },resolve(resizeEvent));
    });
  }

  displayDetails(categoryTitle){
    this.loadTransactionsForCategory(categoryTitle);
    let alreadyVisible = this.state.showDetails;
    return new Promise((resolve)=>{
      let app = this;
      this.setState(
        {showDetails:true,contentWidthTransition:true,activeCategory:categoryTitle},
        ()=>{
        app.detailsAvailableTimeout = app.buildDisplayDetailsTimeout(alreadyVisible);     
        resolve();
      });
    });
  }

  buildDisplayDetailsTimeout(alreadyVisible)
  {
    if(alreadyVisible)
    {
      return null;
    }
    let app = this;
    return setInterval(function() {
      if(app.isResizeComplete())
      {
        if(app.detailsAvailableTimeout)
        {
          clearInterval(app.detailsAvailableTimeout);
        }
        app.setState({
          contentWidthTransition:false,
          transactionTableRowCount: Math.max(1, app.calculateTransactionTableRowCount()-2)
        });
      }
    }, 200); 
  }

  isResizeComplete()
  {
    let resizedContainer = $("#overall-perspective-width-container");
    let width = ( 100 * parseFloat($(resizedContainer).css('width')) / parseFloat($(resizedContainer).parent().css('width')) );
    return Math.abs(width - this.state.overallPerspectiveWidth) < .1;
  }
  calculateTransactionTableRowCount()
  {
    let visibleRowCount = 0;
    $.each($("#transactions-wrapper .rt-tbody .rt-tr"), (index, element) =>{
      if(this.isElementInViewport(element))
      {
        visibleRowCount++;
      }
    });
    return visibleRowCount;
  }

  isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }

  hideDetails(){
    if(this.state.showDetails){
      return new Promise((resolve)=>{
        let app = this;
        this.setState(
          {showDetails:false, contentWidthTransition:true, transactionTableRowCount: this.DEFAULT_ROW_COUNT},
          ()=>{
          app.detailsAvailableTimeout = setTimeout(function() {
            app.setState({contentWidthTransition:false});
        }, 2000);      
          resolve();
        });
      });
    }
  }

  componentDidMount(prevProps,prevState){
    if(!this.finishedInitialLoad){
      this.loadSummaryByCategory(this.state.startDate,this.state.endDate);
      this.finishedInitialLoad = true;
    }
  }

  render() {
    let opWidth = (this.state.showDetails ? this.state.overallPerspectiveWidth : 99);{/*Only 99% to make room when the 1% resize bar displays*/}
    let tmp = this.state.contentWidthTransition ? "app-content-transition":"app-content-no-transition";
    return (
      <div onMouseMove={((e)=>(this.state.resizeFunction(e))).bind(this)} onMouseUp={((e)=>(this.state.resizeEndFunction(e))).bind(this)} className="container-fluid app-base h-100 d-flex flex-column">
        <div>
          <NavBar setIsOnline={this.setIsOnline} online={this.state.online} startDate={this.state.startDate} 
            endDate={this.state.endDate} setDateRange={this.setDateRange}/>
        </div>
        <div className="perspective-container">
          <div id="overall-perspective-width-container" className={tmp} style={{width: opWidth + "%"}}>
            <OverallPerspective loading={this.state.loading} summaryData={this.state.transactionSummary} 
              summaryError={this.state.transactionSummaryError} showDetails={this.displayDetails.bind(this)}/>
          </div>
          {/*Only display Resize Bar and Category Perspective if we're showing the deails*/}
          {this.state.showDetails && (<ResizeBar width={this.props.resizeBarWidth} startResize={this.startResize.bind(this)}/>)}
          <div className = {tmp} style= {{width:(100-opWidth - this.props.resizeBarWidth) + "%"}}>
            <CategoryPerspective loading={this.state.loading} categoryName={this.state.activeCategory} 
              transactionsRowCount={this.state.transactionTableRowCount} transactions={this.state.transactionDetails} 
              active={this.state.showDetails} closeAction={this.hideDetails.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}