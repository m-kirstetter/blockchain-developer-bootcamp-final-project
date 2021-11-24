import { storiesOf } from '@storybook/vue';
import { i18n } from '@/test/i18n';
import ComponentDocs from '@/assets/design-system/docs/components/ComponentDocs.vue';
import { IItem } from '@/interfaces/IItem';
import { sleep } from '@/test/test-utils';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueAvatar from '@/components/data-display/VueAvatar/VueAvatar.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueDropdown from '@/components/input-and-actions/VueDropdown/VueDropdown.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueBadge from '@/components/data-display/VueBadge/VueBadge.vue';
import { IDataTableBulkActionEvent } from './IDataTable';
import { dataTableRecordsFixture, dataTableColumnsFixture } from './DataTableFixtures';
import VueDataTable from './VueDataTable.vue';

const story = storiesOf('Vuesion+|DataTable', module) as any;

story.add(
  'Async mode',
  () => ({
    i18n,
    components: {
      VueDataTable,
      ComponentDocs,
      VueColumns,
      VueColumn,
      VueAvatar,
      VueText,
      VueBox,
      VueDropdown,
      VueBadge,
    },
    data(): any {
      return {
        columns: dataTableColumnsFixture(),
        records: [...dataTableRecordsFixture()].slice(0, 5),
        numberOfRecords: 500000000,
        numberOfRecordsSuffix: 'Users',
        page: 1,
        maxRows: 5,
        isLoading: false,
        sortKey: null,
        sortDirection: 'asc',
        bulkActions: [{ label: 'Delete', value: 'delete', leadingIcon: 'Trash' }],
        groupByOptions: [
          { label: 'Group by', value: null },
          { label: 'Status', value: 'status' },
        ],
        groupBy: null,
      };
    },
    template: `
      <component-docs
        story="Handle all operations via the backend. Display data and current state via data-table props"
      >
        <vue-data-table
          id="table1"
          primary-key="id"
          title="Users"
          async-mode
          :columns="columns"
          :records="records"
          :number-of-records="numberOfRecords"
          :number-of-records-suffix="numberOfRecordsSuffix"
          :page="page"
          :max-rows="maxRows"
          :is-loading="isLoading"
          :sort-key="sortKey"
          :sort-direction="sortDirection"
          :bulk-actions="bulkActions"
          :group-by-options="groupByOptions"
          :group-by="groupBy"
          @sorting-key-change="onSortKeyChange"
          @sorting-direction-change="onSortDirectionChange"
          @row-click="onRowClick"
          @paginate="onPaginate"
          @max-rows-change="onMaxRowsChange"
          @search="onSearch"
          @bulk-action="onBulkAction"
          @group-by="onGroupBy"
        >
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
              align-menu="right"/>
          </template>

          <template slot="empty-state">
            <vue-box padding="32" align="center">
              No Results found!
            </vue-box>
          </template>
        </vue-data-table>
      </component-docs>`,
    methods: {
      // all the function should be replaced with an actual call to the backend
      // the backend needs to provide search, pagination, grouping and sorting
      async onSortKeyChange(key: string) {
        this.isLoading = true;

        await sleep(500);

        this.sortKey = key;

        this.isLoading = false;
      },
      async onSortDirectionChange(sortDirection: string) {
        this.isLoading = true;

        await sleep(500);

        this.sortDirection = sortDirection;

        this.isLoading = false;
      },
      async onRowClick(row: any) {
        this.isLoading = true;

        await sleep(500);

        alert(JSON.stringify(row));

        this.isLoading = false;
      },
      async onPaginate(page: number) {
        this.isLoading = true;

        await sleep(500);

        this.page = page;
        this.records = [...dataTableRecordsFixture()].slice(0, this.maxRows);

        this.isLoading = false;
      },
      async onMaxRowsChange(maxRows: number) {
        this.isLoading = true;

        await sleep(500);

        this.maxRows = maxRows;
        this.records = [...dataTableRecordsFixture()].slice(0, this.maxRows);

        this.isLoading = false;
      },
      async onSearch(query: string) {
        this.isLoading = true;

        await sleep(500);

        this.records = [...dataTableRecordsFixture()]
          .filter((record: any) => {
            query = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            if (query.length === 0) {
              return true;
            }

            const searchRegex = new RegExp(`${query}`, 'gmi');
            let match = false;

            Object.keys(record).forEach((key: string) => {
              if (match === false) {
                match = searchRegex.exec(record[key].toString().toLowerCase()) !== null;
              }
            });

            return match;
          })
          .slice(0, this.maxRows);

        this.isLoading = false;
      },
      async onBulkAction({ selectedAllRecords }: IDataTableBulkActionEvent) {
        this.isLoading = true;

        await sleep(500);

        if (selectedAllRecords) {
          this.records = [];
        } else {
          this.records = [...dataTableRecordsFixture()].slice(0, this.maxRows);
        }

        this.isLoading = false;
      },
      async onGroupBy(groupByOption: IItem) {
        this.isLoading = true;

        await sleep(500);

        this.groupBy = groupByOption.value;
        this.records = [...dataTableRecordsFixture()].slice(0, this.maxRows);

        this.isLoading = false;
      },
    },
  }),
  {
    info: {
      components: { VueDataTable },
    },
  },
);
