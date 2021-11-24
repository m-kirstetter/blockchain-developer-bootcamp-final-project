<template>
  <vue-modal
    :show="show"
    backdrop
    disable-page-scroll
    :close-on-escape="false"
    :close-on-outside-click="false"
    :close-button="false"
    @close="onClose"
  >
    <vue-stack space="32">
      <vue-stack space="8">
        <vue-text look="h4" color="text-high" align="center">New User</vue-text>
        <vue-text color="text-low" align="center"> This is your first time here, are you a Recruiter? </vue-text>
      </vue-stack>

      <vue-tiles space="8" :columns="2">
        <vue-button look="secondary" :loading="noLoading" @click="setRole(Roles.FREELANCER)">No</vue-button>
        <vue-button look="primary" :loading="yesLoading" @click="setRole(Roles.RECRUITER)">Yes</vue-button>
      </vue-tiles>
    </vue-stack>
  </vue-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useContext } from '@nuxtjs/composition-api';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueModal from '@/components/data-display/VueModal/VueModal.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueTiles from '@/components/layout/VueTiles/VueTiles.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import { Roles } from '@/api/enums/Roles';
import { addToast } from '@/components/utils';

export default defineComponent({
  name: 'RoleModal',
  components: {
    VueModal,
    VueButton,
    VueText,
    VueTiles,
    VueStack,
  },
  props: {
    show: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const { $axios, $auth } = useContext();

    const yesLoading = ref(false);
    const noLoading = ref(false);

    const onClose = () => emit('close');

    const setRole = async (role: Roles) => {
      if (role === Roles.FREELANCER) {
        noLoading.value = true;
      } else {
        yesLoading.value = true;
      }

      try {
        await $axios.$patch('/api/v1/users/me', {
          role,
        });

        await $auth.fetchUser();

        addToast({
          title: 'Success!',
          type: 'success',
          text: 'Your settings has been updated.',
        });

        onClose();
      } catch (error) {
        addToast({
          title: 'Error!',
          type: 'danger',
          text: error,
        });
      }

      yesLoading.value = false;
      noLoading.value = false;
    };

    return {
      yesLoading,
      noLoading,
      props,
      onClose,
      Roles,
      setRole,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';
</style>
