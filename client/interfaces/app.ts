import { BootstrapVariant } from "~/enums/bootstrap-variant";

export interface Alert {
  text: string;
  variant: BootstrapVariant;
  show: boolean;
  title?: string;
}
