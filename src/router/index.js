import Vue from 'vue'
import Router from 'vue-router'
import homePage from '../components/home/home.vue'
import addRecord from '../components/addRecord/addRecord.vue'
import editRecord from '../components/editRecord/editRecord.vue'
import editBillNote from '../components/editBillNote/editBillNote.vue'
import addBillNote from '../components/addBillNote/addBillNote.vue'
import billCategory from '../components/billCategory/billCategory.vue'
import selectbillNote from '../components/selectbillNote/selectbillNote.vue'
import account from '../components/account/account.vue'
import categoryStream from '../components/categoryStream/categoryStream.vue'
import expendCount from '../components/expendCount/expendCount.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/homePage'
    },
    {
      path: '/homePage',
      name: 'homePage',
      component: homePage
    },
    {
      path: '/addRecord',
      name: 'addRecord',
      component: addRecord
    },
    {
      path: '/editRecord',
      name: 'editRecord',
      component: editRecord
    },
    {
      path: '/editBillNote',
      name: 'editBillNote',
      component: editBillNote
    },
    {
      path: '/addBillNote',
      name: 'addBillNote',
      component: addBillNote
    },
    {
      path: '/billCategory',
      name: 'billCategory',
      component: billCategory
    },
    {
      path: '/selectbillNote',
      name: 'selectbillNote',
      component: selectbillNote
    },
    {
      path: '/account',
      name: 'account',
      component: account
    },
    {
      path: '/categoryStream',
      name: 'categoryStream',
      component: categoryStream
    },
    {
      path: '/expendCount',
      name: 'expendCount',
      component: expendCount
    }
  ]
})
