import Vue from 'vue'
import Router from 'vue-router'
import Marketing from '@/components/Marketing'
import Home from '@/components/Home'
import ViewContact from '@/components/ViewContact'
import FullList from '@/components/FullList'
import SchoolSelect from '@/components/SchoolSelect'
import { getSchoolId } from '@/utils/school'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'marketing',
      component: Marketing
    },
    {
      path: '/school-select',
      name: 'school-select',
      component: SchoolSelect
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: { requiresSchool: true }
    },
    {
      path: '/full-list',
      name: 'full-list',
      component: FullList,
      meta: { requiresSchool: true }
    },
    {
      path: '/:person',
      name: 'view-contact',
      component: ViewContact,
      meta: { requiresSchool: true }
    }
  ]
})

// Route guard to check for school ID
router.beforeEach((to, from, next) => {
  const requiresSchool = to.matched.some(record => record.meta.requiresSchool)
  const schoolId = getSchoolId()

  if (requiresSchool && !schoolId) {
    // Redirect to school select if no school ID
    next('/school-select')
  } else if (to.path === '/school-select' && schoolId) {
    // Redirect to home if already has school ID
    next('/home')
  } else {
    next()
  }
})

export default router
