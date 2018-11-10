import React from 'react';

import '../../styles/overall-perspective.scss';

export default class OverallPerspective extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    let loadingClass = this.props.loading ? 'overall-loading' : 'hidden';
    return(
      <div id="overall-perspective-loading" className={loadingClass}>
        <span>.</span><span>.</span><span>.</span>
      </div>
    );
  }
}