import { BootstrapVariant } from "~/enums/bootstrap-variant";

export interface ToastInterface {
  variant: BootstrapVariant;
  text: string;
  title: string;
}
