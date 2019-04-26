import React from "react";
import StringMatcher from "./categorize-string-matcher.js";
import NumericMatcher from "./categorize-numeric-matcher.js";
import { debug } from "util";
import NumericMatcherUpdater from "./numeric-matcher-updater.js";
import $ from "jquery";
import ReactDOM from "react-dom";

export default class CategoryPerspective extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.generateInitialStateFromProps(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.generateInitialStateFromProps(nextProps));
    }

    componentDidMount() {
        let node = ReactDOM.findDOMNode(this);
        $(node).modal("show");
        //ensures the next time this is open, it's a 'new' modal and will have componentDidMount shown.
        $(node).on('hidden.bs.modal', this.props.hideModal);
    }

    generateInitialStateFromProps(nextProps) {
        let nextState = {
            source: {
                addCharacterFunc: ((input) => { return nextProps.categoryMatcher.addSourceCharacter(input) }).bind(this),
                removeCharacterFunc: ((input) => { return nextProps.categoryMatcher.removeSourceCharacter(input) }).bind(this),
                includesIndex: ((input) => { return nextProps.categoryMatcher.matchedSourceIndexes.includes(input) }).bind(this),
                active: false,
                startIndex: 0,
                isSelecting: true, //true if selecting, false if deselecting
                backgroundColor: []
            },
            description: {
                addCharacterFunc: ((input) => { return nextProps.categoryMatcher.addDescriptionCharacter(input) }).bind(this),
                removeCharacterFunc: ((input) => { return nextProps.categoryMatcher.removeDescriptionCharacter(input) }).bind(this),
                includesIndex: ((input) => { return nextProps.categoryMatcher.matchedDescriptionIndexes.includes(input) }).bind(this),
                active: false,
                startIndex: 0,
                isSelecting: true, //true if selecting, false if deselecting
                backgroundColor: []
            },
            amountUpdater: new NumericMatcherUpdater(
                "#categorizeTransactionAmountSlider",
                nextProps.categoryMatcher.minAmount,
                nextProps.categoryMatcher.maxAmount,
                nextProps.categoryMatcher.currentAmount,
                this),
            lowAmount: nextProps.categoryMatcher.minAmount,
            highAmount: nextProps.categoryMatcher.maxAmount, // required to notify react to re-render when these values change.
            selectedCategory: nextProps.categoryMatcher.categoryName,
            selectedSubCategory: nextProps.categoryMatcher.subCategoryName,
            tmpSelectedSubCategory: "",
            tmpSelectedCategory: "",
            isSelectingCategory: false,
            isSelectingSubCategory: false
        }
        for (let index = 0; index < nextProps.categoryMatcher.sourceReference.length; index++) {
            let matcherContainsIndex = nextProps.categoryMatcher.matchedSourceIndexes.includes(index);
            nextState.source.backgroundColor.push(matcherContainsIndex ? "green" : "inherit");
        }
        for (let index = 0; index < nextProps.categoryMatcher.descriptionReference.length; index++) {
            let matcherContainsIndex = nextProps.categoryMatcher.matchedDescriptionIndexes.includes(index);
            nextState.description.backgroundColor.push(matcherContainsIndex ? "green" : "inherit");
        }
        return nextState;
    }

    copyFieldState(fieldState) {
        let copy = Object.assign({}, fieldState);
        copy.backgroundColor = copy.backgroundColor.map((input) => input);
        return copy;
    }

    highlight(fieldStateKey, charIndex) {
        let fieldState = this.copyFieldState(this.state[fieldStateKey]);
        if (!fieldState.active) {
            return;
        }
        let indexUpdateAmount = Math.sign(fieldState.startIndex - charIndex);
        let finishedUpdate = false;
        let updateIndex = charIndex;
        while (!finishedUpdate) {
            if (fieldState.isSelecting) {
                let actionSuccess = fieldState.addCharacterFunc(updateIndex);
                if (actionSuccess) {
                    let updatedState = {};
                    fieldState.backgroundColor[updateIndex] = "green";
                    updatedState[fieldStateKey] = fieldState;
                    this.setState(updatedState);
                }
            } else {
                let actionSuccess = fieldState.removeCharacterFunc(updateIndex);
                if (actionSuccess) {
                    let updatedState = {};
                    fieldState.backgroundColor[updateIndex] = "inherit";
                    updatedState[fieldStateKey] = fieldState;
                    this.setState(updatedState);
                }
            }
            finishedUpdate = updateIndex == fieldState.startIndex;
            updateIndex = updateIndex + indexUpdateAmount;
        }
    }

    startHighlight(fieldStateKey, startIndex) {
        let fieldState = this.copyFieldState(this.state[fieldStateKey]);
        fieldState.active = true;
        fieldState.startIndex = startIndex;
        fieldState.isSelecting = !fieldState.includesIndex(startIndex);
        let updatedState = {};
        updatedState[fieldStateKey] = fieldState;
        this.setState(updatedState, () => {
            this.highlight(fieldStateKey, startIndex);
        });
    }

    endHighlight() {
        let updatedState = {};
        updatedState.source = this.copyFieldState(this.state.source);
        updatedState.description = this.copyFieldState(this.state.description);
        updatedState.source.active = false;
        updatedState.description.active = false;
        this.setState(updatedState);
    }

    mouseUp(event) {
        this.endHighlight();
        this.state.amountUpdater.endUpdate(event);
    }

    onUpdateAmount() {
        this.setState({
            lowAmount: this.state.amountUpdater.minAmount,
            highAmount: this.state.amountUpdater.maxAmount
        });
    }

    getCategorySelectorDisplay() {
        if (this.state.isSelectingCategory) {
            return (
                <input id="categorizeTransactionModal_inputCategory" type="text" placeholder="Enter Category Name"
                    value={this.state.tmpSelectedCategory}
                    onChange={(event) => { this.setState({ tmpSelectedCategory: event.target.value }) }}
                    onBlur={(event) => this.selectCategory(event.target.value)}>
                </input>
            );
        } else {
            return (
                <button className="btn btn-secondary" onClick={this.displayCategories.bind(this)}>{this.state.selectedCategory ? this.state.selectedCategory : 'Select Category'}</button>
            );
        }
    }

    getSubCategorySelectorDisplay() {
        if (this.state.isSelectingSubCategory) {
            return (
                <input id="categorizeTransactionModal_inputSubCategory" type="text" placeholder="Enter Sub Category Name"
                    value={this.state.tmpSelectedSubCategory}
                    onChange={(event) => { this.setState({ tmpSelectedSubCategory: event.target.value }) }}
                    onBlur={(event) => this.selectSubCategory(event.target.value)}>
                </input>
            );
        } else {
            return (
                <button className="btn btn-secondary" onClick={this.displaySubCategories.bind(this)}>{this.state.selectedSubCategory ? this.state.selectedSubCategory : 'Select Sub Category'}</button>
            );
        }
    }

    displayCategories() {
        $('#categorizeTransactionModal_displayCategoriesButton').dropdown("toggle");
        this.setState({ isSelectingCategory: true });
    }

    displaySubCategories() {
        $('#categorizeTransactionModal_displaySubCategoriesButton').dropdown("toggle");
        this.setState({ isSelectingSubCategory: true });
    }

    selectCategory(selection) {
        if (selection) {
            this.setState({
                selectedCategory: selection,
                isSelectingCategory: false
            });
            $('#categorizeTransactionModal_categoryDropdown').removeClass("show");
        }
    }

    selectSubCategory(selection) {
        if (selection) {
            this.setState({
                selectedSubCategory: selection,
                isSelectingSubCategory: false
            });
            $('#categorizeTransactionModal_subCategoryDropdown').removeClass("show");
        }
    }

    submit() {
        this.props.categoryMatcher.minAmount = this.state.lowAmount;
        this.props.categoryMatcher.maxAmount = this.state.highAmount;
        this.props.categoryMatcher.categoryName = this.state.selectedCategory;
        this.props.categoryMatcher.subCategoryName = this.state.selectedSubCategory;
        this.props.saveFunc(this.props.categoryMatcher);
    }

    buildCategoryNameLinks() {
        if (this.props.categoryNames == null) {
            return [];
        }
        let response = [];
        this.props.categoryNames.forEach((name) => {
            response.push(<a key={name} className="dropdown-item" onClick={() => { this.selectCategory(name) }} href="#">{name}</a>);
        });
        return response;
    }

    buildSubCategoryNameLinks() {
        if (this.props.subCategoryNames == null) {
            return [];
        }
        let response = [];
        this.props.subCategoryNames.forEach((name) => {
            response.push(<a key={name} className="dropdown-item" onClick={() => { this.selectSubCategory(name) }} href="#">{name}</a>);
        });
        return response;
    }
    render() {
        let modal = this;
        if (!this.props.categoryMatcher) {
            return <div></div>
        }
        return (
            <div className="modal fade" id="categorizeTransactionModal" tabIndex="-1" role="dialog" aria-labelledby="categorizeTransactionModalLabel" aria-hidden="true"
                onMouseUp={this.mouseUp.bind(this)} onMouseMove={(event) => { this.state.amountUpdater.update(event) }}>
                <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 id="categorizeTransactionModalLabel" className="modal-title text-center col-12">Categorize</h5>
                        </div>
                        <div className="modal-body">
                            <table className="table" style={{ width: "auto", margin: "auto" }}>
                                <thead>
                                    <tr>
                                        <th className="text-center" scope="col">Source</th>
                                        <th className="text-center" scope="col">Description</th>
                                        <th className="text-center" scope="col" style={{ width: "30%" }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <StringMatcher
                                                text={this.props.categoryMatcher.sourceReference}
                                                characterColor={this.state.source.backgroundColor}
                                                startHighlight={this.startHighlight.bind(this, "source")}
                                                highlight={this.highlight.bind(this, "source")}>
                                            </StringMatcher>
                                        </td>
                                        <td>
                                            <StringMatcher
                                                text={this.props.categoryMatcher.descriptionReference}
                                                characterColor={this.state.description.backgroundColor}
                                                startHighlight={this.startHighlight.bind(this, "description")}
                                                highlight={this.highlight.bind(this, "description")}>
                                            </StringMatcher>
                                        </td>
                                        <td style={{ verticalAlign: "middle" }}>
                                            <NumericMatcher updater={this.state.amountUpdater}></NumericMatcher>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <div className="dropdown">
                                <button id="categorizeTransactionModal_displayCategoriesButton"
                                    type="button"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    style={{ visibility: modal.state.isSelectingCategory ? "visible" : "hidden" }}>
                                </button>
                                {this.getCategorySelectorDisplay()}
                                <div id="categorizeTransactionModal_categoryDropdown" className="dropdown-menu">
                                    {this.buildCategoryNameLinks()}
                                </div>
                            </div>
                            <div className="dropdown">
                                <button id="categorizeTransactionModal_displaySubCategoriesButton"
                                    type="button"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    style={{ visibility: modal.state.isSelectingSubCategory ? "visible" : "hidden" }}>
                                </button>
                                {this.getSubCategorySelectorDisplay()}
                                <div id="categorizeTransactionModal_subCategoryDropdown" className="dropdown-menu">
                                    {this.buildSubCategoryNameLinks()}
                                </div>
                            </div>
                            <button type="button" className="btn btn-primary"
                                disabled={!this.state.selectedCategory}
                                data-dismiss="modal"
                                onClick={() => { this.submit() }}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}