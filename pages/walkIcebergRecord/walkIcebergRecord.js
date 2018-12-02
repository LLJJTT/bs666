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
    hideModal:true, //模态框的状态  true-隐藏  false-显示
    animationData:{},//底部动画
    canvasHidden:true, //隐藏画板
    imagePath:null,
    screenWidth:'',
    shareImgPath:'',
    zId:''
  },

  // 监听页面加载 
  onLoad(){
    var that = this
    that.getToday()
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            showSiper:false
          })
          console.log('没授权----No')
        }
        else{
          that.getIceData()
          that.setData({
            showSiper:true
          })
          // console.log('已经授权-----Yes')
        }
      }
    })
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
      that.setData({
        showSiper:true,
      })
      that.onLoad()
      wx.hideLoading()
      // setTimeout(function(){ 
        
      // }, 2000);
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
      // console.log(this.data.currentDay)
      if (this.data.currentDay==1) {//当前日期为1号
        var date = new Date();
        var d = new Date(date.getFullYear(), this.data.currentMonth-1, 0);
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
        var yesterday = this.data.currentDay - 1
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
      var date = new Date();
      var d = new Date(date.getFullYear(), this.data.currentMonth, 0);
      // console.log('当前是第'+this.data.currentDay+'天---当月最后一天'+d.getDate())
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
        var tomorrow = this.data.currentDay + 1
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
      duration:100000
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
        wx.showToast({
          title: '数据加载失败',
          icon: 'none',
          duration: 5000
        })
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
  // 长按显示遮罩层
  showModal: function () {
    var that=this
    that.setData({
      zId:that.data.textArr[that.data.activeCurrent].id,//走冰山id
      hideModal:false
    })
    console.log('走冰山id---'+this.data.zId)
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation 
    setTimeout(function(){
      that.fadeIn();//调用显示动画
    },200)   
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that=this; 
    var animation = wx.createAnimation({
      duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function(){
      that.setData({
        hideModal:true
      })      
    },720)//先执行下滑动画，再隐藏模块
    
  },

  //动画集
  fadeIn:function(){
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })    
  },
  fadeDown:function(){
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),  
    })
  },
  // 点击保存图片
  saveImg(){
    var that = this
    // wx.request({
    //   url:app.globalData.url+'ice/getRecords',
    //   method:'POST',
    //   data: {
    //     zid:that.data.zId
    //   },
    //   header: {
    //     'content-type': 'json'
    //   },
    //   success(res) {
    //     console.log(res)
    //   },
    //   error(err){
    //     console.log(err)
    //   }
    // }) 
    // 在清空一次虚拟路径
    that.setData({
      shareImgPath:''
    })
    that.hideModal()
    that.setData({
      hideModal:false
    })
    that.saveImageToPhotosAlbum() 
  },
  
  // 生成图片
  saveImageToPhotosAlbum(){
    var that = this;
    console.log('临时路径-'+that.data.shareImgPath)
    wx.showLoading({
        title: '保存中...',
    })
    //获取用户图片存储授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {//这里是用户同意授权后的回调
              //画板路径保存成功后，调用方法吧图片保存到用户相册
                that.saveImageToPhone()
            },
            fail() {//这里是用户拒绝授权后的回调
              wx.showModal({
                title: '提示',
                content: '拒绝了授权',
                showCancel: true
              })
            }
          })
        }else{//用户已经授权过了
          that.saveImageToPhone();
        }
      }
    })
  },
  // 判断是否成功保存到本地
  saveImageToPhone(){
    var that = this
    console.log('临时路径-'+that.data.shareImgPath)
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImgPath,
      //保存成功失败之后，都要隐藏画板，否则影响界面显示。
      success: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '已经保存到本地',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          canvasHidden: true
        })
      },
      fail: (err) => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          canvasHidden: true
        })
      }
    })
  }
})