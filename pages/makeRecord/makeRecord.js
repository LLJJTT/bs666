var app = getApp();
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
    event:'',
    answer:'指责',
    feel:'',
    viewpoint:'',
    expect:'',
    expect_mine:'',
    expect_other:'',
    yearn:'',
    selfCognition:null,
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
  // 自定义函数

  // 拖动打分
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
  
  // 获取输入框内容

  //事件
  getEvent(e){
    this.setData({
      event:e.detail.value
    })
  },

  //应对
  selectActive(e){
    this.setData({
      activeCurrent:e.target.dataset.index
    })
    for(var i=0;i<this.data.arrBtn.length;i++){
      this.setData({
        answer:this.data.arrBtn[this.data.activeCurrent].title
      })
    }
  },

  //感受
  getFeel(e){
    this.setData({
      feel:e.detail.value
    })
  },

  //观点
  getViewPoint(e){
    this.setData({
      viewpoint:e.detail.value
    })
  },

  //对自己期望
  getExpectMine(e){
    this.setData({
      expect_mine:e.detail.value
    })
  },
  //对他人期望
  getExpectOther(e){
    this.setData({
      expect_other:e.detail.value
    })
  },

  //渴望
  getYearn(e){
    this.setData({
      yearn:e.detail.value
    })
  },

  // 点击保存
  saveData(){
    if (!this.data.event) {
      wx.showToast({
        title: '请输入事件',
        icon: 'none',
        duration: 2000
      })
    }else if (!this.data.answer) {
      wx.showToast({
        title: '请选择应对',
        icon: 'none',
        duration: 2000
      })
    }
    else if (!this.data.feel) {
      wx.showToast({
        title: '请输入感受',
        icon: 'none',
        duration: 2000
      })
    }
    else if (!this.data.viewpoint) {
      wx.showToast({
        title: '请输入观点',
        icon: 'none',
        duration: 2000
      })
    }
    else if (!this.data.expect_mine) {
      wx.showToast({
        title: '请输入对自己的期待',
        icon: 'none',
        duration: 2000
      })
    }
    else if (!this.data.expect_other) {
      wx.showToast({
        title: '请输入对他人的期待',
        icon: 'none',
        duration: 2000
      })
    }
   else if (!this.data.yearn) {
      wx.showToast({
        title: '请输入渴望',
        icon: 'none',
        duration: 2000
      })
    }
    else if (!this.data.core) {
      wx.showToast({
        title: '请为自己打分',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.showLoading({
        title:'保存中',
        mask:true
      })

      // 拼接期待
      this.setData({
        expect:'对自己：'+this.data.expect_mine+'对他人：'+this.data.expect_other
      })

      // 向后台传数据
      var that  = this
      var mainOpenid = app.globalData.openId
      var addIce = {
        mainOpenid: mainOpenid, 
        event:this.data.event,
        answer:this.data.answer,
        feel:this.data.feel,
        viewpoint:this.data.viewpoint,
        expect:this.data.expect,
        yearn:this.data.yearn,
        selfCognition:this.data.core
      }
      wx.request({
        url: app.globalData.url+'ice/add', 
        data: addIce,
        method:'POST',
        success(res){
          if (res.data.code==200) {
            wx.hideLoading()
            wx.showToast({
              title: '保存成功，正在跳转',
              icon: 'none',
              duration: 3000
            })
            that.setData({
              event:'',
              answer:'指责',
              feel:'',
              viewpoint:'',
              expect:'',
              yearn:'',
              core:'1'
            })
            // 保存成功跳转冰山界面
            setTimeout(function(){
              wx.navigateTo({//保留当前页面
               url: '../walkIcebergRecord/walkIcebergRecord'
              })
            },3000)
          }
        },
        fail(err){
          wx.showToast({
            title: '数据加载失败',
            icon: 'loading',
            duration: 2000
          })
          console.log(err)
        }
      })
    }
  },
})