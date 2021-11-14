<template>
  <vue-content-block :class="$style.membership">
    <vue-box :padding="['24 16', '24 16', 24, 32]">
      <vue-stack :space="[16, 16, 24, 32]">
        <vue-card tabindex="0" role="region">
          <vue-stack space="0">
            <vue-box padding="8 0 16 0">
              <vue-text look="large-title" as="h1">Membership</vue-text>
            </vue-box>
          </vue-stack>
        </vue-card>
      </vue-stack>
    </vue-box>
  </vue-content-block>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueContentBlock from '@/components/layout/VueContentBlock/VueContentBlock.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueCard from '@/components/data-display/VueCard/VueCard.vue';

export default defineComponent({
  name: 'MembershipPage',
  auth: true,
  components: {
    VueStack,
    VueBox,
    VueContentBlock,
    VueText,
    VueCard,
  },
  setup() {
    useMeta({ title: 'Smart Gigs - Membership' });

    return {};
  },
  head: {},
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

.membership {
  padding-top: $navbar-height;
}
</style>
