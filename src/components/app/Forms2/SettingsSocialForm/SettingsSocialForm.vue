<template>
  <validation-observer v-slot="{ invalid }" tag="div">
    <form @submit.prevent="onSubmit">
      <vue-stack>
        <vue-input
          id="linkedin"
          v-model="linkedin"
          name="linkedin"
          label="LinkedIn"
          placeholder="LinkedIn"
          validation="required|url"
          required
        />

        <vue-button
          look="primary"
          :disabled="invalid"
          :loading="isLoading"
          size="lg"
          block
          type="submit"
          leading-icon="save"
        >
          Save Social
        </vue-button>
      </vue-stack>
    </form>
  </validation-observer>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { ValidationObserver } from 'vee-validate';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import { onMounted, useContext } from '@nuxtjs/composition-api';
import { addToast } from '@/components/utils';

export default defineComponent({
  name: 'SettingsSocialForm',
  components: {
    VueStack,
    ValidationObserver,
    VueButton,
    VueInput,
  },
  props: {},
  setup() {
    const { store, $axios, $auth } = useContext();

    const linkedin = ref<string>(null);

    const isLoading = ref(false);

    onMounted(() => {
      linkedin.value = store.state.auth.user.linkedin;
    });

    const onSubmit = async () => {
      isLoading.value = true;

      try {
        await $axios.$patch('/api/v1/users/me', {
          linkedin: linkedin.value,
        });

        await $auth.fetchUser();

        addToast({
          title: 'Success!',
          type: 'success',
          text: 'Your social profile has been updated.',
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
      linkedin,
      isLoading,
      onSubmit,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';
</style>
