import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { i18n } from '@/test/i18n';
import ComponentDocs from '@/assets/design-system/docs/components/ComponentDocs.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueSelect from '@/components/input-and-actions/VueSelect/VueSelect.vue';
import VueCalendar from './VueCalendar.vue';

const story = storiesOf('Vuesion+|Calendar', module) as any;

story.add(
  'Default',
  () => ({
    components: { ComponentDocs, VueCalendar, VueStack, VueColumns, VueColumn, VueInput, VueSelect },
    data(): any {
      return {
        minDate: null,
        maxDate: null,
        rangeStart: null,
        rangeEnd: null,
        firstDayOfWeek: 1,
        selectedDate: null,
        today: undefined,
        locale: { label: 'English', value: 'en' },
      };
    },
    template: `
      <component-docs
        component-name="Calendar"
        usage="Used to display a gregorian calendar."
        story="Show the calendar component with all its properties."
        show-disclaimer
      >
      <vue-stack space="64">
        <vue-stack>
          <vue-columns stack-phone>
            <vue-column :width="['content', '50%']">
              <vue-input label="Minimum date" name="minDate" id="minDate" hide-description type="date" v-model="minDate" />
            </vue-column>
            <vue-column :width="['content', '50%']">
              <vue-input label="Maximum date" name="maxDate" id="maxDate" hide-description type="date" v-model="maxDate" />
            </vue-column>
          </vue-columns>

          <vue-columns stack-phone>
            <vue-column :width="['content', '50%']">
              <vue-input label="Range start" name="rangeStart" id="rangeStart" hide-description type="date" v-model="rangeStart" />
            </vue-column>
            <vue-column :width="['content', '50%']">
              <vue-input label="Range end" name="rangeEnd" id="rangeEnd" hide-description type="date" v-model="rangeEnd" />
            </vue-column>
          </vue-columns>

          <vue-columns stack-phone>
            <vue-column :width="['content', '50%']">
              <vue-input
                label="First day of week"
                name="firstDayOfWeek"
                id="firstDayOfWeek"
                hide-description
                type="number"
                v-model="firstDayOfWeek"
              />
            </vue-column>
            <vue-column :width="['content', '50%']">
              <vue-input label="Selected date" name="selectedDate" id="selectedDate" hide-description type="date" v-model="selectedDate" />
            </vue-column>
          </vue-columns>

          <vue-columns stack-phone>
            <vue-column :width="['content', '50%']">
              <vue-input
                label="Today"
                name="today"
                id="today"
                hide-description
                type="date"
                v-model="today"
              />
            </vue-column>
            <vue-column :width="['content', '50%']">
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
            </vue-column>
          </vue-columns>
        </vue-stack>

        <vue-calendar
          id="calendar1"
          :min-date="minDate"
          :max-date="maxDate"
          :range-start="rangeStart"
          :range-end="rangeEnd"
          :first-day-of-week="firstDayOfWeek"
          :selected-date="selectedDate"
          :today="today"
          :locale="locale.value"
          @input="onChange($event); selectedDate = $event.toJSON().slice(0, 10)"
        />
      </vue-stack>
      </component-docs>`,
    i18n,
    methods: {
      onChange: action('@change'),
    },
  }),
  {
    info: {
      components: { VueCalendar },
    },
  },
);
