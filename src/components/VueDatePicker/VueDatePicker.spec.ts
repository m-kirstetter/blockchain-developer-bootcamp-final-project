import { fireEvent, render, RenderResult, waitFor } from '@testing-library/vue';
import { triggerDocument } from '@/test/test-utils';
import VueDatePicker from './VueDatePicker.vue';
import { getUTCDate } from '@/components/VueCalendar/utils';

describe('VueDatePicker.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(VueDatePicker, {
      props: {
        id: 'date-picker',
        name: 'date-picker',
        label: 'Start date',
        disabled: false,
        placeholder: 'Select a date',
        duration: 0,
        locale: 'en',
      },
    });
  });

  test('renders component', () => {
    const { getByPlaceholderText } = harness;

    getByPlaceholderText('Select a date');
  });

  test('renders component value in EN locale', async () => {
    const { updateProps, getByDisplayValue } = harness;

    await updateProps({ value: '2000-12-01' });

    getByDisplayValue('12/01/2000');
  });

  test('renders component value in DE locale', async () => {
    const { updateProps, getByDisplayValue } = harness;

    await updateProps({ value: new Date('2000-12-01'), locale: 'de' });

    getByDisplayValue('01.12.2000');
  });

  test('renders component value in different format', async () => {
    const { updateProps, getByDisplayValue } = harness;

    await updateProps({ value: new Date('2000-12-01'), format: { day: '2-digit', month: 'long', year: 'numeric' } });

    getByDisplayValue('December 01, 2000');
  });

  test('should emit input event', async () => {
    const tomorrow = new Date('2021-03');
    const { getByPlaceholderText, getByTestId, queryAllByText, emitted } = harness;

    tomorrow.setDate(tomorrow.getDate() + 1);

    await fireEvent.focus(getByPlaceholderText('Select a date'));
    await fireEvent.click(getByTestId('custom-date-picker-calendar-month'));
    await fireEvent.click(queryAllByText('March')[1]);
    await fireEvent.click(getByTestId('custom-date-picker-calendar-year'));
    await fireEvent.click(queryAllByText('2021')[1]);
    await fireEvent.click(queryAllByText(tomorrow.getDate())[0]);

    expect(emitted().input).toEqual([[getUTCDate(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())]]);
  });

  test('should open calendar and close it via escape keypress', async () => {
    const { getByTestId, queryByText, updateProps } = harness;
    const datePicker = getByTestId('date-picker');

    await updateProps({ value: '2000-12-01' });

    // don't show calendar when 'e' key is pressed
    await fireEvent.keyDown(datePicker, { key: 'e', code: 'KeyE' });
    await waitFor(() => {
      expect(queryByText('Friday')).not.toBeInTheDocument();
    });

    await fireEvent.keyDown(datePicker, { key: 'Enter', code: 'Enter' });
    await waitFor(() => {
      expect(queryByText('Friday')).toBeInTheDocument();
    });

    // hide calendar on 'Escape' press
    await fireEvent.keyDown(datePicker, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(queryByText('Friday')).not.toBeInTheDocument();
    });
  });

  test('should open calendar and close it via outside click', async () => {
    harness.unmount();

    const { getByDisplayValue, queryByText, updateProps } = render(VueDatePicker, {
      props: {
        id: 'date-picker',
        name: 'date-picker',
        label: 'Start date',
        disabled: false,
        placeholder: 'Select a date',
        duration: 0,
        locale: 'en',
      },
      stubs: ['vue-select'],
    });

    await updateProps({ value: '2000-12-01' });
    await waitFor(() => {
      expect(queryByText('Friday')).not.toBeInTheDocument();
    });

    await fireEvent.focus(getByDisplayValue('12/01/2000'));
    await waitFor(() => {
      expect(queryByText('Friday')).toBeInTheDocument();
    });

    triggerDocument.mousedown({ target: null });

    await waitFor(() => {
      expect(queryByText('Friday')).not.toBeInTheDocument();
    });
  });
});
