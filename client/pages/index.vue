<template>
  <b-container>
    <b-row class="vh-100 text-center" align-v="center">
      <b-col>
        <b-spinner
          variant="primary"
          label="Spinning"
          v-if="loading"
          style="width: 3rem; height: 3rem; border-width: 0.4rem"
        />
        <b-button
          class="main-navigation-button"
          variant="primary"
          size="lg"
          @click="connect"
          v-else
        >
          Connect with Metamask
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  layout: "landing",

  computed: {
    loading(): boolean {
      return this.$store.state.auth1.loading;
    },

    user(): string {
      return this.$store.state.ethers.user;
    }
  },

  methods: {
    connect() {
      this.$store.dispatch("auth1/connectMetamask");
    },

    disconnect() {
      this.$store.dispatch("ethers/disconnect");
      this.$store.dispatch("app/resetGigs");
      this.$auth.logout();
    }
  },

  watch: {
    user: function(newUser: string, oldUser: string) {
      if (newUser && newUser !== oldUser) {
        this.$store.dispatch("auth1/authenticate").catch(error => {
          // disconnect everything if error occured
          this.disconnect();
        });
      } else {
        // disconnect everything if no user
        this.disconnect();
      }
    }
  }
});
</script>

<style></style>
