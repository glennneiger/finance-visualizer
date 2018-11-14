import React from 'react';

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
  render(){
    let loadingClass = this.props.loading ? 'perspective-loading' : 'hidden';
    return(
      <div className="perspective" >
        <PerspectiveNavbar opened={this.state.navbarOpened} toggleDisplay={this.toggleOverallNavbar.bind(this)} title="Summary"/>
        <div id="overall-perspective-loading" className={loadingClass + " flex-fill"}>
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    );
  }
}