// pages/index/index.js
import HTTP from '../../public/http/index.js'
import regeneratorRuntime from '../../public/regenerator-runtime/runtime.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:0,
    data:'',
    has_been_learned_days:0,
    need_days:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    let that = this;
    
    if(wx.getStorageSync('token')==undefined){
      app.wxlogin()
    }
  },
  DoCanvas(precentnum, tatalnum) {
    //
    var ctx = wx.createCanvasContext('Canvas');

    ctx.beginPath()
    ctx.setLineWidth(1)
    ctx.arc(90, 90,85, 0, 2 * Math.PI)
    ctx.setStrokeStyle('#ccc')
    ctx.stroke()

    ctx.beginPath()
    ctx.setLineWidth(7)
    ctx.arc(90, 90,85, 1.51 * Math.PI, Math.PI * 1.49 + precentnum / 100 * (Math.PI * 2))
    ctx.setStrokeStyle('#37b5fc')
    // ctx.setStrokeStyle('#FFDB5C')
    ctx.stroke()

    ctx.beginPath()
    ctx.setLineWidth(1)
    ctx.arc(90, 90,85, 1.51 * Math.PI + precentnum / 100 * (Math.PI * 2), Math.PI * 1.49 + tatalnum / 100 * (Math.PI * 2))
    ctx.setStrokeStyle('#ccc')
    // ctx.setStrokeStyle('#91F2DE')
    ctx.stroke()

    ctx.draw()

  },
  choosePlan:function(){
    wx.navigateTo({
      url: '../study_plan/study_plan?status='+this.data.status,
    })
  },
  bindSearchBtn:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  handleStart:function(){
    wx.showLoading({
      title: '单词正在路上',
    })
    HTTP.dailyWord({ token: wx.getStorageSync('token') }).then(res => {
      let english_id ; 
      let will_study_new_word = [];
      let will_study_revise_word = [];
      //从数组中去除已经达标的单词
      for(let i = 0;i < res.data.new_words.length;i++){
        if(res.data.new_words[i].is_reach_expected_rank === 0){       
          will_study_new_word.push(res.data.new_words[i])
        }
      }
      for(let i = 0;i < res.data.revise_words.length;i++){
        if(res.data.revise_words[i].is_reach_expected_rank === 0){
          will_study_revise_word.push(res.data.revise_words[i])
        }
      }
      if (will_study_new_word.length === 0) {
        english_id = will_study_revise_word[0].words.id
      } else {
        english_id = will_study_new_word[0].words.id
      }
      wx.hideLoading()
      wx.navigateTo({
        url: '../word_detail/word_detail?from=index&english_id='+english_id+'&rank='+res.data.rank+'&list_number='+res.data.list_number,
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    HTTP.indexDetail({ token: wx.getStorageSync('token') }).then(res => {
      if (res.data.status === 0 || res.data.status === 1) {
        wx.navigateTo({
          url: '../study_plan/study_plan?status=' + res.data.status,
        })
      } else if (res.data.status === 2) {      
        that.setData({
          status: res.data.status,
          data:res.data.index_data,
          need_days: res.data.index_data.need_days,
          has_been_learned_days: res.data.index_data.has_been_learned_days
        })
        // that.DoCanvas((that.data.has_been_learned_days * 100 / that.data.need_days) < 2 ? 2 : (that.data.has_been_learned_days * 100 / that.data.need_days) , 100);
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})