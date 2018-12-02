
export default class ResizeEvent{

  constructor(callback){
    this.completed = false;
    this.callback = callback;
  }

  resize(mouseEvent){
    if(this.completed){
      return;
    }
    let leftContainerWidth = (mouseEvent.pageX/document.body.clientWidth)*100 ;
    this.callback(leftContainerWidth);
  }

  end(){
    this.completed = true;
  }
}