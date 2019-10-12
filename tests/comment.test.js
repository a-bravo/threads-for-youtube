import { shallowMount } from '@vue/test-utils';
import Comment from '../src/components/Comment.vue';
import { YT_LINK_CLASS, RT_MORE_OBJECT, OPTIONS } from '../src/constants';


// Constants

const ABOVE_SCORE_THRESHOLD = OPTIONS.COMMENT_SCORE_THRESHOLD + 1;
const BELOW_SCORE_THRESHOLD = OPTIONS.COMMENT_SCORE_THRESHOLD - 1;
const COMMENT_HIDDEN_MESSAGE = 'comment score below threshold';

const root = {
  data() {
    return {
      state: {
        comments: {},
      },
      loadComments: jest.fn().mockResolvedValue({}),
      item: {
        data: {
          permalink: '/test',
        },
      },
    };
  },
};

describe('Comment', () => {
  // mount component
  const wrapper = shallowMount(Comment, {
    propsData: {
      item: {
        data: {
          id: 1,
          author: 'test',
          score: ABOVE_SCORE_THRESHOLD,
          created_utc: 23142131,
          body: 'test',
          permalink: 'link',
        },
        comments: [],
        kind: 'Listing',
      },
      options: OPTIONS,
    },
    parentComponent: root,
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
      expect(wrapper.contains('ul.replies')).toBe(false);
      expect(wrapper.find('.body').isVisible()).toBe(true);

      // no replies
      expect(wrapper.contains('comment-stub')).toBe(false);

      // comment not hidden
      expect(wrapper.html()).not.toContain(COMMENT_HIDDEN_MESSAGE);
      expect(wrapper.contains('.body')).toBe(true);
      expect(wrapper.contains('.collapsed')).toBe(false);
      expect(wrapper.find('.body').isVisible()).toBe(true);

      // not a 'more' object
      expect(wrapper.contains('more-button-stub')).toBe(false);
    });
  });

  test('renders correctly when comment has replies', () => {
    wrapper.vm.$root.$data.state.comments = {
      2: { data: { id: 2 } },
      3: { data: { id: 3 } },
    };
    wrapper.setProps({
      item: {
        comments: ['2', '3'],
        kind: 'Listing',
        data: { score: ABOVE_SCORE_THRESHOLD },
      },
    });

    expect(wrapper.contains('li')).toBe(true);
    expect(wrapper.contains('ul.replies')).toBe(true);

    expect(wrapper.findAll('comment-stub')).toHaveLength(2);
  });

  describe('renders correctly when comment is collapsed', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.comments = {
        2: { data: { id: 2 } },
        3: { data: { id: 3 } },
      };
    });

    test('user collapses comment', () => {
      wrapper.setProps({
        item: {
          data: {
            id: 1,
            author: 'test',
            score: 9,
            created_utc: 23142131,
            body: 'test',
            permalink: 'link',
          },
          comments: ['2', '3'],
        },
      });

      // collapse comment
      wrapper.find(`a.${YT_LINK_CLASS}`).trigger('click');

      // elements still present
      expect(wrapper.contains('li')).toBe(true);
      expect(wrapper.contains('ul.replies')).toBe(true);
      expect(wrapper.contains('.body')).toBe(true);
      expect(wrapper.contains('.links')).toBe(true);
      expect(wrapper.findAll('comment-stub')).toHaveLength(2);

      // elements not visible
      expect(wrapper.contains('.collapsed')).toBe(true);
      expect(wrapper.find('ul.replies').isVisible()).toBe(false);
      expect(wrapper.find('.body').isVisible()).toBe(false);
      expect(wrapper.find('.links').isVisible()).toBe(false);
      expect(wrapper.find('comment-stub').isVisible()).toBe(false);
      expect(wrapper.html()).not.toContain(COMMENT_HIDDEN_MESSAGE);
    });

    test('comment is hidden due to score', () => {
      wrapper.setProps({
        item: {
          data: {
            id: 1,
            author: 'test',
            score: BELOW_SCORE_THRESHOLD,
            created_utc: 23142131,
            body: 'test',
            permalink: 'link',
          },
          comments: ['2', '3'],
        },
      });

      // elements still present
      expect(wrapper.contains('li')).toBe(true);
      expect(wrapper.contains('ul.replies')).toBe(true);
      expect(wrapper.contains('.body')).toBe(true);
      expect(wrapper.contains('.links')).toBe(true);
      expect(wrapper.findAll('comment-stub')).toHaveLength(2);
      expect(wrapper.html()).toContain(COMMENT_HIDDEN_MESSAGE);


      // elements not visible
      expect(wrapper.contains('.collapsed')).toBe(true);
      expect(wrapper.find('ul.replies').isVisible()).toBe(false);
      expect(wrapper.find('.body').isVisible()).toBe(false);
      expect(wrapper.find('.links').isVisible()).toBe(false);
      expect(wrapper.find('comment-stub').isVisible()).toBe(false);
    });
  });

  describe('renders correctly when comment is a reddit "more" object', () => {
    test('normal "more" object', () => {
      wrapper.setProps({
        item: {
          kind: RT_MORE_OBJECT,
          data: { count: 2 },
          moreLoading: false,
        },
      });

      expect(wrapper.contains('more-button-stub')).toBe(true);
      expect(wrapper.contains('.body')).toBe(false);
      expect(wrapper.html()).toContain('load more comments');
      expect(wrapper.html()).not.toContain('[Could not reach reddit. Try again later.]');
    });

    test('"more" object with error on load', () => {
      wrapper.setProps({
        item: {
          kind: RT_MORE_OBJECT,
          data: { count: 2 },
          moreLoading: false,
          moreError: true,
        },
      });

      expect(wrapper.contains('more-button-stub')).toBe(true);
      expect(wrapper.contains('.body')).toBe(false);
      expect(wrapper.html()).toContain('load more comments');
      expect(wrapper.html()).toContain('[Could not reach reddit. Try again later.]');
    });

    test('continue thread object', () => {
      wrapper.setProps({
        item: {
          kind: RT_MORE_OBJECT,
          data: { count: 0 },
          moreLoading: false,
        },
      });

      expect(wrapper.html()).toContain('continue this thread');
      expect(wrapper.find('a').attributes('href')).toBe('https://old.reddit.com/test');
      expect(wrapper.contains('.body')).toBe(false);
    });
  });
});
