<template>
  <vue-content-block :class="$style.gigs" data-testid="gigs-page">
    <vue-box :padding="['24 16', '24 16', 24, 32]">
      <gigs-data-table />
    </vue-box>
  </vue-content-block>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api';
import VueContentBlock from '@/components/layout/VueContentBlock/VueContentBlock.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import GigsDataTable from '@/components/app/DataTables/GigsDataTable/GigsDataTable.vue';

export default defineComponent({
  name: 'GigsPage',
  auth: true,
  components: {
    VueContentBlock,
    VueBox,
    GigsDataTable,
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

.gigs {
  padding-top: $navbar-height;
}
</style>
