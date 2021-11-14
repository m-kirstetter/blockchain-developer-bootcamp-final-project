import { storiesOf } from '@storybook/vue';
import { i18n } from '@/test/i18n';
import ComponentDocs from '@/assets/design-system/docs/components/ComponentDocs.vue';
import VueDropdown from '@/components/input-and-actions/VueDropdown/VueDropdown.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueAvatar from '@/components/data-display/VueAvatar/VueAvatar.vue';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueToggle from '@/components/input-and-actions/VueToggle/VueToggle.vue';
import VueSelect from '@/components/input-and-actions/VueSelect/VueSelect.vue';
import VueBadge from '@/components/data-display/VueBadge/VueBadge.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueInline from '@/components/layout/VueInline/VueInline.vue';
import { dataTableColumnsFixture, dataTableRecordsFixture, dataTableRecordsGroupingFixture } from './DataTableFixtures';
import VueDataTable from './VueDataTable.vue';

const story = storiesOf('Vuesion+|DataTable', module) as any;

story.add(
  'Grouping',
  () => ({
    i18n,
    components: {
      VueDataTable,
      VueDropdown,
      ComponentDocs,
      VueColumns,
      VueColumn,
      VueText,
      VueAvatar,
      VueInput,
      VueToggle,
      VueSelect,
      VueBadge,
      VueBox,
      VueButton,
      VueInline,
    },
    data(): any {
      return {
        columns: dataTableColumnsFixture(),
        records: dataTableRecordsGroupingFixture(),
        groupByOptions: [
          { label: 'Group by', value: null },
          { label: 'Status', value: 'status' },
          { label: 'Age', value: 'age' },
        ],
        groupBy: { label: 'Group by', value: null },
      };
    },
    template: `
      <component-docs
        story="Show group by options and group records."
      >
      <vue-data-table
        id="table1"
        primary-key="id"
        title="Users"
        :max-rows="5"
        :columns="columns"
        :records="records"
        :group-by-options="groupByOptions"
        :group-by="groupBy.value"
        @group-by="groupBy.value = $event.value"
      >
        <template v-slot:group-header="{ column, recordCount, value, groupBy }">
          <template v-if="groupBy === 'status'">
            <vue-inline space="8">
              <vue-text color="text-medium" look="small-title" weight="semi-bold">
                {{ column.title }}
              </vue-text>
              <vue-badge v-if="value === 'new'" status="success">New</vue-badge>
              <vue-badge v-else-if="value === 'pending'" status="warning">Pending</vue-badge>
              <vue-badge v-else-if="value === 'blocked'" status="danger">Blocked</vue-badge>
              <vue-badge v-else-if="value === 'registered'" status="info">Registered</vue-badge>

              <vue-text color="text-medium" look="small-title" weight="semi-bold">
                ({{ $n(recordCount) }})
              </vue-text>
            </vue-inline>
          </template>
          <template v-else>
            <vue-text color="text-medium" look="small-title" weight="semi-bold">
              {{ column.title }}: {{ value }} ({{ $n(recordCount) }})
            </vue-text>
          </template>
        </template>

        <template v-slot:user="{ row }">
          <vue-columns space="12" align-y="center">
            <vue-column width="content">
              <vue-avatar :name="row.firstname + ' ' + row.lastname" size="md" :src="row.avatar"/>
            </vue-column>
            <vue-column>
              <vue-text weight="semi-bold" as="div">{{ row.firstname }} {{ row.lastname }}</vue-text>
              <vue-text color="text-low">ID: {{ row.id }}</vue-text>
            </vue-column>
          </vue-columns>
        </template>

        <template v-slot:status="{ cell }">
          <vue-badge v-if="cell.value === 'new'" status="success">New</vue-badge>
          <vue-badge v-else-if="cell.value === 'pending'" status="warning">Pending</vue-badge>
          <vue-badge v-else-if="cell.value === 'blocked'" status="danger">Blocked</vue-badge>
          <vue-badge v-else-if="cell.value === 'registered'" status="info">Registered</vue-badge>
        </template>

        <template v-slot:date="{ cell }">
          {{ $d(cell.value, 'dayMonthYearNumeric', 'de') }}
        </template>

        <template v-slot:actions="{ cell, row }">
          <vue-dropdown
            button-text="Select"
            :items="[{label:'Delete', value:'delete'}]"
            align-menu="right"
            @item-click="onItemClick(cell, row)"/>
        </template>

        <template slot="empty-state">
          <vue-box padding="32" align="center">
            No Results found!
          </vue-box>
        </template>
      </vue-data-table>
      </component-docs>`,
    methods: {},
  }),
  {
    info: {
      components: { VueDataTable },
    },
  },
);

