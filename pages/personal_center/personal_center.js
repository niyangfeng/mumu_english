//index.js
//获取应用实例
import HTTP from '../../public/http/index.js'
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    data:''
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      app.wxlogin(app.globalData.userInfo).then((res) => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      })
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.wxlogin(res.userInfo).then((res) => {
          wx.switchTab({
            url: '/pages/index/index',
          })
        })
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.wxlogin(res.userInfo).then((res)=>{
            wx.switchTab({
              url: '/pages/index/index',
            })
          })
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    HTTP.userInfo({token:wx.getStorageSync('token')}).then(res=>{
      if(res.code === 200){
        this.setData({
          data: res.data
        })
      }    
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    app.wxlogin(e.detail.userInfo).then((res) => {
      wx.switchTab({
        url: '/pages/index/index',
      })
    })
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
