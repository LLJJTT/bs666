

Page({
  data: {
    week:['日','一','二','三','四','五','六'],
    walk_days:'13',
    selected_date:'2018年9月',
    years: [],
    year: 2018,
    months: [],
    month: 10,
    maskFlagMax:true,//不显示遮罩
    pickerViewFlag:true,
    nowMonthArr:[],
    move:'0rpx;'
  },
  // 监听页面加载
  onLoad(e){
    this.getToday()
    this.getNowMonthDate()
    this.getFirstDayWeek()
  },
  // 监听页面-初次-渲染完成
  onReady(){

  },
  // 监听页面显示
  onShow(){

  },
  // 自定义函数
  // 左切换
  toLeft(){
    wx.showLoading({
      title:'切换中',
      mask:true
    })
    if (this.data.month==1) {
      this.data.month =13
      this.setData({
        year:this.data.year - 1
      })
    }
    this.setData({
      month:this.data.month - 1
    })
    this.changeMargin()
    wx.hideLoading()
  },
  // 右切换
  toRight(){
    wx.showLoading({
      title:'切换中',
      mask:true
    })
    if (this.data.month==12) {
      this.data.month =0
      this.setData({
        year:this.data.year + 1
      })
    }
    this.setData({
      month:this.data.month + 1
    })
    this.changeMargin()
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
    this.setData({
      years:years,
      months:months,
      year:year,
      month:month
    })
  },
  // 获取本月的天数
  getNowMonthDate(){
    var date = new Date();
    // var year = date.getFullYear();
    // var month = date.getMonth()+1;
    var d = new Date(this.data.year, this.data.month, 0);
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
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
    })
    // console.log(this.data.year+'-'+this.data.month)
  },
  // 动态改变Margin
  changeMargin(){
    this.getNowMonthDate()
    var d = new Date();
    d.setYear(this.data.year);
    d.setMonth(this.data.month-1);
    d.setDate(1);//月的第一天
    // 展示每月第一天margin-left 
    // 距离 = 星期数 * 宽度(90)
    var weekday_ml = d.getDay()*90+'rpx'
    this.setData({
      move:weekday_ml,
    })
  },
  // 确定
  sureGetDate(){
    wx.showLoading({
      title:'切换中',
      mask:true
    })
    this.changeMargin()
    this.setData({
      maskFlagMax:true,
      pickerViewFlag:true,
    })
    wx.hideLoading()
  },
  // 取消
  cancleGetDate(){
    this.getToday()
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
  }
})