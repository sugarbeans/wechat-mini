const app = getApp()
Page({
  data: {
    isLogin:false,
    nickName:'',
    userImg:'../../assets/banner/icon.png'
  },
  
  //事件处理函数
  
  onLoad: function(option) {
    let openid = wx.getStorageSync('openid')
    if(openid==''){ //判断是否授权登录
      wx.navigateTo({
        url:"/pages/loginPage/loginPage"
      })
      return
    }
  },
  onShow:function(options){
    let that = this
    
    let userImg = wx.getStorageSync('userImg')
    let nickName = wx.getStorageSync('nickName')
    if(userImg!='' && nickName!=''){
      this.setData({
        userImg:userImg,
        nickName:nickName,
        isLogin:true
      })
    }
  },
  toGetLogin:function(){
    wx.navigateTo({
      url:"/pages/loginPage/loginPage"
    })
  },
  toOrder:function(e){
    let _id = e.currentTarget.dataset.id
    getApp().globalData.id = _id
    wx.switchTab({
      url:"/pages/order/order"
    })
  },
  toMyfavourite:function(){
    // wx.navigateTo({
    //   url:"/pages/myfavourite/myfavourite"
    // })
    wx.showToast({
      title: '敬请期待',
      icon: 'none',
      duration: 2000
    })
  },
  toContactPeople:function(){
    // wx.navigateTo({
    //   url:"/pages/commonvistor/commonvistor"
    // })
    wx.showToast({
      title: '敬请期待',
      icon: 'none',
      duration: 2000
    })
  },
  toContact:function(){
    wx.makePhoneCall({
      phoneNumber:'（86）-（514）-87357803'
    })
  },
})
