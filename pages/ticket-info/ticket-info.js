var util = require('../../utils/util')
Page({
  data:{
    activeNum:3,
    showScrollTop:false,
    ticketIndex:1,
    errorMsg:'',
    showError:false,
    ruleShow:false,
    scale:14,
    latitude: 22.573324,
    longitude: 113.944670,
    markers: [
      {
        latitude: 22.573324,
        longitude: 113.944670,
        iconPath: '../../assets/banner/location.png'
      }
    ],
    productList:[],
	  yhProductList:[],
    showDialog:false,
    textButton: [{text: '确定'}],
    itemRule:[],
	  poi: null,
    stockList: null,
    showLoading: false,
    loadingText: '数据加载中...'
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  onLoad:function(option){
    let encryptId = decodeURIComponent(option.encryptId)
    let type = option.type
    let that = this
    that.setData({
      resourceId:decodeURIComponent(encryptId),
      showLoading: true
    })
    that.getProductList(encryptId,type)
  },
  onShareAppMessage: function() {
    return {
      title: '瘦西湖', //转发页面的标题
      path: '/pages/ticket-info/ticket-info?encryptId='+this.data.resourceId  //转发页面的路径以及携带的参数
    }
    //        https://mp.12301cn.cn/pages/ticket-info/ticket-info?encryptId=MTE5
  },
  onShow:function(){
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if(currentPage.options.code){
      this.setData({
        iscode:currentPage.options.code
      })
      getApp().globalData.code = currentPage.options.code
    } else {
      getApp().globalData.code = false
    }
  },
  toUser:function(){
    wx.navigateTo({
      url:"/pages/orderCode/order"
    })
  },
  getProductList:function(encryptId,type){
    let baseUrl = util.baseUrl
    let that = this
    wx.request({
      url:baseUrl+'/data/findProducts',
      method:'POST',
	  data: {
		 "iscenicid": encryptId,
		 "startDate": util.formatTime(new Date(new Date().setDate(new Date().getDate()+1)), 0) //查询明天的票
	  },
      success:function(res){
		  console.log(res, 'res')
        if(res.data.code==='200'){
		      let _arr = wx.getStorageSync('pois').filter(item=>item.id == encryptId)
          let _latitudeLongitude = _arr[0].latitude_longitude.split(',')
          that.setData({
			      poi: _arr[0],
			      stockList: res.data.data.stockList,
            productList: that.changeMinPrice(res.data.data.products),
			      yhProductList: that.changeMinPrice(res.data.data.yhProducts),
            latitude: _latitudeLongitude[1],
            longitude: _latitudeLongitude[0],
            markers: [
              {
                latitude: _latitudeLongitude[1],
                longitude: _latitudeLongitude[0],
                iconPath: '../../assets/banner/location.png'
              }
            ],
            showLoading: false
          })
        }
      },
      fail:function(res){
        console.log(res)
        that.setData({
          errorMsg:'请求数据异常',
          showError:true
        })
      }
    })
  },
  // changeMinPrice: function(arr) {
	//   let _productList = []
	//   arr.forEach(item => {
	// 	  let _prices = []
	// 	  item.priceList.forEach(price => _prices.push(price.todayPrice))
	// 	  let _arr = _prices.sort((a,b)=>a-b)
  //     item.price = _arr[0]
	// 	  _productList.push(item)
	//   })
	//   return _productList
  // },
  changeMinPrice: function(arr) {
	  let _productList = []
	  arr.forEach(item => {
      item.priceList.sort((a, b) => a.todayPrice-b.todayPrice)
		  _productList.push(item)
	  })
	  return _productList
  },
  onPageScroll: function (e) {
    let scrollTop = e.scrollTop
    if(scrollTop>500){
      this.setData({
        showScrollTop:true
      })
    } else {
      this.setData({
        showScrollTop:false
      })
    }
  },
  moreItem:function(){
    let that = this
    if(this.data.activeNum>that.data.productList.length){
      this.setData({
        errorMsg:'暂无更多',
        showError:true,
      })
    } else {
      this.setData({
        activeNum:that.data.productList.length
      })
    }
    
  },
  lessItem:function(){
    let that = this
    this.setData({
      activeNum:3
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  toScrollTop:function(){
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  toBookProduct:function(e){
	  wx.setStorageSync('product', e.currentTarget.dataset.obj)
	  wx.setStorageSync('stockList', this.data.stockList)
	  wx.navigateTo({
		url:'/pages/bookproduct/bookproduct'
	  })
  },
  seeRule:function(e){
    let obj = e.currentTarget.dataset.obj
	console.log(obj, 'obj-seeRule')
	this.setData({
	  ruleShow:true,
	  itemRule:obj.memo
	})
  },
  tapDialogButton:function(e){
    this.setData({
      ruleShow:false,
      itemRule:[]
    })
  }
})
