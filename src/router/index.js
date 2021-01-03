import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import discovery from '_c/discovery'
import playlists from '_c/playlists'
import detaillist from '_c/detaillist'
import songs from '_c/songs'
import mvs from '_c/mvs'
import ranking from '_c/ranking'
import singers from '_c/singers'
import mvdetail from '_c/mvdetail'
import result from '_c/result'
import singerdetail from '_c/singerdetail'
import ablumlist from '_c/ablumlist'




export default new Router({
  routes: [
    { path: '/',redirect:'/discovery'}, 
    { path: '/discovery',component: discovery},
    { path: '/playlists',component: playlists},
    { path: '/detaillist',component: detaillist},
    { path: '/songs',component: songs},
    { path: '/mvs',component: mvs},
    { path: '/mvdetail',component: mvdetail},
    { path: '/ranking',component: ranking},
    { path: '/singers',component: singers},
    { path: '/result',component: result},
    { path: '/singerdetail',component: singerdetail},
    { path: '/ablumlist',component: ablumlist}
  ]
})
