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
import { dataTableRecordsFixture, dataTableColumnsFixture } from './DataTableFixtures';
import VueDataTable from './VueDataTable.vue';

const story = storiesOf('Vuesion+|DataTable', module) as any;

story.add(
  'Expandable rows',
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
    },
    data(): any {
      return {
        columns: {
          expand: { sortable: false, searchable: false, slot: 'expand', title: ' ', inlineStyle: { width: '64px' } },
          ...dataTableColumnsFixture(),
        },
        records: dataTableRecordsFixture(),
        expandedRows: [],
      };
    },
    template: `
      <component-docs
        story="Display additional information per record."
      >
        <vue-data-table
          id="table1"
          primary-key="id"
          title="Users"
          :columns="columns"
          :records="records"
        >
          <template v-slot:row="{ row }">
            <td>
              <vue-button
                size="sm"
                look="outline"
                :leading-icon="expandedRows.includes(row.id) ? 'minus' : 'plus'"
                :style="{ padding: '0', height: 'auto', minWidth: 'auto' }"
                @click="onExpand(row.id)"
              />
            </td>
            <td>
              <vue-columns space="12" align-y="center">
                <vue-column width="content">
                  <vue-avatar :name="row.firstname + ' ' + row.lastname" size="md" :src="row.avatar"/>
                </vue-column>
                <vue-column>
                  <vue-text weight="semi-bold" as="div">{{ row.firstname }} {{ row.lastname }}</vue-text>
                  <vue-text color="text-low">ID: {{ row.id }}</vue-text>
                </vue-column>
              </vue-columns>
            </td>
            <td>{{ row.age }}</td>
            <td>{{ row.address }}</td>
            <td>
              <vue-badge v-if="row.status === 'new'" status="success">New</vue-badge>
              <vue-badge v-else-if="row.status === 'pending'" status="warning">Pending</vue-badge>
              <vue-badge v-else-if="row.status === 'blocked'" status="danger">Blocked</vue-badge>
              <vue-badge v-else-if="row.status === 'registered'" status="info">Registered</vue-badge>
            </td>
            <td>{{ $d(row.created, 'dayMonthYearNumeric', 'de') }}</td>
            <td>{{ $d(row.updated, 'dayMonthYearNumeric', 'de') }}</td>
            <td>
              <vue-dropdown
                button-text="Select"
                :items="[{label:'Edit', value:'edit'}]"
                align-menu="right"
              />
            </td>
          </template>

          <template v-slot:after-row="{ row, rowKey }">
            <tr v-if="expandedRows.includes(row.id)" :key="'additional-info-' + row.id">
              <td></td>
              <td colspan="7">
                <table>
                  <thead>
                  <tr>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>ID</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>{{ row.firstname }}</td>
                    <td>{{ row.lastname }}</td>
                    <td>{{ row.id }}</td>
                  </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>

          <template slot="empty-state">
            <vue-box padding="32" align="center">
              No Results found!
            </vue-box>
          </template>
        </vue-data-table>
      </component-docs>`,
    methods: {
      onExpand(id: string | number) {
        if (this.expandedRows.includes(id)) {
          this.expandedRows = this.expandedRows.filter((rowId: string | number) => rowId !== id);
        } else {
          this.expandedRows.push(id);
        }
      },
    },
  }),
  {
    info: {
      components: { VueDataTable },
    },
  },
);
