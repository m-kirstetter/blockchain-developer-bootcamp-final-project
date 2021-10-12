<template>
  <b-navbar toggleable="sm" type="light" variant="light">
    <b-container>
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <b-navbar-brand id="navbar-brand" href="/">Smart Gig</b-navbar-brand>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-button
            id="button-disconnect"
            variant="outline-success"
            class="my-2 my-sm-0"
            type="submit"
            @click="disconnect"
            v-if="$store.state.ethers.connected"
          >
            <font-awesome-icon :icon="['fas', 'power-off']" class="mr-1" />
            {{ truncate($store.state.ethers.user, 6, 6, 18) }}
          </b-button>
          <b-button
            id="button-connect"
            variant="outline-success"
            class="my-2 my-sm-0"
            type="submit"
            @click="connect"
            v-else
          >
            <b-spinner small v-if="$store.state.ethers.loading" />
            <font-awesome-icon :icon="['fas', 'wallet']" class="mr-1" v-else />
            Connect
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  methods: {
    async connect() {
      await this.$store.dispatch("ethers/init");
    },
    disconnect() {
      this.$store.dispatch("ethers/disconnect");
    },
    truncate(text, startChars, endChars, maxLength) {
      if (text.length > maxLength) {
        var start = text.substring(0, startChars);
        var end = text.substring(text.length - endChars, text.length);
        return start + " .... " + end;
      }
      return text;
    },
  },
};
</script>
