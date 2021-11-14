<template>
  <vue-content-block :class="$style.index">
    <vue-columns space="0" full-page>
      <vue-column :width="['content', 'content', '100%']" align="center" align-y="center">
        <vue-stack>
          <vue-text v-if="wrongNetwork" color="danger" align="center">
            Wrong network, please connect to Ropsten
          </vue-text>
          <vue-button look="primary" size="lg" :loading="loading" @click.prevent="connect">
            Connect with Metamask
          </vue-button>
        </vue-stack>
      </vue-column>
    </vue-columns>
  </vue-content-block>
</template>

<script lang="ts">
import { defineComponent, useContext, useMeta, computed, onMounted, ref } from '@nuxtjs/composition-api';
import VueContentBlock from '@/components/layout/VueContentBlock/VueContentBlock.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import { EventBus } from '@/services/EventBus';

export default defineComponent({
  name: 'IndexPage',
  components: {
    VueContentBlock,
    VueButton,
    VueColumns,
    VueColumn,
    VueStack,
    VueText,
  },
  setup() {
    useMeta({ title: 'Index' });
    const { store } = useContext();
    const wrongNetwork = ref(false);
    const loading = computed<boolean>(() => store.state.ethers.loading);

    onMounted(() => {
      EventBus.$on('wrongNetwork', () => {
        wrongNetwork.value = true;
      });
    });

    const connect = async () => {
      try {
        await store.dispatch('ethers/authenticateUser');
      } catch (error) {
        wrongNetwork.value = true;
      }
    };

    return {
      loading,
      connect,
      wrongNetwork,
    };
  },
  head: {},
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

.index {
  max-width: 100%;
}
</style>
