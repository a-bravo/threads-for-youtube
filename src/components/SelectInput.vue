<template>
  <select
    v-model="selected"
    :disabled="!selected"
  >
    <option
      v-for="o in options"
      :key="o.value || o"
      :value="o.value || o"
    >
      {{ o.text || o }}
      <slot />
    </option>
  </select>
</template>

<script>
export default {
  props: {
    value: {
      type: undefined,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selected: this.value,
    };
  },
  watch: {
    selected() {
      this.$emit('input', this.selected);
    },
    value() {
      this.selected = this.value;
    },
  },
};
</script>
