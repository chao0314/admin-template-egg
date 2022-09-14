import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SingIn from '../components/home/SingIn.vue';
import SingUp from '../components/home/SingUp.vue';
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
                    path: '',
                    name: 'singIn',
                    component: SingIn
                }, {
                    path: 'singUp',
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
