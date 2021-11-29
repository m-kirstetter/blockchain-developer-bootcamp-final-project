<template>
  <validation-observer v-slot="{ invalid }" tag="div">
    <form @submit.prevent="createGig">
      <vue-stack>
        <vue-tiles space="8" :columns="2">
          <vue-input
            id="gig-title"
            v-model="title"
            name="gig-title"
            required
            label="Title"
            placeholder="Title"
            validation="required"
          />
          <vue-slider
            id="gig-budget-ranger"
            label="Budget range (in ETH)"
            :min="1"
            :max="10"
            :range="budget"
            @change="budgetUpdate"
          />
        </vue-tiles>

        <vue-textarea
          id="gig-description"
          v-model="description"
          name="description"
          label="Description"
          validation="required"
          required
        />

        <vue-textarea
          id="gig-details"
          v-model="details"
          name="details"
          label="Details"
          validation="required"
          required
        />

        <vue-textarea id="gig-skills" v-model="skills" name="skills" label="Skills" validation="required" required />

        <vue-tiles space="8" :columns="2">
          <vue-button look="secondary" size="lg" @click="onClose">Cancel</vue-button>
          <vue-button
            look="primary"
            :disabled="invalid"
            :loading="isLoading"
            size="lg"
            block
            type="submit"
            leading-icon="save"
          >
            Post Gig
          </vue-button>
        </vue-tiles>
      </vue-stack>
    </form>
  </validation-observer>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useContext } from '@nuxtjs/composition-api';
import { ValidationObserver } from 'vee-validate';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueTextarea from '@/components/input-and-actions/VueTextarea/VueTextarea.vue';
import VueTiles from '@/components/layout/VueTiles/VueTiles.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueSlider from '@/components/input-and-actions/VueSlider/VueSlider.vue';
import { IGigBudget } from '@/api/models/gig.model';
import { EventBus } from '@/services/EventBus';

export default defineComponent({
  name: 'CreateGigForm',
  components: {
    VueInput,
    VueButton,
    VueTextarea,
    VueTiles,
    VueSlider,
    VueStack,
    ValidationObserver,
  },
  props: {},
  setup(_props, { emit }) {
    const { store } = useContext();

    const isLoading = ref(false);

    const title = ref<string>(null);
    const description = ref<string>(null);
    const details = ref<string>(null);
    const skills = ref<string>(null);
    const budget = ref<number[]>([2, 5]);
    const budgetRange = ref<IGigBudget>({ min: budget.value[0], max: budget.value[1] });

    const onClose = () => emit('cancel');

    const budgetUpdate = (data: number[]) => {
      budgetRange.value = { min: data[0], max: data[1] };
    };

    const createGig = async () => {
      isLoading.value = true;

      await store
        .dispatch('gig/createGig', {
          title: title.value,
          description: description.value,
          details: details.value,
          skills: skills.value,
          budget: budgetRange.value,
        })
        .then(() => onClose());

      EventBus.$emit('reloadGigs');

      isLoading.value = false;
    };

    return {
      isLoading,
      title,
      description,
      details,
      skills,
      budget,
      budgetUpdate,
      createGig,
      onClose,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';
</style>
