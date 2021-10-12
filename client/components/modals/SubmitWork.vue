<template>
  <b-modal
    id="submitWork"
    title="Post Gig"
    v-model="show"
    @ok="submit"
    @cancel="cancel"
    hide-header-close
    no-close-on-backdrop
    no-close-on-esc
  >
    <b-alert :show="error" variant="danger">
      <h4 class="alert-heading">Error!</h4>
      <p class="mb-0">
        Something went wrong with the contract you just submitted.
      </p>
    </b-alert>
    <b-form>
      <b-row class="mt-2">
        <b-col cols="12">
          <label for="contract-input">Contract address</label>
          <b-form-input
            id="contract-input"
            v-model="work.contract"
            placeholder="Insert the smart contract address here..."
            :state="validateState('contract')"
          />
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data: function() {
    return {
      work: {
        contract: "",
      },
      error: false,
    };
  },
  validations: {
    work: {
      contract: {
        required,
      },
    },
  },
  computed: {
    gigId() {
      return this.$store.state.modals.submitWork.data.gigId;
    },
    show() {
      return this.$store.state.modals.submitWork.show;
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.work[name];
      return $dirty ? !$error : null;
    },
    reset() {
      this.error = false;
      this.work = {
        contract: "",
      };

      this.$store.commit("modals/SET_SUBMITWORK_MODAL", {
        show: false,
        data: {},
      });

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    async submit(event) {
      event.preventDefault();
      this.$v.work.$touch();
      if (this.$v.work.$anyError) return;
      await this.$store
        .dispatch("app/submit", {
          gigId: this.gigId,
          contract: this.work.contract,
        })
        .then(() => {
          this.reset();
        })
        .catch((error) => {
          this.error = true;
        });
    },
    cancel(event) {
      event.preventDefault();
      this.reset();
    },
  },
};
</script>
