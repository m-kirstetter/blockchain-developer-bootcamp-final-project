<template>
  <div>
    <div id="gigs-list">
      <div v-for="(gig, index) in $store.state.app.gigs" :key="index + 1">
        <Gig :gig="gig" @submit="submit" @enroll="enroll" />
      </div>
    </div>
    <div
      id="no-gigs-placeholder"
      class="text-center"
      v-if="$store.state.app.gigs.length === 0"
    >
      <p v-if="gigsLoading">Gigs loading....</p>
      <p v-else>Sorry, no gigs found.</p>
      <p v-if="!user">
        You're not connected to Metamask, you can connect
        <a href="#" @click="connect">here</a>.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Modal } from "~/interfaces/modal";

export default Vue.extend({
  computed: {
    user: function(): string {
      return this.$store.state.ethers.user;
    },
    gigsLoading: function(): boolean {
      return this.$store.state.app.loading;
    }
  },
  methods: {
    connect(): void {
      this.$store.dispatch("ethers/walletConnect");
    },
    enroll(id: number) {
      this.$store.dispatch("app/enroll", id);
    },
    submit(id: number) {
      this.$store.dispatch("modals/openSubmitWorkModal", {
        show: true,
        data: {
          gigId: id
        }
      } as Modal);
    }
  }
});
</script>
