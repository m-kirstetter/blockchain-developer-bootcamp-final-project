import Vue from "vue";
import { Gig } from "~/interfaces/gig";
import { Alert } from "~/interfaces/app";

const AppDefaultState = () => ({
  gigsCount: 0,
  gigs: [] as Gig[],
  loading: false,
  alert: { show: false } as Alert
});

export default AppDefaultState;
