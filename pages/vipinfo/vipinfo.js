var util = require('../../utils/util')
Page({
  data:{
    address: "大虹桥路28号",
    cardName: "贵宾卡A卡",
    cardType: 1,
    cname: "林凡二",
    idCard: "110101200001012710",
    idCardType: "01",
    isMailing: 1,
    isChecked: true,
    mobile: "13040008989",
    money: 0.05,
    price: 0.05,
    quantity: 1,

    codeTypeFlag:false,
    typeName:'身份证',
    visitorType:[
      {
        id:'01',
        value:'身份证'
      }
    ],
    loading:false,
    region: ['江苏省', '扬州市', '维扬区'],
    zonePick: '江苏省-扬州市-维扬区',
    openid: '',
    detailShow: false,
    textButton: [{text: '确定并支付'}],
    showError: false,
    errorMsg:'',
    type: 'A'

  },
  onLoad:function(option){
    let _type = decodeURIComponent(option.type)
    if(_type==='A' || _type==='B') {
      let index = _type === 'A' ? 0 : 1
      let _obj = getApp().globalData.vipCards[index]
      this.setData({
        cardName: _obj.name,
        cardType: _obj.id,
        price: _obj.price,
        type: _type
      })
      let that = this
      wx.getStorage({
        key:'openid',
        success:function(res){
          that.setData({
            openid: res.data
          })
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
    } else {
      wx.navigateTo({
        url:"/pages/vipcord/vipcord"
      })
    }
    // let _obj = decodeURIComponent(option.obj)
    // if(_obj) {
    //   this.data = {...JSON.parse(_obj)}
    //   console.log(_obj)
    // }
  },
  bindRegionChange: function (e) {
    this.setData({
      zonePick: `${e.detail.value[0]}-${e.detail.value[1]}-${e.detail.value[2]}`
    })
  },
  getName:function(e){
    this.setData({
      cname:e.detail.value.replace(/[^\w\u4E00-\u9FA5]/g,'')
    })
  },
  getPhone:function(e){
    if(e.detail.value!='' && e.detail.value.length==11){
      let result = util.phoneRule(e.detail.value)
      if(result){
        this.setData({
          mobile:e.detail.value
        })
      } else {
        this.setData({
          showError:true,
          errorMsg:'手机号码输入有误'
        })
      }
    } else {
      this.setData({
        mobile:e.detail.value
      })
    }
  },
  getCode:function(e){
    if(e.detail.value!='' && e.detail.value.length==18){
      let result = util.IdentityCodeValid(e.detail.value)
      if(result[1]){
        this.setData({
          idCard:e.detail.value
        })
      } else {
        this.setData({
          showError:true,
          errorMsg:result[0]
        })
      }
      
    } else {
      this.setData({
        idCard:e.detail.value
      })
    }
  },
  getAddress:function(e){
    this.setData({
      address:e.detail.value.replace(/[^\w\u4E00-\u9FA5]/g,'')
    })
  },
  changeSwitch:function(e){
    let isChecked = e.detail.value
    this.setData({
      isChecked:isChecked,
      isMailing: isChecked | 0
    })
    let _str = isChecked ? "请确保邮寄地址的准确！" : "不需要邮寄实物卡吗？"
    wx.showToast({
      title: _str,
      icon: "none",
      duration: 3000
    })
  },
  finishAddVistor:function(){
    wx.showToast({
      title: '请再次确认是否需要邮寄或者地址的准确性',
      icon: 'none',
      duration: 3000
    })
    if(this.data.quantity<=0){
      this.setData({
        showError:true,
        errorMsg:'数量有误！'
      })
      return
    }
    if(this.data.cname==''){
      this.setData({
        showError:true,
        errorMsg:'姓名为空！！'
      })
      return
    }
    if(this.data.mobile=='' || this.data.mobile.length<11){
      this.setData({
        showError:true,
        errorMsg:'手机号有误！！'
      })
      return
    }
    if(this.data.credentialsTypeEnum ==='01' && (this.data.code=='' || this.data.code.length<18) ){
      this.setData({
        showError:true,
        errorMsg:'证件号码有误！！'
      })
      return
    }
    this.setData({
      detailShow: true
    })
  },
  minusTicketIndex:function(e){
    let _number = this.data.quantity
    if(_number==0){
      this.setData({
        errorMsg:'数量不能为负值',
        showError:true
      })
    }else{
      this.setData({
        quantity: _number-1
      })
      this.changeTotal()
    }
  },
  addTicketIndex:function(e){
    let _number = this.data.quantity
    this.setData({
      quantity :_number+1
    })
    this.changeTotal()
  },
  getNumber:function(e){
    this.setData({
      quantity: e.detail.value
    })
    this.changeTotal()
  },
  changeTotal() {
    let _total = 0
    this.data.quantity > 0 && (_total = this.data.quantity * this.data.price)
    this.setData({
      money: _total>0 ? _total.toFixed(2): _total 
    })
  },
  payOrderMethod:function(){ //提交订单
    let baseUrl = util.baseUrl
    let that = this
    const {cardName, cardType, cname, idCard, idCardType, isMailing, mobile, money, price, quantity} = that.data
    let obj = {cardName, cardType, cname, idCard, idCardType, isMailing, mobile, money, price, quantity}
    obj.address = that.data.zonePick+","+that.data.address
    console.log(obj, 'create-order')
    // wx.request({
    //   url:baseUrl+'/order/createVipOrder',
    //   data: obj,
    //   method:'POST',
    //   timeout:300000,
    //   success:function(res){
    //     console.log(res, 'res')
    //     if(res.data.success){
    //       let _obj = res.data.data
    //       that.transferWechatPay(_obj.orderNo, that.data.openid, _obj.money)
    //     } else {
    //       that.setData({
    //         errorMsg:res.data.description.split(':')[1],
    //         showError:true,
    //         showPayLoading:false
    //       })
    //     }
    //   },
    //   fail:function(res){
    //     console.log(res)
    //     that.setData({
    //       showPayLoading:false
    //     })
    //   }
    // })
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
        console.log(res, 'res-pay')
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
                url:"/pages/payorderpage/payorderpage"
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
  tapDialogButton:function(e){
    this.setData({
      detailShow:false
    })
    this.payOrderMethod()
  }
})