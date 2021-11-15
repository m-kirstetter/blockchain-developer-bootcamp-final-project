<template>
  <div :class="$style.freelancersDataTable">
    FreelancersDataTable
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'FreelancersDataTable',
  components: {},
  props: {},
  setup() {
    return {};
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

.freelancersDataTable {
  // this class is only applied if you add css properties
}
</style>
