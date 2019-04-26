import React from 'react';
import SVGPieChart from "react-svg-piechart";

import PerspectiveNavbar, { BottomPerspectiveNavbar } from '../utility/perspective-navbar';

import '../../styles/overall-perspective.scss';
import { addTextToPieChart } from './overall-perspective-logic.js';
import $ from "jquery";

export default class OverallPerspective extends React.Component {

  constructor(props) {
    super(props);
    this.state = { navbarOpened: false };
    this.activeCategory = null;
    this.pieChartHasText = false;
  }
  toggleOverallNavbar() {
    return new Promise((resolve, reject) => {
      this.setState((previousState) =>
        ({ navbarOpened: !previousState.navbarOpened })
        , resolve);
    });
  }

  generateKey(data) {
    if (data) {
      let response = [];
      for (let i = 0; i < data.length; i++) {
        response.push(
          <li key={data[i].title} className="overall-perspective-key-item">
            <div className="overall-perspective-title-and-key">
              <div className="overall-perspective-key-color" style={{ backgroundColor: data[i].color }} />
              <span className="overall-perspective-key-title">{data[i].title}</span>
            </div>
            {/*<span className="overall-perspective-key-percent">{data[i].percentage}</span>*/}
          </li>);
      }
      return response;
    } else {
      return "";
    }
  }

  setActiveCategory(data) {
    if (data) {
      this.activeCategory = data.title;
    } else {
      this.activeCategory = null;
    }
  }

  onPieChartClick() {
    if (this.activeCategory) {
      this.props.showDetails(this.activeCategory);
    }
  }

  render() {
    return this.renderOrDisplayError();
  }

  componentDidMount() {
    addTextToPieChart(".overall-perspective-chart");
    this.pieChartHasText = true;
  }

  componentDidUpdate() {
    if (!this.pieChartHasText) {
      addTextToPieChart(".overall-perspective-chart");
      this.pieChartHasText = true;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.summaryData || !nextProps.summaryData || !this.props.summaryData.categories || !nextProps.summaryData.categories) {
      this.pieChartHasText = true; //don't need to draw text if no data exists.
      return;
    }
    if (this.props.summaryData.categories.length != nextProps.summaryData.categories.length) {
      this.pieChartHasText = false;
      return;
    }
    for (let summaryIndex = 0; summaryIndex < this.props.summaryData.categories.length; summaryIndex++) {
      if (!nextProps.loading && !(
        this.props.summaryData.categories[summaryIndex].title == nextProps.summaryData.categories[summaryIndex].title &&
        this.props.summaryData.categories[summaryIndex].value == nextProps.summaryData.categories[summaryIndex].value &&
        this.props.summaryData.categories[summaryIndex].percentage == nextProps.summaryData.categories[summaryIndex].percentage)) {
        this.pieChartHasText = false;
        return;
      }
    }
  }

  renderOrDisplayError() {
    if (this.props.summaryError) {
      return (<div className="alert alert-danger" role="alert">{this.props.summaryError}</div>);
    }
    try {
      let loadingClass = this.props.loading ? 'perspective-loading' : 'hidden';
      let contentClass = (this.props.loading ? 'hidden' : "overall-perspective-content");
      let response = (
        <div className="perspective">
          <PerspectiveNavbar opened={this.state.navbarOpened} toggleDisplay={this.toggleOverallNavbar.bind(this)} title="Summary" />
          <div id="overall-perspective-loading" className={loadingClass + " flex-fill"}>
            <span>.</span><span>.</span><span>.</span>
          </div>
          <div id="overall-perspective-content" className={contentClass + " container"}>
            <div className="row align-items-center" style={{ width: "100%", height: "100%" }}>
              <div style={{ width: "100%", textAlign: "center" }} className={"d-md-none"}>
                <div id="overall-perspective-mobile-formatted-total">{"" + this.props.summaryData.currencySymbol + this.props.summaryData.formattedTotal}</div>
              </div>
              <div className="overall-perspective-key col-md-3 d-none d-md-flex">
                <div>Legend</div>
                <div>
                  <ul id="overall-perspective-legend" style={{ paddingLeft: "10px" }}>
                    {this.generateKey(this.props.summaryData.categories)}
                  </ul>
                </div>
              </div>
              <div className="col-md-6 col-xs-12" style={{ textAlign: "center" }}>
                <div className="overall-perspective-chart" onClick={this.onPieChartClick.bind(this)} style={{ cursor: "pointer" }}>
                  <SVGPieChart data={this.props.summaryData.categories} onSectorHover={this.setActiveCategory.bind(this)} expandSize={1} viewBoxSize={75} strokeWidth={.5} expandOnHover />
                </div>
              </div>
              <div className="overall-perspective-summary col-md-3 d-none d-md-flex">
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
              <BottomPerspectiveNavbar className={"d-md-none"} opened={this.state.navbarOpened} toggleDisplay={this.toggleOverallNavbar.bind(this)} title="Summary" />
            </div>
          </div>
        </div>
      );
      return response;
    } catch (error) {
      console.error(error);
      return (<div className="alert alert-danger" role="alert">Unable to display summary information</div>);
    }
  }
}