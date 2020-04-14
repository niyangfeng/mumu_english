// pages/card_lists/card_lists.js
import HTTP from '../../public/http/index.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    word_list:[],
    page:1
  },
  loadList:function(){
    HTTP.newWordList({ token: wx.getStorageSync('token')}).then(res => {
      this.setData({
        word_list: res.data
      })
    })
  },
  removeNewWord:function(e){
    HTTP.removeNewWord({ token: wx.getStorageSync('token'), english_id:e.currentTarget.dataset.id }).then(res => {
      if(res.code === 200){
        wx.showToast({
          title: '移除成功',
        })
        this.loadList()
      }
    })
  },
  turnToDetail:function(e){
    wx.navigateTo({
      url: '../word_detail/word_detail?from=new_word&english_id=' +  e.currentTarget.dataset.id ,
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
    this.loadList()
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