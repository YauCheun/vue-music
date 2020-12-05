import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = 'http://catbk.cn:3000'
axios.defaults.withCredentials = true
axios.defaults.crossDomain = true
axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  if (config.method === 'post') {
    config.data = qs.stringify({
      ...config.data
    })
  }
  return config;
})
