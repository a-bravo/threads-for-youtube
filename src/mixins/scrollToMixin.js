import { YT_NAVBAR_ID } from '../constants';

export default {
  data() {
    return {
      YT_NAVBAR_ID,
    };
  },
  methods: {
    scrollTo(id) {
      // scroll to element with id, accounting for YT navbar
      const target = document.getElementById(id);
      const navHeight = document.getElementById(YT_NAVBAR_ID).offsetHeight;

      window.scroll(0, target.offsetTop - navHeight);
    },
  },
};
