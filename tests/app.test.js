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
    sync: {
      get: jest.fn().mockResolvedValue({}),
    },
  },
};
const mocks = { $browser: browser };

const numPostsMessage = 'reddit post';
const numCommentsMessage = 'reddit comment';

describe('App', () => {
  // mount component
  const wrapper = shallowMount(App, { mocks });

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test('has the correct default data', () => {
    expect(typeof App.data).toBe('function');
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.apiError).toBe(false);
    expect(wrapper.vm.after).toBe(null);
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

  describe('renders the correct markup when no submissions added', () => {
    test('api returns with no submissions', () => {
      wrapper.vm.loading = false;
      wrapper.vm.submissions = [];
      wrapper.vm.apiError = false;

      expect(wrapper.html()).toContain(`0 ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`0 ${numCommentsMessage}`);
    });

    test('api returns with error', () => {
      wrapper.vm.loading = false;
      wrapper.vm.submissions = [];
      wrapper.vm.apiError = true;

      expect(wrapper.html()).toContain(`0 ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`0 ${numCommentsMessage}`);
    });
  });

  describe('renders the correct markup when submissions added', () => {
    test('with no comments', () => {
      wrapper.vm.loading = false;
      wrapper.vm.submissions = [
        { data: { id: 1, num_comments: 0, subreddit: 'test' } },
        { data: { id: 2, num_comments: 0, subreddit: 'test' } },
      ];

      expect(wrapper.html()).toContain(`2 ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`0 ${numCommentsMessage}`);
    });

    test('with comments', () => {
      wrapper.vm.loading = false;
      wrapper.vm.submissions = [
        { data: { id: 1, num_comments: 10, subreddit: 'test' } },
        { data: { id: 2, num_comments: 2, subreddit: 'test' } },
      ];

      expect(wrapper.html()).toContain(`2 ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`12 ${numCommentsMessage}`);
    });

    test('with more submissions to load', () => {
      wrapper.vm.loading = false;
      wrapper.vm.after = 'someId';
      wrapper.vm.submissions = [
        { data: { id: 1, num_comments: 10, subreddit: 'test' } },
        { data: { id: 2, num_comments: 2, subreddit: 'test' } },
      ];

      expect(wrapper.html()).toContain(`2+ ${numPostsMessage}`);
      expect(wrapper.html()).toContain(`12+ ${numCommentsMessage}`);
    });

    test('from subreddit that is being filtered', () => {
      wrapper.vm.loading = false;
      wrapper.vm.after = null;
      wrapper.vm.options.FILTERS = ['test'];
      wrapper.vm.submissions = [
        { data: { id: 1, num_comments: 10, subreddit: 'test' } },
        { data: { id: 2, num_comments: 2, subreddit: 'tests' } },
      ];

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
