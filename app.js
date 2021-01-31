//app.js
import './vendor/weapp-cookie/index'   //处理cookie问题
App({
  globalData:{
    id:'',
    searchScenic:{},
    code:false,
    vipCards: [{type: 'A', id: 1, name: '贵宾卡(A卡)', price: 258}, {type: 'B', id: 2, name: '贵宾卡(B卡)', price: 318}]
  },
  onLaunch(e) {
    wx.checkSession({
      success () {
        console.log('未过期')
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail () {
        console.log('过期')
        // session_key 已经失效，需要重新执行登录流程
        wx.navigateTo({
          url:"/pages/loginPage/loginPage"
        })
      }
    })
  },
})
