import React from 'react';
import $ from "jquery";

import '../../styles/category-perspective.scss';

import PerspectiveNavbar from '../utility/perspective-navbar';
import TransactionsSubPerspective from './transactions-subperspective.js';

export default class CategoryPerspective extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      adjustedTableHeight : false,
      transactionsRowCount : 50
    }
  }

  render(){
    let loadingClass = this.props.loading ? 'perspective-loading' : 'hidden';
    let contentClass = !this.props.loading ? 'category-perspective-content' : 'hidden';
    return(
      <div className="perspective">
        <div id="category-perspective-loading" className={loadingClass + " flex-fill"}>
          <span>.</span><span>.</span><span>.</span>
        </div>
        <div id="category-perspective-content" className={contentClass + " d-flex flex-column"}>
          <div className="perspective-title">
            <span style={{float:"right", display: this.props.active ? "inline-block" : "none", cursor:"pointer"}} onClick={this.props.closeAction}>X</span>
            <span>Transactions ({this.props.categoryName})</span>
          </div> 
          <div style={{width:"100%"}} className="flex-grow-1">
            <TransactionsSubPerspective transactions={this.props.transactions.transactions} currencySymbol={this.props.transactions.currencySymbol} rowCount={this.props.transactionsRowCount}/>
          </div>
        </div>
      </div>
    );
  }
}