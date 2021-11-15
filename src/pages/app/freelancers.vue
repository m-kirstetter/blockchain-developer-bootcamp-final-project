<template>
  <vue-content-block :class="$style.freelancers" data-testid="freelancers-page">
    <vue-box :padding="['24 16', '24 16', 24, 32]">
      <vue-stack :space="[16, 16, 24, 32]">
        <vue-data-table
          id="freelancers-table"
          primary-key="id-freelancers-table"
          title="Freelancers"
          :class="$style.table"
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
          @row-click="console.log('search', $event)"
          @paginate="page = $event"
          @max-rows-change="
            maxRows = $event;
            page = 1;
          "
          @sorting-key-change="sortKey = $event"
          @sorting-direction-change="sortDirection = $event"
          @search="console.log('search', $event)"
        >
          <template #user="{ row }">
            <vue-columns space="12" align-y="center">
              <vue-column width="content">
                <vue-avatar :name="row.firstname + ' ' + row.lastname" size="sm" :src="row.avatar" />
              </vue-column>
              <vue-column>
                <vue-text weight="semi-bold" as="div"> {{ row.firstname }} {{ row.lastname }} </vue-text>
                <vue-text color="text-low">ID: {{ row.id }}</vue-text>
              </vue-column>
            </vue-columns>
          </template>

          <template #status="{ cell }">
            <vue-badge v-if="cell.value === 'new'" status="success">New</vue-badge>
            <vue-badge v-else-if="cell.value === 'pending'" status="warning">Pending</vue-badge>
            <vue-badge v-else-if="cell.value === 'blocked'" status="danger">Blocked</vue-badge>
            <vue-badge v-else-if="cell.value === 'registered'" status="info">Registered</vue-badge>
          </template>

          <template #date="{ cell }">
            {{ $moment(cell.value).format('ll') }}
          </template>

          <template #actions="{ cell, row }">
            <vue-dropdown
              button-text="Select"
              :items="[{ label: 'Delete', value: 'delete' }]"
              align-menu="right"
              @item-click="onItemClick(cell, row)"
            />
          </template>

          <template slot="empty-state">
            <vue-box padding="32" align="center"> No Results found! </vue-box>
          </template>
        </vue-data-table>
      </vue-stack>
    </vue-box>
  </vue-content-block>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api';
import VueContentBlock from '@/components/layout/VueContentBlock/VueContentBlock.vue';
import VueDataTable from '@/components/VueDataTable/VueDataTable.vue';
import VueBadge from '@/components/data-display/VueBadge/VueBadge.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueDropdown from '@/components/input-and-actions/VueDropdown/VueDropdown.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueAvatar from '@/components/data-display/VueAvatar/VueAvatar.vue';
import { dataTableRecordsFixture, dataTableColumnsFixture } from '@/components/VueDataTable/DataTableFixtures';

export default defineComponent({
  name: 'FreelancersPage',
  auth: true,
  components: {
    VueContentBlock,
    VueDataTable,
    VueBadge,
    VueText,
    VueBox,
    VueStack,
    VueDropdown,
    VueColumns,
    VueColumn,
    VueAvatar,
  },
  setup() {
    useMeta({ title: 'Gigs' });
    const columns = dataTableColumnsFixture();
    const records = dataTableRecordsFixture(100);
    const page = 1;
    const maxRows = 25;
    const showTitle = false;
    const showSearch = true;
    const searchPlaceholder = 'Search for firstname, lastname, status or id...';
    const numberOfRecordsSuffix = 'Users';
    const sortKey = 'createdAt';
    const sortDirection = { label: 'Ascending', value: 'asc' };
    const clearSelection = true;

    return {
      columns,
      records,
      page,
      maxRows,
      showTitle,
      showSearch,
      searchPlaceholder,
      numberOfRecordsSuffix,
      sortKey,
      sortDirection,
      clearSelection,
    };
  },
  head: {},
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

.freelancers {
  padding-top: $navbar-height;
}
</style>
