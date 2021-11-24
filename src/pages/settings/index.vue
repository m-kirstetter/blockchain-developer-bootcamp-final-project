<template>
  <vue-content-block :class="$style.settings" data-testid="settings-page">
    <vue-box :padding="['24 16', '24 16', 24, 32]">
      <vue-stack :space="[16, 16, 24, 32]">
        <vue-card tabindex="0" role="region">
          <vue-stack space="0">
            <vue-box padding="8 0 16 0">
              <vue-text look="large-title" as="h1">General</vue-text>
            </vue-box>
            <settings-general-form id="settings-general-form" />
          </vue-stack>
        </vue-card>
      </vue-stack>
    </vue-box>
  </vue-content-block>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api';
import VueContentBlock from '@/components/layout/VueContentBlock/VueContentBlock.vue';
import VueCard from '@/components/data-display/VueCard/VueCard.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import SettingsGeneralForm from '@/components/app/Forms2/SettingsGeneralForm/SettingsGeneralForm.vue';

export default defineComponent({
  name: 'SettingsPage',
  auth: true,
  components: {
    VueStack,
    VueBox,
    VueCard,
    VueText,
    VueContentBlock,
    SettingsGeneralForm,
  },
  setup() {
    useMeta({ title: 'Smart Gigs - Profile' });

    return {};
  },
  head: {},
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

.settings {
  padding-top: $navbar-height;
}
</style>
