<template>
  <vue-sidebar>
    <vue-sidebar-group name="Navigation">
      <vue-sidebar-group-item leading-icon="view-list" name="Gigs" to="/app/gigs" />
      <vue-sidebar-group-item leading-icon="users" name="Freelancers" to="/app/freelancers" />
    </vue-sidebar-group>

    <vue-sidebar-group name="Documentation">
      <vue-sidebar-group-item leading-icon="book" name="General Docs" to="/docs" disabled />
      <vue-sidebar-group-item leading-icon="question-mark-circle" name="Why Smart Gigs" to="/docs/why" />
      <vue-sidebar-group-item leading-icon="star" name="DAO" to="/docs/dao" />
      <vue-sidebar-group-item leading-icon="add-user" name="Membership" to="/docs/membership" />
      <vue-sidebar-group-item leading-icon="package" name="Tokenomics" to="/docs/tokenomics" />
    </vue-sidebar-group>

    <vue-sidebar-group name="Community">
      <vue-sidebar-group-item leading-icon="github" name="Github" href="https://github.com/vuesion/vuesion" />
      <vue-sidebar-group-item leading-icon="chat" name="Discord" href="https://discord.gg/59x5cg2" />
      <vue-sidebar-group-item leading-icon="twitter" name="Twitter" href="https://twitter.com/vuesion1" />
    </vue-sidebar-group>
  </vue-sidebar>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import VueSidebar from '@/components/navigation/VueSidebar/VueSidebar.vue';
import VueSidebarGroup from '@/components/navigation/VueSidebar/VueSidebarGroup.vue';
import VueSidebarGroupItem from '@/components/navigation/VueSidebar/VueSidebarGroupItem.vue';

export default defineComponent({
  name: 'MainSidebarMenu',
  components: {
    VueSidebar,
    VueSidebarGroup,
    VueSidebarGroupItem,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/_design-system';
</style>
