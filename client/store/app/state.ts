import { Gig } from "~/interfaces/gig";
import { Alert } from "~/interfaces/app";
import { BootstrapVariant } from "~/enums/bootstrap-variant";

interface AppState {
  gigsCount: number;
  gigs: Gig[];
  loading: boolean;
  alert: Alert;
}

const AppDefaultState = (): AppState => ({
  gigsCount: 0,
  gigs: [],
  loading: false,
  alert: { show: false, text: "", variant: BootstrapVariant.PRIMARY }
});

export default AppDefaultState;
