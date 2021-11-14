<template>
  <div :class="$style.vueCalendar">
    <div :class="$style.selectedDate">
      <vue-text align="center" look="h6" weight="semi-bold">
        {{ selectedDayOfWeekName }}
      </vue-text>

      <div>
        <vue-text align="center" look="h1" weight="semi-bold">
          {{ selectedDay }}
        </vue-text>
        <vue-text align="center" look="h6" weight="semi-bold">
          {{ selectedMonthName }}
        </vue-text>
      </div>

      <vue-text align="center" look="h3" weight="semi-bold">
        {{ selectedYear }}
      </vue-text>
    </div>

    <vue-box :padding="[16, '16 24']" :class="$style.calendar">
      <vue-stack space="8">
        <vue-columns>
          <vue-column>
            <vue-select
              :id="id + '-month'"
              :name="id + '-month'"
              label="Select Month"
              hide-label
              hide-description
              :value="selectedMonth"
              :items="monthOptions"
              @input="onMonthChange"
            />
          </vue-column>
          <vue-column>
            <vue-select
              :id="id + '-year'"
              :name="id + '-year'"
              label="Select Year"
              hide-label
              hide-description
              :value="selectedYear"
              :items="yearOptions"
              align-menu="right"
              @input="onYearChange"
            />
          </vue-column>
        </vue-columns>

        <table>
          <thead>
            <tr>
              <th v-for="(weekday, idx) in weekdays" :key="`weekday-${idx}`" :class="$style.disabledDay">
                <vue-text look="medium-title" weight="semi-bold" color="info">{{ weekday }}</vue-text>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(days, daysIdx) in calendar" :key="`days-${daysIdx}`">
              <td
                v-for="(day, dayIdx) in days"
                :key="`day-${dayIdx}`"
                :class="[
                  day.currentDay && $style.currentDay,
                  day.disabled && $style.disabled,
                  day.selected && $style.selected,
                  day.inRange && $style.inRange,
                  day.rangeStart && $style.rangeStart,
                  day.rangeEnd && $style.rangeEnd,
                ]"
                :tabindex="day.disabled ? -1 : 0"
                @keydown.enter.stop.prevent="onDayClick(day)"
                @keydown.space.stop.prevent="onDayClick(day)"
                @click="onDayClick(day)"
              >
                <vue-text look="description" :weight="day.selected ? 'semi-bold' : 'regular'">
                  {{ day.day }}
                </vue-text>
              </td>
            </tr>
          </tbody>
        </table>
      </vue-stack>
    </vue-box>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import chunk from 'lodash/chunk';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueSelect from '@/components/input-and-actions/VueSelect/VueSelect.vue';
import { IItem } from '@/interfaces/IItem';
import { IDay } from './ICalendar';
import { convertToUTCDate, getUTCDate } from './utils';

