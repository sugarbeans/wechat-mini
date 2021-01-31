var util = require('../../utils/util')
Page({
  data:{
    showError:false,
    errorMsg:'',
    error:'error'
  },
  //用户授权
  bindGetUserInfo: function(res){
    let that = this
    wx.login({
      success (res) {
        if (res.code) {
          that.toLogin(res.code)
        } else {
          console.log('登录失败！')
          that.setData({
            showError:true,
            errorMsg:'登录失败！请重试！'
          })
        }
      }
    })
  },
  toLogin:function(e){
    let baseUrl = util.baseUrl
    let that = this
    wx.request({
      url: baseUrl+'/appletLogin/wxlogin',
      method:'POST',
      data: {
        code: e
      },
      timeout:300000,
      success:function(res){
        if(res.data.success){
          let openid = res.data.data.user.openId
          let id = res.data.data.user.id
          wx.getUserInfo({
            success: function(res1){
              let userImg = res1.userInfo.avatarUrl
              let nickName = res1.userInfo.nickName
              that.setData({
                showError:true,
                error:'success',
                errorMsg:'登录成功'
              })
              wx.setStorage({
                key: "nickName",
                data: nickName
              })
              wx.setStorage({
                key: "userImg",
                data: userImg
              })
              wx.setStorage({
                key: "openid",
                data: openid
              })
              wx.nextTick(()=>{
                wx.navigateBack({
                  delta:1,
                })
              })
            },
            fail:function(res){
              that.setData({
                showError:true,
                error:'error',
                errorMsg:'您取消了授权'
              })
            }
          })
        } else {
          that.setData({
            showError:true,
            errorMsg:'登录失败！请重试！'
          })
        }
      },
      fail:function(res){
        console.log('登录失败！')
        that.setData({
          showError:true,
          errorMsg:'登录失败！请重试！'
        })
      }
    })
  },
  
})
