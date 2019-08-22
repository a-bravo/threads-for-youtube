import { shallowMount } from '@vue/test-utils';
import Comment from '../src/components/Comment.vue';


describe('Comment', () => {
  // mount component
  const wrapper = shallowMount(Comment, {
    propsData: {
      item: {
        id: 1,
        author: {
          name: 'test',
        },
        score: 9,
        created_utc: 23142131,
        body: 'test',
        permalink: 'link',
        replies: [],
      },
    },
  });

  describe('initial state', () => {
    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('renders correct markup', () => {
      expect(wrapper.contains('li')).toBe(true);
      expect(wrapper.contains('ul')).toBe(true);

      // no replies
      expect(wrapper.contains('comment-stub')).toBe(false);
    });
  });

  test('renders correctly when comment has replies', () => {
    wrapper.setProps({
      item: {
        id: 1,
        author: {
          name: 'test',
        },
        score: 9,
        created_utc: 23142131,
        body: 'test',
        permalink: 'link',
        replies: [
          { id: 2 },
          { id: 3 },
        ],
      },
    });

    expect(wrapper.contains('li')).toBe(true);
    expect(wrapper.contains('ul')).toBe(true);

    expect(wrapper.findAll('comment-stub')).toHaveLength(2);
  });
});
