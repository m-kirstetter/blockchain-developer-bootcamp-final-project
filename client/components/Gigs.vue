<template>
  <div>
    <div id="gigs-list">
      <div v-for="(gig, index) in $store.state.app.gigs" :key="index + 1">
        <Gig :gig="gig" @submit="submit" @enroll="enroll" />
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

<script lang="ts">
import Vue from "vue";
import { Modal } from "~/interfaces/modal";

export default Vue.extend({
  methods: {
    enroll(id: number) {
      this.$store.dispatch("app/enroll", id);
    },
    submit(id: number) {
      this.$store.dispatch("modals/openSubmitWorkModal", {
        show: true,
        data: {
          gigId: id
        }
      } as Modal);
    }
  }
});
</script>
