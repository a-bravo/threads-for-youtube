import { shallowMount } from '@vue/test-utils';
import Comment from '../src/components/Comment.vue';
import { YT_LINK_CLASS, OPTIONS } from '../src/constants';


// Constants

const ABOVE_SCORE_THRESHOLD = OPTIONS.COMMENT_SCORE_THRESHOLD + 1;
const BELOW_SCORE_THRESHOLD = OPTIONS.COMMENT_SCORE_THRESHOLD - 1;
const COMMENT_HIDDEN_MESSAGE = 'comment score below threshold';

describe('Comment', () => {
  // mount component
  const wrapper = shallowMount(Comment, {
    propsData: {
      item: {
        id: 1,
        author: {
          name: 'test',
        },
        score: ABOVE_SCORE_THRESHOLD,
        created_utc: 23142131,
        body: 'test',
        permalink: 'link',
        replies: [],
      },
      options: OPTIONS,
    },
  });

  describe('initial state', () => {
    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has correct data', () => {
      expect(wrapper.vm.isOpen).toBe(true);
      expect(wrapper.vm.options).toStrictEqual(OPTIONS);
    });

    test('renders correct markup', () => {
      expect(wrapper.contains('li')).toBe(true);
      expect(wrapper.contains('ul')).toBe(true);
      expect(wrapper.find('.body').isVisible()).toBe(true);

      // no replies
      expect(wrapper.contains('comment-stub')).toBe(false);

      // comment not hidden
      expect(wrapper.html()).not.toContain(COMMENT_HIDDEN_MESSAGE);
      expect(wrapper.contains('.body')).toBe(true);
      expect(wrapper.contains('.collapsed')).toBe(false);
      expect(wrapper.find('.body').isVisible()).toBe(true);
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

  describe('renders correctly when comment is collapsed', () => {
    test('user collapses comment', () => {
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
      wrapper.find(`a.${YT_LINK_CLASS}`).trigger('click');

      // elements still present
      expect(wrapper.contains('li')).toBe(true);
      expect(wrapper.contains('ul')).toBe(true);
      expect(wrapper.contains('.body')).toBe(true);
      expect(wrapper.contains('.links')).toBe(true);
      expect(wrapper.findAll('comment-stub')).toHaveLength(2);

      // elements not visible
      expect(wrapper.contains('.collapsed')).toBe(true);
      expect(wrapper.find('ul').isVisible()).toBe(false);
      expect(wrapper.find('.body').isVisible()).toBe(false);
      expect(wrapper.find('.links').isVisible()).toBe(false);
      expect(wrapper.find('comment-stub').isVisible()).toBe(false);
      expect(wrapper.html()).not.toContain(COMMENT_HIDDEN_MESSAGE);
    });

    test('comment is hidden due to score', () => {
      wrapper.setProps({
        item: {
          id: 1,
          author: {
            name: 'test',
          },
          score: BELOW_SCORE_THRESHOLD,
          created_utc: 23142131,
          body: 'test',
          permalink: 'link',
          replies: [
            { id: 2 },
            { id: 3 },
          ],
        },
      });

      // elements still present
      expect(wrapper.contains('li')).toBe(true);
      expect(wrapper.contains('ul')).toBe(true);
      expect(wrapper.contains('.body')).toBe(true);
      expect(wrapper.contains('.links')).toBe(true);
      expect(wrapper.findAll('comment-stub')).toHaveLength(2);
      expect(wrapper.html()).toContain(COMMENT_HIDDEN_MESSAGE);


      // elements not visible
      expect(wrapper.contains('.collapsed')).toBe(true);
      expect(wrapper.find('ul').isVisible()).toBe(false);
      expect(wrapper.find('.body').isVisible()).toBe(false);
      expect(wrapper.find('.links').isVisible()).toBe(false);
      expect(wrapper.find('comment-stub').isVisible()).toBe(false);
    });
  });
});
