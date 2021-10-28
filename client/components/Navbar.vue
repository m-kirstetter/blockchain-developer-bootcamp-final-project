<template>
  <b-navbar toggleable="sm" type="light" variant="light">
    <b-container>
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <b-navbar-brand id="navbar-brand" href="/">Smart Gig</b-navbar-brand>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-button variant="link">
            <b-spinner small v-if="$store.state.app.loading" />
          </b-button>
          <b-button
            id="button-disconnect"
            variant="outline-success"
            class="my-2 my-sm-0"
            type="submit"
            @click="disconnect"
            v-if="$store.state.ethers.connected && $store.state.auth.loggedIn"
          >
            <font-awesome-icon :icon="['fas', 'power-off']" class="mr-1" />
            {{ truncate($store.state.ethers.user, 6, 6, 18) }}
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  methods: {
    disconnect() {
      this.$store.dispatch("ethers/disconnect");
      this.$store.dispatch("app/resetGigs");
      this.$auth.logout();
    },

    truncate(
      text: string,
      startChars: number,
      endChars: number,
      maxLength: number
    ) {
      if (text.length > maxLength) {
        var start = text.substring(0, startChars);
        var end = text.substring(text.length - endChars, text.length);
        return start + " .... " + end;
      }
      return text;
    }
  }
});
</script>
