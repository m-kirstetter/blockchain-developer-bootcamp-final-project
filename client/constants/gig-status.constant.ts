import { GigStatus } from "~/enums/gig-status";
import { BootstrapVariant } from "@/enums/bootstrap-variant";

export const GIG_STATUS_MAPPING: Record<number, GigStatus> = {
  0: GigStatus.REGISTERED,
  1: GigStatus.OPEN,
  2: GigStatus.REVIEW,
  3: GigStatus.AWARDED
};

export const GIG_STATUS_VARIANT: { [key in GigStatus]: BootstrapVariant } = {
  [GigStatus.REGISTERED]: BootstrapVariant.INFO,
  [GigStatus.OPEN]: BootstrapVariant.SUCCESS,
  [GigStatus.REVIEW]: BootstrapVariant.WARNING,
  [GigStatus.AWARDED]: BootstrapVariant.DARK
};
