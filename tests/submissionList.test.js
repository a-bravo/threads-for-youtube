import { shallowMount } from '@vue/test-utils';
import SubmissionList from '../src/components/SubmissionList.vue';
import { OPTIONS } from '../src/constants';

const root = {
  data() {
    return {
      state: {
        submissionList: [],
        submissions: { loading: true, error: false, moreError: false },
        comments: {},
        nextSubmission: null,
      },
    };
  },
};

describe('SubmissionList', () => {
  // mount component
  const wrapper = shallowMount(SubmissionList, {
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
      wrapper.setProps({ submissions: [] });
    });

    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      expect(wrapper.vm.submissions).toHaveLength(0);
    });

    test('renders correct markup', () => {
      // present
      expect(wrapper.contains('spinner-stub')).toBe(true);

      // not present
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('more-button-stub')).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
    });
  });

  describe('renders correctly on edge cases', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissions.loading = false;
      wrapper.vm.$root.$data.state.submissions.error = false;
      wrapper.setProps({ submissions: [] });
    });

    test('on api error', () => {
      wrapper.vm.$root.$data.state.submissions.error = true;

      expect(wrapper.html()).toContain('Could not reach reddit. Try again later.');
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('more-button-stub')).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
    });

    test('on load no results', () => {
      expect(wrapper.html()).toContain('No posts.');

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('more-button-stub')).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
    });
  });

  describe('renders correctly when adding submissions', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissions.loading = false;
      wrapper.vm.$root.$data.state.submissions.error = false;
      wrapper.vm.$root.$data.state.submissions.moreLoading = false;
      wrapper.vm.$root.$data.state.submissions.moreError = false;
      wrapper.vm.$root.$data.state.nextSubmission = null;
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: 10 } },
          { data: { id: 2, num_comments: 5 } },
        ],
      });
    });

    test('few submissions', () => {
      expect(wrapper.findAll('submission-stub')).toHaveLength(2);
      expect(wrapper.contains('more-button-stub')).toBe(false);
    });

    describe('more submissions', () => {
      test('available to load', () => {
        wrapper.vm.$root.$data.state.nextSubmission = 'someId';

        expect(wrapper.findAll('submission-stub')).toHaveLength(2);
        expect(wrapper.contains('more-button-stub')).toBe(true);
        expect(wrapper.html()).toContain('load more posts');
        expect(wrapper.html()).not.toContain('(Could not reach reddit. Try again later.)');
      });

      test('error on load', () => {
        wrapper.vm.$root.$data.state.nextSubmission = 'someId';
        wrapper.vm.$root.$data.state.submissions.moreError = true;

        expect(wrapper.findAll('submission-stub')).toHaveLength(2);
        expect(wrapper.contains('more-button-stub')).toBe(true);
        expect(wrapper.html()).toContain('load more posts');
        expect(wrapper.html()).toContain('(Could not reach reddit. Try again later.)');
      });
    });
  });
});
