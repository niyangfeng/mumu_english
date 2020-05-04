// pages/report/report.js
import HTTP from '../../public/http/index.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    array: ['手机', '微信', '邮箱', 'QQ'],

  },
  bindPickerChange:function(e){
    this.setData({index:e.detail.value})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindFormSubmit: function (e) {
    let data = e.detail.value;
    data.contact_way = this.data.array[this.data.index];
    data.token = wx.getStorageSync('token');
    HTTP.reportQuestion(data).then((res)=>{
      if(res.code === 200){
        wx.showToast({
          title: res.message,
          icon:'none'
        })
        wx.navigateBack({
          delta:-1,
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
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