import { storiesOf } from '@storybook/vue';
import ComponentDocs from '@/assets/design-system/docs/components/ComponentDocs.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueTiles from '@/components/layout/VueTiles/VueTiles.vue';
import VueToggle from '@/components/input-and-actions/VueToggle/VueToggle.vue';
import VueSelect from '@/components/input-and-actions/VueSelect/VueSelect.vue';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueCollapse from '@/components/behavior/VueCollapse/VueCollapse.vue';
import VueDatePicker from './VueDatePicker.vue';

const story = storiesOf('Vuesion+|DatePicker', module) as any;

story.add(
  'Default',
  () => ({
    components: {
      ComponentDocs,
      VueDatePicker,
      VueStack,
      VueTiles,
      VueToggle,
      VueSelect,
      VueInput,
      VueBox,
      VueCollapse,
    },
    data(): any {
      return {
        showProps: false,
        label: 'Start date',
        hideLabel: false,
        hideDescription: false,
        required: false,
        value: null,
        disabled: false,
        placeholder: 'Select a date',
        description: 'Please select a start date',
        errorMessage: 'This field is required',
        duration: 250,
        size: { label: 'Medium', value: 'md' },
        minDate: null,
        maxDate: null,
        firstDayOfWeek: 1,
        today: new Date(),
        locale: { label: 'English', value: 'en' },
        format: { day: '2-digit', month: '2-digit', year: 'numeric' },
        alignY: { label: 'Bottom', value: 'bottom' },
      };
    },
    methods: {
      formatDate(date: Date) {
        if (date && date.toJSON()) {
          return date.toJSON().substr(0, 10);
        }

        return null;
      },
      setDate(prop: string, date: string) {
        if (date.length) {
          this[prop] = new Date(date);
        } else {
          this[prop] = null;
        }
      },
    },
    template: `<component-docs
      component-name="Date Picker"
      usage="Used to let the user select a date as input value."
      story="Display the date picker component and all its properties."
      show-disclaimer
    >
      <vue-stack space="64">
        <vue-stack>
          <vue-toggle label="Show props" name="showProps" id="showProps" v-model="showProps" />
          <vue-collapse :show="showProps">
            <vue-tiles :columns="[1, 2]">
              <vue-input label="Label" name="label" id="label" hide-description v-model="label" />
              <vue-box align-y="center" padding="null">
                <vue-toggle label="Hide label" name="hideLabel" id="hideLabel" v-model="hideLabel" />
              </vue-box>
              <vue-box align-y="center" padding="null">
                <vue-toggle label="Hide description" name="hideDescription" id="hideDescription" v-model="hideDescription" />
              </vue-box>
              <vue-box align-y="center" padding="null">
                <vue-toggle label="Required" name="required" id="required" v-model="required" />
              </vue-box>
              <vue-input label="Selected Date" name="value" id="value" type="date" hide-description :value="formatDate(value)" @input="setDate('value', $event)" />
              <vue-box align-y="center" padding="null">
                <vue-toggle label="Disabled" name="disabled" id="disabled" v-model="disabled" />
              </vue-box>
              <vue-input label="Placeholder" name="placeholder" id="placeholder" hide-description v-model="placeholder" />
              <vue-input label="Description" name="description" id="description" hide-description v-model="description" />
              <vue-input label="Error message" name="errorMessage" id="errorMessage" hide-description v-model="errorMessage" />
              <vue-input label="Duration" name="duration" id="duration" type="number" hide-description v-model="duration" />
              <vue-select
                :items="[
              { label: 'Small', value: 'sm' },
              { label: 'Medium', value: 'md' },
              { label: 'Large', value: 'lg' },
              ]"
                label="Size"
                name="size"
                id="size"
                hide-description
                v-model="size"
              />
              <vue-input label="Minimum Date" name="minDate" id="minDate" type="date" hide-description :value="formatDate(minDate)" @input="setDate('minDate', $event)" />
              <vue-input label="Maximum Date" name="maxDate" id="maxDate" type="date" hide-description :value="formatDate(maxDate)" @input="setDate('maxDate', $event)" />
              <vue-input label="First day of week" name="firstDayOfWeek" id="firstDayOfWeek" type="number" hide-description v-model="firstDayOfWeek" />
              <vue-input label="Today" name="today" id="today" type="date" hide-description :value="formatDate(today)" @input="setDate('today', $event)" />
              <vue-select
                label="Locale"
                name="locale"
                id="locale"
                hide-description
                v-model="locale"
                :items="[
                  { label: 'English', value: 'en' },
                  { label: 'Deutsch', value: 'de' },
                  { label: 'Español', value: 'es' },
                  { label: 'Français', value: 'fr' },
              ]"
              />
              <vue-select
                label="Day format"
                name="dayFormat"
                id="dayFormat"
                hide-description
                :items="[
              { label: 'numeric', value: 'numeric' },
              { label: '2-digit', value: '2-digit' },
            ]"
                :value="format.day"
                @input="format.day = $event.value"
              />
              <vue-select
                label="Month format"
                name="monthFormat"
                id="monthFormat"
                hide-description
                :items="[
              { label: 'numeric', value: 'numeric' },
              { label: '2-digit', value: '2-digit' },
              { label: 'narrow', value: 'narrow' },
              { label: 'short', value: 'short' },
              { label: 'long', value: 'long' },
            ]"
                :value="format.month"
                @input="format.month = $event.value"
              />
              <vue-select
                label="Year format"
                name="yearFormat"
                id="yearFormat"
                hide-description
                :items="[
              { label: 'numeric', value: 'numeric' },
              { label: '2-digit', value: '2-digit' },
            ]"
                :value="format.year"
                @input="format.year = $event.value"
              />
              <vue-select
                :items="[
              { label: 'Top', value: 'top' },
              { label: 'Bottom', value: 'bottom' },
              ]"
                label="Align vertically"
                name="alignY"
                id="alignY"
                hide-description
                v-model="alignY"
              />
            </vue-tiles>
          </vue-collapse>
        </vue-stack>

        <vue-date-picker
          id="date-picker"
          name="date-picker"
          :label="label"
          :hide-label="hideLabel"
          :hide-description="hideDescription"
          :required="required"
          :disabled="disabled"
          :placeholder="placeholder"
          :description="description"
          :error-message="errorMessage"
          :duration="duration"
          :size="size.value"
          :min-date="minDate"
          :max-date="maxDate"
          :first-day-of-week="firstDayOfWeek"
          :today="today"
          :locale="locale.value"
          :format="format"
          :align-y="alignY.value"
          v-model="value"
          @clear="value = null"
        />
      </vue-stack>
    </component-docs>`,
  }),
  {
    info: {
      components: { VueDatePicker },
    },
  },
);
