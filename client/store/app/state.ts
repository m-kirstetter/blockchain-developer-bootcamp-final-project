import { Gig } from "~/interfaces/gig";

const AppDefaultState = () => ({
  gigsCount: 0 as number,
  gigs: [] as Gig[]
});

export default AppDefaultState;
