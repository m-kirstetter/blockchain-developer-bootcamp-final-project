<template>
  <b-container>
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

<script>
import PostGigButton from "@/components/PostGigButton";
import Gigs from "@/components/Gigs";

export default {
  components: {
    PostGigButton,
    Gigs,
  },
};
</script>
