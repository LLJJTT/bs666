var app = getApp();
Page({
  data: {
    hideModal:true, //模态框的状态  true-隐藏  false-显示
    animationData:{},//底部动画
    canvasHidden:true, //隐藏画板
    shareImgPath:''
  },

  // 监听页面加载 
  onLoad(){
    
  },
  // 自定义函数
  // 显示遮罩层
  showModal: function () {
    var that=this;
    that.setData({
      hideModal:false
    })
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
    console.log(that.data.shareImgPath)
    that.setData({
      shareImgPath:''
    })
    console.log(that.data.shareImgPath)
    that.hideModal()
    that.setData({
      hideModal:false
    })
    that.saveImageToPhotosAlbum() 
  },
  
  // 生成图片
  saveImageToPhotosAlbum(){
    var that = this
    console.log(that.data.shareImgPath)
    wx.showLoading({
        title: '保存中...',
    })
    //获取用户设备信息，屏幕宽度
    wx.getSystemInfo({
      success: res => {
          that.setData({
              screenWidth: res.screenWidth
          })
          // console.log(that.data.screenWidth)
      }
    })
    
    //设置画板显示，才能开始绘图
    that.setData({
        canvasHidden: false
    })
    var unit = that.data.screenWidth / 375
    var bgPath = '../../img/all_bg.png'
    // that.getImgeInfo()
    var context = wx.createCanvasContext('mycanvas')
    //画背景
    context.drawImage(bgPath, 0, 0, unit * 375, unit * 600)
    context.draw(false, function () {
      // 把当前画布指定区域的内容导出生成指定大小的图片
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 750,
        height: unit * 462.5,
        destWidth: unit * 375,
        destHeight: unit * 462.5,
        canvasId: 'mycanvas',
        success: function (res) {
          // 图片的临时路径
          console.log(that.data.shareImgPath)
          that.setData({
            shareImgPath: res.tempFilePath
          })
          // 绘制成功之后获取用户图片存储授权
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
        }
      })
    });
  },
  // 
  saveImageToPhone(){
    var that = this
    console.log(that.data.shareImgPath)
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