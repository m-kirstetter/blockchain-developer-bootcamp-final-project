<template>
  <div :class="$style.gigsDataTable" data-testid="gigs-data-table">
    <vue-stack :space="[16, 16, 24, 32]">
      <!-- Post Gig Modal -->
      <vue-card v-if="showPostGigForm" tabindex="0" role="region">
        <vue-stack space="0">
          <create-gig-form @cancel="showPostGigForm = false" />
        </vue-stack>
      </vue-card>

      <!-- Gigs list -->
      <vue-data-table
        v-else
        id="gigs-table"
        primary-key="id-gigs-table"
        title="Gigs"
        :class="$style.table"
        :columns="columns"
        :records="gigs"
        :page="page"
        :max-rows="maxRows"
        :show-title="showTitle"
        :show-search="showSearch"
        show-action
        :search-placeholder="searchPlaceholder"
        :number-of-records-suffix="numberOfRecordsSuffix"
        :sort-key="sortKey"
        :sort-direction="sortDirection.value"
        @row-click="onExpand($event._id)"
        @paginate="page = $event"
        @max-rows-change="
          maxRows = $event;
          page = 1;
        "
        @sorting-key-change="sortKey = $event"
        @sorting-direction-change="sortDirection = $event"
        @search="console.log('search', $event)"
      >
        <template #row="{ row }">
          <td>
            <vue-button
              size="sm"
              look="outline"
              :leading-icon="expandedRows.includes(row._id) ? 'minus' : 'plus'"
              :style="{ padding: '0', height: 'auto', minWidth: 'auto' }"
              @click="onExpand(row._id)"
            />
          </td>
          <td>
            <vue-columns space="12" align-y="center">
              <vue-column>
                <vue-text weight="semi-bold" as="div">{{ row.title }}</vue-text>
                <vue-text color="text-low">ID: {{ row._id }}</vue-text>
              </vue-column>
            </vue-columns>
          </td>
          <td>
            <vue-badge v-if="row.status === 'Awarded'" status="success">{{ row.status }}</vue-badge>
            <vue-badge v-else-if="row.status === 'Review'" status="warning">{{ row.status }}</vue-badge>
            <vue-badge v-else-if="row.status === 'Open'" status="primary">{{ row.status }}</vue-badge>
            <vue-badge v-else-if="row.status === 'Registered'" status="info">{{ row.status }}</vue-badge>
          </td>
          <td>{{ $moment(row.createdAt).format('ll') }}</td>
          <td>
            <vue-dropdown button-text="Select" :items="[{ label: 'Edit', value: 'edit' }]" align-menu="right" />
          </td>
        </template>

        <template #after-row="{ row }">
          <tr v-if="expandedRows.includes(row._id)" :key="'additional-info-' + row._id" :class="$style.noHover">
            <td colspan="5">
              <vue-box :padding="['24 8', '24 8']">
                <vue-stack :space="[4, 4, 8, 16]">
                  <vue-text look="h3" as="h2"> {{ row.title }} </vue-text>
                  <vue-text look="description">
                    <vue-markdown> {{ row.description }} </vue-markdown>
                  </vue-text>

                  <vue-text look="h4" as="h4"> Details </vue-text>
                  <vue-text look="description">
                    <vue-markdown> {{ row.details }} </vue-markdown>
                  </vue-text>

                  <vue-text look="h4" as="h4"> Skills </vue-text>
                  <vue-text look="description">
                    <vue-markdown> {{ row.skills }} </vue-markdown>
                  </vue-text>

                  <vue-button v-if="user.role === 'FREELANCER'" look="secondary" leading-icon="lightning-bolt" block>
                    Apply
                  </vue-button>
                </vue-stack>
              </vue-box>
            </td>
          </tr>
        </template>

        <template slot="empty-state">
          <vue-box padding="32" align="center"> No Results found! </vue-box>
        </template>

        <template #action>
          <vue-button
            v-if="user.role === 'RECRUITER'"
            look="primary"
            leading-icon="plus"
            block
            @click.prevent="showPostGigForm = true"
          >
            Post Gig
          </vue-button>
        </template>
      </vue-data-table>
    </vue-stack>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, computed, Ref } from '@nuxtjs/composition-api';
import { dataTableRecordsFixture, dataTableColumnsFixture } from '@/components/VueDataTable/GigsDataTableFixtures';
import VueDataTable from '@/components/VueDataTable/VueDataTable.vue';
import VueBadge from '@/components/data-display/VueBadge/VueBadge.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueDropdown from '@/components/input-and-actions/VueDropdown/VueDropdown.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueCard from '@/components/data-display/VueCard/VueCard.vue';
import VueMarkdown from '@/components/data-display/VueMarkdown/VueMarkdown.vue';
import CreateGigForm from '@/components/app/Forms/CreateGigForm/CreateGigForm.vue';

export default defineComponent({
  name: 'GigsDataTable',
  components: {
    VueDataTable,
    VueBadge,
    VueText,
    VueBox,
    VueStack,
    VueDropdown,
    VueColumns,
    VueColumn,
    VueButton,
    VueCard,
    VueMarkdown,
    CreateGigForm,
  },
  props: {},
  setup() {
    const { store } = useContext();

    const columns = {
      expand: { sortable: false, searchable: false, slot: 'expand', title: ' ', inlineStyle: { width: '64px' } },
      ...dataTableColumnsFixture(),
    };
    const records = dataTableRecordsFixture(100);
    const page = 1;
    const maxRows = 25;
    const showTitle = false;
    const showSearch = true;
    const searchPlaceholder = 'Search for firstname, lastname, status or id...';
    const numberOfRecordsSuffix = 'Gigs';
    const sortKey = 'createdAt';
    const sortDirection = { label: 'Ascending', value: 'asc' };
    const clearSelection = true;
    const showPostGigForm = ref(false);
    const expandedRows: Ref<number[]> = ref([]);

    const gigs = computed(() => store.state.gig.gigs);
    const user = computed(() => store.state.auth.user);

    const onExpand = (id: number) => {
      if (expandedRows.value.includes(id)) {
        expandedRows.value = expandedRows.value.filter((rowId: number) => rowId !== id);
      } else {
        expandedRows.value.push(id);
      }
    };

    return {
      columns,
      records,
      page,
      maxRows,
      expandedRows,
      showTitle,
      showSearch,
      searchPlaceholder,
      numberOfRecordsSuffix,
      sortKey,
      sortDirection,
      clearSelection,
      showPostGigForm,
      gigs,
      user,
      onExpand,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

.gigsDataTable {
  // this class is only applied if you add css properties
}
</style>
