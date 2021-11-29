<template>
  <div :class="$style.applyToGigForm" data-testid="apply-to-gig-form">
    <validation-observer v-slot="{ invalid }" tag="div">
      <form @submit.prevent="submitApplication">
        <vue-stack space="0">
          <vue-textarea id="gig-why" v-model="why" name="why" label="Why me" validation="required" required />
          <vue-columns
            v-for="(milestone, index) in milestones"
            :key="`${index}-milestone`"
            space="8"
            :align-y="['top', 'center']"
            stack-phone
          >
            <vue-column :width="['content', '100%']">
              <vue-input
                :id="`milestone-${index}-title`"
                v-model="milestones[index].title"
                :name="`milestone-${index}-title`"
                required
                :label="`Milestone ${index + 1} Title`"
                :placeholder="`Milestone ${index + 1} Title`"
                validation="required"
              />
            </vue-column>
            <vue-column :width="['content', '100%']">
              <vue-columns space="8" :align-y="['top', 'center']" stack-phone>
                <vue-column :width="['content', '100%']">
                  <vue-input
                    :id="`milestone-${index}-amount`"
                    v-model="milestones[index].amount"
                    :name="`milestone-${index}-amount`"
                    required
                    :label="`Milestone ${index + 1} Amount (ETH)`"
                    :placeholder="`Milestone ${index + 1} Amount`"
                    validation="required|regex:^[0-9]+([\.][0-9]+)?$"
                    @focus="$event.target.select()"
                  />
                </vue-column>
                <vue-column :width="['100%', '100px']">
                  <vue-button
                    v-if="index === 0"
                    :class="$style.addMilestoneButton"
                    look="outline"
                    size="md"
                    block
                    leading-icon="plus"
                    @click="addMilestone"
                  />
                  <vue-button
                    v-else
                    :class="$style.addMilestoneButton"
                    look="outline"
                    size="md"
                    block
                    leading-icon="minus"
                    @click="milestones[index].amount = '0' && removeMilestone(index)"
                  />
                </vue-column>
              </vue-columns>
            </vue-column>
          </vue-columns>
          <vue-box padding="0 0 16 0">
            <vue-text>
              {{ `Total proposal amount: ${total} Ether${total > 1 ? 's' : ''}` }}
            </vue-text>
          </vue-box>
          <vue-tiles space="8" :columns="2">
            <vue-button look="secondary" size="lg" @click="onClose">Cancel</vue-button>
            <vue-button
              look="primary"
              :disabled="invalid"
              :loading="isLoading"
              size="lg"
              block
              type="submit"
              leading-icon="paper-airplane"
            >
              Submit Application
            </vue-button>
          </vue-tiles>
        </vue-stack>
      </form>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from '@vue/composition-api';
import { ValidationObserver } from 'vee-validate';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueTextarea from '@/components/input-and-actions/VueTextarea/VueTextarea.vue';
import VueTiles from '@/components/layout/VueTiles/VueTiles.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import { useContext } from '@nuxtjs/composition-api';
import { IGigFrontend } from '@/interfaces/IGig';
import { EventBus } from '@/services/EventBus';

export default defineComponent({
  name: 'ApplyToGigForm',
  components: {
    VueButton,
    VueInput,
    VueTextarea,
    VueTiles,
    VueStack,
    VueColumns,
    VueColumn,
    VueBox,
    VueText,
    ValidationObserver,
  },
  props: {
    gig: {
      type: Object as () => IGigFrontend,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { store } = useContext();

    const isLoading = ref(false);
    const why = ref<string>(null);
    const total = ref(0);

    const milestones = reactive([{ order: 1, title: '', amount: '0' }]);

    const onClose = () => emit('cancel');

    const addMilestone = () => {
      const milestonesCount = milestones.length;
      milestones.push({ order: milestonesCount + 1, title: '', amount: '0' });
      const firstMilestoneTitle = milestones[0].title;
      milestones[0].title = milestones[0].title + ' ';
      milestones[0].title = firstMilestoneTitle;
    };

    const removeMilestone = (key: number) => milestones.splice(key, 1);

    watch(
      () => milestones,
      (currentValue) => {
        let count = currentValue.map((i) => parseFloat(i.amount.length ? i.amount : '0')).reduce((a, b) => a + b);
        if (isNaN(count)) count = 0;
        total.value = Math.round((count + Number.EPSILON) * 100) / 100;
      },
      { deep: true },
    );

    const submitApplication = async () => {
      isLoading.value = true;

      await store
        .dispatch('application/createApplication', {
          why: why.value,
          milestones,
          gig: props.gig._id,
          amount: total.value,
        })
        .then(() => onClose());

      EventBus.$emit('reloadGigs');

      isLoading.value = false;
    };

    return {
      isLoading,
      why,
      total,
      milestones,
      submitApplication,
      addMilestone,
      removeMilestone,
      onClose,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

.addMilestoneButton {
  bottom: 0;
}
</style>
