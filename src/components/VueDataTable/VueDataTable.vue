<template>
  <vue-card tabindex="0" role="region" :aria-labelledby="id" :padding="null" :class="$style.vueDataTable">
    <vue-stack space="0">
      <vue-box v-if="showTitle" padding="16">
        <vue-text look="large-title">{{ title }}</vue-text>
      </vue-box>

      <vue-box padding="24 16">
        <vue-columns space="16">
          <vue-column :width="groupByOptions && groupByOptions.length > 0 ? '80%' : null">
            <vue-input
              v-if="showSearch"
              :id="`search-query-${id}`"
              v-model="searchQuery"
              :name="`search-query-${id}`"
              :label="searchPlaceholder"
              :placeholder="searchPlaceholder"
              hide-description
              hide-label
              trailing-icon="times"
              @input="onSearch"
              @trailing-icon-click="onDeleteSearchQuery"
            />
          </vue-column>
          <vue-column v-if="groupByOptions && groupByOptions.length > 0" width="15%">
            <vue-select
              :id="`group-by-${id}`"
              :items="groupByOptions"
              label="group by"
              hide-description
              hide-label
              :name="`group-by-${id}`"
              :value="activeGroupBy"
              @input="onGroupByClick"
            />
          </vue-column>
          <vue-column v-if="showAction" :width="groupByOptions && groupByOptions.length > 0 ? '15%' : '30%'">
            <slot name="action" />
          </vue-column>
        </vue-columns>
      </vue-box>

      <vue-box v-if="showFilters" padding="4 16">
        <vue-inline space="8">
          <slot name="filters" />
        </vue-inline>
      </vue-box>

      <div :class="[$style.tableWrapper, showSearch === false && showTitle === false && $style.noSearchbar]">
        <table>
          <caption :id="id" class="sr-only">
            {{
              title
            }}
          </caption>
          <thead>
            <tr>
              <th v-if="hasBulkActions" :class="$style.bulkActionCell" scope="col">
                <vue-dropdown :items="bulkActions" @item-click="onBulkActionClick">
                  <vue-inline space="8">
                    <vue-checkbox
                      id="selectAll"
                      label="Select all"
                      name="selectAll"
                      hide-label
                      :checked="selectedRecords.length === filteredRecords.length && filteredRecords.length > 0"
                      @click="onCheckboxClick('ALL_RECORDS')"
                    />

                    <vue-icon-chevron-down v-if="selectedRecords.length > 0" data-testid="bulk-action-toggle" />
                  </vue-inline>
                </vue-dropdown>
              </th>
              <th
                v-for="(column, idx) in visibleColumns"
                :key="idx"
                :tabindex="column.sortable ? 0 : -1"
                :class="[column.cssClass && column.cssClass, column.sortable && $style.sortable]"
                :style="column.inlineStyle"
                scope="col"
                @click.prevent.stop="columnClick(column)"
                @keypress.space.enter.stop.prevent="columnClick(column)"
              >
                <vue-columns align-y="center">
                  <vue-column>
                    <vue-text weight="semi-bold">{{ column.title }}</vue-text>
                  </vue-column>

                  <vue-column v-if="column.sortable" width="content">
                    <vue-icon-selector v-if="column.sortKey !== activeSortKey" />
                    <vue-icon-chevron-up v-if="column.sortKey === activeSortKey && activeSortDirection === 'asc'" />
                    <vue-icon-chevron-down v-if="column.sortKey === activeSortKey && activeSortDirection === 'desc'" />
                  </vue-column>
                </vue-columns>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="count === 0" :class="$style.noResult">
              <td :colspan="hasBulkActions ? visibleColumns.length + 1 : visibleColumns.length">
                <slot name="empty-state" />
              </td>
            </tr>

            <template v-for="(row, idx) in rows">
              <slot name="before-row" :row="getRowObject(row.cells)" />

              <tr v-if="row.isGroupHeader" :key="idx" :class="$style.groupHeader">
                <td :colspan="hasBulkActions ? visibleColumns.length + 1 : visibleColumns.length">
                  <slot
                    name="group-header"
                    :column="columns[activeGroupBy]"
                    :record-count="row.recordCount"
                    :value="row.cells[0].value"
                    :group-by="activeGroupBy"
                  >
                    <vue-text color="text-medium" look="small-title" weight="semi-bold">
                      {{ columns[activeGroupBy].title }}: {{ row.cells[0].value }} ({{ row.recordCount }})
                    </vue-text>
                  </slot>
                </td>
              </tr>

              <tr
                v-else
                :key="row.primaryKeyValue"
                tabindex="0"
                :data-testid="`data-table-row-${idx}`"
                @click="rowClick(row.cells)"
                @keypress.space.enter="rowClick(row.cells)"
              >
                <td v-if="hasBulkActions" :class="$style.bulkActionCell">
                  <vue-checkbox
                    :id="`select-${idx}`"
                    :label="`Select row ${idx}`"
                    :name="`select-${idx}`"
                    hide-label
                    :checked="row.selected"
                    @click="onCheckboxClick(row.primaryKeyValue)"
                  />
                </td>

                <slot name="row" :row="getRowObject(row.cells)">
                  <td
                    v-for="(cell, cellIdx) in getVisibleCells(row.cells)"
                    :key="cellIdx"
                    :class="cell.cssClass && cell.cssClass"
                    :style="cell.inlineStyle"
                  >
                    <slot :name="cell.slot" :cell="cell" :row="getRowObject(row.cells)">
                      <vue-text color="text-medium">{{ cell.value }}</vue-text>
                    </slot>
                  </td>
                </slot>
              </tr>

              <slot name="after-row" :row="getRowObject(row.cells)" />
            </template>
          </tbody>
        </table>
      </div>

      <vue-box padding="24 16 16 16">
        <vue-columns align-y="center">
          <vue-column>
            <vue-inline space="32" align-y="center">
              <vue-pagination
                slim
                :pages="maxPages"
                :selected-page="activePage"
                @prev="onPrevClick"
                @next="onNextClick"
              />
              <vue-text>{{ activePage }} / {{ maxPages }}</vue-text>
              <vue-select
                id="maxRows"
                :items="[
                  { label: '5', value: 5 },
                  { label: '10', value: 10 },
                  { label: '15', value: 15 },
                  { label: '25', value: 25 },
                  { label: '50', value: 50 },
                ]"
                label="max rows"
                name="maxRows"
                hide-label
                hide-description
                align-y-menu="top"
                :value="activeMaxRows"
                @input="onMaxRowsChange"
              />
            </vue-inline>
          </vue-column>
          <vue-column align="right">
            <vue-text color="text-low">
              {{ $n(numberOfRecords || filteredRecords.length) }} {{ numberOfRecordsSuffix }}
            </vue-text>
          </vue-column>
        </vue-columns>
      </vue-box>
    </vue-stack>

    <vue-box v-if="isLoading" align="center" align-y="center" :class="$style.loadingOverlay">
      <vue-text color="info" align="center">
        <vue-loader />
      </vue-text>
    </vue-box>
  </vue-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import debounce from 'lodash/debounce';
