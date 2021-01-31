var util = require('../../utils/util')
Page({
  data: {
    inputShowed: false,
    firstName:'主题',
    firstList:[], //item-----{id:xx,name:'xxxx'}
    secondName:'等级',
    secondNum:'0',
    error:'error',
    secondList:[
      {
        id:'0',
        name:'全部'
      },
      {
        id:'1',
        name:'1A景区'
      },
      {
        id:'2',
        name:'2A景区'
      },
      {
        id:'3',
        name:'3A景区'
      },
      {
        id:'4',
        name:'4A景区'
      },
      {
        id:'5',
        name:'5A景区'
      },
    ], //item-----{id:xx,name:'xxxx'}
    thirdName:'排序',
    thirdNum:'',
    thirdList:[  //item-----{id:xx,name:'xxxx'}
      {
        id:'',
        name:'默认排序'
      },
      {
        id:'1',
        name:'价格升序'
      }
    ],
    productList:[],
    errorMsg:'',
    encryptId:'',
    showError:false,
    themeId:0,
    grade:0,
    isSort:0,
    isCollect:true,
    type:1
  },
  onLoad:function(option) {
    // this.getScenicList()
    // this.getThemeList()
  },
  onShow:function(e){
    let obj = getApp().globalData.searchScenic
    if(obj.type){
      let themeId = this.data.themeId
      let grade = this.data.grade
      let isSort = this.data.isSort
      let type = obj.type
      let encryptId = obj.encryptId
      this.getScenicList(themeId,grade,isSort,type,encryptId)
    } else {
      this.getScenicList()
      //this.getThemeList()
    }
  },
  onShareAppMessage: function() {
    return {
      title: '瘦西湖', //转发页面的标题
      path: '/pages/ticket/ticket'  //转发页面的路径以及携带的参数
    }
  },

  getScenicList:function(themeId,grade,isSort,type,encryptId){
    this.setData({
      productList: wx.getStorageSync('pois')
    })
    console.log(this.data.productList, 'productList')
    // let baseUrl = util.baseUrl
    // let that = this
    // wx.request({
    //   url:baseUrl+'/goodsNav/getPoiId',
    //   method:'POST',
    //   data:{
    //     categoryId:1,
    //     themeId:themeId,
    //     grade:grade,
    //     isSort:isSort,
    //     encrypId:type?'':encryptId,
    //     encrypPoiId:type?encryptId:'',
    //     openid:wx.getStorageSync('openid')
    //   },
    //   success:function(res){
    //     if(res.data.success){
    //       let data =res.data.data.goodsPage.content
    //       data.map((item)=>{ //imageList转数组
    //         let imgUrl = JSON.parse(item.imageList)
    //         item.imageList = imgUrl
    //       })
    //       getApp().globalData.searchScenic = {}
    //       that.setData({
    //         productList:data,
    //       })
    //     }
    //   },
    //   fail:function(res){
    //     console.log(res)
    //   }
    // })
  },
  getThemeList:function(){
    let baseUrl = util.baseUrl
    let that = this
    wx.request({ //获取主题
      url: baseUrl+'/goodsNav/queryThemeBypoiId',
      data:{
        encryptpoiId:''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method:'GET',
      success:function(res){
        if(res.data.success){
          let themeList = []
          let a = [
            {
              id:0,
              name:'全部'
            }
          ]
          themeList = a.concat(res.data.data.themes)
          that.setData({
            firstList:themeList
          })
        }
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  toProductInfo:function(e){
    let _id = encodeURIComponent(e.currentTarget.dataset.id)
    wx.navigateTo({
      url:'/pages/ticket-info/ticket-info?encryptId='+_id
    })
  },
  //搜索
  toSearch:function(){
    wx.navigateTo({
      url:'/pages/searchpage/searchpage'
    })
  },
  choseFirst:function(e){ //选择一
    let themeId = e.detail //拿到传过来的值
    this.setData({
      themeId:themeId
    })
    if(themeId==0){
      this.setData({
        firstName:'主题'
      })
    }
    let grade = this.data.grade
    let isSort = this.data.isSort
    let type = ''
    let encryptId = ''
    //themeId,grade,isSort,type,encryptId
    //this.getScenicList(themeId,grade,isSort,type,encryptId)
  },
  choseSecond:function(e){ //选择二
    let grade = e.detail //拿到传过来的值
    this.setData({
      grade:grade
    })
    if(grade==0){
      this.setData({
        secondName:'等级'
      })
    }
    let themeId = this.data.themeId
    let isSort = this.data.isSort
    let type = ''
    let encryptId = ''
    //this.getScenicList(themeId,grade,isSort,type,encryptId)
  },
  choseThird:function(e){ //选择三
    let isSort = e.detail //拿到传过来的值
    this.setData({
      isSort:isSort
    })
    this.setData({
      isSort:isSort
    })
    if(isSort==''){
      this.setData({
        thirdName:'排序'
      })
    }
    let themeId = this.data.themeId
    let grade = this.data.grade
    let type = ''
    let encryptId = ''
    //this.getScenicList(themeId,grade,isSort,type,encryptId)
  },
  collectOne:function(e){
    let openid = wx.getStorageSync('openid')
    let _id = e.currentTarget.dataset.item.encryptId
    if(openid==''){
      this.setData({
        showError:true,
        errorMsg:'未登录，不可收藏'
      })
      wx.nextTick(() => {
        wx.navigateTo({
          url:"/pages/loginPage/loginPage"
        })
      })
    } else {
      this.collectFn(_id)
    }
  },
  collectFn:function(id){
    let baseUrl = util.baseUrl
    let that = this
    wx.request({
      url:baseUrl+'/follow/followPoi',
      data:{
        encryptId:id,
        type:that.data.type
      },
      method:'POST',
      success:function(res){
        console.log(res)
        if(res.data.success){
          that.setData({
            showError:true,
            errorMsg:'收藏成功',
            error:'success'
          })
          that.getScenicList()
        } else {
          that.setData({
            showError:true,
            errorMsg:'收藏失败！请稍后重试！'
          })
        }
      },
      fail:function(res){
        console.log(res)
        that.setData({
          showError:true,
          errorMsg:'收藏失败！请稍后重试！'
        })
      }
    })
  },
  cancelCollectOne:function(e){
    let _id = e.currentTarget.dataset.item.encryptId
    let type = this.data.type
    this.cancelCollectOneFn(_id,type)
  },
  cancelCollectOneFn:function(id,type){
    let baseUrl = util.baseUrl
    let that = this
    wx.request({
      url:baseUrl+'/follow/unFollowPoi',
      data:{
        encryptId:id,
        type:type
      },
      method:'POST',
      success:function(res){
        console.log(res)
        if(res.data.success){
          that.setData({
            showError:true,
            errorMsg:'取消收藏',
            error:'success'
          })
          that.getScenicList()
        } else {
          that.setData({
            showError:true,
            errorMsg:'收藏失败！请稍后重试！'
          })
        }
      },
      fail:function(res){
        console.log(res)
        that.setData({
          showError:true,
          errorMsg:'收藏失败！请稍后重试！'
        })
      }
    })
  },
  bindErrorImg:function(e){
    let errorImgIndex= e.currentTarget.dataset.errorimg
    this.data.productList.map((item,index)=>{
      if(errorImgIndex==index){
        item.imageList[errorImgIndex].url = '../../assets/banner/error.jpg'
      }
    })
    this.setData({
      productList:this.data.productList
    }); 
  }
});
