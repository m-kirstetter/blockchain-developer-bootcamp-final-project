<template>
  <div>
    <Nuxt />
    <Toast />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "landing",

  mounted() {
    // Disconnect on load
    this.$auth.logout();
  }
});
</script>
