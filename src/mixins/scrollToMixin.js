import { YT_NAVBAR_ID } from '../constants';

export default {
  data() {
    return {
      YT_NAVBAR_ID,
    };
  },
  methods: {
    scrollTo(id, ignoreInView = false) {
      // scroll to element with id, accounting for YT navbar
      const target = document.getElementById(id);
      const navHeight = document.getElementById(YT_NAVBAR_ID).offsetHeight;

      if (ignoreInView && target.getBoundingClientRect().top - navHeight > 0) {
        // if el in view then dont scroll
        return;
      }

      window.scroll(0, target.offsetTop - navHeight);
    },
  },
};
