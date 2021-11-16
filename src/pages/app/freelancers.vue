<template>
  <vue-content-block :class="$style.freelancers" data-testid="freelancers-page">
    <vue-box :padding="['24 16', '24 16', 24, 32]">
      <freelancers-data-table />
    </vue-box>
  </vue-content-block>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api';
import VueContentBlock from '@/components/layout/VueContentBlock/VueContentBlock.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import FreelancersDataTable from '@/components/app/DataTables/FreelancersDataTable/FreelancersDataTable.vue';

export default defineComponent({
  name: 'FreelancersPage',
  auth: true,
  components: {
    VueContentBlock,
    VueBox,
    FreelancersDataTable,
  },
  setup() {
    useMeta({ title: 'Gigs' });

    return {};
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
