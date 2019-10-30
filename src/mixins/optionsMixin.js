import defaultsDeep from 'lodash/defaultsDeep';
import { OPTIONS } from '../constants';

export default {
  data() {
    return {
      options: {},
    };
  },
  created() {
    this.getOptions();
  },
  methods: {
    getOptions() {
      this.$browser.storage.local.get('options')
        .then((item) => {
          this.options = defaultsDeep(item.options, OPTIONS);
        });
    },
  },
};
