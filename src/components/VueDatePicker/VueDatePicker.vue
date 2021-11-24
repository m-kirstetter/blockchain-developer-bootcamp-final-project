<template>
  <div
    ref="datePickerRef"
    :data-testid="id"
    :class="$style.vueDatePicker"
    @keydown.enter.space.up.down.esc.stop.prevent="onKeyDown"
  >
    <vue-input
      :id="id"
      :name="name"
      :label="label"
      :hide-label="hideLabel"
      :hide-description="hideDescription"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder"
      :description="description"
      :error-message="errorMessage"
      :size="size"
      :readonly="true"
      :value="displayValue"
      :leading-icon="showIcon ? 'calendar' : null"
      :trailing-icon="canClear ? 'times' : null"
      :size-attribute="inputSize"
      @focus="onFocus"
      @leading-icon-click="onFocus"
      @trailing-icon-click="onClear"
    />

    <vue-collapse :show="show" :duration="duration">
      <vue-calendar
        :id="id + '-calendar'"
        :min-date="minDate"
        :max-date="maxDate"
        :range-start="rangeStart"
        :range-end="rangeEnd"
        :first-day-of-week="firstDayOfWeek"
        :today="today"
        :locale="locale"
        :selected-date="value"
        :class="[$style.calendar, $style[size], hideLabel && $style.hideLabel, $style[alignY]]"
        @input="onDateChange"
      />
    </vue-collapse>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref } from '@vue/composition-api';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import { getDomRef } from '@/composables/get-dom-ref';
import { useOutsideClick } from '@/composables/use-outside-click';
import { shirtSizeValidator } from '@/components/prop-validators';
import VueCollapse from '@/components/behavior/VueCollapse/VueCollapse.vue';
import VueCalendar from '../VueCalendar/VueCalendar.vue';

export default defineComponent({
  name: 'VueDatePicker',
  components: {
    VueCalendar,
    VueCollapse,
    VueInput,
  },
  inheritAttrs: false,
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    hideLabel: { type: Boolean, default: false },
    hideDescription: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    value: { type: [String, Date], default: null },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    description: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
    duration: { type: Number, default: 250 },
    size: { type: String, validator: shirtSizeValidator, default: 'md' },
    minDate: { type: [Date as new () => Date, String], default: null },
    maxDate: { type: [Date as new () => Date, String], default: null },
    rangeStart: { type: [Date as new () => Date, String], default: null },
    rangeEnd: { type: [Date as new () => Date, String], default: null },
    firstDayOfWeek: { type: [Number, String], default: 0 },
    today: { type: [Date as new () => Date, String], default: () => new Date() },
    locale: { type: String, default: 'en' },
    format: { type: Object, default: () => ({ day: '2-digit', month: '2-digit', year: 'numeric' }) },
    alignY: { type: String, validator: (value: string) => ['top', 'bottom'].includes(value), default: 'bottom' },
    canClear: { type: Boolean, default: true },
    showIcon: { type: Boolean, default: true },
  },
  setup(props, { emit }) {
    const datePickerRef = getDomRef(null);
    const show = ref(false);
    const displayValue = computed(() => {
      if (!props.value) {
        return null;
      }

      let date: Date;

      if (typeof props.value === 'string') {
        date = new Date(props.value);
      } else {
        date = props.value;
      }

      return new Intl.DateTimeFormat(props.locale, props.format).format(date);
    });
    const inputSize = computed(() => {
      return displayValue.value?.length;
    });
    const close = () => (show.value = false);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        close();
      } else {
        onFocus();
      }
    };
    const onFocus = async () => {
      show.value = true;

      await nextTick();

      const el: HTMLDivElement = datePickerRef.value;
      const calendarDays = el.querySelectorAll('td');

      for (let i = 0; i < calendarDays.length; i++) {
        const item = calendarDays.item(i);

        if (item.tabIndex !== -1) {
          item.focus();
          break;
        }
      }
    };
    const onDateChange = (date: Date) => {
      emit('input', date);
      show.value = false;
    };
    const onClear = () => {
      emit('clear');
    };
    /**
     * Only exposed for usage in parent components (e.g. vue-date-range-picker)
     * doesn't need any testing
     */
    /* istanbul ignore next */
    const focus = () => datePickerRef.value.querySelector('input').focus();

    useOutsideClick(datePickerRef, () => close());

    return {
      datePickerRef,
      show,
      displayValue,
      inputSize,
      onKeyDown,
      onFocus,
      onDateChange,
      onClear,
      focus,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/_design-system';

.vueDatePicker {
  position: relative;

  .calendar {
    position: absolute;
    box-shadow: var(--brand-elevation-3);
    border-radius: var(--brand-border-radius-lg);

    &.sm {
      top: $select-label-height + $select-label-gap + $input-control-sm-height + $select-description-gap;

      &.hideLabel {
        top: $input-control-sm-height + $select-description-gap;
      }
    }

    &.md {
      top: $select-label-height + $select-label-gap + $input-control-md-height + $select-description-gap;

      &.hideLabel {
        top: $input-control-md-height + $select-description-gap;
      }
    }

    &.lg {
      top: $select-label-height + $select-label-gap + $input-control-lg-height + $select-description-gap;

      &.hideLabel {
        top: $input-control-lg-height + $select-description-gap;
      }
    }

    &.top {
      top: $select-label-height;
      transform: translateY(-100%);

      &.hideLabel {
        top: -$select-description-gap;
      }
    }
  }
}
</style>
