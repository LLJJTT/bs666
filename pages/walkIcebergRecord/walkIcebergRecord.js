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
    showSiper:false,
    show_no_data:false,
    iceId:'',
  },

  // 监听页面加载 
  onLoad(){
    this.getToday()
    console.log('展示swier---'+wx.getStorageSync('showSiper'))
    if (wx.getStorageSync('showSiper')==true) {//如果缓存 -存在
      this.setData({
        showSiper:true
      })

      this.getIceData()
    }
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

  // 获取冰山记录信息
  getIceData(){
    var that = this
    that.setData({
      textArr:[],
      show_no_data:false,
      current:0,
      activeCurrent:0
    })
    wx.showLoading({
      title:'获取数据中',
      mask:true,
      duration:10000
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
        // console.log(res.data.code)
        // console.log(res.data.data.length)
        if (res.data.code==200) {
          that.setData({
            textArr:res.data.data,
          })
          // 对期待 他人和自己换行
          var arr1 = []
          that.data.textArr.map((item,index,arr) =>{
            var strOther ="对他人："
            var mineWord = item.expect.split(strOther)[0];//对自己：text
            var otherWord = strOther+item.expect.split(strOther)[1];//对他人：text
            var showWord = mineWord + '\n' + otherWord
            item.expect = showWord
            arr1 = arr
          })
          // console.log(arr1)
          that.setData({
              textArr:arr1,
            })
          if (res.data.data.length==0) {
            setTimeout(function(){
              that.setData({
                show_no_data:true
              }) 
              wx.hideLoading()
            },800)
          }else{
            setTimeout(function(){ 
              that.setData({
                show_no_data:false
              })
              wx.hideLoading()
            },800);
          }
        }
      },
      fail(err){
        console.log(err)
      }
    })
  },

  // 跳转

  // 新建新纪录
  goMakeRecord(){
    const date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var nowYMD = year+'-'+month+'-'+day
    var currentYMD = this.data.currentYear+'-'+this.data.currentMonth+'-'+this.data.currentDay
    if (nowYMD!=currentYMD) {
      wx.showToast({
        title: '只能创建今天的记录',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      wx.navigateTo({
        url: '../makeRecord/makeRecord'
      })
    }
  },

  // 修改记录
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
  
  // 去日历页
  goReview(){
    wx.navigateTo({
      url: '../review/review'
    })
  },
})