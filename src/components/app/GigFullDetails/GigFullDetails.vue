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
          <vue-button
            v-if="user.role === 'FREELANCER'"
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
import { defineComponent, ref } from '@vue/composition-api';
import VueMarkdown from '@/components/data-display/VueMarkdown/VueMarkdown.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import { IGigFrontend } from '@/interfaces/IGig';
import { IAuthServiceUser } from '@/interfaces/IAuth';
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
  setup() {
    const showApplyForm = ref(false);

    return {
      showApplyForm,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';
</style>
