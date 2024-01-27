import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('../components/Home.vue'),
            redirect: '/home/welcome',
            children: [
                {
                    path: 'welcome',
                    name: 'welcome',
                    component: () => import('../components/welcome/Welcome.vue')
                },
                {
                    path: 'users',
                    name: 'users',
                    component: () => import('../components/users/Users.vue')
                },
                {
                    path: 'categories',
                    name: 'categories',
                    component: () => import('../components/goods/Categories.vue')
                },
                {
                    path: 'params',
                    name: 'params',
                    component: () => import('../components/goods/Params.vue')
                },
                {
                    path: 'goods',
                    name: 'goods',
                    component: () => import('../components/goods/Goods.vue')
                },
                {
                    path: 'orders',
                    name: 'orders',
                    component: () => import('../components/orders/Orders.vue')
                },
                {
                    path: 'reports',
                    name: 'reports',
                    component: () => import('../components/reports/Reports.vue')
                },
                {
                    path: 'roles',
                    name: 'roles',
                    component: () => import('../components/rights/Roles.vue')
                },
                {
                    path: 'rights',
                    name: 'rights',
                    component: () => import('../components/rights/Rights.vue')
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../components/Login.vue'),
        }
    ]
})


router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        const token = localStorage.getItem('token')
        if (token) {
            next()
        } else {
            next('/login')
        }
    }
})
export default router