<script>
import { getProvider, event } from "@/store/ethers/connectEthers";
import { utils } from "ethers";
import SubmitWork from "@/components/modals/SubmitWork";
import PostGig from "@/components/modals/PostGig";
import Navbar from "@/components/Navbar";

export default {
  components: {
    SubmitWork,
    PostGig,
    Navbar,
  },
  created() {
    event.$on("LogGigStatusChange", (data) => {
      this.$store.dispatch("app/getGigs");
      if (data.status === 0) {
        this.$bvToast.toast(`Gig #${data.gigId} has been created`, {
          title: "Gig created",
          variant: "success",
          autoHideDelay: 5000,
        });
      } else {
        this.$bvToast.toast(
          `Gig #${data.gigId} is now status '${
            this.$store.state.app.const.gigStatusMappingKeys[data.status]
          }'`,
          {
            title: "Status change",
            variant: "warning",
            autoHideDelay: 5000,
          }
        );
      }
    });
    event.$on("LogEnrolled", (data) => {
      this.$store.dispatch("app/getGigs");
      this.$bvToast.toast(`Your are now enrolled to Gig #${data.gigId}`, {
        title: "Enrolled",
        variant: "success",
        autoHideDelay: 5000,
      });
    });
    event.$on("LogWorkSubmitted", (data) => {
      this.$store.dispatch("app/getGigs");
      this.$bvToast.toast(
        `Your work has been submitted to Gig #${data.gigId}`,
        {
          title: "Work submitted",
          variant: "success",
          autoHideDelay: 5000,
        }
      );
    });
  },
  async mounted() {
    const { ethereum } = window;
    if (ethereum) await this.$store.dispatch("ethers/init");
  },
  computed: {
    ethersInitialized: function() {
      return this.$store.state.ethers.user;
    },
  },
  methods: {},
  watch: {
    ethersInitialized: function(user) {
      if (user) {
        this.$store.dispatch("app/getGigs");
      }
    },
  },
};
</script>
<template>
  <div>
    <Navbar />
    <Nuxt />
    <PostGig />
    <SubmitWork />
  </div>
</template>

<style></style>
