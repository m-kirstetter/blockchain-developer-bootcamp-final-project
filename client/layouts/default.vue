<template>
  <div>
    <Navbar />
    <Nuxt />
    <PostGig />
    <SubmitWork />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { isAddress } from "@ethersproject/address";
import { EthersMessages } from "~/enums/ethers-messages";
import { GIG_STATUS_MAPPING } from "~/constants/gig-status.constant";
import { BootstrapVariant } from "~/enums/bootstrap-variant";
import { event } from "~/services/ethers";

declare let window: any;

export default Vue.extend({
  created() {
    event.$on("LogGigStatusChange", (data: any): void => {
      this.$store.dispatch("app/getGigs");
      if (data.status === 0) {
        this.fireToast(
          "Gig created",
          `Gig #${data.gigId} has been created`,
          BootstrapVariant.SUCCESS
        );
      } else {
        this.fireToast(
          "Status change",
          `Gig #${data.gigId} is now status '${
            GIG_STATUS_MAPPING[data.status]
          }'`,
          BootstrapVariant.WARNING
        );
      }
    });
    event.$on("LogEnrolled", (data: any): void => {
      this.$store.dispatch("app/getGigs");
      this.fireToast(
        "Enrolled",
        `Your are now enrolled to Gig #${data.gigId}`,
        BootstrapVariant.SUCCESS
      );
    });
    event.$on("LogWorkSubmitted", (data: any): void => {
      this.$store.dispatch("app/getGigs");
      this.fireToast(
        "Work submitted",
        `Your work has been submitted to Gig #${data.gigId}`,
        BootstrapVariant.SUCCESS
      );
    });
    event.$on("NoMetamask", (data: EthersMessages): void => {
      this.fireToast("Metamask Not Found", data, BootstrapVariant.DANGER);
    });
    event.$on("NotRopsten", (data: EthersMessages): void => {
      this.fireToast("Wrong Network", data, BootstrapVariant.DANGER);
    });
  },
  async mounted(): Promise<void> {
    const { ethereum } = window;
    if (ethereum && ethereum !== "undefined") {
      await this.$store.dispatch("ethers/init");
    } else {
      this.$store.dispatch("app/alert", {
        text: EthersMessages.NOT_METAMASK,
        variant: BootstrapVariant.DANGER,
        show: true
      });
    }
  },
  computed: {
    user: function(): string {
      return this.$store.state.ethers.user;
    }
  },
  methods: {
    fireToast(title: string, text: string, variant: BootstrapVariant): void {
      this.$bvToast.toast(text, {
        title,
        toaster: "b-toaster-bottom-right",
        solid: true,
        variant,
        autoHideDelay: 5000
      });
    }
  },
  watch: {
    user: function(newUser: string, oldUser: string): void {
      if (isAddress(newUser)) {
        this.fireToast(
          "Success",
          `You're connected!`,
          BootstrapVariant.SUCCESS
        );
        this.$store.dispatch("app/getGigs");
      } else {
        this.$store.dispatch("ethers/disconnect");
        this.$store.dispatch("app/resetGigs");
        this.fireToast("Oops", `You're disconnected!`, BootstrapVariant.DANGER);
      }
    }
  }
});
</script>
