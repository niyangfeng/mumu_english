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
      if(res.data.data.length == 0){
        that.setData({
          search_list: res.data.data
        })
      }else{
        let new_word = {
          word: res.data.words.english,
          id: res.data.words.id
        }
        that.setData({
          search_list: [new_word]
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
      url: '../word_detail/word_detail?english_id='+id,
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