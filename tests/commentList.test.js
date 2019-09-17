import { shallowMount } from '@vue/test-utils';
import CommentList from '../src/components/CommentList.vue';
import { OPTIONS } from '../src/constants';


describe('CommentList', () => {
  // mount component
  const wrapper = shallowMount(CommentList, {
    propsData: {
      submission: { id: 1 },
      options: OPTIONS,
    },
  });

  // submissions will have comments
  describe('initial state', () => {
    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      expect(typeof CommentList.data).toBe('function');
      expect(wrapper.vm.comments).toBe(null);
      expect(wrapper.vm.loading).toBe(true);
      expect(wrapper.vm.options).toStrictEqual(OPTIONS);
    });

    test('renders correct markup', () => {
      expect(wrapper.contains('spinner-stub')).toBe(true);
      expect(wrapper.contains('submission-stub')).toBe(true);

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.findAll('comment-stub')).toHaveLength(0);
    });
  });

  test('renders correctly when loading new comments', () => {
    wrapper.vm.comments = [
      { data: { id: 1 }, kind: 'test' },
      { data: { id: 2 }, kind: 'test' },
    ];
    wrapper.vm.loading = false;

    // present
    expect(wrapper.contains('submission-stub')).toBe(true);
    expect(wrapper.contains('ul')).toBe(true);
    expect(wrapper.findAll('comment-stub')).toHaveLength(2);
  });

  describe('renders correctly on edge cases', () => {
    test('on api error', () => {
      wrapper.vm.apiError = true;
      wrapper.vm.loading = false;
      wrapper.vm.comments = [];

      expect(wrapper.html()).toContain('Could not reach reddit. Try again later.');

      expect(wrapper.contains('submission-stub')).toBe(true);
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.findAll('comment-stub')).toHaveLength(0);
    });

    test('on load no results', () => {
      wrapper.vm.apiError = false;
      wrapper.vm.loading = false;
      wrapper.vm.comments = [];


      expect(wrapper.html()).toContain('there doesn\'t seem to be anything here');

      expect(wrapper.contains('submission-stub')).toBe(true);
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.findAll('comment-stub')).toHaveLength(0);
    });
  });
});
