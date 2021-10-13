import { Gig } from "~/interfaces/gig";

const AppDefaultState = () => ({
  gigsCount: 0 as number,
  gigs: [] as Gig[],
  loading: false
});

export default AppDefaultState;
