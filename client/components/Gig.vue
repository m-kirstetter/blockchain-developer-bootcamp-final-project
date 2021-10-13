<template>
  <b-card :border-variant="variant" class="mb-3">
    <b-row class="mb-3">
      <b-col>
        <h4 :id="`gig-title-${gig.id}`" class="card-title mb-0">
          {{ gig.name }}
          <b-badge
            :id="`status-badge-${gig.id}`"
            class="float-right"
            :variant="variant"
          >
            {{ status }}
          </b-badge>
        </h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h6 :id="`gig-owner-${gig.id}`" class="card-subtitle text-muted mb-2">
          {{ gig.owner }}
        </h6>
        <b-card-text
          :id="`gig-freelancers-${gig.id}`"
          class="float-left"
          v-if="gig.status === 'registered'"
        >
          {{ gig.freelancers.length }} out of
          {{ gig.freelancersNumber }} freelancer{{
            gig.freelancersNumber > 1 ? "s" : ""
          }}
          enrolled
        </b-card-text>
        <b-card-text :id="`gig-works-${gig.id}`" class="float-left" v-else>
          {{ gig.worksSubmitted }} out of
          {{ gig.freelancersNumber }} freelancer{{
            gig.freelancersNumber > 1 ? "s" : ""
          }}
          submitted work
        </b-card-text>
      </b-col>
      <b-col>
        <div :id="`gig-actions-${gig.id}`" v-if="$store.state.ethers.connected">
          <b-button
            :id="`gig-enroll-button-${gig.id}`"
            class="float-right ml-2 mt-auto"
            variant="outline-primary"
            @click="$emit('enroll', gig.id)"
            v-if="
              gig.status === 'registered' &&
                !gig.freelancers.includes($store.state.ethers.user) &&
                gig.owner !== $store.state.ethers.user
            "
          >
            Enroll
          </b-button>
          <b-button
            :id="`gig-submit-work-button-${gig.id}`"
            class="float-right"
            variant="outline-success"
            @click="$emit('submit', gig.id)"
            v-if="
              gig.status === 'open' &&
                gig.freelancers.includes($store.state.ethers.user) &&
                !gig.works.includes($store.state.ethers.user)
            "
          >
            Submit Work
          </b-button>
        </div>
      </b-col>
    </b-row>
  </b-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Gig } from "~/interfaces/gig";
import { BootstrapVariant } from "~/enums/bootstrap-variant";
import { GIG_STATUS_VARIANT } from "~/constants/gig-status.constant";

export default Vue.extend({
  props: {
    gig: { type: Object as PropType<Gig>, required: true }
  },
  computed: {
    variant(): BootstrapVariant {
      return GIG_STATUS_VARIANT[this.gig.status];
    },
    status(): string {
      return this.gig.status.charAt(0).toUpperCase() + this.gig.status.slice(1);
    }
  }
});
</script>
