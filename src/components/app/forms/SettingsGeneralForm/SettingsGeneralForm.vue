<template>
  <validation-observer v-slot="{ invalid }" tag="div">
    <form @submit.prevent="onSubmit">
      <vue-stack>
        <vue-tiles :columns="[1, 2]">
          <vue-input
            id="firstname"
            v-model="firstname"
            name="firstname"
            required
            label="First name"
            placeholder="First name"
            validation="required"
          />

          <vue-input
            id="lastname"
            v-model="lastname"
            name="lastname"
            required
            label="Last name"
            placeholder="Last name"
            validation="required"
          />
        </vue-tiles>

        <vue-tiles :columns="[1, 2]">
          <vue-input
            id="email"
            v-model="email"
            name="email"
            required
            type="email"
            label="E-mail"
            placeholder="E-mail"
            validation="required|email"
          />

          <vue-select
            id="role"
            v-model="role"
            label="Choose Role"
            name="role"
            :items="roleOptions"
            placeholder="Role"
            validation="required"
            required
          />
        </vue-tiles>

        <vue-button
          look="primary"
          :disabled="invalid"
          :loading="isLoading"
          size="lg"
          block
          type="submit"
          leading-icon="save"
        >
          Save Settings
        </vue-button>
      </vue-stack>
    </form>
  </validation-observer>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { ValidationObserver } from 'vee-validate';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueSelect from '@/components/input-and-actions/VueSelect/VueSelect.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueTiles from '@/components/layout/VueTiles/VueTiles.vue';
import { computed, onMounted, useContext } from '@nuxtjs/composition-api';
import { addToast } from '@/components/utils';
import { Roles } from '@/api/enums/Roles';
import { IAuthServiceUser } from '@/interfaces/IAuth';

export default defineComponent({
  name: 'SettingsGeneralForm',
  components: {
    VueTiles,
    VueStack,
    ValidationObserver,
    VueButton,
    VueInput,
    VueSelect,
  },
  props: {
    id: { type: String, required: true },
  },
  setup() {
    const { store, $axios, $auth } = useContext();

    onMounted(() => setLocalUser());

    const firstname = ref<string>(null);
    const lastname = ref<string>(null);
    const email = ref<string>(null);
    const role = ref<Record<string, unknown>>(null);

    const roleOptions = [
      { label: 'Freelancer', value: Roles.FREELANCER },
      { label: 'Recruiter', value: Roles.RECRUITER },
    ];

    const isLoading = ref(false);

    const user = computed<IAuthServiceUser>(() => store.state.auth.user);

    const setLocalUser = () => {
      firstname.value = user.value.firstname;
      lastname.value = user.value.lastname;
      email.value = user.value.email;
      role.value = roleOptions.find((role) => role.value === user.value.role);
    };

    const onSubmit = async () => {
      isLoading.value = true;

      try {
        await $axios.$patch('/api/v1/users/me', {
          firstname: firstname.value,
          lastname: lastname.value,
          fullname: `${firstname.value} ${lastname.value}`,
          email: email.value,
          role: role.value.value,
        });

        await $auth.fetchUser();

        addToast({
          title: 'Success!',
          type: 'success',
          text: 'Your settings has been updated.',
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
      firstname,
      lastname,
      email,
      role,
      roleOptions,
      isLoading,
      onSubmit,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';
</style>
