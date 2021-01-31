var util = require('../../utils/util') //时间格式化
Page({
  data:{
    showItemDialog:false,
    textButton: [{text: '确定'}],
    url:'',
    orderInfoView:[],
    showPayLoading:false,
    loadingText:'订单详情查询中 • • • ',
    vipObj: ""
  },
  onLoad:function(option){
    let id = option.id
    if(id === 'vip') {
      
    } else {
      this.changeOrderStatus(id)
      this.getOrderdetail(id)
    }
  },
  getOrderdetail:function(id){
    let baseUrl = util.baseUrl
    let that = this
    that.setData({
      showPayLoading:true,
      loadingText: "加载中..."
    })
    wx.request({
      url:baseUrl+'/order/queryOrderDetail',
      data:{
        orderId:id
      },
      method:'POST',
      timeout:300000,
      success:function(res){
        if(res.data.success){
          that.setData({
            orderInfoView: res.data.data.order,
            showPayLoading:false
          })
        } else {
          that.setData({
            showPayLoading:false
          })
        }
      },
      fail:function(res){
        that.setData({
          showPayLoading:false
        })
        console.log(res)
      }
    })
  },
  changeOrderStatus(id) { ///order/queryOrderStatus
    let that = this
    let openid = ""
    let baseUrl = util.baseUrl
    wx.getStorage({ //提交订单的时候检验是否登录
      key:'openid',
      success:function(res){
        openid = res.data
        that.setData({
          showPayLoading:true
        })
        wx.request({
          url:baseUrl+'/order/queryOrderStatus',
          data: {orderId: id, openid: openid},
          method:'POST',
          timeout:300000,
          success:function(res){
            console.log(res, 'res-detail')
        }})
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
  showQrcode:function(e){
    let url = e.currentTarget.dataset.voucherpic
    console.log(url)
    this.setData({
      url:url,
      showItemDialog:true
    })
  },
  tapItemDialogButton:function(){
    this.setData({
      showItemDialog:false
    })
  }
})
