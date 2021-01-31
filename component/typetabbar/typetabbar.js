Component({
  data: {
    active:'0'
  },
  properties: {
    active:{
      type: String,
      value: ''
    }
  },
  methods: {
    switchType:function(e){
      let _id = e.currentTarget.dataset.id
      this.setData({
        active:_id
      })
      this.triggerEvent('switchType',_id)
    }
  }
})
