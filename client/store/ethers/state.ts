const EthersDefaultState = () => ({
  initialized: false as boolean,
  connected: false as boolean,
  error: null as any,
  // user is ens or address
  user: "" as string,
  address: "" as string,
  network: "" as string,
  ens: null as string | null,
  loading: false as boolean
});

export default EthersDefaultState;
