// pages/word_detail/word_detail.js
const innerAudioContext = wx.createInnerAudioContext();
import HTTP from '../../public/http/index.js'
const app = getApp()
import * as echarts from '../../utils/lib/ec-canvas/echarts';
var _canvas;
var _width;
var _height;

function initChart(recordData,canvas, width, height ) {
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
      center: ['50%', '55%'],
      radius: [0, '50%'],
      data: data_value,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }],
    
  };

  chart.setOption(option);
  return chart;
}
Page({
  echartInit(e) {
    if (e != undefined){
      _canvas = e.detail.canvas;
      _width = e.detail.width;
      _height = e.detail.height;
    }
    
    let recordData = this.data.note;
    HTTP.wordDetail({ english_id: this.data.english_id , token: wx.getStorageSync('token') }).then((res) => {
      if (res.data.is_new_words === 0) {
        this.setData({ addbtn: true })
      } else {
        this.setData({ addbtn: false })
      }
      let note = escape(res.data.words.note)
      note = JSON.parse(unescape(note))
      //判断是否是第一次加载饼图
      // if (this.data.ec_first_init) {
        initChart( note , _canvas, _width, _height);
      // }else{
        // initChart(note)
      // }    
      this.setData({
        chinese: res.data.chinese,
        word: res.data.words,
        ec_first_init:false
      })
      this.checkAudio()
      innerAudioContext.src = 'https://dict.youdao.com/dictvoice?type=2&audio=' + this.data.word.english;
      if (wx.getStorageSync('autoplay')) {
        if (this.data.have_audio) {
          this.handlePlay();
        }
      }
    })   
  },
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      // lazyLoad: false // 延迟加载
    }, //饼图
    ec_first_init:true,
    now_new_word_num:0,//当前已学新词数
    now_revise_word_num: 0,//当前已学复习词数
    progress_new:'0%',//新学单词进度条
    progress_revise:'0%',//复习单词进度
    study_btn:true,
    new_word_study_btn:true,//生词本上一个/下一个按钮
    word:'',
    chinese:[],
    rank:'',//目标等级
    note: [],//释义饼图
    english_id:'',
    list_number:1,
    addbtn: true,//添加生词本按钮
    word_shadow_show:false,//释义蒙层
    new_words_list:[],//新学单词列表
    revise_words_list:[],//复习单词列表
    all_words:[],//全部
    commit_words_list:[],//提交单词列表
    new_word_study_list:[],//生词本的列表
    have_audio:true,
    isIpx:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.isIpx){
      this.setData({ isIpx: true})
    }
    if(options.from === 'index'){
      this.setData({
        study_btn:false,     
        rank:options.rank ,
        list_number:options.list_number
      })
      HTTP.dailyWord({token:wx.getStorageSync('token')}).then(res=>{
        this.setData({
          new_words_list: this.data.new_words_list.concat(res.data.new_words),
          revise_words_list: this.data.revise_words_list.concat(res.data.revise_words)
        })
        if (res.data.new_words.length === 0){
          let revise_words = res.data.revise_words;
          for(let i = 0 ; i < revise_words.length; i++){
            revise_words[i].new_word = false
          }
          this.setData({
            all_words: revise_words,
          })
        } else if (res.data.revise_words.length === 0){
          let new_words = res.data.new_words;
          for (let i = 0; i < new_words.length; i++) {
            new_words[i].new_word = true
          }
          this.setData({
            all_words: new_words
          })
        }else{
          let new_words = res.data.new_words;
          for (let i = 0; i < new_words.length; i++) {
            new_words[i].new_word = true
          }
          let revise_words = res.data.revise_words;
          for (let i = 0; i < revise_words.length; i++) {
            revise_words[i].new_word = false
          }
          this.setData({
            all_words: new_words.concat(revise_words),
          })
        }
      })
    } else if (options.from === 'new_word') {
      HTTP.newWordList({ token: wx.getStorageSync('token') }).then(res => {
        this.setData({
          new_word_study_list: res.data,
          new_word_study_btn: false,
          addbtn:false,
          word_shadow_show:true
        })
      })
    }else if(options.from === 'search'){
      this.setData({ word_shadow_show:true})
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
        note: note
      })
      // this.checkAudio()
      if (res.data.is_new_words === 0){
        this.setData({addbtn:true})
      }else{
        this.setData({addbtn:false})
      }
      // innerAudioContext.src = 'https://dict.youdao.com/dictvoice?type=2&audio=' + this.data.word.english;
      // if(wx.getStorageSync('autoplay')){
      //   if (this.data.have_audio){
      //     this.handlePlay();
      //   }
      // }
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
        this.playAudio(this.data.new_word_study_list[i + 1].english)
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
        this.playAudio(this.data.new_word_study_list[i - 1].english)
        this.loadDetail(this.data.new_word_study_list[i - 1].english_id)
        return
      }
    }
  },
  //点击太简单
  handleEasy:function(){
    let word_arr = this.data.all_words
    for (let i = 0; i < word_arr.length; i++) {
      if (this.data.english_id == word_arr[i].words.id) {
        //每个单词点击太简单后当日不出现，进入提交数组
        this.commitData(word_arr[i].new_word ? 1 : 0, word_arr[i].words.id, word_arr[i].words.english, word_arr[i].rank+Math.ceil(this.data.rank / 2),this.data.list_number)
        word_arr.splice(i, 1)
        this.setData({
          all_words: word_arr,
          word_shadow_show:false
        })
        //判断今日单词是否已学完
        if (word_arr.length === 0) {
          this.handleProgress()
          wx.showToast({
            title: '今日学习已完成',
          })
          HTTP.commitWords({ token: wx.getStorageSync('token'), saveAllData: JSON.stringify(this.data.commit_words_list) }).then(res => {
            if (res.code === 200) {
              setTimeout(function () {
                wx.navigateBack({
                  delta: -1
                })
              }, 1000)
              return;
            }
          })      
        }   
        //切换下一个单词
        if (i < (word_arr.length - 1)) {
          this.setData({ english_id: word_arr[i].words.id });      
          // this.playAudio(word_arr[i].words.english)  
          // this.loadDetail(this.data.english_id);
          this.echartInit();
          this.handleProgress()
          return;
        } else {
          this.setData({ english_id: word_arr[0].words.id });
          // this.playAudio(word_arr[0].words.english)  
          // this.loadDetail(this.data.english_id);
          this.echartInit()
          this.handleProgress()
          return;
        }  
        
      }
    }
    
  },
  //点击认识
  handleKnow: function () {
    let word_arr = this.data.all_words
    for (let i = 0; i < word_arr.length; i++) {
      if (this.data.english_id == word_arr[i].words.id) {
        //点击认识每个单词每日会出现两次
        if (word_arr[i].doublie_click == undefined){
          word_arr[i].doublie_click = 1
          
          //切换下一个单词
          if (i < (word_arr.length - 1)) {
            this.setData({ english_id: word_arr[i + 1].words.id, word_shadow_show: false });
            // this.playAudio(word_arr[i+1].words.english)  
            // this.loadDetail(this.data.english_id);
            this.echartInit()
            this.handleProgress()
            return;
          } else {
            this.setData({ english_id: word_arr[0].words.id, word_shadow_show: false });
            // this.playAudio(word_arr[0].words.english)  
            // this.loadDetail(this.data.english_id);
            this.echartInit()
            this.handleProgress()
            return;
          }
          
        }else{
          this.commitData(word_arr[i].new_word ? 1 : 0, word_arr[i].words.id, word_arr[i].words.english, word_arr[i].rank + 0.5,this.data.list_number)
          word_arr.splice(i, 1)
          this.setData({
            all_words: word_arr,
            word_shadow_show: false
          })
          //判断今日单词是否已学完
          if (word_arr.length === 0) {
            this.handleProgress()
            wx.showToast({
              title: '今日学习已完成',
            })
            HTTP.commitWords({ token: wx.getStorageSync('token'), saveAllData: JSON.stringify(this.data.commit_words_list) }).then(res => {
              if (res.code === 200) {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: -1
                  })
                }, 1000)
                return;
              }
            })
          }  
          //切换下一个单词
          if (i < (word_arr.length - 1)) {
            this.setData({ english_id: word_arr[i].words.id });
            // this.loadDetail(this.data.english_id);
            this.echartInit()
            this.handleProgress()
            return;
          } else {
            this.setData({ english_id: word_arr[0].words.id });
            // this.loadDetail(this.data.english_id);
            this.echartInit()
            this.handleProgress()
            return;
          }
        } 
         
        

      }
    }
  },
  //点击不认识
  handleUnknow: function () {
    this.switchWord()
    this.setData({ word_shadow_show: false})
  },
  //切换单词
  switchWord:function(){
    for(let i = 0;i < this.data.all_words.length;i++){
      if (this.data.english_id == this.data.all_words[i].words.id){
        if (i < (this.data.all_words.length-1)){
          this.setData({ english_id: this.data.all_words[i + 1].words.id });
          // this.playAudio(this.data.all_words[i + 1].words.english)  
          // this.loadDetail(this.data.english_id);
          this.echartInit()
          return ;
        }else{
          this.setData({ english_id: this.data.all_words[0].words.id });
          // this.playAudio(this.data.all_words[0].words.english)  
          // this.loadDetail(this.data.english_id);
          this.echartInit()
          return ;
        }       
      }
    }
   
  },
  //存入提交数组
  commitData:function(is_new_words,english_id,word,rank,list_number){
    let commitData = this.data.commit_words_list;
    let commitWord = {
      is_new_words: is_new_words,
      english_id:english_id,
      word:word,
      rank:rank,
      list_number:list_number
    }
    commitData.push(commitWord)
    wx.setStorageSync('commitData', commitData)
    this.setData({
      commit_words_list: commitData
    })
  },
  //点击查看单词释义
  switchWorkShadow:function(){
    this.setData({ word_shadow_show:true})
  },
  //计算进度条
  handleProgress:function(){
    //计算进度条
    let new_word_num = 0;
    let revise_word_num = 0;
    let storage_word = wx.getStorageSync('commitData') == undefined ? [] : wx.getStorageSync('commitData');
    for (let k = 0; k < storage_word.length; k++) {
      if (storage_word[k].is_new_words === 1) {
        new_word_num++
        this.setData({
          now_new_word_num: new_word_num
        })
      } else if (storage_word[k].is_new_words === 0) {
        revise_word_num++
        this.setData({
          now_revise_word_num: revise_word_num
        })
      }
      this.setData({
        progress_new: Math.round(new_word_num / this.data.new_words_list.length * 10000) / 100.00 + "%",
        progress_revise: Math.round(revise_word_num / this.data.revise_words_list.length * 10000) / 100.00 + "%",
      })
    }
  },
  //判断音频文件是否存在
  checkAudio:function(english){
    wx.request({
      url: 'https://dict.youdao.com/dictvoice?type=2&audio=' + english + '.mp3',
      complete:res=>{
        if (res.statusCode === 404){
          this.setData({
            have_audio:false
          })
        }else{
          this.setData({
            have_audio: true,
            mp3_url: 'http://mp3.mmmba.cn/' + english + '.mp3'
          })
        }
      }
    })
  },
  //点击播放,(如果要一进来就播放放到onload即可)
  handlePlay: function () {
    innerAudioContext.play();
  },
  //点击 停止
  handleStop: function () {
    innerAudioContext.pause();
  },
  playAudio:function(english){
    this.checkAudio(english);
    innerAudioContext.src = 'https://dict.youdao.com/dictvoice?type=2&audio=' + english;
    if (wx.getStorageSync('autoplay')) {
      if (this.data.have_audio) {
        this.handlePlay();
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.audioCtx = wx.createAudioContext('music')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.audioCtx = wx.createAudioContext('music')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorage({
      key: 'commitData',
    })  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorage({
      key: 'commitData',
    }) 
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