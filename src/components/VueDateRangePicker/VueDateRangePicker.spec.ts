import { fireEvent, render, RenderResult } from '@testing-library/vue';
import { getUTCDate } from '../VueCalendar/utils';
import VueDateRangePicker from './VueDateRangePicker.vue';

describe('VueDateRangePicker.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(VueDateRangePicker, {
      props: {
        id: 'date-range-picker',
        name: 'date-range-picker',
        label: 'Select a date range',
        disabled: false,
        placeholder: 'Select a date range',
        duration: 0,
        locale: 'en',
        rangeGap: 5,
      },
    });
  });

  test('renders component', () => {
    const { getByPlaceholderText } = harness;

    getByPlaceholderText('Select a date range');
  });

  test('should emit input event', async () => {
    const { updateProps, getByPlaceholderText, getByTestId, queryAllByText, emitted } = harness;
    await updateProps({ value: null });
    const format = new Intl.DateTimeFormat('en', { month: 'long' });
    const rangeStart = new Date('2021');
    const rangeEnd = new Date('2021');

    rangeStart.setDate(rangeStart.getDate() + 1);
    rangeStart.setMonth(2);
    rangeEnd.setDate(rangeStart.getDate() + 6);
    rangeEnd.setMonth(2);

    await fireEvent.focus(getByPlaceholderText('Select a date range'));
    await fireEvent.click(getByTestId('custom-date-range-picker-date-picker1-calendar-month'));
    await fireEvent.click(queryAllByText('March')[1]);
    await fireEvent.click(getByTestId('custom-date-range-picker-date-picker1-calendar-year'));
    await fireEvent.click(queryAllByText('2021')[1]);
    await fireEvent.click(queryAllByText(rangeStart.getDate())[0]);

    expect(emitted().input[0][0]).toEqual([
      getUTCDate(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()),
      getUTCDate(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate()),
    ]);

    rangeEnd.setDate(rangeEnd.getDate() + 5);

    await fireEvent.click(getByTestId('date-range-picker-date-picker2'));
    await fireEvent.click(getByTestId('custom-date-range-picker-date-picker2-calendar-month'));
    await fireEvent.click(queryAllByText(format.format(rangeEnd))[1]);
    await fireEvent.click(queryAllByText(rangeEnd.getDate())[0]);

    expect(emitted().input[1][0]).toEqual([
      getUTCDate(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()),
      getUTCDate(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate()),
    ]);
  });

  test('should keep the range gap when selecting a new start date', async () => {
    const { updateProps, queryAllByText, emitted, getByDisplayValue } = harness;
    await updateProps({ value: ['2021-03-09', '2021-03-15'] });

    await fireEvent.focus(getByDisplayValue('03/09/2021'));
    await fireEvent.click(queryAllByText('9')[0]);
    await fireEvent.click(queryAllByText('13')[0]);

    expect(emitted().input[0][0]).toEqual([new Date('2021-03-13T00:00:00.000Z'), new Date('2021-03-19T00:00:00.000Z')]);
  });

  test('change start date to an earlier date but respect min-date prop', async () => {
    const { updateProps, queryAllByText, emitted, getByDisplayValue } = harness;
    await updateProps({ value: [new Date('2021-03-09'), new Date('2021-03-15')], minDate: '2021-03-03' });

    await fireEvent.focus(getByDisplayValue('03/09/2021'));
    await fireEvent.click(queryAllByText('2')[0]);
    await fireEvent.click(queryAllByText('3')[0]);

    expect(emitted().input[0][0]).toEqual([new Date('2021-03-03T00:00:00.000Z'), new Date('2021-03-15T00:00:00.000Z')]);
  });

  test('should emit clear event', async () => {
    const { updateProps, getByPlaceholderText, getByTestId, emitted } = harness;
    await updateProps({ value: [new Date('2021-03-09'), new Date('2021-03-15')] });

    await fireEvent.click(getByTestId('date-range-picker-date-picker2-trailing-icon'));

    expect(emitted().clear).toBeTruthy();

    getByPlaceholderText('Select a date range');
  });
});
