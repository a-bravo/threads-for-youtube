import { shallowMount } from '@vue/test-utils';
import Submission from '../src/components/Submission.vue';
import { OPTIONS } from '../src/constants';


describe('Submission', () => {
  // mount component
  const submission = {
    title: 'test title',
    permalink: 'test permalink',
    num_comments: 0,
    created_utc: Date.now(),
    subreddit_name_prefixed: 'test subreddit',
    author: 'test',
  };
  const wrapper = shallowMount(Submission, {
    propsData: {
      submission,
      showFlair: OPTIONS.SHOW_POST_FLAIR,
    },
  });

  describe('initial state', () => {
    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      expect(wrapper.vm.submission).toBe(submission);
    });
  });
});
