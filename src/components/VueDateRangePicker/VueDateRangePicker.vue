<template>
  <div :class="[$style.vueDateRangePicker, rangeStart && $style.hasRange, $style[alignY]]">
    <vue-date-picker
      v-bind="$props"
      :id="id + '-date-picker1'"
      ref="rangeStartRef"
      :name="id + '-date-picker1'"
      :label="label"
      :value="rangeStart"
      :range-start="rangeStart"
      :range-end="rangeEnd"
      :max-date="maxDate"
      :can-clear="false"
      :class="$style.rangeStart"
      @input="onRangeStartChange"
    />

    <div v-if="rangeStart" :class="[$style.separator, $style[size]]">-</div>

    <vue-date-picker
      v-if="rangeStart"
      v-bind="$props"
      :id="id + '-date-picker2'"
      ref="rangeEndRef"
      :name="id + '-date-picker2'"
      :label="label"
      :value="rangeEnd"
      :range-start="rangeStart"
      :range-end="rangeEnd"
      :min-date="minDate || rangeEndMinDate"
      hide-label
      hide-description
      placeholder=""
      :required="false"
      :class="$style.rangeEnd"
      :show-icon="false"
      @input="onRangeEndChange"
      @clear="onClear"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, nextTick } from '@vue/composition-api';
import { shirtSizeValidator } from '@/components/prop-validators';
import { getDomRef } from '@/composables/get-dom-ref';
import VueDatePicker from '../VueDatePicker/VueDatePicker.vue';

export default defineComponent({
  name: 'VueDateRangePicker',
  components: {
    VueDatePicker,
  },
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    hideLabel: { type: Boolean, default: false },
    hideDescription: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    value: { type: [Array, Array as () => Array<string | Date>], default: null },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    description: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
    duration: { type: Number, default: 250 },
    size: { type: String, validator: shirtSizeValidator, default: 'md' },
    minDate: { type: [Date as new () => Date, String], default: null },
    maxDate: { type: [Date as new () => Date, String], default: null },
    firstDayOfWeek: { type: [Number, String], default: 0 },
    today: { type: [Date as new () => Date, String], default: () => new Date() },
    locale: { type: String, default: 'en' },
    format: { type: Object, default: () => ({ day: '2-digit', month: '2-digit', year: 'numeric' }) },
    alignY: { type: String, validator: (value: string) => ['top', 'bottom'].includes(value), default: 'bottom' },
    rangeGap: { type: [String, Number], default: 1 },
  },
  setup(props, { emit }) {
    const daysInMilliseconds = (days: number) => 1000 * 60 * 60 * 24 * days;
    // reactive properties
    const rangeStartRef = getDomRef(null);
    const rangeEndRef = getDomRef(null);
    const rangeStart = ref(null);
    const rangeEnd = ref(null);

    // computed
    const actualRangeGap = computed(() => parseInt(props.rangeGap.toString(10), 10));
    const rangeEndMinDate = computed(() => {
      const gap = actualRangeGap.value + 1;
      const end = new Date(rangeStart.value);
      end.setDate(end.getDate() + gap);

      return end;
    });

    // methods
    const onRangeStartChange = async (start: Date) => {
      const gap = actualRangeGap.value + 1;
      let end = new Date(rangeEnd.value || start);
      const diff = end.getTime() - start.getTime();

      if (diff < daysInMilliseconds(gap)) {
        end = new Date(start);
        end.setDate(end.getDate() + gap);
      }

      rangeStart.value = start;
      rangeEnd.value = end;

      await nextTick();

      rangeEndRef.value.focus();

      onInput();
    };
    const onRangeEndChange = (end: Date) => {
      rangeEnd.value = end;
      onInput();
    };
    const onInput = () => {
      emit('input', [rangeStart.value, rangeEnd.value]);
    };
    const onClear = () => {
      rangeStart.value = null;
      rangeEnd.value = null;
      emit('clear');
    };

    watch(
      () => props.value,
      () => {
        if (Array.isArray(props.value) && props.value.length === 2) {
          const [start, end] = props.value;

          rangeStart.value = typeof start === 'string' ? new Date(start) : start;
          rangeEnd.value = typeof start === 'string' ? new Date(end) : end;
        } else {
          rangeStart.value = null;
          rangeEnd.value = null;
        }
      },
      { immediate: true },
    );

    return {
      rangeStartRef,
      rangeEndRef,
      rangeStart,
      rangeEnd,
      rangeEndMinDate,
      onRangeStartChange,
      onRangeEndChange,
      onClear,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/_design-system';

.vueDateRangePicker {
  .rangeStart {
    > div:nth-child(2) {
      width: 500px;
    }
  }

  .rangeEnd {
    > div:nth-child(2) {
      width: 500px;
    }
  }

  &.hasRange {
    display: flex;
    flex-direction: row;
    align-items: center;

    .rangeStart {
      display: inline-flex;

      input {
        border-radius: $input-border-radius 0 0 $input-border-radius;
        border-right: none;

        &:hover {
          border-right: none;
        }
      }
    }

    .rangeEnd {
      flex: 1 1 auto;

      input {
        border-radius: 0 $input-border-radius $input-border-radius 0;
        border-left: none;

        &:hover {
          border-left: none;
        }
      }
    }

    .separator {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      border-top: $input-border;
      border-bottom: $input-border;
      width: $space-4;

      &.sm {
        height: $input-control-sm-height;
      }
      &.md {
        height: $input-control-md-height;
      }
      &.lg {
        height: $input-control-lg-height;
      }
    }
  }

  @include mediaMax(phone) {
    .rangeStart {
      > div:nth-child(2) {
        width: calc(100vw - #{$space-64});
      }
    }

    .rangeEnd {
      > div:nth-child(2) {
        width: calc(100vw - #{$space-64});
        transform: translateX(-50%);
      }
    }

    &.top {
      .rangeEnd {
        > div:nth-child(2) {
          width: calc(100vw - #{$space-64});
          transform: translate(-50%, -100%);
        }
      }
    }
  }
}
</style>
