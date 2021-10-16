const EthersDefaultState = () => ({
  initialized: false,
  connected: false,
  error: null as any,
  // user is ens or address
  user: "",
  address: "",
  network: "",
  ens: null as string | null,
  loading: false
});

export default EthersDefaultState;
