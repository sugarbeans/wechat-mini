var util = require('../../utils/util')
Page({
  data: {
    hotTicketList:[],
    hotHotelList:[],
    errorMsg:'',
    showError:false,
    textButton: [{text: '确定'}],
    detailShow: false
  },
  onLoad:function(){
    // this.homeDataInit()
    this.setData({
      detailShow: true
    })
  },
  onShow:function(){
    this.homeDataInit()
    // this.topScroll()
  },
  onShareAppMessage: function() {
    return {
      title: '瘦西湖', //转发页面的标题
      path: '/pages/index/index'  //转发页面的路径以及携带的参数
    }
  },
  homeDataInit:function(){
    let baseUrl = util.baseUrl
    let that = this
    wx.request({ //获取首页数据
      url: baseUrl +'/data/findPoi',
      method:'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      timeout:300000,
      success:function(res){
        if(res.data.code === '200'){
          let result = res.data.data.pois
          result.map((item)=>{ //imageList转数组
            let imgUrl = item.pictureUrls
            item.imageList = imgUrl
          })
          that.setData({
            hotTicketList:result
          })
		  wx.setStorageSync('pois', result)
        }
      },
      fail:function(res){
        that.setData({
          errorMsg:'请求数据异常',
          showError:true
        })
      }
    })
  },
  //事件处理函数
  toSearch:function(){
    // wx.navigateTo({
    //   url:'/pages/searchpage/searchpage'
    // })

    wx.switchTab({
      url:'/pages/ticket/ticket'
    })
  },
  toBase:function(e){ 
    let _id = e.currentTarget.dataset.id
    switch (_id) {
      case '1':
        wx.switchTab({
          url:'/pages/ticket/ticket'
        })
        break;
      case '2':
        wx.navigateTo({
          url:'/pages/vipcard/vipcard'
        })
        break;
      // case '3':
      //   wx.navigateTo({
      //     url:'/pages/changguan/changguan'
      //   })
      //   break;
      // case '4':
      //   wx.navigateTo({
      //     url:'/pages/xianlu/xianlu'
      //   })
      //   break;
      // case '5':
      //   wx.navigateTo({
      //     url:'/pages/techan/techan'
      //   })
      //   break;
    
      default:
        wx.showToast({
          title: '敬请期待',
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },
  toTicket:function(e){
    let encryptId = encodeURIComponent(e.currentTarget.dataset.id)
    wx.navigateTo({
      url:'/pages/ticket-info/ticket-info?encryptId='+encryptId,
    })
  },
  bindErrorImg:function(e){
    let errorImgIndex= e.currentTarget.dataset.errorimg
    this.data.hotTicketList.map((item,index)=>{
      if(errorImgIndex==index){
        item.imageList[errorImgIndex] = '../../assets/banner/error.jpg'
      }
    })
    this.setData({
      hotTicketList:this.data.hotTicketList
    }); 
  },
  tapDialogButton:function(e){
    this.setData({
      detailShow:false
    })
  }
})
