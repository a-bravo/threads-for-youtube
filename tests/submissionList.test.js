import { shallowMount } from '@vue/test-utils';
import SubmissionList from '../src/components/SubmissionList.vue';
import { OPTIONS } from '../src/constants';


// Constants

const moreThreadsButton = '#more-threads-button';


describe('SubmissionList', () => {
  // mount component
  const wrapper = shallowMount(SubmissionList, {
    propsData: {
      submissions: [],
      loading: true,
      apiError: false,
      options: OPTIONS,
    },
  });

  describe('initial state', () => {
    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      wrapper.setProps({
        loading: true,
        apiError: false,
        submissions: [],
      });

      expect(typeof SubmissionList.data).toBe('function');
      expect(wrapper.vm.submissions).toHaveLength(0);
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
      expect(wrapper.contains(moreThreadsButton)).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
    });
  });

  describe('renders correctly when adding few submissions', () => {
    wrapper.setProps({
      loading: false,
      apiError: false,
      submissions: [
        { data: { id: 1, num_comments: 10 } },
        { data: { id: 2, num_comments: 5 } },
      ],
    });

    expect(wrapper.findAll('submission-stub')).toHaveLength(2);
    expect(wrapper.contains(moreThreadsButton)).toBe(false);
  });

  describe('renders correctly when adding more than maxIndex submissions', () => {
    wrapper.setProps({
      loading: false,
      apiError: false,
      submissions: [
        { data: { id: 1, num_comments: 10 } },
        { data: { id: 2, num_comments: 5 } },
      ],
    });
    wrapper.vm.maxIndex = 1;

    expect(wrapper.findAll('submission-stub')).toHaveLength(1);
    expect(wrapper.contains(moreThreadsButton)).toBe(true);
  });

  describe('show more submission-stubs when user clicks More Threads button', () => {
    wrapper.setProps({
      loading: false,
      apiError: false,
    });

    test('with 1 more thread to show', () => {
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: 10 } },
          { data: { id: 2, num_comments: 5 } },
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
          { data: { id: 1, num_comments: 10 } },
          { data: { id: 2, num_comments: 5 } },
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
