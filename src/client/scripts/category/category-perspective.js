import React from 'react';
import $ from "jquery";

import '../../styles/category-perspective.scss';

import PerspectiveNavbar from '../utility/perspective-navbar';
import TransactionsSubPerspective from './transactions-subperspective.js';
import CategorizeTransaction from "./categorize-transaction-modal.js";
import CategoryMatcher from "../service/category-matcher.js";

export default class CategoryPerspective extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adjustedTableHeight: false,
      transactionsRowCount: 50,
      activeTransaction: {}
    }
  }
  setActiveTransaction(transaction) {
    //TODO when categories are invalid, show error message and don't open modal.
    if (transaction) {
      let canUpdate = this.props.categoriesById && this.props.categoriesById[transaction.categorizationId];
      if (transaction.categorizationId) {
        if (canUpdate) {
          let categorization = this.props.categoriesById[transaction.categorizationId];
          this.setState({
            activeTransaction: transaction,
            categoryMatcher: new CategoryMatcher(transaction.categorizationId, transaction.source,
              categorization.sourceRegex.split(".*"), transaction.description,
              categorization.descriptionRegex.split(".*"), transaction.value, categorization.minAmount, categorization.maxAmount,
              categorization.categoryName, categorization.subCategoryName)
          });
        } else {
          this.setState({ categoryMatcher: null });
          this.props.displayError("Unable to update categorization rule for this transaction, please try refreshing your page");
        }
      } else {
        this.setState({
          activeTransaction: transaction,
          categoryMatcher: new CategoryMatcher(null, transaction.source, [], transaction.description,
            [], transaction.value, transaction.value, transaction.value)
        });
      }
    }
  }

  hideModal() {
    console.log("Hiding");
    this.setState({
      categoryMatcher: null,
      activeTransaction: null
    });
  }
  render() {
    let loadingClass = this.props.loading ? 'perspective-loading' : 'hidden';
    let contentClass = !this.props.loading ? 'category-perspective-content  d-flex flex-column' : 'hidden';
    return (
      <div className="perspective">
        <div id="category-perspective-loading" className={loadingClass + " flex-fill"}>
          <span>.</span><span>.</span><span>.</span>
        </div>
        <div id="category-perspective-content" className={contentClass}>
          <div className="perspective-title">
            <span style={{ float: "right", display: this.props.active ? "inline-block" : "none", cursor: "pointer" }} onClick={this.props.closeAction}>X</span>
            <span>Transactions ({this.props.categoryName})</span>
          </div>
          <div style={{ width: "100%" }} className="flex-grow-1">
            <TransactionsSubPerspective transactions={this.props.transactions.transactions} currencySymbol={this.props.transactions.currencySymbol}
              rowCount={this.props.transactionsRowCount} setActiveTransaction={this.setActiveTransaction.bind(this)} />
          </div>
        </div>
        {this.state.categoryMatcher &&
          <CategorizeTransaction
            categoryMatcher={this.state.categoryMatcher}
            saveFunc={this.props.addTransactionFunc}
            categoryNames={this.props.categoryNames}
            subCategoryNames={this.props.subCategoryNames}
            hideModal={() => this.hideModal()}>
          </CategorizeTransaction>
        }
      </div>
    );
  }
}