import VueCard from '@/components/data-display/VueCard/VueCard.vue';
import VueIconSelector from '@/components/icons/VueIconSelector.vue';
import VueIconChevronUp from '@/components/icons/VueIconChevronUp.vue';
import VueIconChevronDown from '@/components/icons/VueIconChevronDown.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VuePagination from '@/components/navigation/VuePagination/VuePagination.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueSelect from '@/components/input-and-actions/VueSelect/VueSelect.vue';
import { IItem } from '@/interfaces/IItem';
import VueInline from '@/components/layout/VueInline/VueInline.vue';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueCheckbox from '@/components/input-and-actions/VueCheckbox/VueCheckbox.vue';
import VueDropdown from '@/components/input-and-actions/VueDropdown/VueDropdown.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueLoader from '@/components/data-display/VueLoader/VueLoader.vue';
import { IDataTableCell, IDataTableColumn, IDataTableRow, IDataTableRowGroup } from './IDataTable';

export default defineComponent({
  name: 'VueDataTable',
  components: {
    VueIconChevronDown,
    VueIconChevronUp,
    VueIconSelector,
    VueLoader,
    VueStack,
    VueDropdown,
    VueCheckbox,
    VueInput,
    VueInline,
    VueSelect,
    VueBox,
    VuePagination,
    VueColumn,
    VueColumns,
    VueText,
    VueCard,
  },
  props: {
    id: { type: String, required: true },
    primaryKey: { type: String, default: 'id' },
    title: { type: String, required: true },
    asyncMode: { type: Boolean, default: false },
    columns: { type: Object, required: true },
    records: { type: Array, required: true },
    numberOfRecords: { type: Number, default: null },
    numberOfRecordsSuffix: { type: String, default: 'Records' },
    page: { type: [Number, String], default: 1 },
    maxRows: { type: [Number, String], default: 10 },
    showTitle: { type: Boolean, default: true },
    showSearch: { type: Boolean, default: true },
    showAction: { type: Boolean, default: false },
    showFilters: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
    searchPlaceholder: { type: String, default: 'Search...' },
    sortKey: { type: String, default: null },
    sortDirection: { type: String, default: 'asc' },
    bulkActions: { type: [Array, Array as () => Array<IItem>], default: null },
    clearSelection: { type: Boolean, default: true },
    groupByOptions: { type: [Array, Array as () => Array<IItem>], default: null },
    groupBy: { type: String, default: null },
  },
  setup(props, { emit }) {
    const activeSortKey = ref(props.sortKey);
    const activeSortDirection = ref(props.sortDirection);
    const activePage = ref(parseInt(props.page.toString(), 10));
    const activeMaxRows = ref(parseInt(props.maxRows.toString(), 10));
    const searchQuery = ref('');
    const activeSearchQuery = ref('');
    const selectedRecords = ref<Array<string | number>>([]);
    const selectedAllRecords = ref(false);
    const activeGroupBy = ref(props.groupBy);
    const hasBulkActions = computed(() => props.bulkActions?.length > 0);
    const sanitizedColumns = computed(() => {
      return Object.keys(props.columns).map((key: string) => {
        const column: IDataTableColumn = props.columns[key];

        if (!column.title) {
          column.title = key;
        }

        if (typeof column.visible === 'undefined') {
          column.visible = true;
        }

        if (typeof column.sortable === 'undefined') {
          column.sortable = true;
        }

        if (typeof column.searchable === 'undefined') {
          column.searchable = true;
        }

        column.sortKey = key;

        return column;
      });
    });
    const visibleColumns = computed(() => {
      return sanitizedColumns.value.filter((column: IDataTableColumn) => column.visible);
    });
    const filteredRecords = computed(() => {
      if (props.asyncMode) {
        return props.records;
      }

      const query = activeSearchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      if (query.length === 0) {
        return props.records;
      }

      const searchRegex = new RegExp(`${query}`, 'gmi');
      const filter = (row: any) => {
        let match = false;

        Object.keys(row).forEach((key: string) => {
          const column: IDataTableColumn = props.columns[key];

          if (column.searchable === true && match === false) {
            match = searchRegex.exec(row[key].toString().toLowerCase()) !== null;
          }
        });

        return match;
      };

      return props.records.slice(0).filter(filter);
    });
    const count = computed(() => props.numberOfRecords || filteredRecords.value.length);
    const sortedRecords = computed(() => {
      if (props.asyncMode) {
        return props.records;
      }

      if (!activeSortKey.value) {
        return filteredRecords.value;
      }

      const sort = (a: any, b: any) => {
        const sortOrder = activeSortDirection.value === 'asc' ? 1 : -1;
        const sortProperty = activeSortKey.value;
        const result = a[sortProperty] < b[sortProperty] ? -1 : a[sortProperty] > b[sortProperty] ? 1 : 0;

        return result * sortOrder;
      };

      return filteredRecords.value.slice(0).sort(sort);
    });
    const groups = computed<Array<IDataTableRowGroup>>(() => {
      if (activeGroupBy.value) {
        const valueIndexMapping: any = {};
        const groups: Array<IDataTableRowGroup> = [];

        sortedRecords.value.forEach((record: any) => {
          const groupByValue = record[activeGroupBy.value].toString();
          const isGroup = Object.keys(valueIndexMapping).includes(groupByValue);

          if (isGroup) {
            groups[valueIndexMapping[groupByValue]].rows.push(record);
            groups[valueIndexMapping[groupByValue]].recordCount++;
          } else {
            groups.push({ title: groupByValue, rows: [record], recordCount: 1 });
            valueIndexMapping[groupByValue] = groups.length - 1;
          }
        });

        return groups;
      } else {
        return [{ rows: sortedRecords.value, recordCount: sortedRecords.value.length }];
      }
    });
    const visibleGroups = computed<Array<IDataTableRowGroup>>(() => {
      if (props.asyncMode || activeMaxRows.value <= 0 || activeMaxRows.value >= count.value) {
        return groups.value;
      }

      const visible: Array<IDataTableRowGroup> = [];
      const maxGroups = groups.value.length;
      const startIndex = (activePage.value - 1) * activeMaxRows.value;
      let runningIndex = 0;
      let rowsToAdd = activeMaxRows.value;

      for (let i = 0; i < maxGroups; i++) {
        const { title, rows, recordCount } = groups.value[i];

        if (runningIndex + recordCount >= startIndex && rowsToAdd > 0) {
          const localStart = startIndex - runningIndex < 0 ? 0 : startIndex - runningIndex;
          const localEnd = localStart + rowsToAdd;
          const page = rows.slice(localStart, localEnd);
          const pageLength = page.length;

          if (pageLength > 0) {
            visible.push({ title, rows: page, recordCount });
          }

          runningIndex += recordCount;
          rowsToAdd -= pageLength;
        } else if (runningIndex < startIndex) {
          runningIndex += recordCount;
        } else {
          break;
        }
      }

      return visible;
    });
    const rows = computed<Array<IDataTableRow>>(() => {
      const dataTableRows: Array<IDataTableRow> = [];

      visibleGroups.value.forEach((group) => {
        if (group.title) {
          dataTableRows.push({
            isGroupHeader: true,
            cells: [
              {
                value: group.title,
                column: null,
                visible: null,
                slot: null,
                cssClass: null,
                inlineStyle: null,
                selected: null,
              },
            ],
            recordCount: group.recordCount,
            primaryKeyValue: group.title,
            selected: null,
          });
        }

        group.rows.forEach((record: any) => {
          const cells: IDataTableCell[] = [];
          const primaryKeyValue: string | number = record[props.primaryKey];
          const selected = selectedRecords.value.includes(primaryKeyValue);

          Object.keys(props.columns).forEach((columnKey: string) => {
            const columnDefinition: IDataTableColumn = props.columns[columnKey];
            const cellValue = record[columnKey];
            const rowCell: IDataTableCell = {
              column: columnKey,
              value: cellValue,
              visible: columnDefinition.visible,
              slot: columnDefinition.slot,
              cssClass: columnDefinition.cssClass || null,
              inlineStyle: columnDefinition.inlineStyle || null,
              selected,
            };
            cells.push(rowCell);
          });

          dataTableRows.push({
            primaryKeyValue,
            cells,
            selected,
          });
        });
      });

      return dataTableRows;
    });
    const maxPages = computed(() => {
      if (count.value === 0) {
        return 1;
      }

      return Math.ceil(count.value / activeMaxRows.value);
    });
    const columnClick = (column: IDataTableColumn) => {
      if (activeSortKey.value === column.sortKey && activeSortDirection.value === 'desc') {
        activeSortKey.value = null;
        activeSortDirection.value = 'asc';
      } else if (activeSortKey.value === column.sortKey && activeSortDirection.value === 'asc') {
        activeSortDirection.value = 'desc';
      } else {
        activeSortKey.value = column.sortKey;
        activeSortDirection.value = 'asc';
      }

      emit('sorting-key-change', activeSortKey.value);
      emit('sorting-direction-change', activeSortDirection.value);
    };
    const getRowObject = (cells: IDataTableCell[]) => {
      const row: any = {};

      cells.forEach((cell: IDataTableCell) => {
        row[cell.column] = cell.value;
      });

      return row;
    };
    const rowClick = (cells: IDataTableCell[]) => {
      emit('row-click', getRowObject(cells));
    };
    const getVisibleCells = (cells: IDataTableCell[]) => {
      return cells.filter((cell: IDataTableColumn) => cell.visible);
    };
    const onPrevClick = () => {
      activePage.value -= 1;
      emit('paginate', activePage.value);
    };
    const onNextClick = () => {
      activePage.value += 1;
      emit('paginate', activePage.value);
    };
    const onMaxRowsChange = (option: IItem) => {
      activePage.value = 1;
      activeMaxRows.value = option.value;
      emit('max-rows-change', activeMaxRows.value);
    };
    const onSearch = debounce((value: string) => {
      activeSearchQuery.value = value;
      emit('search', activeSearchQuery.value);
    }, 300);
    const onDeleteSearchQuery = () => {
      searchQuery.value = '';
      activeSearchQuery.value = '';
      emit('search', activeSearchQuery.value);
    };
    const onCheckboxClick = (primaryKeyValue: string | number) => {
      const idx = selectedRecords.value.indexOf(primaryKeyValue);

      selectedAllRecords.value = false;

      if (primaryKeyValue === 'ALL_RECORDS' && selectedRecords.value.length === props.records.length) {
        selectedRecords.value = [];
      } else if (primaryKeyValue === 'ALL_RECORDS') {
        selectedRecords.value = filteredRecords.value.map((record: any) => record[props.primaryKey]);
        selectedAllRecords.value = true;
      } else if (idx === -1) {
        selectedRecords.value.push(primaryKeyValue);
      } else {
        selectedRecords.value.splice(idx, 1);
      }
    };
    const onBulkActionClick = (action: IItem) => {
      emit('bulk-action', {
        action,
        records: props.records.filter((record: any) => selectedRecords.value.includes(record[props.primaryKey])),
        selectedAllRecords: selectedAllRecords.value,
      });

      if (props.clearSelection) {
        selectedRecords.value = [];
        selectedAllRecords.value = false;
      }
    };
    const onGroupByClick = (option: IItem) => {
      emit('group-by', option);

      activeGroupBy.value = option.value;
    };
    watch(
      () => props.sortKey,
      (value) => (activeSortKey.value = value),
    );
    watch(
      () => props.sortDirection,
      (value) => (activeSortDirection.value = value),
    );
    watch(
      () => props.page,
      (value) => (activePage.value = parseInt(value.toString(), 10)),
    );
    watch(
      () => props.maxRows,
      (value) => (activeMaxRows.value = parseInt(value.toString(), 10)),
    );

    return {
      visibleColumns,
      activeSortKey,
      activeSortDirection,
      rows,
      count,
      maxPages,
      activePage,
      activeMaxRows,
      searchQuery,
      hasBulkActions,
      filteredRecords,
      selectedRecords,
      activeGroupBy,
      columnClick,
      rowClick,
      getVisibleCells,
      getRowObject,
      onPrevClick,
      onNextClick,
      onMaxRowsChange,
      onSearch,
      onDeleteSearchQuery,
      onCheckboxClick,
      onBulkActionClick,
      onGroupByClick,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/_design-system';

$row-height: $space-64;
$row-border: 1px solid var(--brand-border-default-low);
$row-bg-hover: var(--brand-bg-default-high);
$cell-padding: 0 $space-16;
$table-min-width: 1280px;
$table-outline: var(--brand-focused);
$table-header-bg: $card-bg;
$table-header-elevation: var(--brand-elevation-1);
$border-radius: $card-border-radius;
$table-group-header-bg: var(--brand-bg-default-high);

.vueDataTable {
  position: relative;
  outline: none;

  &:focus {
    box-shadow: $table-outline;
  }

  table {
    text-align: left;
    position: relative;
    width: 100%;
    padding: 0;
    margin: 0;
    border: none;
    table-layout: fixed;
    white-space: nowrap;
    border-spacing: 0;

    thead {
      th {
        cursor: default;
        background: $table-header-bg;
        position: sticky;
        top: $navbar-height;
        z-index: 1;
        box-shadow: $table-header-elevation;
        user-select: none;
        outline: none;

        &:focus {
          box-shadow: $table-outline;
          z-index: 2;
        }

        &.sortable {
          cursor: pointer;
        }
      }
    }

    tbody {
      tr {
        outline: none;

        &:focus {
          box-shadow: $table-outline;
          z-index: 2;
        }

        &:hover {
          background: $row-bg-hover;
        }

        &:last-child {
          border-bottom: none;
        }

        &.noResult {
          &:hover {
            background: transparent;
          }

          td {
            cursor: default;
            height: auto;
          }
        }
      }
    }

    tr {
      cursor: pointer;
      border-bottom: $row-border;

      th,
      td {
        height: $row-height;
        vertical-align: middle;
        padding: $cell-padding;
        font-weight: $font-weight-regular;

        &.bulkActionCell {
          width: $space-72;
        }
      }

      &.groupHeader {
        background: $table-group-header-bg;
      }
    }
  }

  .noSearchbar {
    border-radius: $card-border-radius $card-border-radius 0 0;

    table {
      border-radius: $card-border-radius $card-border-radius 0 0;

      thead {
        border-radius: $card-border-radius $card-border-radius 0 0;

        th {
          &:first-child {
            border-radius: $card-border-radius 0 0 0;
          }

          &:last-child {
            border-radius: 0 $card-border-radius 0 0;
          }
        }
      }
    }
  }

  .loadingOverlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $table-header-bg;
    opacity: 0.8;
    z-index: 2;
  }

  @include mediaMax(tabletPortrait) {
    .tableWrapper {
      overflow-x: scroll;
      margin-right: $space-16;
    }

    table {
      min-width: $table-min-width;
    }
  }
}
</style>
