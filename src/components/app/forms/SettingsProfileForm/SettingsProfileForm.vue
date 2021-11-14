<template>
  <validation-observer v-slot="{ invalid }" tag="div">
    <form @submit.prevent="onSubmit">
      <vue-stack>
        <vue-textarea id="bio" v-model="bio" name="bio" label="Bio" validation="required" required />

        <vue-button
          look="primary"
          :disabled="invalid"
          :loading="isLoading"
          size="lg"
          block
          type="submit"
          leading-icon="save"
        >
          Save Profile
        </vue-button>
      </vue-stack>
    </form>
  </validation-observer>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { ValidationObserver } from 'vee-validate';
import VueTextarea from '@/components/input-and-actions/VueTextarea/VueTextarea.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import { onMounted, useContext } from '@nuxtjs/composition-api';
import { addToast } from '@/components/utils';

export default defineComponent({
  name: 'SettingsProfileForm',
  components: {
    VueStack,
    ValidationObserver,
    VueButton,
    VueTextarea,
  },
  props: {},
  setup() {
    const { store, $axios, $auth } = useContext();

    const bio = ref<string>(null);

    const isLoading = ref(false);

    onMounted(() => {
      bio.value = store.$auth.user.bio as string;
    });

    const onSubmit = async () => {
      isLoading.value = true;

      try {
        await $axios.$patch('/api/v1/users/me', {
          bio: bio.value,
        });

        await $auth.fetchUser();

        addToast({
          title: 'Success!',
          type: 'success',
          text: 'Your profile bio has been updated.',
        });
      } catch (error) {
        addToast({
          title: 'Error!',
          type: 'danger',
          text: error,
        });
      }

      isLoading.value = false;
    };

    return {
      bio,
      isLoading,
      onSubmit,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';
</style>
