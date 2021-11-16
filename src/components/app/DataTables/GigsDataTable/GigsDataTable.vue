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
        :async-mode="true"
        :is-loading="isLoading"
        :class="$style.table"
        :columns="columns"
        :records="response.results"
        :page="page"
        :max-rows="maxRows"
        :show-title="showTitle"
        :show-search="showSearch"
        show-action
        show-filters
        :search-placeholder="searchPlaceholder"
        :number-of-records="response.totalResults"
        :number-of-records-suffix="numberOfRecordsSuffix"
        :sort-key="sortKey"
        :sort-direction="sortDirection.value"
        :sort-enabled="false"
        @row-click="onExpand($event._id)"
        @sorting-key-change="onSortKeyChange"
        @sorting-direction-change="onSortDirectionChange"
        @paginate="onPaginate"
        @max-rows-change="onMaxRowsChange"
        @search="onSearch"
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

        <template #filters>
          <vue-button v-if="user.role === 'RECRUITER'" look="outline" size="sm" @click.prevent="onToggleOwnGigs">
            {{ `Show ${ownGigs ? 'own' : 'all'} gigs` }}
          </vue-button>
        </template>
      </vue-data-table>
    </vue-stack>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, computed, Ref, onMounted } from '@nuxtjs/composition-api';
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
import { addToast } from '@/components/utils';
import { IGig, IGigsQuery } from '@/api/models/gig.model';

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

    onMounted(() => fetch());

    const isLoading = ref(false);
    const columns = {
      expand: { sortable: false, searchable: false, slot: 'expand', title: ' ', inlineStyle: { width: '64px' } },
      ...dataTableColumnsFixture(),
    };
    const records = dataTableRecordsFixture(100);
    const page = ref(1);
    const maxRows = ref(10);
    const ownGigs = ref(false);
    const showTitle = false;
    const showSearch = false;
    const searchPlaceholder = 'Search for firstname, lastname, status or id...';
    const numberOfRecordsSuffix = 'Gigs';
    const sortKey = ref('createdAt');
    const sortDirection = ref({ label: 'Descending', value: 'desc' });
    const clearSelection = true;
    const showPostGigForm = ref(false);
    const expandedRows: Ref<number[]> = ref([]);

    const response = computed(() => store.state.gig.gigs);
    const user = computed(() => store.state.auth.user);
    const userId = computed(() => store.state.auth.user._id);

    const fetch = async () => {
      isLoading.value = true;

      const filters: Partial<Pick<IGig, 'owner'>> = {};

      if (ownGigs) filters.owner = userId.value;

      const query: IGigsQuery = {
        limit: maxRows.value,
        sortBy: `${sortKey.value}:${sortDirection.value.value}`,
        page: page.value,
        ...filters,
      };

      try {
        await store.dispatch('gig/fetchGigs', query);
      } catch (error) {
        addToast({
          title: 'Error fetching Gigs!',
          type: 'danger',
          text: error,
        });
      }

      isLoading.value = false;
    };

    const onExpand = (id: number) => {
      if (expandedRows.value.includes(id)) {
        expandedRows.value = expandedRows.value.filter((rowId: number) => rowId !== id);
      } else {
        expandedRows.value.push(id);
      }
    };

    const onSortKeyChange = (key: string) => {
      sortKey.value = key ?? 'createdAt';
    };

    const onSortDirectionChange = (direction: string) => {
      if (direction === 'desc') {
        sortDirection.value = { label: 'Descending', value: 'desc' };
      } else if (direction === 'asc') {
        sortDirection.value = { label: 'Ascending', value: 'asc' };
      }
      onPaginate(1);
    };

    const onPaginate = (toPage: number) => {
      page.value = toPage;
      fetch();
    };

    const onMaxRowsChange = (rows: number) => {
      maxRows.value = rows;
      onPaginate(1);
    };

    const onSearch = () => {
      isLoading.value = true;

      isLoading.value = false;
    };

    const onToggleOwnGigs = () => {
      ownGigs.value = !ownGigs.value;
      onPaginate(1);
    };

    return {
      isLoading,
      ownGigs,
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
      response,
      user,
      onExpand,
      onSortKeyChange,
      onSortDirectionChange,
      onPaginate,
      onMaxRowsChange,
      onSearch,
      onToggleOwnGigs,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

tr.noHover:hover {
  background: $card-bg !important;
  cursor: initial !important;
}
</style>
