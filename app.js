//app.js
import HTTP from './public/http/index.js'
import regeneratorRuntime from './public/regenerator-runtime/runtime.js'
App({
  onLaunch: function () {
    let that = this;
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        var model ='';
        if (res.model.indexOf("X") > -1){
          model = res.model.substring(0, res.model.indexOf("X")) + "X";
        }    
        if (model == 'iPhone X' || model == 'iPhone 11') {
          that.globalData.isIpx = true  //判断是否为iPhone X 默认为值false，iPhone X 值为true
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync('username',res.userInfo.nickName,)
              wx.setStorageSync('wechat_profile', res.userInfo.avatarUrl)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  wxlogin:function(userinfo,){
    let token = '';
    let that = this;
    wx.login({
      success: res => {
        let result = HTTP.login({
          js_code:res.code,
          username: wx.getStorageSync('username'),
          wechat_profile: wx.getStorageSync('wechat_profile'),
          openid: wx.getStorageSync('open_id') != ''  ? wx.getStorageSync('open_id') : ''
        })
        result.then(response=>{
          token = response.data.token
          wx.setStorageSync('token', response.data.token)
          wx.setStorageSync('open_id', response.data.openid)
          this.globalData.userInfo.token = response.data.token
          wx.showToast({
            title: '登录成功',
          })
          
        })
      }
    })
    return Promise.resolve(token)
  },
  globalData: {
    userInfo: null,
    token:null,
    isIpx:false
  }
})