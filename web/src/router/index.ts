import {createRouter, createWebHistory} from 'vue-router';
import SingView from '../views/SingView.vue';
import SingIn from '../components/sing/SingIn.vue';
import SingUp from '../components/sing/SingUp.vue';

const HomeView = () => import(/* webpackChunkName: "home" */'../views/HomeView.vue');
// const UserView = () => import(/* webpackChunkName: "user" */'../views/UserView.vue');
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeView
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
