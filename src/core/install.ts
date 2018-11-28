// import VueSample from './VueSample/VueSample.js'
import VueCrontab from './index'

export default install;

function install (_vue: any) {
  console.log('install()')
  // console.log(this.options)

  _vue.mixin({
    created: function() {
      // console.log('install created()')
    },
    updated: function() {
      // console.log('install updated()')
    },
  })

  _vue.prototype.$crontab = VueCrontab.getInstance()
}
