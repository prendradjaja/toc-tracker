const homePage = {template: `
  <div>home</div>
`};
const bookPage = {template: `
  <div>book {{ $route.params.id }}</div>
`};


const routes = [
  { path: '/', component: homePage },
  { path: '/book/:id', component: bookPage }
]

const router = new VueRouter({
  routes
})

const app = new Vue({
  router,
  el: '#app'
})
