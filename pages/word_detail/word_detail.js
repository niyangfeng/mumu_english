// pages/word_detail/word_detail.js
import HTTP from '../../public/http/index.js'
const app = getApp()
import * as echarts from '../../utils/lib/ec-canvas/echarts';

function initChart(canvas, width, height, recordData) {
  let arr = []
  for (let a in recordData){
    arr.push(recordData[a])
  }
  let data_value = []
  for(let i = 0;i < arr.length;i++){
    data_value.push({ 'value': arr[i].percent, 'name': arr[i].sense})
  }
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    // color:data.color,
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      data: data_value,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };

  chart.setOption(option);
  return chart;
}
Page({
  echartInit(e) {
    let recordData = e.target.dataset.record;
    HTTP.wordDetail({ english_id: this.data.english_id , token: wx.getStorageSync('token') }).then((res) => {
      if (res.data.is_new_words === 0) {
        this.setData({ new_word_btn: true })
      } else {
        this.setData({ new_word_btn: false })
      }
      let note = escape(res.data.words.note)
      note = JSON.parse(unescape(note))
      initChart(e.detail.canvas, e.detail.width, e.detail.height, note);
      this.setData({
        chinese: res.data.chinese,
        word: res.data.words,
        rank: res.data.rank,
      })
    })   
  },
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      // lazyLoad: false // 延迟加载
    }, //饼图
    progress:'30%',
    study_btn:true,
    new_word_btn:true,
    word:'',
    chinese:[],
    rank:0,
    note: [],
    english_id:'',
    addbtn:true,
    word_shadow_show:false,
    new_words_list:[],//新学单词列表
    revise_words_list:[],//复习单词列表
    all_words:[],//全部
    commit_words_list:[],//提交单词列表
    new_word_study_list:[]//生词本的列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.from === 'index'){
      this.setData({
        study_btn:false,      
      })
      HTTP.dailyWord({token:wx.getStorageSync('token')}).then(res=>{
        if (res.data.new_words.length === 0){
          this.setData({
            all_words: res.data.revise_words
          })
        } else if (res.data.revise_words.length === 0){
          this.setData({
            all_words: res.data.new_words
          })
        }else{
          this.setData({
            all_words: res.data.new_words.concat(res.data.revise_words),
          })
        }
      })
    } else if (options.from === 'new_word') {
      HTTP.newWordList({ token: wx.getStorageSync('token') }).then(res => {
        this.setData({
          new_word_study_list: res.data,
          new_word_btn: false,
          addbtn:false
        })
      })
    }
    if (options.english_id!=undefined){
      this.setData({ english_id: options.english_id})
    }
  },
  //加载单词详情
  loadDetail:function(id){
    let note;
    HTTP.wordDetail({ english_id: id, token: wx.getStorageSync('token') }).then((res)=>{
      note = JSON.parse(unescape(res.data.words.note))
      this.setData({
        chinese:res.data.chinese,
        word:res.data.words,
        rank:res.data.rank,
        note: note
      })
      if (res.data.is_new_words === 0){
        this.setData({new_word_btn:true})
      }else{
        this.setData({new_word_btn:false})
      }
    })
    return note
  },
  //添加生词本
  addNewWord:function(){
    HTTP.addNewWord({english:this.data.word.english,english_id:this.data.word.id,token:wx.getStorageSync('token')}).then(res=>{
      if(res.code === 200){
        this.setData({ addbtn: false })
        wx.showToast({
          title: res.message,
        })
      }
      
    })
  },
  //点击下一个
  handleNext:function(){
    let current_index ;
    for(let i = 0;i < this.data.new_word_study_list.length;i++){
      
      if (this.data.english_id == this.data.new_word_study_list[i].english_id){
        if (i == (this.data.new_word_study_list.length - 1)) {
          wx.showToast({
            icon: 'none',
            title: '已经是最后一个了',
          })
          return
        }
        current_index  = i;      
        this.setData({
          english_id: this.data.new_word_study_list[i+1].english_id
        })
        this.loadDetail(this.data.new_word_study_list[i + 1].english_id)
        return 
      }
    }
  },
  //点击上一个
  handlePrev: function () {
    let current_index;
    for (let i = 0; i < this.data.new_word_study_list.length; i++) {
      if (this.data.english_id == this.data.new_word_study_list[i].english_id) {
        if (i == 0) {
          wx.showToast({
            icon: 'none',
            title: '已经是第一个了',
          })
          return
        }
        current_index = i;
        this.setData({
          english_id: this.data.new_word_study_list[i - 1].english_id
        })
        this.loadDetail(this.data.new_word_study_list[i - 1].english_id)
        return
      }
    }
  },
  //点击太简单
  handleEasy:function(){

  },
  //点击认识
  handleKnow: function () {

  },
  //点击不认识
  handleUnknow: function () {

  },
  //点击查看单词释义
  switchWorkShadow:function(){
    this.setData({ word_shadow_show:true})
  },
  noneEnoughPeople:function(){

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