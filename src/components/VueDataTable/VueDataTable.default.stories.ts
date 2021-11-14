import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { i18n } from '@/test/i18n';
import ComponentDocs from '@/assets/design-system/docs/components/ComponentDocs.vue';
import VueDropdown from '@/components/input-and-actions/VueDropdown/VueDropdown.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueAvatar from '@/components/data-display/VueAvatar/VueAvatar.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueTiles from '@/components/layout/VueTiles/VueTiles.vue';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueToggle from '@/components/input-and-actions/VueToggle/VueToggle.vue';
import VueSelect from '@/components/input-and-actions/VueSelect/VueSelect.vue';
import VueBadge from '@/components/data-display/VueBadge/VueBadge.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import { dataTableRecordsFixture, dataTableColumnsFixture } from './DataTableFixtures';
import VueDataTable from './VueDataTable.vue';

const story = storiesOf('Vuesion+|DataTable', module) as any;

story.add(
  'Default',
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
      VueStack,
      VueTiles,
      VueInput,
      VueToggle,
      VueSelect,
      VueBadge,
      VueBox,
    },
    data(): any {
      return {
        columns: dataTableColumnsFixture(),
        records: dataTableRecordsFixture(),
        page: 1,
        maxRows: 5,
        showTitle: true,
        showSearch: true,
        searchPlaceholder: 'Search for firstname, lastname, status or id...',
        numberOfRecordsSuffix: 'Users',
        sortKey: 'id',
        sortDirection: { label: 'Ascending', value: 'asc' },
        clearSelection: true,
      };
    },
    template: `
      <component-docs
        :show-disclaimer="true"
        component-name="DataTable"
        usage="Used to organize and display data efficiently. The data table component allows for customization with additional functionality, as needed by your product’s users."
        story="Display data table with 100 records, custom rendering, synchronous interactions based on the record data and all its properties."
      >
      <vue-stack>
        <vue-tiles :columns="[1, 2]">
          <vue-input label="Page" name="page" id="page" hide-description v-model="page"/>
          <vue-input label="Max rows per page" name="maxRows" id="maxRows" hide-description v-model="maxRows"/>
          <vue-input label="Placeholder for search bar" name="searchPlaceholder" id="searchPlaceholder" hide-description
                     v-model="searchPlaceholder"/>
          <vue-input label="Number of records suffix" name="numberOfRecordsSuffix" id="numberOfRecordsSuffix" hide-description
                     v-model="numberOfRecordsSuffix"/>
          <vue-input label="Sort key (column)" name="sortKey" id="sortKey" hide-description v-model="sortKey"/>
          <vue-select
            :items="[
          { label: 'Ascending', value: 'asc' },
          { label: 'Descending', value: 'desc' }
          ]"
            label="Sort direction"
            name="sortDirection"
            id="sortDirection"
            v-model="sortDirection"
          />
          <vue-box :padding="null" align-y="center">
            <vue-toggle label="Show search bar" name="showSearch" id="showSearch" v-model="showSearch"/>
          </vue-box>
          <vue-box :padding="null" align-y="center">
            <vue-toggle label="Clear selection after bulk action" name="clearSelection" id="clearSelection" v-model="clearSelection"/>
          </vue-box>
          <vue-box :padding="null" align-y="center">
            <vue-toggle label="Show title" name="showTitle" id="showTitle" v-model="showTitle"/>
          </vue-box>
        </vue-tiles>

        <vue-data-table
          id="table1"
          primary-key="id"
          title="Users"
          :columns="columns"
          :records="records"
          :page="page"
          :max-rows="maxRows"
          :show-title="showTitle"
          :show-search="showSearch"
          :search-placeholder="searchPlaceholder"
          :number-of-records-suffix="numberOfRecordsSuffix"
          :sort-key="sortKey"
          :sort-direction="sortDirection.value"
          :bulk-actions="[{ leadingIcon: 'trash', label: 'Delete', value: 'delete' }]"
          :clear-selection="clearSelection"
          @row-click="onRowClick"
          @paginate="page = $event"
          @max-rows-change="maxRows = $event; page = 1;"
          @sorting-key-change="sortKey = $event"
          @sorting-direction-change="sortDirection = $event"
          @search="onSearch"
          @bulk-action="onBulkAction"
        >
          <template v-slot:user="{ row }">
            <vue-columns space="12" align-y="center">
              <vue-column width="content">
                <vue-avatar :name="row.firstname + ' ' + row.lastname" size="sm" :src="row.avatar"/>
              </vue-column>
              <vue-column>
                <vue-text weight="semi-bold" as="div">
                  {{ row.firstname }} {{ row.lastname }}
                </vue-text>
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
      </vue-stack>
      </component-docs>`,
    methods: {
      onRowClick: action('@row-click'),
      onItemClick: action('@item-click'),
      onSearch: action('@search'),
      onBulkAction: action('@bulk-action'),
    },
  }),
  {
    info: {
      components: { VueDataTable },
    },
  },
);
