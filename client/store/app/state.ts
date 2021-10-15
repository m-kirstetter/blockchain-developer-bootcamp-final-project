import Vue from "vue";
import { Gig } from "~/interfaces/gig";
import { Alert } from "~/interfaces/app";

const AppDefaultState = () => ({
  gigsCount: 0 as number,
  gigs: [] as Gig[],
  loading: false as boolean,
  alert: { show: false } as Alert
});

export default AppDefaultState;
