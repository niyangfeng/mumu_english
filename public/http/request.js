//  利用promise 构造面向对象版本的http请求
class request {
  constructor({ url, data = '', method = "POST", header = { 'content-type': 'application/x-www-form-urlencoded' } }) {
    this.url = url
    this.data = data
    this.method = method,
    this.header = header
    return this.http()
  }
  http() {
    let _this = this

    return new Promise((resolve, reject) => {
      wx.request({
        url: _this.url,
        data: _this.data,
        method: _this.method,
        header: _this.header,
        success:(res)=> {
          if (res.data.code == 200) {
            resolve(res.data);
          } else {
            if (res.data.message === 'TOKEN值为空，请登录'){
              wx.showToast({
                icon:'none',
                title: '请登录',
              }) 
            }else{
              wx.showToast({
                icon: 'none',
                title: res.data.message,
              })
            }
            
          }
          resolve(res)
        },
        fail:(err)=> {
          reject(err)
          console.log(err)
        }
      })
    })
  }
}
export default request