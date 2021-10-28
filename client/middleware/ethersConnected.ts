import { Middleware } from "@nuxt/types";

const myMiddleware: Middleware = (context): void => {
  const connected: boolean = context.store.state.ethers.connected;

  if (!connected) {
    return context.redirect("/");
  }
};

export default myMiddleware;
