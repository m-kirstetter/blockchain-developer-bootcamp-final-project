<template>
  <div :class="$style.gigFullDetails" data-testid="gig-full-details">
    <vue-box :padding="['24 8', '24 8']">
      <vue-stack :space="[4, 4, 8, 16]">
        <vue-text look="h3" as="h2"> {{ gig.title }} </vue-text>

        <div v-if="!showApplyForm">
          <vue-text look="description">
            <vue-markdown> {{ gig.description }} </vue-markdown>
          </vue-text>

          <vue-text look="h4" as="h4"> Details </vue-text>
          <vue-text look="description">
            <vue-markdown> {{ gig.details }} </vue-markdown>
          </vue-text>

          <vue-text look="h4" as="h4"> Skills </vue-text>
          <vue-text look="description">
            <vue-markdown> {{ gig.skills }} </vue-markdown>
          </vue-text>

          <div v-if="gig.applications.length">
            <vue-text look="h4" as="h4"> Applications </vue-text>
            <vue-box padding="16 0">
              <vue-stack :space="[4, 4, 8, 16]" :padding="8">
                <application-card
                  v-for="application in gig.applications"
                  :key="application._id"
                  :application="application"
                  :user="user"
                  :gig="gig"
                />
              </vue-stack>
            </vue-box>
          </div>

          <vue-button
            v-if="user.role === 'FREELANCER'"
            :disabled="userApplied"
            look="secondary"
            leading-icon="lightning-bolt"
            block
            @click.prevent="showApplyForm = !showApplyForm"
          >
            Apply
          </vue-button>
        </div>

        <div v-else>
          <apply-to-gig-form :gig="gig" @cancel="showApplyForm = !showApplyForm" />
        </div>
      </vue-stack>
    </vue-box>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import VueMarkdown from '@/components/data-display/VueMarkdown/VueMarkdown.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import { IGigFrontend } from '@/interfaces/IGig';
import { IAuthServiceUser } from '@/interfaces/IAuth';
import ApplicationCard from '@/components/app/ApplicationCard/ApplicationCard.vue';
import { isApplicationArray, isModel } from '@/utils/typeguards';
import { IUser } from '@/api/models/user.model';
import ApplyToGigForm from '../Forms/ApplyToGigForm/ApplyToGigForm.vue';

export default defineComponent({
  name: 'GigFullDetails',
  components: {
    VueMarkdown,
    VueText,
    VueBox,
    VueStack,
    VueButton,
    ApplyToGigForm,
    ApplicationCard,
  },
  props: {
    gig: {
      type: Object as () => IGigFrontend,
      required: true,
    },
    user: {
      type: Object as () => IAuthServiceUser,
      required: true,
    },
  },
  setup(props) {
    const showApplyForm = ref(false);

    const userApplied = computed(() => {
      const userId = props.user._id;
      const applications = props.gig.applications;

      if (!isApplicationArray(applications)) throw new Error('Error, application must be Application Model Array');

      return !!applications.find((el) => {
        if (!isModel<IUser>(el.owner)) throw new Error('Error, user must be User Model');

        return el.owner._id === userId;
      });
    });

    return {
      userApplied,
      showApplyForm,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';
</style>
