import React from 'react';

import '../../styles/category-perspective.scss';
import PerspectiveNavbar from '../perspective-navbar';

export default class CategoryPerspective extends React.Component{
  constructor(props){
    super(props);
    this.state = {navbarOpened:false};
  }

  toggleCategoryNavbar(){
    return new Promise((resolve,reject)=>{
      this.setState((previousState)=>
      ({navbarOpened:!previousState.navbarOpened})
      ,resolve);
    });
  }

  render(){
    let loadingClass = this.props.loading ? 'perspective-loading' : 'hidden';
    return(
      <div className="perspective">
        <PerspectiveNavbar opened={this.state.navbarOpened} toggleDisplay={this.toggleCategoryNavbar.bind(this)} title={"Car Spending"}/>
        <div id="category-perspective-loading" className={loadingClass + " flex-fill"}>
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    );
  }

}