import { shallowMount } from '@vue/test-utils';
import CommentList from '../src/components/CommentList.vue';


describe('CommentList', () => {
  // mount component
  const wrapper = shallowMount(CommentList, {
    propsData: {
      submission: {
        id: 1,
        fetch: jest.fn().mockResolvedValue({ comments: [{ id: 3 }] }),
      },
    },
  });

  // submissions will have comments
  describe('initial state', () => {
    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      expect(typeof CommentList.data).toBe('function');
      expect(wrapper.vm.comments).toHaveLength(1);
      expect(wrapper.vm.loading).toBe(false);
    });

    test('renders correct markup', () => {
      expect(wrapper.contains('submission-stub')).toBe(true);
      expect(wrapper.contains('ul')).toBe(true);
      expect(wrapper.findAll('comment-stub')).toHaveLength(1);
    });
  });

  test('renders correctly when loading new comments', () => {
    wrapper.vm.comments = [
      { id: 1 },
      { id: 2 },
    ];

    // present
    expect(wrapper.contains('submission-stub')).toBe(true);
    expect(wrapper.contains('ul')).toBe(true);
    expect(wrapper.findAll('comment-stub')).toHaveLength(2);
  });
});
