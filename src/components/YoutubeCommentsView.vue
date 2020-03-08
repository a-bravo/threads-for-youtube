<script>
import { YT_COMMENTS_ID } from '../constants';

export default {
  mounted() {
    // show comments and trigger scroll event (load comments)
    document.getElementById(YT_COMMENTS_ID).classList.remove('hidden');
    window.dispatchEvent(new CustomEvent('scroll'));
  },
  beforeDestroy() {
    document.getElementById(YT_COMMENTS_ID).classList.add('hidden');
  },
};
</script>
