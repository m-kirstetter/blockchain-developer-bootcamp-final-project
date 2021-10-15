<template>
  <b-container>
    <b-alert :show="alert.show" :variant="alert.variant" class="mt-4">
      {{ alert.text }}
    </b-alert>
    <b-row class="mt-4 mb-3">
      <b-col cols="6">
        <h4 class="mb-0">Current Gigs</h4>
        <small>{{ $store.state.app.gigsCount }} gigs posted</small>
      </b-col>
      <b-col cols="6">
        <PostGigButton />
      </b-col>
    </b-row>
    <Gigs />
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  computed: {
    alert() {
      return this.$store.state.app.alert;
    }
  }
});
</script>

<style></style>
