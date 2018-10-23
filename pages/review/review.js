var app = getApp();
Page({
  data: {
    week:['日','一','二','三','四','五','六'],
    walk_days:'13',
    years: [],
    year: '',
    months: [],
    month: '',
    change_year:'',
    change_month:'',
    today:'1',
    maskFlagMax:true,//不显示遮罩
    pickerViewFlag:true,
    nowMonthArr:[],
    move:'0rpx;',
    color_status:'#64bc8e',
    backData:[],//后台返回的日历
    myselfData:[],//更改格式-循环
    ifWalkWord:null,//今日是否走冰山状态
    dayStatus:0,

  },
  // 监听页面加载
  onLoad(e){
    this.getToday()
    this.getNowMonthDate()
    this.getFirstDayWeek()
    this.getCalendar()
  },
  // 自定义函数
// Api-获取日历 
  getCalendar(){
    wx.showLoading({
      title:'获取中',
      mask:true
    })
    var that  = this
    var mainOpenid = app.globalData.openId
    var strLength = this.data.month.toString().length
    var yearMonth = ''
    if (strLength==1) {//获取月份长度 后端需要格式e.g:201806、201811
      yearMonth = this.data.year.toString() + '0' + this.data.month.toString()
    }else{
      yearMonth = this.data.year.toString()+this.data.month.toString()
    }
    wx.request({
      url: app.globalData.url+'ice/getCalendar', 
      data: {
        mainOpenid: mainOpenid, 
        yearMonth: yearMonth
      },
      method:'POST',
      success(res){
        if (res.data.code==200) {
          var calendar = res.data.data.calendar
          var durationDays = res.data.data.durationDays
          that.setData({
            backData:calendar,
            walk_days:durationDays
          }) 
          that.changeBackData()
          if (res.data.data.todayStatus==0) {// 判断今天是否走冰山
            that.setData({
              ifWalkWord:'今日还未走冰山'
            })
           
          }else{
            that.setData({
              ifWalkWord:'今日已走冰山'
            })
          }
          wx.hideLoading()
        }
      },
      fail(err){
        console.log(err)
      }
    })
  },
  // 左切换
  toLeft(){
    wx.showLoading({
      title:'切换中',
      mask:true
    })
    if (this.data.change_month==1) {
      this.data.change_month =13
      this.setData({
        change_year:this.data.change_year - 1
      })
    }
    this.setData({
      change_month:this.data.change_month - 1,
    })
    this.showNowStatus()
    this.changeMargin()
    this.getCalendar()
    // this.changeBackData()
    wx.hideLoading()
  },
  // 右切换
  toRight(){
    wx.showLoading({
      title:'切换中',
      mask:true
    })
    if (this.data.change_month==12) {
      this.data.change_month =0
      this.setData({
        change_year:this.data.change_year + 1
      })
    }
    this.setData({
      change_month:this.data.change_month + 1,
    })
    this.showNowStatus()
    this.changeMargin()
    this.getCalendar()
    // this.changeBackData()
    wx.hideLoading()
  },
  // 点击按钮-获取日期
  getDate(){
    wx.showLoading({
      title:'获取中',
      mask:true
    })
    this.setData({
      maskFlagMax:false,
      pickerViewFlag:false
    })
    wx.hideLoading()
  },
  // 规范日期
  getToday(){
    // 定义显示年月范围
    const date = new Date()
    const years = []
    const months = []
    for (let i = 2010; i <= date.getFullYear()+ 50; i++) {
      years.push(i)
    }
    for (let i = 1 ; i <= 12; i++) {
      months.push(i)
    }
    // 获取今天年月
    var month = date.getMonth() + 1
    var year = date.getFullYear()
    // 后台传过来的年月
    // var month = parseInt(this.data.dateArr[1].month)
    // var year = parseInt(this.data.dateArr[0].year)
    this.setData({
      change_year:year,
      change_month:month,
      years:years,
      months:months,
      year:year,
      month:month,
      today:date.getDate(),//获取今天日期
      dayStatus:date.getDate()//今天显示blue_point
    })
  },
  // 获取本月的天数
  getNowMonthDate(){
    var date = new Date();
    // var year = date.getFullYear();
    // var month = date.getMonth()+1;
    var d = new Date(this.data.change_year, this.data.change_month, 0);
    var now = []
    for(var i=0;i<d.getDate();i++){
      now.push(i)
    }
    this.setData({
      nowMonthArr:now
    })
  },
  // 初始化判断本月的1号是周几
  getFirstDayWeek(){
    var date = new Date()
    var month = date.getMonth() + 1
    var year = date.getFullYear()
    var d = new Date();
    d.setYear(year);
    d.setMonth(month-1);
    d.setDate(1);//月的第一天
    // 展示每月第一天margin-left 
    // 距离 = 星期数 * 宽度(90)
    var weekday_ml = d.getDay()*90+'rpx'
    this.setData({
      move:weekday_ml
    })

  },
  // 滚动选择日期时
  bindChange: function(e) {
    const val = e.detail.value
    this.setData({
      change_year: this.data.years[val[0]],
      change_month: this.data.months[val[1]],
    })
  },
  // 动态改变Margin
  changeMargin(){
    this.getNowMonthDate()
    var d = new Date();
    d.setYear(this.data.change_year);
    d.setMonth(this.data.change_month-1);
    d.setDate(1);//月的第一天
    // 展示每月第一天margin-left 
    // 距离 = 星期数 * 宽度(90)
    var weekday_ml = d.getDay()*90+'rpx'
    this.setData({
      year:this.data.change_year,
      month:this.data.change_month,
      move:weekday_ml,
    })
  },
  // 确定
  sureGetDate(){
    wx.showLoading({
      title:'切换中',
      mask:true
    })
    this.showNowStatus()
    this.changeMargin()
    this.getCalendar()
    this.changeBackData()
    this.setData({
      maskFlagMax:true,
      pickerViewFlag:true,
    })
    wx.hideLoading()
  },
  // 取消
  cancleGetDate(){
    this.setData({
      maskFlagMax:true,
      pickerViewFlag:true,
    })
  },
  // 点走冰山
  goWalkIce(){
    wx.navigateTo({
      url: '../makeRecord/makeRecord'
    })
  },
  // 更改后台数据为了展示不同状态
  changeBackData(){
    var myselfData = []
    var d = new Date(this.data.year, this.data.month, 0);
      // console.log(this.data.backData)
    if(this.data.backData!=null){
      for(var i=0;i<d.getDate();i++){
        myselfData.push({"status":'0'})
      }
      this.data.backData.map((item,index) =>{
        if (item.selfCognition>5) {
          myselfData[item.day-1].status = 1
        }
        else if (item.selfCognition<=5){
          myselfData[item.day-1].status = -1
        }
      })
      
    }
    else{
      var myselfData = []
      for(var i=0;i<d.getDate();i++){
        myselfData.push({"status":'0'})
      }
    }
    this.setData({
      myselfData:myselfData
    })
  },
  // 是否显示今天以及本月的笑脸、蓝点
  showNowStatus(){
    const date = new Date()
    var thisMonthDay = date.getDate()//今天是哪天
    var month = date.getMonth() + 1//今天所在月份
    if(this.data.change_month!=month){
      this.setData({
        dayStatus:null
      })
    }
    else{
      this.setData({
        dayStatus:thisMonthDay
      })
    }
  }
})