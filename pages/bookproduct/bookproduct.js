var util = require('../../utils/util.js')
let _year = new Date().getFullYear()
let _month = new Date().getMonth()+1
let _flagNum = new Date(_year,_month-1,1).getDay()
Page({
  data:{
    showPriceFlag:true,
    dateBoxNum:3,
	  activeTime: 0,
    showCalendar:false,
    showMask:false,
    vistorList:[], //游客列表
    commonVistorList:[],  //常用联系人列表
    moreCommonVistor:false,
    commonVistorActive: '',
    contactName:'',
    contactPhone:'',
    credentialsTypeEnum: '01',
    typeName:'证件号',
    contactCode:'',
    encryptId:'',
	  total: 0,
    errorMsg:'',
    showError:false,
    showDialog:false,
    textButton:[{text: '取消'}],
    codeTypeFlag:false,
    error:'error',
    showPayLoading:false,
    moreVistor:false,
    dateActive:new Date().getDate()+_flagNum-1,
    delay:5000,
    loadingText:'发起支付中· · ·',
    priceList:[],
    dateList: [],
    visitorType:[
      {
        id:'01',
        value:'身份证'
      },
      {
        id:'02',
        value:'导游证'
      },
      {
        id:'04',
        value:'军官证'
      },
      {
        id:'05',
        value:'港澳通行证'
      }
    ],
    detailShow: false,
    textButton: [{text: '确定并支付'}],
    newTime: ''
  },
  onLoad:function(option){
	  let that = this
    wx.getSystemInfo({ 
      success: function (res) {
        that.setData({ 
          clientHeight: res.windowHeight
        }); 
      } 
    }) 
    this.getPrice()
    this.getCommonVistor()
  },
  onShow:function(option){

  },
  closeCalendaer:function(){
    this.setData({
      showCalendar:false
    })
  },
  chooseType:function(e){
    this.setData({
      codeTypeFlag:!this.data.codeTypeFlag
    })
  },
  getPrice:function(encryptId){
    let that = this
    let baseUrl=util.baseUrl
    let dateList = []
    for(let i=0; i<7; i++) {
      let _str = util.formatTime(new Date(new Date().setDate(new Date().getDate()+i)), 3)
      dateList.push({date: _str})
    }
	  dateList.map(item=>{
	    let _dateArr = item.date.split('-')
	    item.month = _dateArr[0]
	    item.day = _dateArr[1]
	  })
	  let productInfo = wx.getStorageSync("product")
	  productInfo.priceList.map((item, index)=> {
      item.number = 0
      item.vistorList = []
      item.iscenicid = productInfo.iscenicid
      item.itickettypeid = productInfo.ticketId
      item.vistorActive = null
	  })
    that.setData({
      dateList:dateList,
      priceList: productInfo.priceList,
      productInfo:productInfo,
	    stockList: wx.getStorageSync("stockList"),
      newDate:dateList[1].date,
      showPayLoading:false,
      loadingText:'发起支付中· · ·'
	  
    })
  },
  showMoreVistor:function(){
    // this.setData({
    //   moreVistor:!this.data.moreVistor
    // })
    this.setData({
      moreCommonVistor: !this.data.moreCommonVistor
    })
  },
  choseDateOut:function(e){
    let _obj = e.currentTarget.dataset.obj
    this.setData({
      showCalendar:false,
      newDate:_obj.date,
      showPayLoading: true
    })
    this.getTicketList()
  },
  getTicketList:function(){
    let baseUrl = util.baseUrl
    let that = this
    wx.request({
      url:baseUrl+'/data/findTicketList',
      method:'POST',
	    data: {
        iscenicid: that.data.productInfo.iscenicid,
        isyh: 0,
        pageSize: 0,
        priceId: 0,
        productId: that.data.productInfo.ticketId,
        startDate: `${new Date().getFullYear()}-${this.data.newDate}`
      },
      success:function(res){
		  console.log(res, 'res')
        if(res.data.code==='200'){
          // that.setData({
			    //   poi: _arr[0],
			    //   stockList: res.data.data.stockList,
          //   productList: _productListYH.concat(that.changeMinPrice(res.data.data.products)),
			    //   yhProductList: that.changeMinPrice(res.data.data.yhProducts),
          //   latitude: _latitudeLongitude[1],
          //   longitude: _latitudeLongitude[0],
          //   markers: [
          //     {
          //       latitude: _latitudeLongitude[1],
          //       longitude: _latitudeLongitude[0],
          //       iconPath: '../../assets/banner/location.png'
          //     }
          //   ],
          //   showPayLoading: false
          // })
        }
        that.setData({
          showPayLoading: false
        })
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
  chooseTimeOut: function(e) {
	  let _stockObj = e.currentTarget.dataset.stockObj
	  this.setData({
      activeTime:_stockObj.seq,
      newTime: `${_stockObj.beginTime}:${_stockObj.beginMinute} ~ ${_stockObj.endTime} : ${_stockObj.endMinute}`
	  })
  },
  showCalendarDialog:function(){
    let showCalendar = this.data.showCalendar
    this.setData({
      showCalendar:!showCalendar,
      codeTypeFlag:false
    })
  },
  minusTicketIndex:function(e){
    let index = e.currentTarget.dataset.index
    let _number = this.data.priceList[`${index}`].number
    let _key = `priceList[${index}].number`
    if(_number==0){
      this.setData({
        errorMsg:'数量不能为负值',
        showError:true
      })
    }else{
      this.setData({
        [_key]: _number-1
      })
      this.changeTotal()
    }
  },
  addTicketIndex:function(e){
	  let index = e.currentTarget.dataset.index 
    let _number = this.data.priceList[`${index}`].number
    let _key = `priceList[${index}].number`
    this.setData({
      [_key] :_number+1
    })
    this.changeTotal()
  },
  getNumber:function(e){
    let index = e.currentTarget.dataset.index
    let _key = `priceList[${index}].number`
    this.setData({
      [_key]: e.detail.value
    })
    this.changeTotal()
  },
  changeTotal() {
    let _total = 0
    this.data.priceList.forEach(item => {
      item.number>0 && (_total += item.number*item.todayPrice)
    });
    this.setData({
      total: _total>0 ? _total.toFixed(2): total 
    })
  },
  showMaskDialog:function(e){
    // this.setData({
    //   priceObj: e.currentTarget.dataset.priceObj,
    //   priceIndex: e.currentTarget.dataset.priceIndex,
    //   showMask:true
    // })
    let _obj = e.currentTarget.dataset.priceObj
    let _priceIndex = e.currentTarget.dataset.priceIndex
    let that = this
    if(_obj.number>_obj.vistorList.length){
      wx.navigateTo({
        url:'/pages/addvistorpage/addvistorpage',
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('visitorType', {data: _obj, list: that.data.priceList, priceIndex: _priceIndex})
        }
      })
    } else {
      this.setData({
        errorMsg: '出行人数不能大于预定数量',
        showError:true
      })
    }
  },
  getName:function(e){
    this.setData({
      contactName:e.detail.value.replace(/[^\w\u4E00-\u9FA5]/g,'')
    })
  },
  getPhone:function(e){
    this.setData({
      contactPhone:e.detail.value
    })
  },
  getCode:function(e){
    this.setData({
      contactCode:e.detail.value
    })
  },
  closeMaskDialog:function(){
    this.setData({
      showMask:false
    })
  },
  toAddVistor:function(e){
    this.setData({
      errorMsg:e.detail,
      showError:true
    })
  },

  payOrder:function(){ 
    let that = this
    //判断页面信息是否输入完整
    if(that.data.stockList.length>0 && !that.data.activeTime) {
      that.setData({
        errorMsg:'请选择分时时段！',
        showError:true
      })
      return
    }
    if(that.data.contactPhone.length<11){
      that.setData({
        errorMsg:'手机号输入有误',
        showError:true
      })
      return
    }
    if(that.data.productInfo.contactType.length>0){
      if(that.data.contactCode.length<18){
        that.setData({
          errorMsg:'证件号号输入有误',
          showError:true
        })
        return
      }
    }
    wx.getStorage({ //提交订单的时候检验是否登录
      key:'openid',
      success:function(res){
        let openid = res.data
        that.setData({
          showPayLoading:true,
          loadingText: '订单确认中...'
        })
        // that.getToken(openid)
      },
      fail:function(res){
        that.setData({
          showPayLoading:false
        })
        wx.navigateTo({
          url:"/pages/loginPage/loginPage"
        })
      }
    })
  },
  payOrderMethod:function(){ //提交订单
    that.setData({
      showPayLoading:true,
      loadingText: '订单保存中...'
    })
    let baseUrl = util.baseUrl
    let that = this
    let tourist = {
      idCard: that.data.contactCode,
      name: that.data.contactName,
      phone: that.data.contactPhone,
      cardType: that.data.credentialsTypeEnum
    }
    let realNames = []
    let ticketInfos = []
    that.data.priceList.forEach(item => {
      if(item.number > 0) {
        let _ticket = {
          buyNumb: item.number,
          crowdKindId: item.icrowdkindid,
          ibusinessid: 0,
          iscenicid: item.iscenicid,
          note1: "",
          priceId: item.icrowdkindpriceid,
          subStockId: '',
          subStockNum: '',
          ticketName: item.szcrowdkindname,
          ticketTypeId: item.itickettypeid,
          travelDate: `${new Date().getFullYear()}-${that.data.newDate}`
        }
        ticketInfos.push(_ticket)
        let _obj = {
          cardType: that.data.credentialsTypeEnum,
          icrowdkindid: item.icrowdkindid,
          idCard: that.data.contactCode,
          iscenicid: item.iscenicid,
          itickettypeid: item.itickettypeid,
          mbnumber: "",
          mobile: that.data.contactPhone,
          name: that.data.contactName,
          priceId: item.icrowdkindpriceid
        }
        realNames.push(_obj)
      } 
    })
    
    let obj = {
      realNames: realNames,
      subStockId: that.data.activeTime,
      ticketInfos: ticketInfos,
      tourist: tourist,
      iticketstationid: that.data.activeTime,
      money: that.data.total
    }
    console.log(obj, 'create-order')
    wx.request({
      url:baseUrl+'/order/createOrder',
      data:obj,
      method:'POST',
      timeout:300000,
      success:function(res){
        if(res.data.success){
          let _obj = res.data.data.payOrder
          that.setData({
            showPayLoading:true,
            loadingText: '唤起支付中...'
          })
          that.transferWechatPay(_obj.orderId, _obj.openid, _obj.payMoney)
        } else {
          that.setData({
            errorMsg:res.data.description.split(':')[1],
            showError:true,
            showPayLoading:false
          })
        }
      },
      fail:function(res){
        console.log(res)
        that.setData({
          showPayLoading:false
        })
      }
    })
  },
  transferWechatPay:function(orderCode,openid,payMoney){ //调用微信支付
    let baseUrl = util.baseUrl
    let that = this
    wx.request({
      url:baseUrl+'/order/pay',
      data:{
        openid:openid,
        orderId:orderCode,
        payMoney:payMoney
      },
      // header:{
      //   'APPLET_TOKEN':token
      // },
      method:'POST',
      timeout:300000,
      success:function(res){
        that.setData({
          showPayLoading:true,
          loadingText: '支付中...'
        })
        if(res.data.success){
          that.setData({
            showPayLoading:false
          })
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success () { 
              that.setData({
                errorMsg:'支付成功',
                error:'success',
                showError:true,
              })
              wx.setStorage({
                key:'vistorList',
                value:[]
              })
              wx.navigateTo({
                url:"/pages/payorderpage/payorderpage?orderId="+orderCode
              })
            },
            fail () { 
              that.setData({
                errorMsg:'支付失败',
                error:'error',
                showError:true,
              })
              wx.navigateBack({
                delta:1,
                
              })
            }
          })
        } else {
          that.setData({
            errorMsg:res.data.description,
            error:'error',
            showError:true,
            showPayLoading:false
          })
        }
      },
      fail:function(res){
        console.log(res)
        that.setData({
          errorMsg:'支付失败',
          error:'error',
          showError:true,
          showPayLoading:false
        })
      }
    })
  },
  zeroPay:function(obj,token){
    let baseUrl = util.baseUrl
    let that = this
    wx.request({
      url:baseUrl+'/order/createPayment?applet_token='+token,
      data:obj,
      method:'POST',
      timeout:300000,
      success:function(res){
        if(res.data.success){
          that.setData({
            showPayLoading:false
          })
          that.setData({
            errorMsg:'支付成功',
            error:'success',
            showError:true,
          })
          wx.setStorage({
            key:'vistorList',
            value:[]
          })
          wx.navigateTo({
            url:"/pages/payorderpage/payorderpage"
          })
        } else {
          that.setData({
            errorMsg:res.data.description,
            error:'error',
            showError:true,
            showPayLoading:false
          })
        }
      },
      fail:function(res){
        console.log(res)
        that.setData({
          errorMsg:'支付失败',
          error:'error',
          showError:true,
          showPayLoading:false
        })
      }
    })
  },
  changeVistor:function(e){
    let _id = e.currentTarget.dataset.id
    let _obj = e.currentTarget.dataset.obj
    let _index = e.currentTarget.dataset.index
    for(let i=0; i<this.data.priceList.length; i++) {
      this.setData({
        ['priceList['+i+'].vistorActive']:  null,
      })
    }
    this.setData({
      ['priceList['+_index+'].vistorActive']:_id,
      name: _obj.name,
      phone: _obj.phone,
      code: util.idCardEcode(_obj.code),
      moreVistor:false
    })
    that.setData({
      commonVistorActive: _id,
      contactCode: _obj.zjhm,
      contactName: _obj.username,
      contactPhone: _obj.mobile,
      credentialsTypeEnum: '01'
    })

  },
  longChange:function(e){  //长按弹出游客操作选项框
    let obj = e.currentTarget.dataset.obj
    obj.isChecked = false
    this.setData({
      showDialog:true,
      nowObj:obj
    })
  },
  tapDialogButton:function(){ //取消弹出框
    this.setData({
      showDialog:false
    })
  },
  deleteInfo:function(){
    this.data.vistorList.map((item,index)=>{
      if(item.code==this.data.nowObj.code){
        
        this.data.vistorList.splice(index,1)
      }
    })
    this.setData({
      vistorList:this.data.vistorList,
      showDialog:false
    })
    wx.setStorage({
      key:'vistorList',
      data:this.data.vistorList
    })
  },
  changeInfo:function(){
    let that = this
    wx.navigateTo({
      url:"/pages/addvistorpage/addvistorpage",
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('changeVistorInfo', { data: that.data.nowObj })
      }
    })
  },
  chooseTypeItem:function(e){
    let _id = e.currentTarget.dataset.id
    let _name = e.currentTarget.dataset.name
    this.setData({
      credentialsTypeEnum:_id,
      typeName:_name,
      codeTypeFlag:false
    })
  },
  chooseCommonVistor:function(e){
    let needVisitor = 1
    let obj = e.detail
    if(this.data.vistorList.length<this.data.number){
      this.data.vistorList.push(obj)
      this.setData({
        vistorList:this.data.vistorList,
        showMask:false,
        name:this.data.vistorList[0].name,
        phone:this.data.vistorList[0].phone,
        code:util.idCardEcode(this.data.vistorList[0].code),
      })
    } else {
      this.setData({
        errorMsg:'出行人数量不能大于预定数量',
        showError:true
      })
    }
  },
  getCommonVistor:function(){
    let that = this
    let baseUrl=util.baseUrl
    wx.request({
      url:baseUrl+'/data/findTraveler',
      data:{
        openid:wx.getStorageSync('openid'),
      },
      method:'POST',
      success:function(res){
        if(res.data.success){
          let _list = res.data.data
          if(_list && _list.length > 0)
          that.setData({
            commonVistorList: _list,
            commonVistorActive: 0,
            contactCode: _list[0].zjhm,
            contactName: _list[0].username,
            contactPhone: _list[0].mobile,
            credentialsTypeEnum: '01'
          })
        }
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  tapDialogButton:function(e){
    this.setData({
      detailShow:false
    })
    this.payOrderMethod()
    payOrderMethod
  }
})
