<script>
export default {
  activated() {
    // show comments and trigger scroll event (load comments)
    document.getElementById('comments').classList.remove('hidden');
    window.dispatchEvent(new CustomEvent('scroll'));
  },
  deactivated() {
    document.getElementById('comments').classList.add('hidden');
  },
};
</script>
