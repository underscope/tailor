/* eslint-disable sort-imports */
import '@babel/polyfill';
import 'dom-shims/shim/Element.classList';
import 'dom-shims/shim/Element.mutation';
import 'event-source-polyfill';
import 'bootstrap-sass/assets/javascripts/bootstrap';

import assetsApi from '@/api/asset';
import colors from 'vuetify/es5/util/colors';
import ElementRegistry from './ElementRegistry';

import { formatDate, truncate } from '@/filters';
import FileFilter from '@/directives/file-filter';
import QuestionContainer from 'tce-core/QuestionContainer';
import { sync } from 'vuex-router-sync';
import Timeago from 'vue-timeago';
import VeeValidate from './utils/validation';
import Vue from 'vue';
import VueHotkey from 'v-hotkey';
import Vuetify from 'vuetify';
import VuetifySnackbar from '@/plugins/vuetify-snackbar';

import store from './store';
import router from './router';
import App from './App';

Vue.component('tce-question-container', QuestionContainer);
Vue.filter('formatDate', formatDate);
Vue.filter('truncate', truncate);
Vue.use(FileFilter);
Vue.use(VueHotkey);
Vue.use(Vuetify, {
  iconfont: 'mdi',
  theme: {
    primary: colors.blueGrey.darken2,
    secondary: colors.pink
  },
  options: {
    customProperties: true
  }
});
Vue.use(VuetifySnackbar);
Vue.use(VeeValidate, {
  delay: 700,
  fieldsBagName: 'vFields',
  errorBagName: 'vErrors',
  inject: false
});
Vue.use(Timeago, {
  locale: 'en-US',
  locales: {
    'en-US': require('@/assets/locales/timeago-en-US-short.json')
  }
});

const registry = new ElementRegistry(Vue);
registry.initialize().then(() => {
  sync(store, router);
  /* eslint-disable no-new */
  new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App),
    provide() {
      return {
        $teRegistry: registry,
        $storageService: assetsApi
      };
    }
  });
});
