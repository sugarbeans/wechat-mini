var util = require('../../utils/util')
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    searchList:[],
    hotSearchList:[],
    searchState:false,
    errorMsg:'',
    showError:false,
    placeholder:'酒店 / 景点 / 关键字'
  },
  onLoad() {
    let that = this
    this.setData({
      search: this.search.bind(this)
    })
    wx.getStorage({
      key: 'searchList',
      success: function (res) {
        that.setData({
          searchList:res.data
        })
      }
    })
    that.getHotSearch()
  },
  getHotSearch:function(){
    let baseUrl = util.baseUrl
    let that = this
    wx.request({
      url:baseUrl+'/goodsNav/queryPopularRanking',
      method:'POST',
      timeout:300000,
      success:function(res){
        let data = JSON.parse(res.data.data)
        that.setData({
          hotSearchList:data
        })
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  //搜索
  search: function (value) {
    let baseUrl = util.baseUrl
    let that = this
    return new Promise((resolve, reject) => {
        // resolve([{ text: value, value: 1 }])
      wx.request({
        url:baseUrl+'/goodsNav/queryVague',
        data:{
          name:value
        },
        method:'POST',
        timeout:300000,
        success:function(res){
          if(res.data.success){
            let dataList = JSON.parse(res.data.data)
            console.log(dataList)
            that.setData({
              result:dataList
            })
          }
        },
        fail:function(res){
          console.log(res)
          that.setData({
            errorMsg:'执行异常！请稍后重试！',
            showError:true
          })
        }
      })
    })
  },
  //选定搜索结果
  selectResult: function (e) {
    let that = this
    let data = e.detail.data
    that.data.searchList.push(data)
    that.toSearchResult(data.encryptId,data.type)
    that.setData({
      searchList:that.data.searchList,
      searchState:false,
      value:'',
      result:[]
    })
    wx.setStorage({
      key: "searchList",
      data: that.data.searchList
    })
  },
  unique:function(arr){
    var res=[];
    for(var i=0,len=arr.length;i<len;i++){
        var obj = arr[i];
        for(var j=0,jlen = res.length;j<jlen;j++){
            if(res[j]===obj) break;            
        }
        if(jlen===j)res.push(obj);
    }
    return res;
  },
  searchHistory:function(e){
    let _id = e.currentTarget.dataset.id
    let _type = e.currentTarget.dataset.type
    this.toSearchResult(_id,_type)
  },
  toSearchResult:function(encryptId,type){
    switch (type) {
      case 1:
        let obj = {
          encryptId:encryptId,
          type:type
        }
        getApp().globalData.searchScenic = obj
        wx.switchTab({
          url:'/pages/ticket/ticket'
        })
        break;
      case 3:
        wx.navigateTo({
          url:'/pages/ticket-info/ticket-info?encryptId='+encryptId+'&type='+type
        })
        break;
    
      default:
        break;
    }
  }
})
