import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './AppWrapper.vue'
import router from './router'

import '@csstools/normalize.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
