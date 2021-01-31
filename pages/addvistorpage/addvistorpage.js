var util = require('../../utils/util')
Page({
  data:{
    showError:false,
    errorMsg:'',
    name:'',
    phone:'',
    code:'',
    isChecked:false,
    codeTypeFlag:false,
    typeName:'身份证',
    credentialsTypeEnum:'01',
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
    loading:false
  },
  onLoad:function(option){
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('visitorType',function(data){
      that.setData({
        priceObj:data.data,
        priceList: data.list,
        priceIndex: data.priceIndex
      })
    })
    // eventChannel.on('changeVistorInfo', function(data) {
    //   that.setData({
    //     name:data.data.name,
    //     phone:data.data.phone,
    //     code:data.data.code,
    //     credentialsTypeEnum:data.data.credentialsTypeEnum,
    //     typeName:that.typeNameFn(data.data.credentialsTypeEnum),
    //     flagTypeName:that.typeNameFn(data.data.credentialsTypeEnum),
    //     isChecked:data.data.isChecked,
    //     encryptId:data.data.encryptId,
    //   })
      
    // })
    // wx.getStorage({
    //   key: 'vistorList',
    //   success: function (res) {
    //     that.setData({
    //       vistorList:res.data
    //     })
    //     that.data.vistorList.map((item,index)=>{
    //       if(item.code==res.data.code&&res.data.isChecked==false){
    //         that.data.vistorList.splice(index,1)
    //         wx.setStorage({
    //           key: "vistorList",
    //           data: that.data.vistorList
    //         })
    //       }
    //     })
    //   }
    // })

    wx.getStorage({
      key: 'commonVistorList',
      success: function (res) {
        that.setData({
          commonVistorList:res.data
        })
        eventChannel.on('changeVistorInfo', function(data) {
          console.log(data.data, data.priceObj)
          that.setData({
            name:data.data.name,
            phone:data.data.phone,
            code:data.data.code,
            isChecked:data.data.isChecked
          })
          that.data.commonVistorList.map((item,index)=>{
            if(item.code==data.data.code&&data.data.isChecked==true){
              that.data.commonVistorList.splice(index,1)
              console.log(that.data.commonVistorList)
              wx.setStorage({
                key: "commonVistorList",
                data: that.data.commonVistorList
              })
            }
          })
        })
      }
    })
    eventChannel.on('checkedSwitch', function(data) {
      that.setData({
        isChecked:data.data
      })
    })
  },
  getName:function(e){
    this.setData({
      name:e.detail.value.replace(/[^\w\u4E00-\u9FA5]/g,'')
    })
  },
  getPhone:function(e){
    if(e.detail.value!='' && e.detail.value.length==11){
      let result = util.phoneRule(e.detail.value)
      if(result){
        this.setData({
          phone:e.detail.value
        })
      } else {
        this.setData({
          showError:true,
          errorMsg:'手机号码输入有误'
        })
      }
    } else {
      this.setData({
        phone:e.detail.value
      })
    }
  },
  getCode:function(e){
    if(e.detail.value!='' && e.detail.value.length==18){
      let result = util.IdentityCodeValid(e.detail.value)
      if(result[1]){
        this.setData({
          code:e.detail.value
        })
      } else {
        this.setData({
          showError:true,
          errorMsg:result[0]
        })
      }
      
    } else {
      this.setData({
        code:e.detail.value
      })
    }
  },
  changeSwitch:function(e){
    let isChecked = e.detail.value
    this.setData({
      isChecked:isChecked
    })
  },
  finishAddVistor:function(){
    if(this.data.name==''){
      this.setData({
        showError:true,
        errorMsg:'姓名为空！！'
      })
      return
    }
    if(this.data.phone=='' || this.data.phone.length<11 || this.data.phone.length>11){
      this.setData({
        showError:true,
        errorMsg:'手机号有误！！'
      })
      return
    }
    if(this.data.credentialsTypeEnum ==='01' && (this.data.code=='' || this.data.code.length<18 || this.data.code.length>18) ){
      this.setData({
        showError:true,
        errorMsg:'证件号码有误！！'
      })
      return
    }
    let obj = {
      name:this.data.name,
      phone:this.data.phone,
      code:this.data.code,
      isChecked:this.data.isChecked,
      credentialsTypeEnum:this.data.credentialsTypeEnum
    }
    // if(this.data.encryptId){ //修改
    //   obj.encryptId = this.data.encryptId
    //   let _arr = this.data.commonVistorList.filter(item=>item.encryptId !== obj.encryptId)
    //   _arr.unshift(obj)
    //   wx.setStorage({
    //     key: "commonVistorList",
    //     data: _arr
    //   })
    //   let _index = this.data.priceObj.vistorList.findIndex(item=>item.encryptId===obj.encryptId)
    //   this.data.priceObj.vistorList.splice(_index, 1)
    //   this.data.priceObj.vistorList.unshift(obj)
    // }else{ //新增
    //   obj.encryptId = this.data.code
    //   if(this.data.commonVistorList){
    //     this.data.commonVistorList.push(obj)
    //     this.data.priceObj.vistorList.unshift(obj)
    //     wx.setStorage({
    //       key: "commonVistorList",
    //       data: this.data.commonVistorList
    //     })
    //   } else {
    //     let commonVistorList = []
    //     commonVistorList.push(obj)
    //     wx.setStorage({
    //       key: "commonVistorList",
    //       data: commonVistorList
    //     })
    //   }
    // }
    if(this.data.encryptId){ //修改
      obj.encryptId = this.data.encryptId
      let _index = this.data.priceObj.vistorList.findIndex(item=>item.encryptId===obj.encryptId)
      this.data.priceObj.vistorList.splice(_index, 1)
      this.data.priceObj.vistorList.unshift(obj)
    }else{ //新增
      obj.encryptId = this.data.code
      this.data.priceObj.vistorList.unshift(obj)
    }
    let _key = `priceList[${this.data.priceIndex}].vistorList`
    let _key2 = `priceList[${this.data.priceIndex}].vistorActive`
    let pages = getCurrentPages()
    let prevPage = pages[ pages.length - 2 ]
  
    for(let i=0; i<this.data.priceList.length; i++) {
      prevPage.setData({
        ['priceList['+i+'].vistorActive']:  null,
      })
    }
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      showMask:false,
      showDialog:false,
      [_key]: this.data.priceObj.vistorList,
      name: obj.name,
      phone: obj.phone,
      code: obj.code,
      [_key2]: 0,
      contactName: obj.name,
      contactPhone: obj.phone,
      contactCode: obj.code
    })
    wx.navigateBack({
      delta:1,
    })
  },
  chooseCodeType:function(e){
    this.setData({
      codeTypeFlag:!this.data.codeTypeFlag
    })
  },
  chooseTypeItem:function(e){
    let _id = e.currentTarget.dataset.id
    let _name = e.currentTarget.dataset.name
    this.setData({
      credentialsTypeEnum:_id,
      typeName:_name,
      flagTypeName:_name,
      codeTypeFlag:false
    })
  },
  typeNameFn:function(key){
    switch (key) {
      case "ID_CARD":
        return '身份证'
        break;
      case "HUZHAO":
        return '护照'
        break;
      case "OFFICER":
        return '军官证'
        break;
      case "TAIBAO":
        return '台胞证'
        break;
      case "GANGAO":
        return '港澳通行证'
        break;
      case "OTHER":
          return '其他'
          break;
    
      default:
        return '证件号'
        break;
    }
  },
  AddVistorFn:function(obj){
    let that = this
    let baseUrl=util.baseUrl
    that.setData({
      loading:true
    })
    wx.request({
      url:baseUrl+'/tourist/insertSelective',
      data:{
        openid:wx.getStorageSync('openid'),
        // openid:'o72-z1FX3GcyBKyq6VnkW9OZomR0',
        name:obj.name,
        phone:obj.phone,
        credentialsTypeEnum:obj.credentialsTypeEnum,
        code:obj.code,
        encryptId:obj.encryptId!=''?obj.encryptId:''
      },
      method:'POST',
      success:function(res){
        console.log(res)
        if(res.data.success){
          that.setData({
            showError:true,
            errorMsg:'添加常用联系人成功！！',
            loading:false
          })
          wx.navigateBack({
            delta:1,
          })
        } else {
          that.setData({
            loading:false
          })
        }
      },
      fail:function(res){
        console.log(res)
        that.setData({
          loading:false,
          showError:true,
          errorMsg:'添加常用联系人失败！！',
        })
      }
    })
  }
})
