<template>
  <b-modal
    id="submitWork"
    title="Submit Work"
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

<script lang="ts">
import Vue from "vue";
import { Modal } from "~/interfaces/modal";
import { required, minLength, between, url } from "vuelidate/lib/validators";

export default Vue.extend({
  data: function() {
    return {
      work: {
        contract: ""
      },
      error: false
    };
  },
  computed: {
    gigId(): number {
      return this.$store.state.modals.submitWork.data.gigId;
    },
    show(): boolean {
      return this.$store.state.modals.submitWork.show;
    }
  },
  validations: {
    work: {
      contract: {
        required
      }
    }
  },
  methods: {
    validateState(name: string) {
      const dirty = this.$v.work[name]?.$dirty;
      const error = this.$v.work[name]?.$error;
      return dirty ? !error : null;
    },
    reset() {
      this.work = {
        contract: ""
      };

      this.$store.commit("modals/SET_SUBMITWORK_MODAL", {
        show: false,
        data: {}
      } as Modal);

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    async submit(event: Event) {
      event.preventDefault();
      this.$v.work.$touch();
      if (this.$v.work.$anyError) return;
      await this.$store
        .dispatch("app/submit", {
          gigId: this.gigId,
          contract: this.work.contract
        })
        .then(() => {
          this.reset();
        });
      this.reset();
    },
    cancel(event: Event) {
      event.preventDefault();
      this.reset();
    }
  }
});
</script>
