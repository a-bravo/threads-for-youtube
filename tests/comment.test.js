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

    test('has correct data', () => {
      expect(wrapper.vm.isOpen).toBe(true);
    });

    test('renders correct markup', () => {
      expect(wrapper.contains('li')).toBe(true);
      expect(wrapper.contains('ul')).toBe(true);
      expect(wrapper.find('.body').isVisible()).toBe(true);

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

  test('renders correctly when user collapses comment', () => {
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

    // collapse comment
    wrapper.find('a.yt-simple-endpoint').trigger('click');

    // elements still present
    expect(wrapper.contains('li')).toBe(true);
    expect(wrapper.contains('ul')).toBe(true);
    expect(wrapper.contains('.body')).toBe(true);
    expect(wrapper.contains('.links')).toBe(true);
    expect(wrapper.findAll('comment-stub')).toHaveLength(2);

    // elements not visible
    expect(wrapper.find('ul').isVisible()).toBe(false);
    expect(wrapper.find('.body').isVisible()).toBe(false);
    expect(wrapper.find('.links').isVisible()).toBe(false);
    expect(wrapper.find('comment-stub').isVisible()).toBe(false);
  });
});
