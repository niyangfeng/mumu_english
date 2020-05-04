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
    plan_list: ['请选择每次学习单词数'],
    plan_index: 0,
    book_type_list: [{id:0,name:'请选择书籍类别'}],
    book_type_index:0,
    total_value:'',
    day_value:0,
    complete_date:'',
    status:0,
    bookname:'请选择单词书',
    planname:'请选择每次学习单词数',
    typename:'请选择书籍类别',
    type_id:0
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
    if(e.detail.value != 0){
      let that = this;
      //计算多少天后完成计划
      let day = Math.ceil(this.data.book_list[this.data.book_index].total_amount / this.data.plan_list[e.detail.value])
      let date = new Date();
      date.setDate(date.getDate() + day)
      this.setData({
        plan_index: e.detail.value,
        day_value: day,
        complete_date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        status: 3
      })
      HTTP.choosePlan({ daily_value: that.data.plan_list[e.detail.value], token: wx.getStorageSync('token') })
    }    
  },
  bindBookTypePickerChange:function(e){
    let that = this;
    this.setData({
      book_type_index: e.detail.value,
      status: 3,
      plan_index: 0,
      book_index: 0,
      typename: this.data.book_type_list[e.detail.value].name,
      type_id: this.data.book_type_list[e.detail.value].id,
      bookname: '请选择单词书',
      planname: '请选择每次学习单词数',
    })
    let bookarr = [{ id: 0, name: '请选择单词书' }];
    let booktypeid = this.data.book_type_list[e.detail.value].id
    HTTP.bookList({ token: wx.getStorageSync('token'), book_type: booktypeid }).then((res) => {
      if (res.code === 200) {
        for (let i = 0; i < res.data.list.length; i++) {
          bookarr.push(res.data.list[i])
        }
        that.setData({ book_list: bookarr, })
      }
    }
    )
  },
  saveBtn:function(){
    wx.showToast({ title: '保存成功'})
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
    let that = this;
    let booktypearr = this.data.book_type_list;
    HTTP.bookTypeLisk({ token: wx.getStorageSync('token') }).then(res=>{
      for (let i = 0; i < res.data.length; i++) {
        booktypearr.push(res.data[i])
      }
      that.setData({ book_type_list: booktypearr, })
    })
    
    let plan_arr = this.data.plan_list
    for (let i = 1; i < 31; i++) {
      plan_arr.push(5 * i)
    }
    this.setData({ plan_list: plan_arr })

    HTTP.planIndex({token:wx.getStorageSync('token')}).then((res)=>{
      if(res.data.status === 1){
        for (let i = 0; i < that.data.book_list.length;i++){
          if (that.data.book_list[i].name === res.data.book_name){
            that.setData({
              book_index:i+1
            })
          }
        }
        that.setData({
          status:1,
          bookname: res.data.book_name,
          typename: res.data.type_name,
          type_id: res.data.type_id
        })
        let bookarr = that.data.book_list;
        let booktypeid = that.data.type_id;
        HTTP.bookList({ token: wx.getStorageSync('token'), book_type: booktypeid }).then((resp) => {
          if (resp.code === 200) {
            for (let i = 0; i < resp.data.list.length; i++) {
              bookarr.push(resp.data.list[i])
            }
            that.setData({ book_list: bookarr, })
          }
        }
        )
      } else if (res.data.status === 2){
        for (let i = 0; i < that.data.book_list.length; i++) {
          if (this.data.book_list[i].name === res.data.data.book_name) {
            that.setData({
              book_index: i + 1
            })
          }
        }
        that.setData({
          bookname: res.data.data.book_name,
          daily_value: res.data.data.daily_words,
          expected_date: res.data.data.expected_date.split(' '),
          status:2,
          planname: '每日学习' + res.data.data.daily_words + '个单词，预计' + res.data.data.expected_date.split(' ')[0] + '学完',
          typename: res.data.data.type_name,
          type_id: res.data.data.type_id
        })
        let bookarr = that.data.book_list;
        let booktypeid = that.data.type_id;
        HTTP.bookList({ token: wx.getStorageSync('token'), book_type: booktypeid }).then((resp) => {
          if (resp.code === 200) {
            for (let i = 0; i < resp.data.list.length; i++) {
              bookarr.push(resp.data.list[i])
            }
            that.setData({ book_list: bookarr, })
          }
        }
        )
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