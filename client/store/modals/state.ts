import { BootstrapVariant } from "~/enums/bootstrap-variant";

export interface ModalInterface {
  show: boolean;
  variant: BootstrapVariant;
  text?: string;
  title?: string;
  data?: object;
}

interface ModalsInterface {
  submitWork: ModalInterface;
  postGig: ModalInterface;
}

const ModalsDefaultState = (): ModalsInterface => ({
  submitWork: {
    show: false,
    variant: BootstrapVariant.PRIMARY
  },
  postGig: {
    show: false,
    variant: BootstrapVariant.PRIMARY
  }
});

export default ModalsDefaultState;
