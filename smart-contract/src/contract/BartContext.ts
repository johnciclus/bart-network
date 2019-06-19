import { Context } from "fabric-contract-api";
import { CreditGuaranteeState } from "../state/CreditGuaranteeState";

export class BartContext extends Context {
  constructor() {
    super();
  }

  public async getState(key: string): Promise<CreditGuaranteeState> {
    const state = await this.stub.getState(key);
    if (!state || state.length === 0) {
      throw new Error(`${key} not found`);
    }

    return new CreditGuaranteeState(CreditGuaranteeState.deserialize(state));
  }

}
