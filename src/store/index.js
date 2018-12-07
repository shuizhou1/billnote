import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  billNote_id: null, // 账本id
  category_id: '', // 一级分类id
  subdivide_id: '',// 二级分类id
  dateFormat: '', // 格式化的日期
// 账单详情页及添加账单页的数据
  radio: '2',   
  billNum: '',   
  billRemarks: '', // 备注
  date: '',
  id: '',
//
  themeColor: '', //账本主题色
  categoryArr: [],
  categoryStreamData: [],
  billcategoryParams: {
    superID: '',
    subdivideID: '',
    superName: '',
    subdivide: '',
    icon: ''
  }
}
const getters = {

}
const mutations = {
  formatDate(state, obj) {
    // 给个位的月份和天数前面加零
    this.dealMonthDay = function(value) {
      let dealValue;
      if (value < 10) {
        dealValue = "0" + value;
      } else {
        dealValue = value;
      }
      return dealValue;
    }
    let [year, month, day, dateStr] = [
      obj.date.getFullYear(),
      obj.date.getMonth()+1,
      obj.date.getDate(),
    ]
    let trim = ' ' // 空格（带数字的时间需要空格）
    if (obj.isDay) {
      if (obj.isCn) {
        dateStr = `${year}年${trim}${month}月${trim}${day}日`
      } else {
        // let deal = this.dealMonthDay
        month =  this.dealMonthDay(month)
        day = this.dealMonthDay(day)
        dateStr = `${year}-${month}-${day}`      
      }
    } else {
      if (obj.isCn) {
        dateStr = `${year}年${trim}${month}月`
      } else {
        month = this.dealMonthDay(month)
        day = this.dealMonthDay(day)
        dateStr = `${year}-${month}`
      }
    }
    state.dateFormat = dateStr
  },
 
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
})
