var util = require('../../utils/util.js')
var timer=null
Page({
  data:{
    plain:false,
    time:5,
    plain:true
  },
  onLoad:function(option){
    let _orderId = option.orderId
    this.changeOrderStatus(_orderId)
    let that = this
    timer = setInterval(()=>{
      if(that.data.time==0){
        clearInterval(timer)
        let code = getApp().globalData.code
        if(code){
          wx.navigateTo({
            url:'/pages/orderCode/order'
          })
        } else {
          wx.switchTab({
            url:'/pages/order/order'
          })
        }
      } else {
        that.setData({
          time:that.data.time-1
        })
      }
    },1000)
  },
  toOrder:function(){
    clearInterval(timer)
    let code = getApp().globalData.code
    if(code){
      wx.navigateTo({
        url:'/pages/orderCode/order'
      })
    } else {
      wx.switchTab({
        url:'/pages/order/order'
      })
    }
    
  },
  changeOrderStatus(id) { ///order/queryOrderStatus
    let that = this
    let baseUrl = util.baseUrl
    let openid = ""
    wx.getStorage({ //提交订单的时候检验是否登录
      key:'openid',
      success:function(res){
        openid = res.data
        wx.request({
          url:baseUrl+'/order/queryOrderStatus',
          data: {orderId: id, openid: openid},
          method:'POST',
          timeout:300000,
          success:function(res){
            console.log(res, 'res-detail')
          }})
        that.setData({
          showPayLoading:true
        })
        // that.getToken(openid)
      },
      fail:function(res){
        console.log(res)
        that.setData({
          showPayLoading:false
        })
        wx.navigateTo({
          url:"/pages/loginPage/loginPage"
        })
      }
    })
  },
  toProduct:function(){
    clearInterval(timer)
    wx.navigateBack({
      delta: 2
    })
  }
})
