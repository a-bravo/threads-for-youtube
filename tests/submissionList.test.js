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
      expect(wrapper.contains('ul')).toBe(true);
      expect(wrapper.html()).not.toContain(emptyCommentsMessage());
      expect(wrapper.contains(moreThreadsButton)).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
    });
  });

  describe('renders correctly when adding few submissions', () => {
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
