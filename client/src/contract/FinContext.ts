import { Context } from "fabric-contract-api";
import { CDBState } from "../state/CDBState";

export class FinchainContext extends Context {
  constructor() {
    super();
  }

  public async getState(key: string): Promise<CDBState> {
    const state = await this.stub.getState(key);
    if (!state || state.length === 0) {
      throw new Error(`${key} não foi encontrado`);
    }

    return new CDBState(CDBState.deserialize(state));
  }

}
