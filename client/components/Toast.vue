<template> </template>

<script lang="ts">
import Vue from "vue";
import { EventBus } from "~/plugins/event-bus";
import { ToastInterface } from "~/interfaces/toast";

export default Vue.extend({
  created() {
    EventBus.$on("Toast", ({ variant, text, title }: ToastInterface): void => {
      this.$bvToast.toast(text, {
        title: title,
        variant: variant,
        autoHideDelay: 5000,
        toaster: "b-toaster-bottom-right",
        append: true
      });
    });
  },

  destroyed() {
    EventBus.$off("Toast");
  }
});
</script>
