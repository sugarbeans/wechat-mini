var util = require('../../utils/util')
Page({
  data: {
    
  },
  onLoad:function(option) {
    
  },
  onShow:function(e){
    
  },
  toTicket:function(e){
    let type = encodeURIComponent(e.currentTarget.dataset.type)
    console.log(type, 'type')
    wx.navigateTo({
      url:'/pages/vipinfo/vipinfo?type='+type
    })
  },
  onShareAppMessage: function() {
    return {
      title: '瘦西湖', //转发页面的标题
      path: '/pages/ticket/ticket'  //转发页面的路径以及携带的参数
    }
  }
});
