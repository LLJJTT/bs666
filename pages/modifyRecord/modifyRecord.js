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
    pullAreaWidth:null,
    pullBtnWidth:null,
    event:'',
    answer:'指责',
    feel:'',
    viewpoint:'',
    expect:'',
    expect_mine:'',
    expect_other:'',
    yearn:'',
    selfCognition:null,
    iceId:null,
    x:0
  },
  // 监听页面加载
  onLoad(option){
    // 接收ice id
    this.setData({
      iceId:option.id
    })

    this.getPullWidth()

    var that =  this
    setTimeout(function(){ 
      that.getModifyData()
    },300);
    
    
  },
  // 监听页面-初次-渲染完成
  onReady(){

  },
  // 监听页面显示
  onShow(){
  },
  // 获取滑块需求参数
  getPullWidth(){
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
  getModifyData(){//根据id 换详情
    wx.showLoading({
      title:'获取数据中',
      mask:true
    })
    var that = this
    var mainOpenid = app.globalData.openId
    wx.request({
      url: app.globalData.url+'ice/getRecords', 
      data: {
        mainOpenid:mainOpenid,
        id:that.data.iceId
      },
      method:'POST',
      success(res){
        // console.log(res.data)
        if (res.data.code==200) {
          that.setData({
            event:res.data.data[0].event,
            feel:res.data.data[0].feel,
            viewpoint:res.data.data[0].viewpoint,
            yearn:res.data.data[0].yearn,
            core:res.data.data[0].selfCognition
          })

          // 显示---应对方案
          var answer = res.data.data[0].answer
          that.data.arrBtn.map((item,index) =>{
            if (item.title===answer) {
              that.setData({
                activeCurrent:index
              })
            }
          })

          // 显示--期待（对自己和对他人）
          var expect = res.data.data[0].expect
          var strOther ="对他人："
          var strMine ="对自己："
          var otherWord = expect.split(strOther)[1];//对他人
          var str_befor_except = expect.split(strOther)[0];
          var mineWord  = str_befor_except.split(strMine)[1];//对自己
          that.setData({
            expect_mine:mineWord,
            expect_other:otherWord
          })

          // 显示分数所在位置
          var lw = Number(that.data.core) * that.data.pullAreaWidth /10
          var rw = that.data.pullAreaWidth - lw
          that.setData({
            left_width:lw,//绿色条
            right_width:rw,//白色条
            x:lw - that.data.pullBtnWidth/2 - 6//x偏移量
          })
          wx.hideLoading()
        }
      },
      fail(err){
        console.log(err)
      }
    })
  },
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
  // 获取输入框内容
  getEvent(e){//事件
    this.setData({
      event:e.detail.value
    })
  },
  selectActive(e){//应对
    this.setData({
      activeCurrent:e.target.dataset.index
    })
    for(var i=0;i<this.data.arrBtn.length;i++){
      this.setData({
        answer:this.data.arrBtn[this.data.activeCurrent].title
      })
    }
  },
  getFeel(e){//感受
    this.setData({
      feel:e.detail.value
    })
  },
  getViewPoint(e){//观点
    this.setData({
      viewpoint:e.detail.value
    })
  },
  getExpectMine(e){//对自己期望
    this.setData({
      expect_mine:e.detail.value
    })
  },
  getExpectOther(e){//对他人期望
    this.setData({
      expect_other:e.detail.value
    })
  },
  getYearn(e){//渴望
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
        id:this.data.iceId, 
        event:this.data.event,
        answer:this.data.answer,
        feel:this.data.feel,
        viewpoint:this.data.viewpoint,
        expect:this.data.expect,
        yearn:this.data.yearn,
        selfCognition:this.data.core
      }
      wx.request({
        url: app.globalData.url+'ice/update', 
        data: addIce,
        method:'POST',
        success(res){
          if (res.data.code==200) {
            wx.hideLoading()
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 3000
            })
            that.setData({
              event:'',
              answer:'指责',
              feel:'',
              viewpoint:'',
              expect:'',
              expect_mine:'',
              expect_other:'',
              yearn:'',
              core:'1'
            })

            // 显示分数所在位置
            var lw = Number(that.data.core) * that.data.pullAreaWidth /10
            var rw = that.data.pullAreaWidth - lw
            that.setData({
              left_width:lw,//绿色条
              right_width:rw,//白色条
              x:lw - that.data.pullBtnWidth/2 - 6//x偏移量
            })

            // 保存成功跳转
            setTimeout(function(){
              wx.navigateTo({//保留当前页面，，打开到应用内的某个页面
               url: '../walkIcebergRecord/walkIcebergRecord'
              })
            },3000)
          }
        },
        fail(err){
          console.log(err)
        }
      })
    }
  },
  // 删除
  deleteData(){
     var that  = this
    wx.showModal({
      title:"温馨提示",
      content:"您确定要删除此条数据么？",
      success(res){
        console.log(res)
        if (res.confirm===true) {
          
        // 向后台传数据
         
          var mainOpenid = app.globalData.openId
          var addIce = {
            mainOpenid: mainOpenid,
            id:that.data.iceId, 
          }
          wx.request({
            url: app.globalData.url+'ice/delete', 
            data: addIce,
            method:'POST',
            success(res){
              if (res.data.code==200) {
                wx.showToast({
                  title: '删除中',
                  icon: 'loading',
                  duration: 3000
                })
                setTimeout(function(){ 
                  wx.navigateTo({
                    url: '../walkIcebergRecord/walkIcebergRecord'
                  })
                },3000);
              }
            },
            fail(err){
              console.log(err)
            }
          })
        }
      }
    })
    
  }
})