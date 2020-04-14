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
    data:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    let that = this;
    this.DoCanvas(27.5,100);
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
    ctx.setStrokeStyle('#91F2DE')
    ctx.stroke()

    ctx.beginPath()
    ctx.setLineWidth(7)
    ctx.arc(90, 90,85, 1.51 * Math.PI, Math.PI * 1.49 + precentnum / 100 * (Math.PI * 2))
    // ctx.setStrokeStyle('#5CC696')
    ctx.setStrokeStyle('#FFDB5C')
    ctx.stroke()

    ctx.beginPath()
    ctx.setLineWidth(1)
    ctx.arc(90, 90,85, 1.51 * Math.PI + precentnum / 100 * (Math.PI * 2), Math.PI * 1.49 + tatalnum / 100 * (Math.PI * 2))
    // ctx.setStrokeStyle('#FF5959')
    ctx.setStrokeStyle('#91F2DE')
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
      if (res.data.new_words.length === 0) {
        english_id = res.data.revise_words[0].words.id
      } else {
        english_id = res.data.new_words[0].words.id
      }
      wx.navigateTo({
        url: '../word_detail/word_detail?from=index&english_id='+english_id,
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
        // wx.setStorageSync('bookname', res.data.index_data.book_name);
        // wx.setStorageSync('daily_value', res.data.index_data.daily_value);
        // wx.setStorageSync('need_days', res.data.index_data.need_days);
        that.setData({
          status: res.data.status,
          data:res.data.index_data
        })
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