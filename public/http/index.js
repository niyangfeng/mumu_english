
const app = getApp()
const api = 'https://dict.mmmba.cn'
import request from './request.js'
//接口统一管理
export default {
  // 注册
  login: (data) => {
    return new request({
      url: api + '/api/user/register',
      data
    })
  },
  //个人中心
  userInfo: (data) => {
    return new request({
      url: api + '/api/my/user/info',
      data
    })
  },
  //首页单词
  indexDetail : (data) => {
    return new request({
      url:api + '/api/index',
      data
    })
  },
  //计划首页
  planIndex:(data)=>{
    return new request({
      url: api + '/api/modify/plan/index',
      data
    })
  },
  //单词书列表
  bookList : (data) => {
    return new request({
      url: api + '/api/book/list',
      data
    })
  },
  //选择单词书
  chooseBook:(data)=>{
    return new request({
      url:api + '/api/choose/book',
      data
    })
  },
  //单词书详情
  bookDetail:(data) => {
    return new request({
      url: api + '/api/modify/daily/words',
      data
    })
  },
  //选择计划
  choosePlan:(data)=>{
    return new request({
      url: api +'/api/save/modify/daily/words',
      data
    })
  },
  //单词搜索
  searchWords:(data) => {
    return new request({
      url: api + '/api/search/word',
      data
    })
  },
  //单词联想搜索
  searchRelatedWords: (data) => {
    return new request({
      url: api + '/api/associate/search/word',
      data
    })
  },
  //单词详情
  wordDetail: (data) => {
    return new request({
      url: api + '/api/new/words/detail',
      data
    })
  },
  //添加生词本
  addNewWord: (data) => {
    return new request({
      url: api + '/api/new/words/add',
      data
    })
  },
  //移除生词本
  removeNewWord: (data) => {
    return new request({
      url: api + '/api/new/words/remove',
      data
    })
  },
  //生词本列表
  newWordList: (data) => {
    return new request({
      url: api + '/api/new/words/list',
      data
    })
  },
  //生词本详情
  newWordDetail: (data) => {
    return new request({
      url: api + '/api/new/words/detail',
      data
    })
  },
  //每日单词列表
  dailyWord: (data) => {
    return new request({
      url: api + '/api/list/words',
      data
    })
  },
  //提交已学单词
  commitWords: (data) => {
    return new request({
      url: api + '/api/save/words/record',
      data
    })
  },
  //上报接口
  reportQuestion: (data) => {
    return new request({
      url: api + '/api/opinion/record',
      data
    })
  },
  //书籍类别列表
  bookTypeLisk: (data) => {
    return new request({
      url: api + '/api/book/type/list',
      data
    })
  },
  //保存缓存
  saveCache:(data) => {
    return new request({
      url: api + '/api/modify/cache/record',
      data
    })
  },
//清除缓存
  deleteCache: (data) => {
    return new request({
      url: api + '/api/delete/all/cache',
      data
    })
  }

}
