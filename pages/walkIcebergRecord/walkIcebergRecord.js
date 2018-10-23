var app = getApp();
Page({
  data: {
    textArr: [],
    indicatorDots:false,  //是否显示面板指示点
    autoplay: false,      //是否自动切换
    interval: 1000,       //自动切换时间间隔
    duration: 100,      //滑动动画时长
    current:0,//当前所在滑块的index 
    activeCurrent:0,
    currentYear:null,
    currentMonth:null,
    currentDay:null,
    showSiper:wx.getStorageSync('showSiper'),
    show_no_data:false,
    iceId:'',
  },
  // 监听页面加载 
  onLoad(){
    // console.log(app.globalData.code)
    this.getToday()
    var textArrLength = this.data.textArr.length
    console.log(this.data.showSiper)
    if (this.data.showSiper==true) {
      this.getIceData()
    }
  },
  // 监听页面-初次-渲染完成
  onReady(){

  },
  // 监听页面显示
  onShow(){
  },
  // 自定义函数
  // 获取今天年月
  getToday(){
    const date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    this.setData({
      currentYear:year,
      currentMonth:month,
      currentDay:day
    })
    // console.log(year+'-'+month+'-'+day)
  },
  // 官方授权
  bindGetUserInfo(e){
    if (e.detail.errMsg=="getUserInfo:fail auth deny") {
      wx.showToast({
        title: '您拒绝了授权',
        icon: 'none',
        duration: 2000
      })
    }
    else if (e.detail.errMsg=="getUserInfo:ok"){
      wx.setStorage({
        key: 'showSiper',
        data: true
      })
      var that = this
      var e = e.detail
      // console.log(e)//授权成功返回
      app.globalData.userInfo = e.userInfo

      new Promise((resolve, reject) => {
        wx.login({//获取code换openid
          success: function (res) {
            resolve(res)
          }
        })
      }).then((res) => {
        var appId = app.globalData.appId
        var appSecret = app.globalData.appSecret
        var code = res.code
        // wx.request({
        //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + appSecret + '&js_code=' + code + '&grant_type=authorization_code',
        //   data: {},
        //   header: {
        //     'content-type': 'json'
        //   },
        //   success: function (res) {
        //     console.log(res)
        //     var openid = res.data.openid //返回openid
        //     console.log('openid为' + openid);
        //   }
        // })
        // console.log(res)
        app.globalData.code = res.code
      })

     
      wx.showLoading({
        title:'授权成功',
        mask:true,
      }) 
      setTimeout(function(){ 
        console.log(wx.getStorageSync('showSiper'))
        that.setData({
          showSiper:wx.getStorageSync('showSiper'),
        })
        that.onLoad()
        wx.hideLoading()
      }, 1500);
    }
  },
  // 一次滑动完成
  moveText(e){
    this.setData({
      activeCurrent:e.detail.current
    })
  },
  // 左切换
  toLeft(){
    var that = this;
    var ind = that.data.activeCurrent-1;
    if (ind>=0){
      that.setData({
        activeCurrent: ind,
        current:ind
      })
    }else{//左到头时
      that.setData({
        show_no_data:false,
      })
      var yesterday = this.data.currentDay - 1
      if (this.data.currentDay==1) {//当前日期为1号
        var date = new Date();
        var d = new Date(date.getFullYear(), this.data.currentMonth, 0);
        d.getDate()
        this.setData({
          currentDay:d.getDate(),//当月的天数
        })

        if (this.data.currentMonth==1) {
          this.setData({//月份为12
            currentMonth:12,
            currentYear:this.data.currentYear - 1
          })
        }
        else{
          this.setData({//月份-1
            currentMonth:this.data.currentMonth - 1,
          })
        }
        
      }else{
        this.setData({
          currentDay:yesterday,
        })
      }
      this.getIceData()
    }
  },
  // 右切换
  toRight(){
    var that = this;
    var ind = that.data.activeCurrent+1;
    if (ind <= this.data.textArr.length -1) {
      that.setData({
        activeCurrent: ind,
        current: ind
      })
    }else{//右到头
      that.setData({
        show_no_data:false,
      })
      var tomorrow = this.data.currentDay + 1
      var date = new Date();
      var d = new Date(date.getFullYear(), this.data.currentMonth, 0);
      if (this.data.currentDay==d.getDate()) {//当前日为--当月最后一天
        if (this.data.currentMonth==12) {//当月为12月
          this.setData({//月份为1月
            currentMonth:1,
            currentYear:this.data.currentYear + 1
          })
        }
        else{
          this.setData({//月份+1
            currentMonth:this.data.currentMonth + 1,
          })
        }
        this.setData({
          currentDay:1,//当月的天数
        })
      }else{
        this.setData({
          currentDay:tomorrow,
        })
      }
      this.getIceData()
    }
  },
  // 判断登录
  judgeLogin(){

  },
  // 跳转
  goMakeRecord(){
    wx.navigateTo({
      url: '../makeRecord/makeRecord'
    })
  },
  goModifyRecord(){
    if (this.data.textArr.length==0) {
      wx.showToast({
        title: '请先新建记录',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      var id = this.data.textArr[this.data.activeCurrent].id
      wx.navigateTo({
        url: '../modifyRecord/modifyRecord?id='+id
      })
    }
    
  },
  goReview(){
    wx.navigateTo({
      url: '../review/review'
    })
  },
  // 获取冰山记录信息
  getIceData(){
    var that = this
    that.setData({
      textArr:[],
    })
    wx.showLoading({
      title:'获取数据中',
      mask:true
    })
    var mainOpenid = app.globalData.openId
    //获取月份长度 后端需要格式 2018-09-06
    const date = new Date()
    var strYear = this.data.currentYear
    var strMonth = this.data.currentMonth.toString().length
    var strDay = this.data.currentDay.toString().length
    var yearMonthDay = ''
    var Month,Day
    if (strMonth==1) {
      Month = '0' + this.data.currentMonth.toString()
    }
    else{
      Month = this.data.currentMonth.toString()
    }
    if (strDay==1) {
      Day = '0' + this.data.currentDay.toString()
    }
    else{
      Day = this.data.currentDay.toString()
    }
    yearMonthDay = strYear + '-' + Month + '-' + Day//年月日 格式：2018-09-06

    wx.request({
      url: app.globalData.url+'ice/getRecords', 
      data: {
        mainOpenid:mainOpenid,
        date:yearMonthDay
      },
      method:'POST',
      success(res){
        if (res.data.code==200) {
          if (res.data.data.length==0) {
            wx.showToast({
              title: '获取数据中',
              icon: 'loading',
              duration: 1500
            })
            setTimeout(function(){ 
              that.setData({
                textArr:res.data.data,
                show_no_data:true,
              })
            },1500);
          }else{
            wx.showToast({
              title: '获取数据中',
              icon: 'loading',
              duration: 1500
            })
            setTimeout(function(){ 
              that.setData({
                textArr:res.data.data,
                show_no_data:false
              })
            },1500);
            
          }
          wx.hideLoading()
        }
      },
      fail(err){
        console.log(err)
      }
    })
  }
})