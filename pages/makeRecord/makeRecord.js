Page({
  data: {
    arrBtn:[{
      title:'指责'
    },{
      title:'超理智'
    },{
      title:'逃避'
    },{
      title:'一致性表达'
    }],
    core:'2',
    activeCurrent:0,

  },
  // 监听页面加载
  onLoad(){
    
  },
  // 监听页面-初次-渲染完成
  onReady(){

  },
  // 监听页面显示
  onShow(){
  },
  // 自定义函数
  // 点击开始
  onChange(e){
    var x = e.detail.x //x轴便宜量
    var b = Math.ceil((2*x+18*2)/350*10)
    this.setData({
      core:b
    })
  },
  selectActive(e){
    this.setData({
      activeCurrent:e.target.dataset.index
    })
  }
})