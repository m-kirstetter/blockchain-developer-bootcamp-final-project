<template>
  <div>
    <Navbar />
    <Nuxt />
    <PostGig />
    <SubmitWork />
    <Toast />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { BootstrapVariant } from "~/enums/bootstrap-variant";
import { isAddress } from "@ethersproject/address";
import { EventBus } from "~/plugins/event-bus";

export default Vue.extend({
  name: "default",

  created() {
    EventBus.$on("GetGigs", (): void => {
      this.$store.dispatch("app/getGigs");
    });
  },

  destroyed() {
    EventBus.$off("GetGigs");
    EventBus.$off("Toast");
  },

  computed: {
    user(): string {
      return this.$store.state.ethers.user;
    }
  },

  watch: {
    user(newUser: string, oldUser: string) {
      if (isAddress(newUser)) {
        EventBus.$emit("Toast", {
          variant: BootstrapVariant.SUCCESS,
          text: "You're connected!",
          title: "Success"
        });
        this.$store.dispatch("app/getGigs");
      } else {
        this.$auth.logout();
        this.$store.dispatch("app/resetGigs");
        this.$store.dispatch("ethers/disconnect");
        EventBus.$emit("Toast", {
          variant: BootstrapVariant.DANGER,
          text: "You're disconnected!",
          title: "Oops"
        });
      }
    }
  }
});
</script>
