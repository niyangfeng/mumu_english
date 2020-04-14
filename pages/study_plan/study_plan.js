// pages/study_plan/study_plan.js
import HTTP from '../../public/http/index.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_list:[{id:0,name:'请选择单词书'}],
    book_index:0,
    plan_list: ['请选择每日学习单词数'],
    plan_index: 0,
    total_value:'',
    day_value:0,
    complete_date:'',
    status:0,
    bookname:'',
    planname:''
  },
  bindBookPickerChange:function(e){
    this.setData({
      book_index: e.detail.value,
      status: 3,
      plan_index:0,
      bookname: this.data.book_list[e.detail.value].name
    })
    HTTP.chooseBook({ book_id: this.data.book_list[e.detail.value].id,token:wx.getStorageSync('token')})
  },
  bindPlanPickerChange: function (e) {
    let that = this;
    //计算多少天后完成计划
    let day = Math.ceil(this.data.total_value / e.detail.value)
    let date = new Date();
    date.setDate(date.getDate() + day)
    this.setData({
      plan_index: e.detail.value,
      day_value: day,
      complete_date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      status:3
    })
    HTTP.choosePlan({ daily_value: that.data.plan_list[e.detail.value],token:wx.getStorageSync('token')})
  },
  saveBtn:function(){
    wx.switchTab({
      url: '../pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let bookarr = this.data.book_list
     HTTP.bookList({ token: wx.getStorageSync('token') }).then((res)=>{
       for(let i =0;i<res.data.list.length;i++){
         bookarr.push(res.data.list[i])
       }  
       that.setData({ book_list: bookarr, })
      }
    )
    let plan_arr = this.data.plan_list
    for(let i = 1;i<31;i++){
      plan_arr.push(5*i)
    }
    this.setData({ plan_list: plan_arr})
    // //已选择
    // if(options.status != 0 ){
    //   HTTP.bookDetail({token:wx.getStorageSync('token')}).then((res)=>{
    //     that.setData({ 
    //       total_value: res.data.total_value,
    //       status:1
    //     })
    //   })
    // }
    // if(options.status == 2){
    //   let date = new Date();
    //   date.setDate(date.getDate() + wx.getStorageSync('need_days'))
    //   that.setData({
    //     status: 2,
    //     bookname:wx.getStorageSync('bookname'),
    //     planname: '每日学习' + wx.getStorageSync('daily_value') + '个单词，预计' + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()+'学完'
    //   })
    // }
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
    HTTP.planIndex({token:wx.getStorageSync('token')}).then((res)=>{
      if(res.data.status === 1){
        this.setData({
          status:1,
          bookname: res.data.data.book_name,
        })
      } else if (res.data.status === 2){
        this.setData({
          bookname: res.data.data.book_name,
          daily_value: res.data.data.daily_words,
          expected_date: res.data.data.expected_date.split(' '),
          status:2,
          planname: '每日学习' + res.data.data.daily_words + '个单词，预计' + res.data.data.expected_date.split(' ')[0] + '学完'
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