// pages/search/search.js
import HTTP from '../../public/http/index.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_key_word:'',
    search_list:[]
  },
  handleSearch:function(e){
    let that = this;
    HTTP.searchWords({ word: that.data.search_key_word,token:wx.getStorageSync('token') }).then((res) => {
      console.log(res)
      if(res.data.status == 0){
        wx.navigateTo({
          url: '../word_detail/word_detail?from=search&english_id='+res.data.data.words.id,
        })  
      }else{
        that.setData({
          search_list: []
        })
      }
      
    })
  },
  handleRelatedSearch:function (e) {
    let that = this
    HTTP.searchRelatedWords({ keyword: e.detail.value, token: wx.getStorageSync('token')}).then((res)=>{
      that.setData({
        search_key_word: e.detail.value,
        search_list:res.data
      })
    })
  },
  handleTurnDetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../word_detail/word_detail?from=search&english_id='+id,
    })  
  },
  handleCancel:function(){
    this.setData({
      search_key_word: '',
      search_list: []
    })
    wx.navigateBack({
      delta:-1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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