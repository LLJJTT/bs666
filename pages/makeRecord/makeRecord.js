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
    core:'1',
    activeCurrent:0,
    left_width:15,
    right_width:0,
  },
  // 监听页面加载
  onLoad(){
    const that = this
    const query = wx.createSelectorQuery()
    query.select('#pull_btn').boundingClientRect()
    query.select('#pull').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res){
      that.setData({
        pullAreaWidth:res[1].width,
        pullBtnWidth:res[0].width,
        right_width:that.data.pullAreaWidth-15
      })
    })
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
    var lw = x+this.data.pullBtnWidth/2 + 6
    var rw = this.data.pullAreaWidth -lw
    // console.log(lw/350)
    var b = Math.ceil(10*lw/this.data.pullAreaWidth)
    this.setData({
      left_width:lw,
      right_width:rw,
      core:b
    })
  },
  selectActive(e){
    this.setData({
      activeCurrent:e.target.dataset.index
    })
  }
})