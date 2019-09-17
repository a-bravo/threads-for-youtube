import { shallowMount } from '@vue/test-utils';
import SubmissionList from '../src/components/SubmissionList.vue';
import { OPTIONS } from '../src/constants';


describe('SubmissionList', () => {
  // mount component
  const wrapper = shallowMount(SubmissionList, {
    propsData: {
      submissions: [],
      loading: true,
      apiError: false,
      options: OPTIONS,
      morePosts: false,
      moreLoading: false,
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
      expect(wrapper.contains('more-button-stub')).toBe(false);
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
      expect(wrapper.contains('more-button-stub')).toBe(false);
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
      expect(wrapper.contains('more-button-stub')).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
    });
  });

  describe('renders correctly when adding submissions', () => {
    test('few submissions', () => {
      wrapper.setProps({
        loading: false,
        apiError: false,
        morePosts: false,
        submissions: [
          { data: { id: 1, num_comments: 10 } },
          { data: { id: 2, num_comments: 5 } },
        ],
      });

      expect(wrapper.findAll('submission-stub')).toHaveLength(2);
      expect(wrapper.contains('more-button-stub')).toBe(false);
    });

    test('more submissions to load', () => {
      wrapper.setProps({
        loading: false,
        apiError: false,
        moreLoading: false,
        morePosts: true,
        submissions: [
          { data: { id: 1, num_comments: 10 } },
          { data: { id: 2, num_comments: 5 } },
        ],
      });

      expect(wrapper.findAll('submission-stub')).toHaveLength(2);
      expect(wrapper.contains('more-button-stub')).toBe(true);
    });
  });
});
