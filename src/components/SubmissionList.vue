<template>
  <ul class="submission-list">
    <submission
      v-for="submission in visibleSubmissions.slice(0, maxIndex)"
      :key="submission.id"
      :submission="submission"
    />

    <li
      v-if="!isFinished"
      class="submission"
    >
      <button
        v-if="!loading"
        id="more-threads-button"
        @click="fetchMore"
      >
        More Threads
      </button>

      <div v-else>
        loading...
      </div>
    </li>

    <li
      v-else-if="hiddenSubmissions.length"
      class="submission"
    >
      <div class="meta">
        {{ hiddenSubmissions.length }} empty comment thread(s) hidden.
      </div>
    </li>
  </ul>
</template>

<script>
import Submission from './Submission.vue';

export default {
  components: {
    Submission,
  },
  props: {
    submissions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      maxIndex: 10,
      loading: false,
    };
  },
  computed: {
    hiddenSubmissions() {
      return this.submissions.filter(submission => submission.num_comments < 1);
    },
    visibleSubmissions() {
      return this.submissions.filter(submission => submission.num_comments >= 1);
    },
    isFinished() {
      return this.maxIndex >= this.visibleSubmissions.length;
    },
  },
  watch: {
    submissions() {
      this.maxIndex = 10;
    },
  },
  methods: {
    fetchMore() {
      this.loading = true;
      this.maxIndex += 10;
      this.loading = false;
    },
  },
};
</script>

<style>
.submission-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
