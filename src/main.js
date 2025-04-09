import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'
// vant 样式
import 'vant/lib/index.css'
import 'uno.css'
import './style/index.less'
import { Icon } from 'vant'
// import Vconsole from 'vconsole'

createApp(App).use(store).use(router).use(Icon).mount('#app')