story.add(
  'Lot of records',
  () => ({
    i18n,
    components: {
      VueDataTable,
      VueDropdown,
      ComponentDocs,
      VueColumns,
      VueColumn,
      VueText,
      VueAvatar,
      VueInput,
      VueToggle,
      VueSelect,
      VueBadge,
      VueBox,
      VueButton,
      VueInline,
    },
    data(): any {
      return {
        columns: dataTableColumnsFixture(),
        records: dataTableRecordsFixture(50000),
        groupByOptions: [
          { label: 'Group by', value: null },
          { label: 'Status', value: 'status' },
          { label: 'Age', value: 'age' },
        ],
        groupBy: { label: 'Group by', value: null },
      };
    },
    template: `
      <component-docs
        story="Show 50.000 records."
      >
        <vue-data-table
          id="table1"
          primary-key="id"
          title="Users"
          :max-rows="5"
          :columns="columns"
          :records="records"
          :group-by-options="groupByOptions"
          :group-by="groupBy.value"
          @group-by="groupBy.value = $event.value"
        >
          <template v-slot:group-header="{ column, recordCount, value, groupBy }">
            <template v-if="groupBy === 'status'">
              <vue-inline space="8">
                <vue-text color="text-medium" look="small-title" weight="semi-bold">
                  {{ column.title }}
                </vue-text>
                <vue-badge v-if="value === 'new'" status="success">New</vue-badge>
                <vue-badge v-else-if="value === 'pending'" status="warning">Pending</vue-badge>
                <vue-badge v-else-if="value === 'blocked'" status="danger">Blocked</vue-badge>
                <vue-badge v-else-if="value === 'registered'" status="info">Registered</vue-badge>

                <vue-text color="text-medium" look="small-title" weight="semi-bold">
                  ({{ $n(recordCount) }})
                </vue-text>
              </vue-inline>
            </template>
            <template v-else>
              <vue-text color="text-medium" look="small-title" weight="semi-bold">
                {{ column.title }}: {{ value }} ({{ $n(recordCount) }})
              </vue-text>
            </template>
          </template>

          <template v-slot:user="{ row }">
            <vue-columns space="12" align-y="center">
              <vue-column width="content">
                <vue-avatar :name="row.firstname + ' ' + row.lastname" size="md" :src="row.avatar"/>
              </vue-column>
              <vue-column>
                <vue-text weight="semi-bold" as="div">{{ row.firstname }} {{ row.lastname }}</vue-text>
                <vue-text color="text-low">ID: {{ row.id }}</vue-text>
              </vue-column>
            </vue-columns>
          </template>

          <template v-slot:status="{ cell }">
            <vue-badge v-if="cell.value === 'new'" status="success">New</vue-badge>
            <vue-badge v-else-if="cell.value === 'pending'" status="warning">Pending</vue-badge>
            <vue-badge v-else-if="cell.value === 'blocked'" status="danger">Blocked</vue-badge>
            <vue-badge v-else-if="cell.value === 'registered'" status="info">Registered</vue-badge>
          </template>

          <template v-slot:date="{ cell }">
            {{ $d(cell.value, 'dayMonthYearNumeric', 'de') }}
          </template>

          <template v-slot:actions="{ cell, row }">
            <vue-dropdown
              button-text="Select"
              :items="[{label:'Delete', value:'delete'}]"
              align-menu="right" />
          </template>

          <template slot="empty-state">
            <vue-box padding="32" align="center">
              No Results found!
            </vue-box>
          </template>
        </vue-data-table>
      </component-docs>`,
    methods: {},
  }),
  {
    info: {
      components: { VueDataTable },
    },
  },
);
