//app.js
App({
  onLaunch: function (ops) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 未授权显示内容-请授权
    wx.setStorage({
      key: 'showSiper',
      data: false
    })
    // 登录
    wx.login({
      success: res => {
        // console.log(res)
        this.globalData.code = res.code
        // console.log('登录---'+res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 授权之后-再次进入-获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorage({
                key: 'showSiper',
                data: true
              })
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    url:'http://192.168.0.157:789/',
    userInfo: null,//用户信息
    code: null,//code码 换oppenId、session_key等
    appId:'wx5191fc5ad1a8a40c',
    appSecret:'a8c37594fd278a95c7fd0ca7ca9c2267',
    openId:'owxnYjhDm_kBQIm6t361KEk9s-Ko'
  }
})