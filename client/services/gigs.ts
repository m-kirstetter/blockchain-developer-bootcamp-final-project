import { utils } from "ethers";
import {
  TransactionRequest,
  TransactionResponse
} from "@ethersproject/abstract-provider";
import { Gig, GigFormInput, GigWorkFormat } from "~/interfaces/gig";
import { ERRORS } from "~/constants/ethers.constant";
import { getContract, getContractRw } from "~/services/ethers";
import { GIG_STATUS_MAPPING } from "~/constants/gig-status.constant";
import {
  EthersErrorResponse,
  GigsServiceResponse,
  GigEthersResponse,
  WorkEthersResponse
} from "~/interfaces/ethers";

export async function getGigsService(): Promise<GigsServiceResponse> {
  let gigsCount = 0;
  let gigs: Gig[] = [];

  const localContract = getContract();
  if (!localContract) throw new Error("No contract.");

  gigsCount = parseInt(
    // @TODO: Create types from ABI
    // type-coverage:ignore-next-line
    await localContract.gigsCount().catch((error: EthersErrorResponse) => {
      throw new Error(ERRORS[error.code]);
    })
  );

  if (gigsCount > 0) {
    for (let i = 1; i < gigsCount + 1; i++) {
      // @TODO: Create types from ABI
      // type-coverage:ignore-next-line
      const gig: GigEthersResponse = await localContract.gigs(i.toString());

      // get enrolled freelancers
      const enrolled: number = gig.enrolled;
      let freelancers: string[] = [];
      if (enrolled > 0) {
        for (let j = 0; j < enrolled; j++) {
          // @TODO: Create types from ABI
          const freelancer: string = await localContract
            // type-coverage:ignore-next-line
            .enrolledFreelancers(i.toString(), j.toString())
            // type-coverage:ignore-next-line
            .catch((error: EthersErrorResponse) => {
              throw new Error(ERRORS[error.code]);
            });
          freelancers.push(freelancer);
        }
      }

      // get enrolled freelancers submitted works
      const worksNumber: number = gig.works;
      let works: string[] = [];
      if (worksNumber > 0) {
        for (let k = 0; k < worksNumber; k++) {
          // @TODO: Create types from ABI
          const submittedWork: WorkEthersResponse = await localContract
            // type-coverage:ignore-next-line
            .worksByGig(i.toString(), k.toString())
            // type-coverage:ignore-next-line
            .catch((error: EthersErrorResponse) => {
              throw new Error(ERRORS[error.code]);
            });
          works.push(submittedWork.owner);
        }
      }

      // push to array
      gigs.push(formatGig(gig, freelancers, works, i));
    }
  }

  return {
    gigsCount,
    gigs
  };
}

export async function createGigService(
  gig: GigFormInput
): Promise<TransactionResponse> {
  let result: TransactionResponse;

  const localContractRw = getContractRw();
  if (!localContractRw) throw new Error("No contract.");

  const request: TransactionRequest = {
    value: utils.parseEther(gig.compensation.toString())
  };

  // @TODO: Create types from ABI
  result = await localContractRw
    // type-coverage:ignore-next-line
    .createGig(gig.title, gig.freelancers.toString(), request)
    // type-coverage:ignore-next-line
    .catch((error: EthersErrorResponse) => {
      throw new Error(ERRORS[error.code]);
    });

  return result;
}

export async function enrollGigService(
  id: string
): Promise<TransactionResponse> {
  let result: TransactionResponse;

  const localContractRw = getContractRw();
  if (!localContractRw) throw new Error("No contract.");

  // @TODO: Create types from ABI
  result = await localContractRw
    // type-coverage:ignore-next-line
    .enroll(id.toString())
    // type-coverage:ignore-next-line
    .catch((error: EthersErrorResponse) => {
      throw new Error(ERRORS[error.code]);
    });

  return result;
}

export async function submitGigService(
  work: GigWorkFormat
): Promise<TransactionResponse> {
  let result: TransactionResponse;

  const localContractRw = getContractRw();
  if (!localContractRw) throw new Error("No contract.");

  // @TODO: Create types from ABI
  result = await localContractRw
    // type-coverage:ignore-next-line
    .submitWork(work.gigId.toString(), work.contract)
    // type-coverage:ignore-next-line
    .catch((error: EthersErrorResponse) => {
      throw new Error(ERRORS[error.code]);
    });

  return result;
}

function formatGig(
  gig: GigEthersResponse,
  freelancers: string[],
  works: string[],
  id: number
): Gig {
  return {
    id,
    name: gig.name,
    compensation: gig.compensation.toString(),
    status: GIG_STATUS_MAPPING[gig.status],
    owner: gig.owner,
    freelancersNumber: gig.freelancersNumber,
    freelancers,
    worksSubmitted: gig.works,
    works,
    awardedTo: gig.awardedTo
  };
}
