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
    data:'',
    autoPlayChecked:false,
    uniqueCode:'',
    modalShow:false
  },
  onLoad: function () {
    if(wx.getStorageSync('autoplay')){
      this.setData({ autoPlayChecked:true})
    }
    if(wx.getStorageSync('token')){
      this.setData({ uniqueCode: wx.getStorageSync('token') })
    }
    if (app.globalData.userInfo) {
      app.wxlogin(app.globalData.userInfo).then((res) => {
        this.getStudyInfo()
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
          this.getStudyInfo()
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
            this.getStudyInfo()
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
    
  },
  autoPlayChange: function(e){
    this.setData({ autoPlayChecked:e.detail.value})
    if (e.detail.value){
      wx.setStorageSync('autoplay', e.detail.value)
    }else{
      wx.removeStorageSync('autoplay')
    }
  },
  getStudyInfo:function(){
    HTTP.userInfo({ token: wx.getStorageSync('token') }).then(res => {
      if (res.code === 200) {
        this.setData({
          data: res.data
        })
      }
    })
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo!=undefined){
      let that = this;
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync('username', e.detail.userInfo.nickName);
      wx.setStorageSync('wechat_profile', e.detail.userInfo.avatarUrl);
      let result = app.wxlogin(e.detail.userInfo)
      result.then(res => {
        let timer = setInterval(function () {
          if (wx.getStorageSync('token') != undefined && wx.getStorageSync('token') != '') {
            that.setData({uniqueCode: wx.getStorageSync('token')})
            clearInterval(timer)
            that.getStudyInfo()
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }, 200)

      })
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
    
  },
  handleShowModal:function(){
    this.setData({modalShow:true})
  },
  handleShowUniqueCode:function(){
    wx.navigateTo({
      url: '../unique_code/unique_code',
    })
  },
  handleHideModal:function(){
    this.setData({modalShow:false})
  },
  handleReport: function () {
    wx.navigateTo({
      url: '../report/report',
    })
  },
  onShow:function(){
    if (wx.getStorageSync('token') != undefined && wx.getStorageSync('token') != ''){
      this.getStudyInfo()
    }
  }
})
