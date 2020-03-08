import { shallowMount } from '@vue/test-utils';
import SelectInput from '../src/components/SelectInput.vue';


describe('SelectInput', () => {
  // mount component
  const wrapper = shallowMount(SelectInput, {
    propsData: {
      value: 'value',
      options: ['value', 'value1', 'value2'],
    },
  });

  describe('initial state', () => {
    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      expect(typeof SelectInput.data).toBe('function');
      expect(wrapper.vm.selected).toBe('value');
      expect(wrapper.emitted().input).toBeFalsy();
    });

    test('renders correct markup', () => {
      expect(wrapper.find('select').element.value).toBe('value');
      expect(wrapper.findAll('option')).toHaveLength(3);
    });
  });

  test('on value prop change', () => {
    wrapper.setProps({
      value: 'value1',
    });

    expect(wrapper.vm.selected).toBe('value1');
    expect(wrapper.find('select').element.value).toBe('value1');
    expect(wrapper.emitted().input.length).toBe(1);
  });

  test('user changes selected option', () => {
    // mock user change option
    wrapper.vm.selected = 'value2';

    expect(wrapper.find('select').element.value).toBe('value2');
    expect(wrapper.emitted().input.length).toBe(2);
  });
});
