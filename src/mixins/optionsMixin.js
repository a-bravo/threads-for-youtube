import defaults from 'lodash/defaults';
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
      this.$browser.storage.sync.get('options')
        .then((item) => {
          this.options = defaults(item.options, OPTIONS);
        });
    },
  },
};
