Component({
  data: {

  },
  commonVistorList:{
    type:Array,
    value:true
  },
  properties: {
    priceObj: {
      type:Object,
      value:true
    },
    priceList: {
      type: Array,
      value: true
    },
    priceIndex: {
      type: Number,
      value: true
    }
  },
  methods: {
    closeMaskDialog:function(){
      this.triggerEvent('closeMaskDialog', false);
    },
    toAddVistor:function(){
      let that = this
      if(this.data.priceObj.number>this.data.priceObj.vistorList.length){
        wx.navigateTo({
          url:'/pages/addvistorpage/addvistorpage',
          success: function(res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('visitorType', {data: that.data.priceObj, list: that.data.priceList, priceIndex: that.data.priceIndex})
          }
        })
      } else {
        this.triggerEvent('toAddVistor','出行人数不能大于预定数量')
      }
    },
    changeVistorInfo:function(e){
      let obj = e.currentTarget.dataset.obj
      wx.navigateTo({
        url:"/pages/addvistorpage/addvistorpage",
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('changeVistorInfo', { data: obj, priceObj: this.data.priceObj, list: that.data.priceList})
        }
      })
    },
    chooseCommonVistor:function(e){
      let commonObj = e.currentTarget.dataset.obj
      this.triggerEvent('chooseCommonVistor',commonObj)
    }
  }
})
