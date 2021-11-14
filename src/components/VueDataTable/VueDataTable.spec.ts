import uniq from 'lodash/uniq';
import { fireEvent, render, RenderResult } from '@testing-library/vue';
import { i18n } from '@/test/i18n';
import { sleep } from '@/test/test-utils';
import { dataTableColumnsFixture, dataTableRecordsFixture, dataTableRecordsGroupingFixture } from './DataTableFixtures';
import VueDataTable from './VueDataTable.vue';

describe('VueDataTable.vue', () => {
  describe('default', () => {
    let harness: RenderResult;
    const columns = dataTableColumnsFixture();
    const records = dataTableRecordsFixture(100);

    beforeEach(() => {
      harness = render(VueDataTable, {
        i18n,
        props: {
          id: 'table1',
          primaryKey: 'id',
          title: 'Users',
          asyncMode: false,
          columns,
          records,
          numberOfRecords: null,
          numberOfRecordsSuffix: 'Records',
          page: 1,
          maxRows: 10,
          showTitle: true,
          showSearch: true,
          isLoading: false,
          searchPlaceholder: 'Search...',
          sortKey: null,
          sortDirection: 'asc',
          bulkActions: null,
          clearSelection: true,
          groupByOptions: null,
          groupBy: null,
        },
      });
    });

    test('renders component', () => {
      const { getByText, queryAllByText } = harness;

      expect(queryAllByText('Users')).toHaveLength(2);
      getByText('1 / 10');
      getByText('100 Records');
    });

    test('should sort by age asc', async () => {
      const { getByText, emitted, getByTestId } = harness;
      const allAgesAfterSort: Array<number> = [];

      await fireEvent.click(getByText('Age'));

      for (let i = 0; i < 10; i++) {
        const row = getByTestId(`data-table-row-${i}`) as HTMLTableRowElement;
        allAgesAfterSort.push(parseInt(row.cells[1].textContent, 10));
      }

      expect(emitted()['sorting-direction-change']).toEqual([['asc']]);
      expect(emitted()['sorting-key-change']).toEqual([['age']]);
      expect(
        records
          .sort((a: any, b: any) => {
            if (a.age < b.age) {
              return -1;
            }
            if (a.age > b.age) {
              return 1;
            }
            return 0;
          })
          .slice(0, 10)
          .map((record: any) => record.age),
      ).toEqual(allAgesAfterSort);
    });

    test('should sort by age desc', async () => {
      const { getByText, emitted, getByTestId } = harness;
      const allAgesAfterSort: Array<number> = [];

      await fireEvent.click(getByText('Age'));
      await fireEvent.click(getByText('Age'));

      for (let i = 0; i < 10; i++) {
        const row = getByTestId(`data-table-row-${i}`) as HTMLTableRowElement;
        allAgesAfterSort.push(parseInt(row.cells[1].textContent, 10));
      }

      expect(emitted()['sorting-direction-change']).toEqual([['asc'], ['desc']]);
      expect(emitted()['sorting-key-change']).toEqual([['age'], ['age']]);
      expect(
        records
          .sort((a: any, b: any) => {
            if (a.age < b.age) {
              return 1;
            }
            if (a.age > b.age) {
              return -1;
            }
            return 0;
          })
          .slice(0, 10)
          .map((record: any) => record.age),
      ).toEqual(allAgesAfterSort);

      await fireEvent.click(getByText('Age'));

      expect(emitted()['sorting-direction-change']).toEqual([['asc'], ['desc'], ['asc']]);
      expect(emitted()['sorting-key-change']).toEqual([['age'], ['age'], [null]]);
    });

    test('should go to page 2 and back to one', async () => {
      const { getByText, emitted, getByTestId } = harness;
      let allIdsAfterSort: Array<number> = [];

      await fireEvent.click(getByTestId('pagination-next'));

      for (let i = 0; i < 10; i++) {
        const row = getByTestId(`data-table-row-${i}`) as HTMLTableRowElement;
        allIdsAfterSort.push(parseInt(row.cells[0].textContent, 10));
      }

      getByText('2 / 10');

      expect(emitted().paginate).toEqual([[2]]);
      expect(records.slice(10, 20).map((record: any) => record.id)).toEqual(allIdsAfterSort);

      await fireEvent.click(getByTestId('pagination-prev'));
      allIdsAfterSort = [];

      for (let i = 0; i < 10; i++) {
        const row = getByTestId(`data-table-row-${i}`) as HTMLTableRowElement;
        allIdsAfterSort.push(parseInt(row.cells[0].textContent, 10));
      }

      getByText('1 / 10');

      expect(emitted().paginate).toEqual([[2], [1]]);
      expect(records.slice(0, 10).map((record: any) => record.id)).toEqual(allIdsAfterSort);
    });

    test('should display at least one possible page', async () => {
      const { getByText, updateProps } = harness;

      await updateProps({ records: [] });

      getByText('1 / 1');
    });

    test('should emit row-click event', async () => {
      const { getByTestId, emitted } = harness;

      await fireEvent.click(getByTestId(`data-table-row-0`));

      expect(emitted()['row-click'][0][0]).toEqual(records[0]);
    });

    test('should change max rows to display', async () => {
      const { getByText, getByTestId, emitted } = harness;
      const toggle = getByTestId('toggle-maxRows');

      await fireEvent.click(toggle);
      await sleep(50);

      await fireEvent.click(getByTestId('5-0'));

      expect(emitted()['max-rows-change']).toEqual([[5]]);
      getByText('1 / 20');
    });

    test('should search for blocked users and delete search', async () => {
      const { getByTestId, emitted, getByPlaceholderText } = harness;
      const search = getByPlaceholderText('Search...');
      const allStatusesAfterSearch: Array<string> = [];

      await fireEvent.update(search, 'blocked');
      await sleep(500);

      for (let i = 0; i < 10; i++) {
        const row = getByTestId(`data-table-row-${i}`) as HTMLTableRowElement;
        allStatusesAfterSearch.push(row.cells[3].textContent);
      }

      expect(emitted().search).toEqual([['blocked']]);
      expect(uniq(allStatusesAfterSearch)).toEqual(['blocked']);

      const deleteSearchIcon = search.parentNode.querySelector('i').parentElement;
      await fireEvent.click(deleteSearchIcon);

      expect(emitted().search).toEqual([['blocked'], ['']]);
    });
  });

  describe('bulk actions', () => {
    let harness: RenderResult;
    const columns = dataTableColumnsFixture();
    const records = dataTableRecordsFixture();

    beforeEach(() => {
      harness = render(VueDataTable, {
        i18n,
        props: {
          id: 'table1',
          primaryKey: 'id',
          title: 'Users',
          asyncMode: false,
          columns,
          records,
          numberOfRecords: null,
          numberOfRecordsSuffix: 'Records',
          page: 1,
          maxRows: 10,
          showTitle: true,
          showSearch: true,
          isLoading: false,
          searchPlaceholder: 'Search...',
          sortKey: null,
          sortDirection: 'asc',
          bulkActions: [{ label: 'Delete', value: 'delete' }],
          clearSelection: true,
          groupByOptions: null,
          groupBy: null,
        },
      });
    });

    test('should select all, emit bulk-action event and clear selection', async () => {
      const { getByText, getByTestId, emitted, queryAllByTestId } = harness;

      await fireEvent.click(getByText('Select all'));
      await fireEvent.click(getByTestId('bulk-action-toggle'));
      await sleep(50);
      await fireEvent.click(getByTestId('delete-0'));

      expect(emitted()['bulk-action'][0][0].action).toEqual({ label: 'Delete', value: 'delete' });
      expect(emitted()['bulk-action'][0][0].records).toHaveLength(100);
      expect(emitted()['bulk-action'][0][0].selectedAllRecords).toBeTruthy();
      expect(queryAllByTestId('bulk-action-toggle')).toHaveLength(0);
    });

    test('should select all, emit bulk-action event, leave selection and clear selection after click on select all again', async () => {
      const { getByText, getByTestId, emitted, queryAllByTestId, updateProps } = harness;

      await updateProps({ clearSelection: false });
      await fireEvent.click(getByText('Select all'));
      await fireEvent.click(getByTestId('bulk-action-toggle'));
      await sleep(50);
      await fireEvent.click(getByTestId('delete-0'));

      expect(emitted()['bulk-action'][0][0].action).toEqual({ label: 'Delete', value: 'delete' });
      expect(emitted()['bulk-action'][0][0].records).toHaveLength(100);
      expect(emitted()['bulk-action'][0][0].selectedAllRecords).toBeTruthy();
      expect(queryAllByTestId('bulk-action-toggle')).toHaveLength(1);

      await fireEvent.click(getByText('Select all'));

      expect(queryAllByTestId('bulk-action-toggle')).toHaveLength(0);
    });

    test('should select first 3 records, de-select 3rd record and amit bulk-action event', async () => {
      const { getByText, getByTestId, emitted, queryAllByTestId } = harness;

      await fireEvent.click(getByText('Select row 0'));
      await fireEvent.click(getByText('Select row 1'));
      await fireEvent.click(getByText('Select row 2'));
      await fireEvent.click(getByText('Select row 2'));
      await fireEvent.click(getByTestId('bulk-action-toggle'));
      await sleep(50);
      await fireEvent.click(getByTestId('delete-0'));

      expect(emitted()['bulk-action'][0][0].action).toEqual({ label: 'Delete', value: 'delete' });
      expect(emitted()['bulk-action'][0][0].records).toHaveLength(2);
      expect(emitted()['bulk-action'][0][0].selectedAllRecords).toBeFalsy();
      expect(queryAllByTestId('bulk-action-toggle')).toHaveLength(0);
    });
  });

  describe('grouping', () => {
    let harness: RenderResult;
    const columns = dataTableColumnsFixture();
    const records = dataTableRecordsGroupingFixture();

    beforeEach(() => {
      harness = render(VueDataTable, {
        i18n,
        props: {
          id: 'table1',
          primaryKey: 'id',
          title: 'Users',
          asyncMode: false,
          columns,
          records,
          numberOfRecords: null,
          numberOfRecordsSuffix: 'Records',
          page: 1,
          maxRows: 5,
          showTitle: true,
          showSearch: true,
          isLoading: false,
          searchPlaceholder: 'Search...',
          sortKey: null,
          sortDirection: 'asc',
          bulkActions: null,
          clearSelection: true,
          groupByOptions: [
            { label: 'Group By', value: null },
            { label: 'Status', value: 'status' },
          ],
          groupBy: null,
        },
      });
    });

    test('should group by status', async () => {
      const { getByText, getByTestId, emitted } = harness;

      await fireEvent.click(getByTestId('custom-group-by-table1'));
      await sleep(50);
      await fireEvent.click(getByTestId('status-1'));

      getByText('Status: new (6)');

      expect(emitted()['group-by'][0][0]).toEqual({ label: 'Status', value: 'status', trailingIcon: null });
    });

    test('should display groups across pages', async () => {
      const { getByText, getByTestId } = harness;

      await fireEvent.click(getByTestId('custom-group-by-table1'));
      await sleep(50);
      await fireEvent.click(getByTestId('status-1'));

      getByText('Status: new (6)');
      getByText('1 / 4');

      await fireEvent.click(getByTestId('pagination-next'));

      getByText('Status: new (6)');
      getByText('Status: pending (4)');
      getByText('2 / 4');

      await fireEvent.click(getByTestId('pagination-next'));

      getByText('Status: blocked (7)');
      getByText('3 / 4');

      await fireEvent.click(getByTestId('pagination-next'));

      getByText('Status: blocked (7)');
      getByText('4 / 4');
    });
  });

  describe('async mode', () => {
    let harness: RenderResult;
    const columns = dataTableColumnsFixture();
    const records = dataTableRecordsFixture();

    beforeEach(() => {
      harness = render(VueDataTable, {
        i18n,
        props: {
          id: 'table1',
          primaryKey: 'id',
          title: 'Users',
          asyncMode: true,
          columns,
          records,
          numberOfRecords: null,
          numberOfRecordsSuffix: 'Records',
          page: 1,
          maxRows: 5,
          showTitle: true,
          showSearch: true,
          isLoading: false,
          searchPlaceholder: 'Search...',
          sortKey: null,
          sortDirection: 'asc',
          bulkActions: [{ label: 'Delete', value: 'delete' }],
          clearSelection: true,
          groupByOptions: [{ label: 'Status', value: 'status' }],
          groupBy: null,
        },
      });
    });

    test('should sort by age asc', async () => {
      const { getByText, emitted } = harness;

      await fireEvent.click(getByText('Age'));

      expect(emitted()['sorting-direction-change']).toEqual([['asc']]);
      expect(emitted()['sorting-key-change']).toEqual([['age']]);
    });

    test('should sort by age desc', async () => {
      const { getByText, emitted } = harness;

      await fireEvent.click(getByText('Age'));
      await fireEvent.click(getByText('Age'));

      expect(emitted()['sorting-direction-change']).toEqual([['asc'], ['desc']]);
      expect(emitted()['sorting-key-change']).toEqual([['age'], ['age']]);

      await fireEvent.click(getByText('Age'));

      expect(emitted()['sorting-direction-change']).toEqual([['asc'], ['desc'], ['asc']]);
      expect(emitted()['sorting-key-change']).toEqual([['age'], ['age'], [null]]);
    });

    test('should go to page 2 and back to one', async () => {
      const { emitted, getByTestId } = harness;

      await fireEvent.click(getByTestId('pagination-next'));

      expect(emitted().paginate).toEqual([[2]]);

      await fireEvent.click(getByTestId('pagination-prev'));

      expect(emitted().paginate).toEqual([[2], [1]]);
    });

    test('should change max rows to display', async () => {
      const { getByTestId, emitted } = harness;
      const toggle = getByTestId('toggle-maxRows');

      await fireEvent.click(toggle);
      await sleep(50);

      await fireEvent.click(getByTestId('5-0'));

      expect(emitted()['max-rows-change']).toEqual([[5]]);
    });

    test('should search for blocked users and delete search', async () => {
      const { emitted, getByPlaceholderText } = harness;
      const search = getByPlaceholderText('Search...');

      await fireEvent.update(search, 'blocked');
      await sleep(500);

      expect(emitted().search).toEqual([['blocked']]);

      const deleteSearchIcon = search.parentNode.querySelector('i').parentElement;
      await fireEvent.click(deleteSearchIcon);

      expect(emitted().search).toEqual([['blocked'], ['']]);
    });
  });
});
