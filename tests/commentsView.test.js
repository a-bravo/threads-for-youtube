import { shallowMount } from '@vue/test-utils';
import CommentsView from '../src/components/CommentsView.vue';


describe('CommentsView', () => {
  // mount component
  const wrapper = shallowMount(CommentsView, {
    propsData: {
      submissions: [],
      loading: true,
      apiError: false,
    },
  });

  describe('initial state', () => {
    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      expect(typeof CommentsView.data).toBe('function');
      expect(wrapper.vm.submissions).toHaveLength(0);
      expect(wrapper.vm.visibleSubmissions).toHaveLength(0);
    });

    test('renders correct markup', () => {
      wrapper.setProps({
        apiError: false,
        loading: true,
        submissions: [],
      });
      // present
      expect(wrapper.html()).toContain('Loading reddit posts...');

      // not present
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('comment-list-stub')).toBe(false);
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
      expect(wrapper.contains('comment-list-stub')).toBe(false);
    });

    test('on load no results', () => {
      wrapper.setProps({
        loading: false,
        apiError: false,
        submissions: [],
      });

      expect(wrapper.html()).toContain('No comments.');

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('comment-list-stub')).toBe(false);
    });

    test('when adding submissions with no comments', () => {
      wrapper.setProps({
        loading: false,
        apiError: false,
        submissions: [
          { id: 1, num_comments: 0 },
          { id: 2, num_comments: 0 },
        ],
      });

      expect(wrapper.html()).toContain('No comments.');

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('comment-list-stub')).toBe(false);
    });
  });

  describe('renders correctly when adding submissions with comments', () => {
    wrapper.setProps({
      loading: false,
      apiError: false,
    });

    test('on initial state', () => {
      wrapper.setProps({
        submissions: [
          { id: 1, num_comments: 10, subreddit: { display_name: 'test' } },
          { id: 2, num_comments: 5, subreddit: { display_name: 'test2' } },
        ],
      });

      // sidebar
      expect(wrapper.contains('ul')).toBe(true);
      expect(wrapper.findAll('li')).toHaveLength(2);
      expect(wrapper.findAll('li').at(0).classes('selected')).toBe(true);
      expect(wrapper.findAll('li').at(1).classes('selected')).toBe(false);

      // component
      expect(wrapper.findAll('comment-list-stub')).toHaveLength(1);
    });

    test('on initial state with mixed comments and no comments', () => {
      wrapper.setProps({
        submissions: [
          { id: 1, num_comments: 0, subreddit: { display_name: 'test' } },
          { id: 2, num_comments: 10, subreddit: { display_name: 'test2' } },
        ],
      });

      // sidebar
      expect(wrapper.contains('ul')).toBe(true);
      expect(wrapper.findAll('li')).toHaveLength(1);
      expect(wrapper.findAll('li').at(0).classes('selected')).toBe(true);

      // component
      expect(wrapper.findAll('comment-list-stub')).toHaveLength(1);
    });

    test('when user clicks on another sidebar-item', () => {
      wrapper.setProps({
        submissions: [
          { id: 1, num_comments: 10, subreddit: { display_name: 'test' } },
          { id: 2, num_comments: 5, subreddit: { display_name: 'test2' } },
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
  });
});
