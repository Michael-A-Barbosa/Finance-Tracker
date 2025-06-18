import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Importe do bootstrap-vue-next
import BootstrapVueNext from 'bootstrap-vue-next'

// Importe os estilos CSS do Bootstrap 5 primeiro
import 'bootstrap/dist/css/bootstrap.min.css'
// Depois, os estilos do BootstrapVueNext
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)
app.use(router)
app.use(store)

// Use o BootstrapVueNext
app.use(BootstrapVueNext)

app.mount('#app')