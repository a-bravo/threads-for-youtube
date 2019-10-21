/**
 * @file options page entrypoint, mount options app
 */

import Vue from 'vue';
import browser from 'webextension-polyfill';
import Options from './Options.vue';

Vue.prototype.$browser = browser;
new Vue({ // eslint-disable-line no-new
  el: '#options-app',
  render: h => h(Options),
});
