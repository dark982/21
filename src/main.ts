import { createApp } from 'vue'
import App from '@/App.vue'

import bootstrap from 'bootstrap'
import './assets/styles/main.scss'
import './assets/styles/bootstrap.scss'

import Router from './Router';
import Store from './store/MainStore';


const app = createApp(App);



app.use(Router)
app.use(Store)

export { Store }

app.mount('#app')
