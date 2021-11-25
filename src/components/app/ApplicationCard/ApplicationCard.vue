<template>
  <div data-testid="application-card">
    <vue-card>
      <vue-columns align-y="center">
        <vue-column :width="['100%']">
          <vue-text>{{ application.owner.address }}</vue-text>
        </vue-column>
        <vue-column :width="['100%']" align="center">
          <vue-text>{{ `${application.amount} ETH` }}</vue-text>
        </vue-column>
        <vue-column :width="['100%']" align="center">
          <vue-badge>{{ application.status }}</vue-badge>
        </vue-column>
        <vue-column :width="['100%']" align="center">
          <vue-text>{{ $moment(application.createdAt).format('ll') }}</vue-text>
        </vue-column>
        <vue-column :width="['100%']" align="right">
          <vue-button
            :disabled="!canSeeDetails"
            look="outline"
            :leading-icon="details ? 'eye-off' : 'eye'"
            @click="details = !details"
          >
            Details
          </vue-button>
        </vue-column>
      </vue-columns>
      <vue-collapse v-if="canSeeDetails" :show="details">
        <vue-box padding="16 0 0 0">
          <vue-box padding="0">
            <vue-text padding="0 0 8 0" look="h5" as="h5"> Application Details </vue-text>
            <vue-box padding="8 0 0 0">
              <vue-text look="description">{{ application.why }}</vue-text>
            </vue-box>
          </vue-box>
          <vue-box padding="16 0">
            <vue-text look="h5" as="h5"> Milestones </vue-text>
            <vue-box padding="8 0 0 0">
              <vue-text look="description">
                <ul>
                  <li v-for="milestone in application.milestones" :key="milestone._id">
                    {{ `${milestone.order} - ${milestone.title} - ${milestone.amount} ETH` }}
                  </li>
                </ul>
              </vue-text>
            </vue-box>
          </vue-box>
          <vue-button
            v-if="isGigOwner"
            look="outline"
            size="lg"
            block
            leading-icon="checkmark"
            :loading="isLoading"
            @click="onAccept"
          >
            Accept
          </vue-button>
        </vue-box>
      </vue-collapse>
    </vue-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import VueCard from '@/components/data-display/VueCard/VueCard.vue';
import VueBadge from '@/components/data-display/VueBadge/VueBadge.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueCollapse from '@/components/behavior/VueCollapse/VueCollapse.vue';
import { useContext } from '@nuxtjs/composition-api';
import { isModel } from '@/utils/typeguards';
import { IApplicationFrontend } from '@/interfaces/IApplication';
import { IGigFrontend } from '@/interfaces/IGig';
import { IUserFrontend } from '@/interfaces/IUser';
import { IUser } from '@/api/models/user.model';

export default defineComponent({
  name: 'ApplicationCard',
  components: {
    VueCard,
    VueBadge,
    VueButton,
    VueText,
    VueColumns,
    VueColumn,
    VueBox,
    VueCollapse,
  },
  props: {
    application: {
      type: Object as () => IApplicationFrontend,
      required: true,
    },
    user: {
      type: Object as () => IUserFrontend,
      required: true,
    },
    gig: {
      type: Object as () => IGigFrontend,
      required: true,
    },
  },
  setup(props) {
    const { store } = useContext();

    const isLoading = ref(false);
    const details = ref(false);

    const isApplicationOwner = computed(() => {
      if (!isModel<IUser>(props.application.owner)) throw new Error('Error, user must be Model');

      return props.user.role === 'FREELANCER' && props.application.owner._id === props.user._id;
    });

    const isGigOwner = computed(() => {
      if (!isModel<IUser>(props.gig.owner)) throw new Error('Error, user must be Model');

      return props.user.role === 'RECRUITER' && props.gig.owner._id === props.user._id;
    });

    const canSeeDetails = computed(() => isGigOwner.value || isApplicationOwner.value);

    const onAccept = async () => {
      isLoading.value = true;

      await store.dispatch('contract/createContract', { application: props.application, user: props.user });

      isLoading.value = false;
    };

    return {
      isApplicationOwner,
      isGigOwner,
      canSeeDetails,
      details,
      onAccept,
      isLoading,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';
</style>
