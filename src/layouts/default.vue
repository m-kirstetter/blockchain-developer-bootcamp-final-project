<template>
  <div id="app" :class="$style.app">
    <vue-toast />

    <!-- Nabar -->
    <vue-navbar
      v-if="$route.path !== '/'"
      :user-name="user.name || user.address"
      show-menu-icon
      @menu-item-click="onNavbarDropodownClick"
      @menu-click="showSidebar = !showSidebar"
    >
      <template #center>
        <vue-box :padding="[8, 12, 12, 12]" align-y="center">
          <vue-text look="h5" as="span">Smart Gigs</vue-text>
        </vue-box>
      </template>
    </vue-navbar>

    <vue-box :padding="[0]">
      <vue-columns :space="[8, 16, 24, 32]" :align-y="['top']" stack-phone>
        <!-- Sidebar -->
        <vue-column v-if="$route.path !== '/' && showSidebar" :width="['100%', '250px']">
          <main-sidebar-menu v-if="$route.path.includes('app') || $route.path.includes('docs')" />
          <profile-sidebar-menu v-if="$route.path.includes('settings')" />
        </vue-column>

        <!-- Content -->
        <vue-column :width="['content', '100%']">
          <nuxt :class="$style.content" />
          <vue-footer v-if="$route.path !== '/'" slim :themes="themes" />
        </vue-column>
      </vue-columns>
    </vue-box>

    <!-- User role modal -->
    <role-modal :show="showRoleModal" @close="showRoleModal = false" />

    <vue-back-to-top />
  </div>
</template>

<script lang="ts">
import '@/assets/global.scss';
import { defineComponent, computed, useContext, ref, onMounted, useMeta, watch } from '@nuxtjs/composition-api';
import VueFooter from '@/components/navigation/VueFooter/VueFooter.vue';
import VueToast from '@/components/data-display/VueToast/VueToast.vue';
import VueBackToTop from '@/components/behavior/VueBackToTop/VueBackToTop.vue';
import { IItem } from '@/interfaces/IItem';
import { INewContractEvent } from '@/interfaces/INewContractEvent';
import VueNavbar from '@/components/navigation/VueNavbar/VueNavbar.vue';
import MainSidebarMenu from '@/components/app/SidebarMenus/MainSidebarMenu.vue';
import ProfileSidebarMenu from '@/components/app/SidebarMenus/ProfileSidebarMenu.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import RoleModal from '@/components/app/Modals/RoleModal/RoleModal.vue';
import { addToast } from '@/components/utils';
import { EventBus } from '@/services/EventBus';
import { Roles } from '@/api/enums/Roles';

export default defineComponent({
  name: 'App',
  components: {
    VueNavbar,
    VueBackToTop,
    VueToast,
    MainSidebarMenu,
    ProfileSidebarMenu,
    VueColumns,
    VueColumn,
    VueFooter,
    VueText,
    VueBox,
    RoleModal,
  },
  setup() {
    const { app, $auth, store } = useContext();
    const { htmlAttrs } = useMeta();
    const showSidebar = ref(true);
    const themes = computed(() => [
      { label: 'System', value: 'system' },
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
    ]);
    const locale = computed(() => app.i18n.locale);
    const loggedIn = computed(() => app.$auth.loggedIn);
    const user = computed(() => app.$auth.user);
    const showRoleModal = ref(false);

    onMounted(() => {
      EventBus.$on('logout', async (silent = false) => {
        await logout(silent);
      });

      EventBus.$on('NewContract', async (contract: INewContractEvent) => {
        if (loggedIn.value) {
          await store.dispatch('contract/updateContract', {
            _id: contract.externalId,
            contract: contract.contractAddress,
          });

          EventBus.$emit('reloadGigs');

          addToast({
            title: 'Success!',
            type: 'success',
            text: 'Contract has been created',
          });
        }
      });
    });

    const onNavbarDropodownClick = async (menuItem: IItem) => {
      if (menuItem.value === 'logout') await logout();
      if (menuItem.value === 'settings') app.router.push('/settings');
      if (menuItem.value === 'profile') app.router.push('/settings/profile');
    };

    watch(
      loggedIn,
      (value) => {
        if (!value) {
          logout(true);
        } else if ($auth.user.role === Roles.GUEST) {
          showRoleModal.value = true;
        }
      },
      { immediate: true },
    );

    watch(
      [locale],
      () => {
        htmlAttrs.value = {
          lang: locale.value.substr(0, 2),
        };
      },
      { immediate: true },
    );

    async function logout(silent = false) {
      await app.$auth.logout().then(() => {
        if (!silent) {
          addToast({
            title: 'Warning!',
            type: 'warning',
            text: 'You logged out.',
          });
        }
      });
    }

    return {
      themes,
      showSidebar,
      loggedIn,
      user,
      showRoleModal,
      onNavbarDropodownClick,
    };
  },
  head: {},
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';
@import '~@/assets/reset';
@import '~@/assets/typography';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
  }
}
</style>
