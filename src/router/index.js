import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import ViewContact from '@/components/ViewContact'
import FullList from '@/components/FullList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/full-list',
      name: 'full-list',
      component: FullList
    },
    {
      path: '/:person',
      name: 'view-contact',
      component: ViewContact
    }
  ]
})
