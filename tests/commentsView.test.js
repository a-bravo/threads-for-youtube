import { shallowMount } from '@vue/test-utils';
import CommentsView from '../src/components/CommentsView.vue';
import { OPTIONS } from '../src/constants';

// Constants

const ABOVE_COMMENT_THRESHOLD = OPTIONS.POST_COMMENT_THRESHOLD + 1;
const BELOW_COMMENT_THRESHOLD = OPTIONS.POST_COMMENT_THRESHOLD - 1;

const root = {
  data() {
    return {
      state: {
        submissionList: [],
        submissions: { error: false, loading: true, moreLoading: false },
        comments: {},
        nextSubmission: null,
        init: false,
      },
    };
  },
};

describe('CommentsView', () => {
  // mount component
  const wrapper = shallowMount(CommentsView, {
    propsData: {
      submissions: [],
      options: OPTIONS,
    },
    parentComponent: root,
  });

  describe('initial state', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissions.loading = true;
      wrapper.vm.$root.$data.state.submissions.error = false;
      wrapper.vm.$root.$data.state.init = false;
      wrapper.setProps({ submissions: [] });
    });

    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      expect(typeof CommentsView.data).toBe('function');
      expect(wrapper.vm.submissions).toHaveLength(0);
      expect(wrapper.vm.visibleSubmissions).toHaveLength(0);
      expect(wrapper.vm.isSidebarOpen).toBe(true);
      expect(wrapper.vm.options).toStrictEqual(OPTIONS);
    });

    test('renders correct markup', () => {
      // present
      expect(wrapper.contains('spinner-stub')).toBe(true);

      // not present
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('comment-list-stub')).toBe(false);
      expect(wrapper.contains('more-button-stub')).toBe(false);
    });

    test('renders correct markup on state.init', () => {
      wrapper.vm.$root.$data.state.init = true;

      expect(wrapper.contains('spinner-stub')).toBe(false);
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('comment-list-stub')).toBe(false);
      expect(wrapper.contains('more-button-stub')).toBe(false);
    });
  });

  describe('renders correctly on edge cases', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissions.loading = false;
      wrapper.vm.$root.$data.state.submissions.error = false;
      wrapper.vm.$root.$data.state.submissions.moreLoading = false;
      wrapper.vm.$root.$data.state.nextSubmission = null;
      wrapper.vm.$root.$data.state.init = false;
      wrapper.setProps({ submissions: [] });
    });

    test('on api error', () => {
      wrapper.vm.$root.$data.state.submissions.error = true;

      expect(wrapper.html()).toContain('Could not reach reddit.');
      wrapper.find('a').trigger('click');
      expect(wrapper.emitted().reload.length).toBe(1);

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('comment-list-stub')).toBe(false);
    });

    test('on load no results', () => {
      expect(wrapper.html()).toContain('No comments.');

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('comment-list-stub')).toBe(false);
    });

    test('when adding submissions with # of comments below threshold', () => {
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: BELOW_COMMENT_THRESHOLD } },
          { data: { id: 2, num_comments: BELOW_COMMENT_THRESHOLD } },
        ],
      });

      expect(wrapper.html()).toContain('No comments.');

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('comment-list-stub')).toBe(false);
    });

    test('when there are no more submissions to load', () => {
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: 10 } },
          { data: { id: 2, num_comments: 5 } },
        ],
      });

      expect(wrapper.findAll('comment-list-stub')).toHaveLength(1);
      expect(wrapper.contains('more-button-stub')).toBe(false);
    });

    test('when there are more submissions to load', () => {
      wrapper.vm.$root.$data.state.nextSubmission = 'someId';
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: 10 } },
          { data: { id: 2, num_comments: 5 } },
        ],
      });

      expect(wrapper.findAll('comment-list-stub')).toHaveLength(1);
      expect(wrapper.contains('more-button-stub')).toBe(true);
    });
  });

  describe('renders correctly when adding submissions with # of comments above threshold', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissions.loading = false;
      wrapper.vm.$root.$data.state.submissions.moreLoading = false;
      wrapper.vm.$root.$data.state.submissions.error = false;
      wrapper.vm.$root.$data.state.nextSubmission = null;
      wrapper.vm.$root.$data.state.init = false;
    });

    test('on initial state', () => {
      // mock submissions change behavior
      wrapper.setProps({ submissions: [] });
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test' } },
          { data: { id: 2, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test2' } },
        ],
      });

      // sidebar
      expect(wrapper.contains('ul')).toBe(true);
      expect(wrapper.findAll('li')).toHaveLength(2);
      expect(wrapper.findAll('li').at(0).classes('selected')).toBe(true);
      expect(wrapper.findAll('li').at(1).classes('selected')).toBe(false);
      expect(wrapper.contains('.submissions-sidebar > div.details')).toBe(false);

      // component
      expect(wrapper.findAll('comment-list-stub')).toHaveLength(1);
    });

    test('on initial state with mixed comments(above thresh) and no comments(below thres)', () => {
      // mock submissions change behavior
      wrapper.setProps({ submissions: [] });
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: BELOW_COMMENT_THRESHOLD, subreddit: 'test' } },
          { data: { id: 2, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test2' } },
        ],
      });

      // sidebar
      expect(wrapper.contains('ul')).toBe(true);
      expect(wrapper.contains('.submissions-sidebar > div.details')).toBe(true);
      expect(wrapper.findAll('li')).toHaveLength(1);
      expect(wrapper.findAll('li').at(0).classes('selected')).toBe(true);

      // component
      expect(wrapper.findAll('comment-list-stub')).toHaveLength(1);
    });

    test('when user clicks on another sidebar-item', () => {
      // mock submissions change behavior
      wrapper.setProps({ submissions: [] });
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test' } },
          { data: { id: 2, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test2' } },
        ],
      });

      // inital sidebar
      expect(wrapper.findAll('li').at(0).classes('selected')).toBe(true);
      expect(wrapper.findAll('li').at(1).classes('selected')).toBe(false);

      // user clicks on sidebar
      wrapper.findAll('li').at(1).trigger('click');

      expect(wrapper.findAll('li').at(0).classes('selected')).toBe(false);
      expect(wrapper.findAll('li').at(1).classes('selected')).toBe(true);
    });

    test('when loading more submissions', () => {
      // mock submissions change behavior
      const firstSubmission = { data: { id: 1, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test' } };
      const secondSubmission = { data: { id: 2, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test2' } };
      wrapper.setProps({ submissions: [] });
      wrapper.setProps({
        submissions: [
          firstSubmission,
          secondSubmission,
        ],
      });

      // user clicks on sidebar
      wrapper.findAll('li').at(1).trigger('click');
      expect(wrapper.vm.currentSubmission).toStrictEqual(wrapper.vm.submissions[1]);
      expect(wrapper.findAll('li').at(0).classes('selected')).toBe(false);
      expect(wrapper.findAll('li').at(1).classes('selected')).toBe(true);

      // mock load more submissions (the first 2 object remain the same, mocking a push)
      wrapper.setProps({
        submissions: [
          firstSubmission,
          secondSubmission,
          { data: { id: 3, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test2' } },
        ],
      });

      // currentSubmission should remain the same
      expect(wrapper.vm.currentSubmission).toStrictEqual(wrapper.vm.submissions[1]);

      // the second submission should still be selected
      expect(wrapper.findAll('li').at(1).classes('selected')).toBe(true);

      expect(wrapper.vm.isSidebarOpen).toBe(true);
    });

    test('when loading different submissions', () => {
      // mock submissions change behavior
      wrapper.setProps({ submissions: [] });
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test' } },
          { data: { id: 2, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test2' } },
          { data: { id: 3, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test2' } },
        ],
      });

      // user clicks on sidebar
      wrapper.findAll('li').at(2).trigger('click');
      expect(wrapper.vm.currentSubmission).toStrictEqual(wrapper.vm.submissions[2]);
      expect(wrapper.findAll('li').at(0).classes('selected')).toBe(false);
      expect(wrapper.findAll('li').at(2).classes('selected')).toBe(true);
      wrapper.vm.isSidebarOpen = false;

      // mock load different submissions (same data but new/different object)
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test' } },
          { data: { id: 2, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test2' } },
          { data: { id: 3, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test2' } },
        ],
      });

      // state (currentSubmission, selected submission, etc) should reset
      expect(wrapper.vm.currentSubmission).toStrictEqual(wrapper.vm.submissions[0]);
      expect(wrapper.vm.isSidebarOpen).toBe(true);
      expect(wrapper.findAll('li').at(0).classes('selected')).toBe(true);
    });

    test('user collapses sidebar', () => {
      // mock submissions change behavior
      wrapper.setProps({ submissions: [] });
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test' } },
          { data: { id: 2, num_comments: ABOVE_COMMENT_THRESHOLD, subreddit: 'test2' } },
        ],
      });

      wrapper.findAll('li').at(1).trigger('click');
      expect(wrapper.vm.currentSubmission).toStrictEqual(wrapper.vm.submissions[1]);

      // collapse sidebar
      wrapper.find('span.collapse-sidebar').trigger('click');

      // currentSubmission should remain the same
      expect(wrapper.vm.currentSubmission).toStrictEqual(wrapper.vm.submissions[1]);

      expect(wrapper.vm.isSidebarOpen).toBe(false);
      expect(wrapper.findAll('li')).toHaveLength(0);
      expect(wrapper.findAll('selected')).toHaveLength(0);

      // uncollapse sidebar
      wrapper.find('span.collapse-sidebar').trigger('click');

      // currentSubmission should remain the same
      expect(wrapper.vm.currentSubmission).toStrictEqual(wrapper.vm.submissions[1]);

      // the second submission should still be selected
      expect(wrapper.findAll('li').at(1).classes('selected')).toBe(true);

      expect(wrapper.vm.isSidebarOpen).toBe(true);
    });
  });
});
