import { shallowMount } from '@vue/test-utils';
import SubmissionList from '../src/components/SubmissionList.vue';


// Constants

const moreThreadsButton = '#more-threads-button';
const emptyCommentsMessage = (num) => {
  const message = 'empty comment thread(s) hidden.';
  return num !== undefined ? `${num} ${message}` : message;
};


describe('SubmissionList', () => {
  // mount component
  const wrapper = shallowMount(SubmissionList, {
    propsData: {
      submissions: [],
      loading: true,
      apiError: false,
    },
  });

  describe('initial state', () => {
    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      expect(typeof SubmissionList.data).toBe('function');
      expect(wrapper.vm.submissions).toHaveLength(0);
      expect(wrapper.vm.hiddenSubmissions).toHaveLength(0);
      expect(wrapper.vm.visibleSubmissions).toHaveLength(0);
    });

    test('renders correct markup', () => {
      wrapper.setProps({
        apiError: false,
        loading: true,
        submissions: [],
      });
      // present
      expect(wrapper.contains('spinner-stub')).toBe(true);

      // not present
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.html()).not.toContain(emptyCommentsMessage());
      expect(wrapper.contains(moreThreadsButton)).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
    });
  });

  describe('renders correctly on edge cases', () => {
    test('on api error', () => {
      wrapper.setProps({
        apiError: true,
        loading: false,
        submissions: [],
      });

      expect(wrapper.html()).toContain('Could not reach reddit. Try again later.');

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.html()).not.toContain(emptyCommentsMessage());
      expect(wrapper.contains(moreThreadsButton)).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
    });

    test('on load no results', () => {
      wrapper.setProps({
        loading: false,
        apiError: false,
        submissions: [],
      });

      expect(wrapper.html()).toContain('No posts.');

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.html()).not.toContain(emptyCommentsMessage());
      expect(wrapper.contains(moreThreadsButton)).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
    });
  });

  describe('renders correctly when adding few submissions', () => {
    wrapper.setProps({
      loading: false,
      apiError: false,
    });

    test('with no comments', () => {
      wrapper.setProps({
        submissions: [
          { id: 1, num_comments: 0 },
          { id: 2, num_comments: 0 },
        ],
      });

      expect(wrapper.contains('submission-stub')).toBe(false);
      expect(wrapper.html()).toContain(emptyCommentsMessage(2));
    });

    test('with comments', () => {
      wrapper.setProps({
        submissions: [
          { id: 1, num_comments: 10 },
          { id: 2, num_comments: 5 },
        ],
      });

      expect(wrapper.findAll('submission-stub')).toHaveLength(2);
      expect(wrapper.html()).not.toContain(emptyCommentsMessage());
      expect(wrapper.contains(moreThreadsButton)).toBe(false);
    });

    test('with mixed comments and no comments', () => {
      wrapper.setProps({
        submissions: [
          { id: 1, num_comments: 10 },
          { id: 2, num_comments: 0 },
        ],
      });

      expect(wrapper.findAll('submission-stub')).toHaveLength(1);
      expect(wrapper.html()).toContain(emptyCommentsMessage(1));
    });
  });

  describe('renders correctly when adding more than maxIndex submissions', () => {
    wrapper.setProps({
      loading: false,
      apiError: false,
    });

    test('with no comments', () => {
      wrapper.setProps({
        submissions: [
          { id: 1, num_comments: 0 },
          { id: 2, num_comments: 0 },
        ],
      });
      wrapper.vm.maxIndex = 1;

      expect(wrapper.contains('submission-stub')).toBe(false);
      expect(wrapper.html()).toContain(emptyCommentsMessage(2));
    });

    test('with comments', () => {
      wrapper.setProps({
        submissions: [
          { id: 1, num_comments: 10 },
          { id: 2, num_comments: 5 },
        ],
      });
      wrapper.vm.maxIndex = 1;

      expect(wrapper.findAll('submission-stub')).toHaveLength(1);
      expect(wrapper.contains(moreThreadsButton)).toBe(true);
    });

    test('with mixed comments and no comments', () => {
      wrapper.setProps({
        submissions: [
          { id: 1, num_comments: 10 },
          { id: 2, num_comments: 0 },
        ],
      });
      wrapper.vm.maxIndex = 1;

      expect(wrapper.findAll('submission-stub')).toHaveLength(1);
      expect(wrapper.html()).toContain(emptyCommentsMessage(1));
    });
  });

  describe('show more submission-stubs when user clicks More Threads button', () => {
    wrapper.setProps({
      loading: false,
      apiError: false,
    });

    test('with 1 more thread to show', () => {
      wrapper.setProps({
        submissions: [
          { id: 1, num_comments: 10 },
          { id: 2, num_comments: 5 },
        ],
      });
      wrapper.vm.maxIndex = 1;

      const more = wrapper.find(moreThreadsButton);
      expect(wrapper.findAll('submission-stub')).toHaveLength(1);

      more.trigger('click');

      expect(wrapper.findAll('submission-stub')).toHaveLength(2);
      expect(wrapper.contains(moreThreadsButton)).toBe(false);
    });

    test('with more threads to show', () => {
      wrapper.setProps({
        submissions: [
          { id: 1, num_comments: 10 },
          { id: 2, num_comments: 5 },
        ],
      });
      wrapper.vm.maxIndex = -9;

      const more = wrapper.find(moreThreadsButton);
      expect(wrapper.findAll('submission-stub')).toHaveLength(0);

      more.trigger('click');

      expect(wrapper.findAll('submission-stub')).toHaveLength(1);
      expect(wrapper.contains(moreThreadsButton)).toBe(true);
    });
  });
});
