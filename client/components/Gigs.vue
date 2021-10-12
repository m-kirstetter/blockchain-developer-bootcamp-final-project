<template>
  <div>
    <div id="gigs-list">
      <div v-for="(gig, index) in $store.state.app.gigs" :key="index + 1">
        <Gig
          :gig="gig"
          :status="getStatus(gig.status)"
          @submit="submit"
          @enroll="enroll"
        />
      </div>
    </div>
    <div
      id="no-gigs-placeholder"
      class="text-center"
      v-if="$store.state.app.gigs.length === 0"
    >
      <p>Sorry, not gigs available right now.</p>
    </div>
  </div>
</template>

<script>
import Gig from "./Gig";

export default {
  components: {
    Gig,
  },
  methods: {
    enroll(id) {
      this.$store.dispatch("app/enroll", id);
    },
    submit(id) {
      this.$store.dispatch("modals/openSubmitWorkModal", {
        show: true,
        data: {
          gigId: id,
        },
      });
    },
    getStatus(status) {
      let lower = status.toLowerCase();
      let variant;
      switch (status) {
        case "open":
          variant = "success";
          break;
        case "review":
          variant = "warning";
          break;
        case "awarded":
          variant = "dark";
          break;
        default:
          variant = "info";
      }
      return {
        name: status.charAt(0).toUpperCase() + lower.slice(1),
        variant,
      };
    },
  },
};
</script>
