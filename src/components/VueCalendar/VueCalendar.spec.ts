import { fireEvent, render, RenderResult } from '@testing-library/vue';
import { getUTCDate } from './utils';
import VueCalendar from './VueCalendar.vue';

const today: Date = getUTCDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);
const getWeekdayName = (date: Date, locale = 'en') => new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
const getMonthName = (date: Date, locale = 'en') => new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);

describe('VueCalendar.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(VueCalendar, {
      props: {
        id: 'calendar1',
        minDate: null,
        maxDate: null,
        rangeStart: null,
        rangeEnd: null,
        firstDayOfWeek: 0,
        selectedDate: null,
        locale: 'en',
      },
    });
  });

  test('renders component and emits change event when today is clicked', async () => {
    const { getByText, queryAllByText, emitted } = harness;

    getByText(getWeekdayName(today));
    expect(queryAllByText(getMonthName(today))).toHaveLength(3);
    expect(queryAllByText(today.getDate())).toHaveLength(2);
    expect(queryAllByText(today.getFullYear())).toHaveLength(3);

    await fireEvent.click(queryAllByText(today.getDate())[1]);

    expect(emitted().input).toEqual([[today]]);
  });

  test('renders component with min max date and does not emit change event when disabled day is clicked', async () => {
    const { queryAllByText, emitted, updateProps } = harness;

    await updateProps({
      minDate: new Date(today.getFullYear(), today.getMonth(), 15),
      maxDate: new Date(today.getFullYear(), today.getMonth(), 20),
      today: null,
    });

    let elements = queryAllByText('13');
    await fireEvent.click(elements.length === 1 ? elements[0] : elements[1]);

    expect(emitted().input).toBeFalsy();

    elements = queryAllByText('16');
    await fireEvent.click(elements.length === 1 ? elements[0] : elements[1]);

    expect(emitted().input).toEqual([[getUTCDate(today.getFullYear(), today.getMonth(), 16)]]);
  });

  test('renders component with range and does not emit change event when disabled day is clicked', async () => {
    const { queryAllByText, emitted, updateProps } = harness;

    await updateProps({
      rangeStart: new Date(today.getFullYear(), today.getMonth(), 15),
      minDate: new Date(today.getFullYear(), today.getMonth(), 15),
      rangeEnd: new Date(today.getFullYear(), today.getMonth(), 20),
    });

    let elements = queryAllByText('13');
    await fireEvent.click(elements.length === 1 ? elements[0] : elements[1]);

    expect(emitted().input).toBeFalsy();

    elements = queryAllByText('21');
    await fireEvent.click(elements.length === 1 ? elements[0] : elements[1]);

    expect(emitted().input).toEqual([[getUTCDate(today.getFullYear(), today.getMonth(), 21)]]);
  });

  test('renders component with selected date', async () => {
    const { getByText, queryAllByText, updateProps } = harness;
    const selectedDate = getUTCDate(today.getFullYear(), today.getMonth(), 15);

    await updateProps({ selectedDate });

    getByText(getWeekdayName(selectedDate));
    expect(queryAllByText(getMonthName(selectedDate))).toHaveLength(3);
    expect(queryAllByText(selectedDate.getDate())).toHaveLength(2);
    expect(queryAllByText(selectedDate.getFullYear())).toHaveLength(3);
  });

  test('should render 31. may 2018', async () => {
    const { getByText, queryAllByText, updateProps } = harness;
    const selectedDate = getUTCDate(2018, 4, 31);

    await updateProps({ today: selectedDate, selectedDate });

    getByText(getWeekdayName(selectedDate));
    expect(queryAllByText(getMonthName(selectedDate))).toHaveLength(3);
    expect(queryAllByText(selectedDate.getDate())).toHaveLength(2);
    expect(queryAllByText(selectedDate.getFullYear())).toHaveLength(3);
  });

  test('should render 100 years minDate + 100 years in future', async () => {
    const { updateProps, getByText } = harness;

    await updateProps({ minDate: new Date(2000, 1, 1) });

    getByText('2050');
    getByText('2100');
  });

  test('should render 100 years maxDate - 100 years in the past', async () => {
    const { updateProps, getByText } = harness;

    await updateProps({ maxDate: new Date(2000, 1, 1), selectedDate: new Date(2000, 1, 1) });

    getByText('1950');
    getByText('1900');
  });

  test('should render 50 in the past and 50 years in the future', () => {
    const { getByText } = harness;

    getByText((today.getFullYear() - 50).toString());
    getByText((today.getFullYear() + 50).toString());
  });

  test('should render the right week days if firstDayOdWeek is 1 and the first day of the month is a sunday', async () => {
    const { updateProps, container } = harness;
    const testDate = new Date(2019, 11, 1);

    await updateProps({ firstDayOfWeek: 1, today: testDate });

    const cell = container.querySelector('tbody').querySelector('tr').querySelectorAll('td').item(6);

    expect(cell.textContent.trim()).toBe('1');
  });

  test('should change year', async () => {
    const { getByTestId, queryAllByText } = harness;
    const nextYear = getUTCDate(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());

    expect(queryAllByText(today.getFullYear())).toHaveLength(3);

    await fireEvent.click(getByTestId('custom-calendar1-year'));
    await fireEvent.click(queryAllByText(nextYear.getFullYear())[1]);

    expect(queryAllByText(today.getFullYear())).toHaveLength(1);
  });

  test('should change month', async () => {
    const { getByTestId, queryAllByText } = harness;
    const nextMonthName = getMonthName(
      getUTCDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
    );

    expect(queryAllByText(nextMonthName)).toHaveLength(1);

    await fireEvent.click(getByTestId('custom-calendar1-month'));
    await fireEvent.click(queryAllByText(nextMonthName)[1]);

    expect(queryAllByText(nextMonthName)).toHaveLength(3);
  });
});
