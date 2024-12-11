type AbiInput = {
  indexed: boolean;
  internalType: string;
  name: string;
  type: string;
};

type AbiEvent = {
  anonymous: boolean;
  inputs: AbiInput[];
  name: string;
  type: "event";
};

type ContractABI = AbiEvent[];

export { ContractABI, AbiInput, AbiEvent };
