import {createRouter, createWebHistory} from 'vue-router';
import SingView from '../views/SingView.vue';
import SingIn from '../components/sing/SingIn.vue';
import SingUp from '../components/sing/SingUp.vue';

const HomeView = () => import(/* webpackChunkName: "home" */'../views/HomeView.vue');
const HomeIndex = () => import(/* webpackChunkName: "home" */'../components/home/HomeIndex.vue');
const UserIndex = () => import(/* webpackChunkName: "home" */'../components/user/UserList.vue');
const UserList = () => import(/* webpackChunkName: "home" */'../components/user/UserList.vue');
const PermissionIndex = () => import(/* webpackChunkName: "home" */'../components/permission/PermissionIndex.vue');
const PermissionRole = () => import(/* webpackChunkName: "home" */'../components/permission/PermissionRole.vue');
const PermissionList = () => import(/* webpackChunkName: "home" */'../components/permission/PermissionList.vue');
// const UserView = () => import(/* webpackChunkName: "user" */'../views/UserView.vue');
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            children: [
                {
                    path: 'index',
                    name: 'homeIndex',
                    component: HomeIndex
                }, {
                    path: 'user',
                    name: 'user',
                    component: UserIndex,
                    children: [{
                        path: 'list',
                        name: 'userList',
                        component: UserList
                    }]
                }, {
                    path: 'permission',
                    name: 'permission',
                    component: PermissionIndex,
                    children: [
                        {
                            path: 'role',
                            name: 'permissionRole',
                            component: PermissionRole
                        }, {
                            path: 'list',
                            name: 'permissionList',
                            component: PermissionList
                        }
                    ]
                }
            ]
        },

        {
            path: '/sing',
            name: 'sing',
            component: SingView,
            children: [
                {
                    path: 'in',
                    name: 'singIn',
                    component: SingIn
                }, {
                    path: 'up',
                    name: 'singUp',
                    component: SingUp

                }
            ]
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        }]
})

export default router
