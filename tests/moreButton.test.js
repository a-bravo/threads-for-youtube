import { shallowMount } from '@vue/test-utils';
import MoreButton from '../src/components/MoreButton.vue';


describe('MoreButton', () => {
  // mount component
  const wrapper = shallowMount(MoreButton, {
    propsData: {
      loading: false,
    },
  });

  // submissions will have comments
  describe('initial state', () => {
    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      expect(typeof MoreButton.data).toBe('function');
      expect(wrapper.vm.loading).toBe(false);
    });

    test('renders correct markup', () => {
      expect(wrapper.contains('.more-button')).toBe(true);
    });
  });

  test('renders correctly when loading', () => {
    wrapper.setProps({
      loading: true,
    });

    expect(wrapper.contains('.more-button')).toBe(false);
    expect(wrapper.html()).toContain('loading...');
  });

  test('emits event on user click', () => {
    wrapper.setProps({
      loading: false,
    });

    expect(wrapper.emitted().more).not.toBeTruthy();
    expect(wrapper.contains('.more-button')).toBe(true);
    wrapper.find('.more-button').trigger('click');
    expect(wrapper.emitted().more).toBeTruthy();
  });
});
