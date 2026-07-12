import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// 引入超时判断、登出方法
import { isLoginTimeout, logoutAndRedirect } from '../utils/authTimeout'

const router = createRouter({
    // history: createWebHistory(),//h5
    history: createWebHashHistory(),//app
    routes: [
        // 前台
        { path: "/", component: () => import('../view/index/index.vue') },
        { path: "/index", component: () => import('../view/index/index.vue') },
        { path: "/login", component: () => import('../view/index/login.vue') },
        { path: "/register", component: () => import('../view/index/register.vue') },
        { path: "/artist", component: () => import('../view/index/artist.vue') },
        { path: "/dynamicIndex", component: () => import('../view/index/dynamicIndex.vue') },
        { path: "/message/:id", component: () => import('../view/index/message.vue') },
        { path: "/contacts", component: () => import('../view/index/contacts.vue') },
        { path: "/user", component: () => import('../view/index/user.vue') },
        { path: "/contactdetails/:id", component: () => import('../view/index/contactdetails.vue') },
        { path: "/user_datingorders", component: () => import('../view/index/user_datingorders.vue') },
        { path: "/user_vip", component: () => import('../view/index/user_vip.vue') },
        { path: "/user_membership", component: () => import('../view/index/user_membership.vue') },
        { path: "/user_withdraw", component: () => import('../view/index/user_withdraw.vue') },
        { path: "/user_resetpass", component: () => import('../view/index/user_resetpass.vue') },
        { path: "/user_resrtpaypass", component: () => import('../view/index/user_resrtpaypass.vue') },
        { path: "/user_recharge", component: () => import('../view/index/user_recharge.vue') },
        { path: "/rpaymentconfirm", component: () => import('../view/index/rpaymentconfirm.vue') },
        { path: "/cardlist", component: () => import('../view/index/cardlist.vue') },
        { path: "/addcard", component: () => import('../view/index/addcard.vue') },
        { path: "/userinfo", component: () => import('../view/index/userinfo.vue') },
        { path: "/datingcark", component: () => import('../view/index/datingcark.vue') },
        { path: "/shop", component: () => import('../view/index/shop.vue') },

        { path: "/DownloadPage", component: () => import('../view/DownloadPage.vue') },
         { path: "/AndroidPage", component: () => import('../view/AndroidPage.vue') },
        // 后台
        {
            path: "/admin_index",
            component: () => import('../view/admin/admin_index.vue'),
            children: [
                { path: "/admin_rueixisk", component: () => import('../view/admin/admin_rueixisk.vue') },
                { path: "/admin_publiczl", component: () => import('../view/admin/admin_publiczl.vue') },
                { path: "/admin_ruklose", component: () => import('../view/admin/admin_ruklose.vue') },
                { path: "/admin_user", component: () => import('../view/admin/admin_user.vue') },
                { path: "/admin_contacts", component: () => import('../view/admin/admin_contacts.vue') },
                { path: "/admin_suoruotoji", component: () => import('../view/admin/admin_suoruotoji.vue') },
                { path: "/admin_message", component: () => import('../view/admin/admin_message.vue') },
                {
                    path: "/admin_shopindex",
                    component: () => import('../view/admin/admin_shopindex.vue'),
                    children: [
                        { path: "/admin_shop", component: () => import('../view/admin/admin_shop.vue') },
                        { path: "/admin_goodsmanage", component: () => import('../view/admin/admin_goodsmanage.vue') },
                    ]
                },
            ]
        },
        { path: "/admin_login", component: () => import('../view/admin/admin_login.vue') },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return { el: to.hash, behavior: 'instant' }
        }
        return { top: 0, left: 0, behavior: 'instant' }
    }
})

// 路由全局前置守卫
router.beforeEach(async (to, from, next) => {
    const user = localStorage.getItem('user')    // 前台用户登录态
    const admin = localStorage.getItem('adminuser') // 后台管理员登录态

    // ========== 1. 后台路由拦截 ==========
    if (to.path.startsWith('/admin')) {
        if (user) {
            next('/login')
            return
        }
        if (to.path === '/admin_login') {
            next()
            return
        }
        admin ? next() : next('/admin_login')
        return
    }

    // ========== 2. 前台路由拦截 ==========
    // 后台已登录，禁止访问前台
    if (admin) {
        next('/admin_login')
        return
    }

    // 公开路由
    const publicPages = ['/login', '/register','/DownloadPage','/AndroidPage']
    const purePath = to.path.split('?')[0]
    const isPublic = publicPages.includes(purePath)
    if (isPublic) {
        next()
        return
    }

    // 未登录，跳登录页
    if (!user) {
        next('/login')
        return
    }

    // 已登录：二次校验是否超时，超时则执行登出并跳转
    if (isLoginTimeout()) {
        await logoutAndRedirect(router)
        next('/login')
        return
    }

    // 全部校验通过，正常放行
    next()
})

export default router