import { Modal } from "~/interfaces/modal";

const ModalsDefaultState = () => ({
  submitWork: {
    show: false,
    data: {}
  } as Modal,
  postGig: {
    show: false,
    data: {}
  } as Modal
});

export default ModalsDefaultState;
