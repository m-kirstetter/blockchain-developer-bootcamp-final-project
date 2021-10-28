<template>
  <div>
    <span
      id="post-gig-button-wrapper"
      class="d-inline-block float-right"
      tabindex="0"
    >
      <b-button
        id="button-post-gig"
        class="float-right"
        variant="outline-primary"
        @click="post()"
        :disabled="!$store.state.ethers.connected"
      >
        Post Gig
      </b-button>
    </span>
    <b-tooltip
      id="tooltip-disconnected"
      target="post-gig-button-wrapper"
      v-if="!$store.state.ethers.connected"
    >
      Please connect first
    </b-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  methods: {
    post() {
      this.$store.dispatch("modals/openPostGigModal", {
        show: true,
        data: {}
      });
    }
  }
});
</script>
