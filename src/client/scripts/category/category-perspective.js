import React from 'react';

import '../../styles/category-perspective.scss';

export default class CategoryPerspective extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    let loadingClass = this.props.loading ? 'overall-loading' : 'hidden';
    return(
      <div id="category-perspective-loading" className={loadingClass}>
        <span>.</span><span>.</span><span>.</span>
      </div>
    );
  }

}