export default class ResizeEvent{

  constructor(callback){
    this.callback = callback;
    this.mockResize = jest.fn();
    this.mockEnd = jest.fn();
    this.resize.bind = ()=>this.resize;
    this.end.bind = ()=>this.end;
  }

  resize(mouseEvent){
    this.mockResize(mouseEvent);
  }

  end(){
    this.mockEnd();
  }
}