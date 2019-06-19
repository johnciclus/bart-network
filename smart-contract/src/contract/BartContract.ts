import { Contract, Context } from "fabric-contract-api";
import { BartContext } from "./BartContext";
import { CreditGuaranteeState } from "../state/CreditGuaranteeState";

export class BartContract extends Contract {
  constructor() {
    super();
  }

  public createContext(): Context {
    return new BartContext();
  }

  public beforeTransaction(ctx: Context): Promise<void> {
    console.log("This was executed before the transaction");
    return;
  }

  public afterTransaction(ctx: Context, result: any): Promise<void> {
    console.log("this was executed after the transaction", result);
    return;
  }

  public async create(
      ctx: BartContext,
      key: string,
      name: string,
      type: string,
      digitalAddress: string,
      expirationDate: Date,
      value: number,
      units: string,
      owner: string
  ) {
    const guarantee = CreditGuaranteeState.createInstance({ id: key, name, type, digitalAddress, expirationDate, value, units, owner });
    console.log("Creating credit guarantee", guarantee);
    return await ctx.stub.putState(key, CreditGuaranteeState.serialize(guarantee));
  }

  public async createCreditGuarantee(
      ctx: BartContext,
      id: string,
      name: string,
      type: string,
      digitalAddress: string,
      expirationDate: Date,
      value: number,
      units: string,
      owner: string
  ) {
    const guarantee = CreditGuaranteeState.createInstance({ id, name, type, digitalAddress, expirationDate, value, units, owner });
    console.log("Creating credit guarantee", guarantee);
    return await ctx.stub.putState(id, CreditGuaranteeState.serialize(guarantee));
  }

  // public async buy(ctx: BartContext, key: string, owner: string) {
  //   const cdbByes = await ctx.stub.getState(key);
  //   let cdb = JSON.parse(cdbByes.toString("utf8"));
  //   if(cdb.status !== CDBStatus.ISSUED) throw new Error("O status do cdb deve ser ISSUED")
  //   cdb = CDBState.createInstance({ ...cdb, owner, status: CDBStatus.BOUGHT });
  //   await ctx.stub.putState(key, CDBState.serialize(cdb));
  //   return cdb;
  // }

  public async findCreditGuarantee(ctx: BartContext, id: string) {
    const cdb = await ctx.getState(id);
    if (!cdb) throw new Error("Credit Guarantee not found");
    return cdb;
  }

  public async findAllTxsForKey(ctx: BartContext, id: string) {
    const txsIterator = await ctx.stub.getHistoryForKey(id);
    const res = [];
    while (true) {
      const tx = await txsIterator.next();
      if (tx.value && tx.value.value) {
        console.log("tx==>", tx.value.value.toString("utf8"));
        try {
          res.push(JSON.parse(tx.value.value.toString("utf8")));
        } catch (e) {
          console.error("erro==>", e);
          res.push(tx.value.value.toString("utf8"));
        }
      }

      if (tx.done) {
        await txsIterator.close();
        return JSON.stringify(res, null, 2);
      }
    }
  }

  public async delete(ctx: BartContext, id: string) {
    const guarantee = await ctx.getState(id);
    if (!guarantee) throw new Error("Guarantee not found");


    return await ctx.stub.deleteState(id).then( () => {
          return true;
      }
    ).catch( error => {
      console.log(error);
      return false;
    });


  }
}
