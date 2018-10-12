Page({
  data: {
    textArr: [1,2,3,4],
    indicatorDots:false,  //是否显示面板指示点
    autoplay: false,      //是否自动切换
    interval: 1000,       //自动切换时间间隔
    duration: 100,      //滑动动画时长
    current:0,//当前所在滑块的index 
    activeCurrent:0,
    date:'9月13日',
  },
  // 监听页面加载
  onLoad(){
    var textArrLength = this.data.textArr.length
    console.log(textArrLength)
    console.log(this.data)
    this.setData({
      
      // date: '899999'
    })
  },
  // 监听页面-初次-渲染完成
  onReady(){

  },
  // 监听页面显示
  onShow(){
  },
  // 自定义函数

  // 一次滑动完成
  moveText(e){
    this.setData({
      activeCurrent:e.detail.current
    })
  },
  // 左右切换
  toLeft(){
    var that = this;
    var ind = that.data.activeCurrent-1;
    if (ind>=0){
      that.setData({
        activeCurrent: ind,
        current:ind
      })
    }
  },
  toRight(){
    var that = this;
    var ind = that.data.activeCurrent+1;
    if (ind <= this.data.textArr.length -1) {
      that.setData({
        activeCurrent: ind,
        current: ind
      })
    }
  },
  // 跳转
  goMakeRecord(){
    wx.navigateTo({
      url: '../makeRecord/makeRecord'
    })
  },
  goModifyRecord(){
    wx.navigateTo({
      url: '../modifyRecord/modifyRecord'
    })
  },
  goReview(){
    wx.navigateTo({
      url: '../review/review'
    })
  },
})