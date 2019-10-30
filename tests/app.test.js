import { shallowMount } from '@vue/test-utils';
import App from '../src/App.vue';
import { OPTIONS } from '../src/constants';


// Constants

const browser = {
  runtime: {
    onMessage: {
      addListener: jest.fn(),
    },
  },
  storage: {
    local: {
      get: jest.fn().mockResolvedValue({}),
    },
  },
};
const root = {
  data() {
    return {
      state: {
        submissionList: [],
        submissions: { error: false, loading: false },
        comments: {},
        nextSubmission: null,
        init: false,
      },
      loadSubmissions: jest.fn().mockResolvedValue({}),
      clearDataAction: jest.fn(),
      setInitAction: jest.fn(),
    };
  },
};
const mocks = { $browser: browser };

const numPostsMessage = 'reddit post';
const numCommentsMessage = 'reddit comment';

describe('App', () => {
  // mount component
  const wrapper = shallowMount(App, { mocks, parentComponent: root });

  describe('init', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissionList = [];
      wrapper.vm.$root.$data.state.nextSubmission = null;
    });

    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct default data', () => {
      expect(typeof App.data).toBe('function');
      expect(wrapper.vm.options).toStrictEqual(OPTIONS);
      expect(wrapper.vm.currentTabComponent).toBe(OPTIONS.DEFAULT_TAB);
      expect(wrapper.vm.submissions).toHaveLength(0);
    });

    test('renders the correct markup at init', () => {
      expect(wrapper.html()).toContain(numPostsMessage);
      expect(wrapper.html()).toContain(numCommentsMessage);
      expect(wrapper.findAll('button')).toHaveLength(wrapper.vm.tabs.length);

      expect(wrapper.contains(`${OPTIONS.DEFAULT_TAB}-stub`)).toBe(true);
    });
  });

  describe('renders the correct markup when no submissions added', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissionList = [];
      wrapper.vm.$root.$data.state.nextSubmission = null;
      wrapper.vm.$root.$data.state.submissions.error = false;
      wrapper.vm.$root.$data.state.submissions.loading = false;
      wrapper.vm.$root.$data.state.init = false;
    });

    test('api returns with no submissions', () => {
      expect(wrapper.html()).toContain(`0 ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`0 ${numCommentsMessage}`);
    });

    test('on state.init', () => {
      wrapper.vm.$root.$data.state.init = true;

      expect(wrapper.html()).toContain(`-- ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`-- ${numCommentsMessage}`);
    });

    test('api returns with error', () => {
      wrapper.vm.$root.$data.state.submissions.error = true;

      expect(wrapper.html()).toContain(`-- ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`-- ${numCommentsMessage}`);
    });

    test('data loading', () => {
      wrapper.vm.$root.$data.state.submissions.loading = true;

      expect(wrapper.html()).toContain(`-- ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`-- ${numCommentsMessage}`);
    });
  });

  describe('renders the correct markup when submissions added', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissions = {
        1: { data: { id: 1, num_comments: 0, subreddit: 'test' } },
        2: { data: { id: 2, num_comments: 0, subreddit: 'test' } },
      };
      wrapper.vm.$root.$data.state.submissionList = ['1', '2'];
      wrapper.vm.$root.$data.state.nextSubmission = null;
    });

    test('with no comments', () => {
      expect(wrapper.html()).toContain(`2 ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`0 ${numCommentsMessage}`);
    });

    test('with comments', () => {
      wrapper.vm.$root.$data.state.submissions['1'].data.num_comments = 10;
      wrapper.vm.$root.$data.state.submissions['2'].data.num_comments = 2;

      expect(wrapper.html()).toContain(`2 ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`12 ${numCommentsMessage}`);
    });

    test('with more submissions to load', () => {
      wrapper.vm.$root.$data.state.submissions['1'].data.num_comments = 10;
      wrapper.vm.$root.$data.state.submissions['2'].data.num_comments = 2;

      wrapper.vm.$root.$data.state.nextSubmission = 'someId';
      wrapper.vm.$root.$data.state.submissions = {
        1: { data: { id: 1, num_comments: 10, subreddit: 'test' } },
        2: { data: { id: 2, num_comments: 2, subreddit: 'test' } },
      };

      expect(wrapper.html()).toContain(`2+ ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`12+ ${numCommentsMessage}`);
    });

    test('from subreddit that is being filtered', () => {
      wrapper.vm.options.FILTERS = ['test'];
      wrapper.vm.$root.$data.state.submissions = {
        1: { data: { id: 1, num_comments: 10, subreddit: 'test' } },
        2: { data: { id: 2, num_comments: 2, subreddit: 'tests' } },
      };

      expect(wrapper.html()).toContain(`1 ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`2 ${numCommentsMessage}`);
    });
  });

  describe('renders the correct component when user changes tab', () => {
    test('to reddit submissions-list component', () => {
      wrapper.vm.currentTabComponent = 'submission-list';
      expect(wrapper.contains('submission-list-stub')).toBe(true);

      expect(wrapper.contains('youtube-comments-view-stub')).toBe(false);
      expect(wrapper.contains('comments-view-stub')).toBe(false);
    });

    test('to youtube-comments-view component', () => {
      wrapper.vm.currentTabComponent = 'youtube-comments-view';
      expect(wrapper.contains('youtube-comments-view-stub')).toBe(true);

      expect(wrapper.contains('submission-list-stub')).toBe(false);
      expect(wrapper.contains('comments-view-stub')).toBe(false);
    });

    test('to reddit comments-view component', () => {
      wrapper.vm.currentTabComponent = 'comments-view';
      expect(wrapper.contains('comments-view-stub')).toBe(true);

      expect(wrapper.contains('submission-list-stub')).toBe(false);
      expect(wrapper.contains('youtube-comments-view-stub')).toBe(false);
    });
  });
});
