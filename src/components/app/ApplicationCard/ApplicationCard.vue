<template>
  <div data-testid="application-card" :class="$style.applicationCard">
    <vue-card>
      <vue-columns align-y="center">
        <vue-column :width="['100%']">
          <vue-text>
            {{ application.owner.address === user.address ? 'My application' : application.owner.address }}
          </vue-text>
        </vue-column>
        <vue-column :width="['100%']" align="center">
          <vue-text>{{ `${application.amount} ETH` }}</vue-text>
        </vue-column>
        <vue-column :width="['100%']" align="center">
          <vue-badge v-if="application.status === 'Applied'" status="neutral">{{ application.status }}</vue-badge>
          <vue-badge v-if="application.status === 'Declined'" status="danger">{{ application.status }}</vue-badge>
          <vue-badge v-if="application.status === 'Accepted'" status="success">{{ application.status }}</vue-badge>
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
                  <li v-for="(milestone, index) in application.milestones" :key="milestone._id">
                    {{ `${milestone.order} - ${milestone.title} - ${milestone.amount} ETH ${milestoneStatus(index)}` }}
                  </li>
                </ul>
              </vue-text>
            </vue-box>
          </vue-box>
          <vue-button
            v-if="isGigOwner && application.status === 'Applied'"
            look="outline"
            size="lg"
            block
            leading-icon="checkmark"
            :loading="isLoading"
            :disabled="!isGigOwner || gig.status !== 'Open' || application.status !== 'Applied'"
            @click="onAccept"
          >
            Accept
          </vue-button>
          <vue-button
            v-else-if="isGigOwner && !gig.contract.paid"
            look="secondary"
            size="lg"
            block
            leading-icon="paper-airplane"
            :loading="isLoading"
            @click="onPay"
          >
            Lock Gig Amount
          </vue-button>
          <vue-button
            v-else-if="isGigOwner && gig.contract.paid && gig.status !== 'Closed'"
            look="secondary"
            size="lg"
            block
            leading-icon="paper-airplane"
            :loading="isLoading"
            @click="releaseMilestone"
          >
            Release Milestone {{ gig.contract.currentMilestone + 1 }}
          </vue-button>
        </vue-box>
      </vue-collapse>
    </vue-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, watch } from '@vue/composition-api';
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
import { EventBus } from '@/services/EventBus';
import { IContract } from '@/api/models/contract.model';
import { addToast } from '@/components/utils';
import { Contract } from 'ethers';
import { IContractFrontend } from '@/interfaces/IContract';

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
    const { store, $ethereum } = useContext();

    const isLoading = ref(false);
    const details = ref(false);
    let smartContract: Contract;

    onMounted(() => setContractInstance());

    const setContractInstance = async () => {
      if (!isModel<IContract>(props.gig.contract)) throw new Error('Error, gig must be Model');

      if (!smartContract && props.gig.contract?.contract) {
        smartContract = await $ethereum.contractInstance(props.gig.contract.contract);
      }
    };

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

      try {
        await store.dispatch('contract/createContract', {
          application: props.application,
          user: props.user,
          gig: props.gig,
        });
      } catch (error) {
        addToast({
          title: 'Error!',
          type: 'danger',
          text: error.message,
        });

        isLoading.value = false;
      }
    };

    const onPay = async () => {
      isLoading.value = true;

      const value = await smartContract.total();

      try {
        if (!isModel<IContractFrontend>(props.gig.contract)) throw new Error('Error, contract must be Model');
        await $ethereum.userWallet.sendTransaction({
          to: props.gig.contract.contract,
          value,
        });

        await store.dispatch('contract/updateContract', {
          _id: props.gig.contract._id,
          paid: true,
        });

        EventBus.$emit('reloadGigs');

        addToast({
          title: 'Success!',
          type: 'success',
          text: 'Amount has been locked successfully!',
        });
      } catch (error) {
        addToast({
          title: 'Error!',
          type: 'danger',
          text: error.message,
        });
      }

      isLoading.value = false;
    };

    const releaseMilestone = async () => {
      isLoading.value = true;

      try {
        if (!isModel<IContractFrontend>(props.gig.contract)) throw new Error('Error, gig must be Model');

        await smartContract.release(props.gig.contract.currentMilestone);

        if (props.gig.contract.currentMilestone === props.application.milestones.length - 1) {
          await store.dispatch('gig/updateGig', {
            _id: props.gig._id,
            status: 'Closed',
          });
        } else {
          await store.dispatch('contract/updateContract', {
            _id: props.gig.contract._id,
            currentMilestone: props.gig.contract.currentMilestone + 1,
          });
        }

        EventBus.$emit('reloadGigs');

        addToast({
          title: 'Success!',
          type: 'success',
          text: `Milestone ${props.gig.contract.currentMilestone + 1} has been released successfully!`,
        });
      } catch (error) {
        addToast({
          title: 'Error!',
          type: 'danger',
          text: error.message,
        });
      }

      isLoading.value = false;
    };

    const milestoneStatus = (index: number) => {
      if (!isModel<IContractFrontend>(props.gig.contract)) throw new Error('Error, gig must be Model');

      if (props.gig && props.gig.contract && index === props.gig.contract.currentMilestone && props.gig.contract.paid) {
        return '- Current';
      } else {
        return '';
      }
    };

    watch(
      () => props.gig,
      () => {
        setContractInstance();
        isLoading.value = false;
      },
      { deep: true },
    );

    return {
      isApplicationOwner,
      isGigOwner,
      canSeeDetails,
      details,
      onAccept,
      onPay,
      releaseMilestone,
      isLoading,
      smartContract,
      milestoneStatus,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';
</style>