export default defineComponent({
  name: 'VueCalendar',
  components: {
    VueSelect,
    VueBox,
    VueStack,
    VueColumn,
    VueColumns,
    VueText,
  },
  model: {
    prop: 'selectedDate',
  },
  props: {
    id: { type: String, required: true },
    minDate: { type: [Date as new () => Date, String], default: null },
    maxDate: { type: [Date as new () => Date, String], default: null },
    rangeStart: { type: [Date as new () => Date, String], default: null },
    rangeEnd: { type: [Date as new () => Date, String], default: null },
    firstDayOfWeek: { type: [Number, String], default: 0 },
    selectedDate: { type: [Date as new () => Date, String], default: null },
    today: { type: [Date as new () => Date, String], default: () => new Date() },
    locale: { type: String, default: 'en' },
  },
  setup(props, { emit }) {
    // Reactive Properties
    const selectedMonth = ref<number>(null);
    const selectedYear = ref<number>(null);
    const selectedDayOfWeek = ref<number>(null);
    const selectedDay = ref<number>(null);

    // Props To Computed
    const actualMinDate = computed(() => props.minDate && convertToUTCDate(new Date(props.minDate.toString())));
    const actualMaxDate = computed(() => props.maxDate && convertToUTCDate(new Date(props.maxDate.toString())));
    const actualRangeStart = computed(
      () => props.rangeStart && convertToUTCDate(new Date(props.rangeStart.toString())),
    );
    const actualRangeEnd = computed(() => props.rangeEnd && convertToUTCDate(new Date(props.rangeEnd.toString())));
    const actualSelectedDate = computed(
      () => props.selectedDate && convertToUTCDate(new Date(props.selectedDate.toString())),
    );
    const actualToday = computed(() => (props.today ? new Date(props.today.toString()) : new Date()));
    const actualFirstDayOfWeek = computed(() => parseInt(props.firstDayOfWeek.toString(), 10));

    // Computed
    const calculatedDate = computed(() => getUTCDate(selectedYear.value, selectedMonth.value, selectedDay.value));
    const calendar = computed<IDay[][]>(() => {
      let days: number[] = [];

      let paddingLeft = getUTCDate(selectedYear.value, selectedMonth.value, 1).getDay() - actualFirstDayOfWeek.value;
      const daysInMonth = 32 - new Date(selectedYear.value, selectedMonth.value, 32).getDate();

      if (paddingLeft < 0) {
        paddingLeft = 7 + paddingLeft;
      }

      days = days.concat(Array(paddingLeft).fill(null));

      for (let i = 0; i < daysInMonth; i++) {
        days.push(i + 1);
      }

      const paddingRight = Math.ceil(days.length / 7) * 7 - days.length;

      days = days.concat(Array(paddingRight).fill(null));

      const dayObjects: IDay[] = days.map(
        (day: number): IDay => {
          const date: Date = day ? getUTCDate(selectedYear.value, selectedMonth.value, day) : getUTCDate(0, 0, 0);
          const currentDay: boolean =
            date.getTime() ===
            getUTCDate(
              actualToday.value.getFullYear(),
              actualToday.value.getMonth(),
              actualToday.value.getDate(),
            ).getTime();
          const disabled: boolean = isDayDisabled(day, date);
          let selected: boolean = date.getTime() === calculatedDate.value.getTime();
          let inRange = false;
          let rangeStart = false;
          let rangeEnd = false;

          date.setHours(0);

          if (day && actualRangeStart.value && actualRangeEnd.value) {
            inRange =
              date.getTime() >= actualRangeStart.value.getTime() &&
              date.getTime() &&
              date.getTime() <= actualRangeEnd.value.getTime();
            rangeStart = date.getTime() === actualRangeStart.value.getTime();
            rangeEnd = date.getTime() === actualRangeEnd.value.getTime();
          }

          if (day === null) {
            selected = false;
          }

          return { day, currentDay, selected, disabled, inRange, rangeStart, rangeEnd };
        },
      );

      return chunk(dayObjects, 7);
    });
    const yearOptions = computed<Array<IItem>>(() => {
      let firstYear;
      const yearRange = 100;

      if (actualMinDate.value) {
        firstYear = actualMinDate.value.getFullYear();
      } else if (actualMaxDate.value) {
        firstYear = actualMaxDate.value.getFullYear() - yearRange;
      } else {
        firstYear = new Date().getFullYear() - yearRange / 2;
      }
      const yearNumbers = [];

      for (let i = firstYear; i < firstYear + (yearRange + 1); i++) {
        yearNumbers.push(i);
      }

      return yearNumbers.map(
        (year): IItem => {
          return { label: year.toString(), value: year };
        },
      );
    });
    const monthOptions = computed<Array<IItem>>(() => {
      const format = new Intl.DateTimeFormat(props.locale, { month: 'long' });
      const months: Array<IItem> = [];

      for (let month = 0; month < 12; month++) {
        const testDate = new Date(Date.UTC(2000, month, 1, 0, 0, 0));
        months.push({ label: format.format(testDate), value: month });
      }

      return months;
    });
    const weekdayNames = computed(() => {
      const format = new Intl.DateTimeFormat(props.locale, { weekday: 'long' });
      const weekdays: Array<string> = [];

      for (let day = 0; day < 7; day++) {
        const testDate = new Date(Date.UTC(0, 0, day, 0, 0, 0));
        weekdays.push(format.format(testDate).substring(0, 1));
      }

      return weekdays;
    });
    const weekdays = computed(() => {
      const orderedDays: string[] = [];
      let startDay: number = actualFirstDayOfWeek.value;

      for (let i = 0; i < 7; i++) {
        orderedDays.push(weekdayNames.value[startDay]);

        startDay++;

        if (startDay === 7) {
          startDay = 0;
        }
      }

      return orderedDays;
    });
    const selectedDayOfWeekName = computed(() =>
      new Intl.DateTimeFormat(props.locale, { weekday: 'long' }).format(calculatedDate.value),
    );
    const selectedMonthName = computed(() =>
      new Intl.DateTimeFormat(props.locale, { month: 'long' }).format(calculatedDate.value),
    );

    // Methods
    const setDate = () => {
      let date: Date = actualToday.value;

      if (actualSelectedDate.value) {
        date = actualSelectedDate.value;
      }

      selectedDay.value = date.getDate();
      selectedDayOfWeek.value = date.getDay();
      selectedMonth.value = date.getMonth();
      selectedMonth.value = date.getMonth();
      selectedYear.value = date.getFullYear();
      selectedYear.value = date.getFullYear();
    };
    const isDayDisabled = (day: number, date: Date) => {
      date = convertToUTCDate(date);

      let disabled = false;

      if (!day) {
        disabled = true;
      } else if (actualMinDate.value && date.getTime() < actualMinDate.value.getTime()) {
        disabled = true;
      } else if (actualMaxDate.value && date.getTime() > actualMaxDate.value.getTime()) {
        disabled = true;
      }

      return disabled;
    };

    // Event handler
    const onYearChange = (item: IItem) => {
      selectedYear.value = item.value;
    };
    const onMonthChange = (item: IItem) => {
      selectedMonth.value = item.value;
    };
    const onDayClick = (day: IDay) => {
      if (day.disabled) {
        return;
      }

      selectedDay.value = day.day;
      selectedDayOfWeek.value = getUTCDate(selectedYear.value, selectedMonth.value, day.day).getDay();

      onInput();
    };
    const onInput = () => {
      emit('input', calculatedDate.value);
    };

    // Watchers
    watch(actualMinDate, () => setDate());
    watch(actualMaxDate, () => setDate());
    watch(actualRangeStart, () => setDate());
    watch(actualRangeEnd, () => setDate());
    watch(actualSelectedDate, () => setDate());
    watch(actualToday, () => setDate());

    setDate();

    return {
      selectedDayOfWeek,
      selectedDay,
      selectedMonth,
      selectedYear,
      calculatedDate,
      calendar,
      yearOptions,
      monthOptions,
      weekdays,
      selectedDayOfWeekName,
      selectedMonthName,
      onYearChange,
      onMonthChange,
      onDayClick,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/_design-system';

$calendar-max-width-phone: 300px;
$calendar-max-width-tablet-portrait: 500px;
$calendar-bg: var(--brand-surface-default-high);
$calendar-accent-color: var(--brand-primary);
$calendar-border-radius: var(--brand-border-radius-lg);
$calendar-row-border-radius: var(--brand-border-radius-sm);
$calendar-range-bg: var(--brand-surface-info-low);
$calendar-outline: var(--brand-focused);
$calendar-disabled-opacity: 0.3;
$calendar-selected-date-color: var(--brand-text-info);

.vueCalendar {
  position: relative;
  display: flex;
  flex-direction: row;
  max-width: $calendar-max-width-phone;
  background: $calendar-bg;
  z-index: 1000;

  .selectedDate {
    flex: 0 0 25%;
    background: $calendar-accent-color;
    border-radius: $calendar-border-radius 0 0 $calendar-border-radius;
    display: none;
    flex-direction: column;
    color: var(--a11y-default-color);

    > span {
      display: inline-block;
      flex: 0 0 auto;
      padding: $space-16;
    }

    > div {
      flex: 1 1 auto;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
  }

  .calendar {
    border-radius: $calendar-border-radius;
    height: 100%;
    flex: 1 1 75%;

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;

      thead {
        background: transparent;
      }

      tr {
        border: none;

        td,
        th {
          text-align: center;
          vertical-align: center;
          width: 14.285%;
          padding: 14.285% 0 0 0;
          display: inline-block;
          position: relative;

          > span {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }

          &:first-child {
            border-radius: $calendar-row-border-radius 0 0 $calendar-row-border-radius !important;
          }

          &:last-child {
            border-radius: 0 $calendar-row-border-radius $calendar-row-border-radius 0 !important;
          }
        }

        td {
          cursor: pointer;
          border-radius: $calendar-row-border-radius;

          &.inRange {
            background: $calendar-range-bg;
            border-radius: 0;
          }

          &.rangeStart {
            border-radius: $calendar-row-border-radius 0 0 $calendar-row-border-radius;
          }

          &.rangeEnd {
            border-radius: 0 $calendar-row-border-radius $calendar-row-border-radius 0;
          }

          &.currentDay {
            color: $calendar-selected-date-color;
          }

          &.selected {
            background: $calendar-accent-color;
            z-index: 1;
            color: var(--a11y-default-color);
          }

          &.disabled {
            cursor: default;
            opacity: $calendar-disabled-opacity;

            &:focus {
              outline: none;
              box-shadow: none;
              z-index: 0;
            }

            &.inRange {
              opacity: 0.6;
            }
          }

          &:focus {
            outline: none;
            box-shadow: $calendar-outline;
            z-index: 1;
          }
        }
      }
    }
  }

  @include mediaMin(tabletPortrait) {
    max-width: $calendar-max-width-tablet-portrait;

    .selectedDate {
      display: flex;
    }

    .calendar {
      border-radius: 0 $calendar-border-radius $calendar-border-radius 0;
    }
  }
}
</style>
