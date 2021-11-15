<template>
  <vue-sidebar data-testid="profile-sidebar">
    <vue-sidebar-group name="Navigation">
      <vue-sidebar-group-item leading-icon="chevron-double-left" name="Back" to="/app/gigs" />
    </vue-sidebar-group>

    <vue-sidebar-group name="Settings">
      <vue-sidebar-group-item leading-icon="cog" name="General" to="/settings" />
      <vue-sidebar-group-item leading-icon="user" name="Profile" to="/settings/profile" />
      <vue-sidebar-group-item leading-icon="globe" name="Social" to="/settings/social" />
    </vue-sidebar-group>
  </vue-sidebar>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import VueSidebar from '@/components/navigation/VueSidebar/VueSidebar.vue';
import VueSidebarGroup from '@/components/navigation/VueSidebar/VueSidebarGroup.vue';
import VueSidebarGroupItem from '@/components/navigation/VueSidebar/VueSidebarGroupItem.vue';

export default defineComponent({
  name: 'ProfileSidebarMenu',
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
