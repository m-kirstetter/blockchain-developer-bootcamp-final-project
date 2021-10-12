<template>
  <b-modal
    id="postGig"
    title="Post Gig"
    v-model="show"
    @ok="create"
    @cancel="cancel"
    hide-header-close
    no-close-on-backdrop
    no-close-on-esc
  >
    <b-form>
      <b-row>
        <b-col cols="6">
          <b-form-group
            id="freelancers-input-group"
            :label="
              `${gig.freelancers} Freelancer${gig.freelancers > 1 ? 's' : ''}`
            "
            label-for="freelancers-input"
          >
            <b-form-input
              id="freelancers-input"
              v-model="gig.freelancers"
              type="range"
              min="1"
              max="10"
              step="1"
            />
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group
            id="compensation-input-group"
            :label="`Compensation (${gig.compensation} ETH)`"
            label-for="compensation-input"
          >
            <b-form-input
              id="compensation-input"
              v-model="gig.compensation"
              type="range"
              min="0.1"
              max="10"
              step="0.1"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <b-form-group
            id="title-input-group"
            label="Gig Title"
            label-for="title-input"
          >
            <b-form-input
              id="title-input"
              v-model="gig.title"
              placeholder="Write your gig title here..."
              :state="validateState('title')"
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <label for="description-input">Description Link</label>
          <b-form-input
            id="description-input"
            v-model="gig.description"
            placeholder="Insert your gig description link here..."
            :state="validateState('description')"
          />
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
</template>

<script>
import { required, minLength, between, url } from "vuelidate/lib/validators";

export default {
  data: function() {
    return {
      gig: {
        title: "",
        description: "",
        freelancers: 1,
        compensation: 0.1,
      },
    };
  },
  computed: {
    show() {
      return this.$store.state.modals.postGig.show;
    },
  },
  validations: {
    gig: {
      title: {
        required,
        minLength: minLength(4),
      },
      description: {
        required,
        url,
      },
      freelancers: {
        required,
        between: between(1, 10),
      },
      compensation: {
        required,
        between: between(0.1, 10),
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.gig[name];
      return $dirty ? !$error : null;
    },
    reset() {
      this.gig = {
        title: "",
        description: "",
        freelancers: 1,
        compensation: 0.1,
      };

      this.$store.commit("modals/SET_POSTGIG_MODAL", {
        show: false,
        data: {},
      });

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    create(event) {
      event.preventDefault();
      this.$v.gig.$touch();
      if (this.$v.gig.$anyError) {
        return;
      }
      this.$store.dispatch("app/create", this.gig);
      this.reset();
    },
    cancel(event) {
      event.preventDefault();
      this.reset();
    },
  },
};
</script>
