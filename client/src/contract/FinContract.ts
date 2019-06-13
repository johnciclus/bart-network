import { Contract, Context } from "fabric-contract-api";
import { FinchainContext } from "./FinContext";
import { CDBState } from "../state/CDBState";
import { CDBStatus } from "../state/enum/CDBStatus";

export class FinchainContract extends Contract {
  constructor() {
    super();
  }

  public createContext(): Context {
    return new FinchainContext();
  }

  public beforeTransaction(ctx: Context): Promise<void> {
    console.log("Fui chamado antes de chamar enviar a trasação");
    return;
  }

  public afterTransaction(ctx: Context, result: any): Promise<void> {
    console.log("Fui chamado após a transação", result);
    return;
  }

  public async issue(
    ctx: FinchainContext,
    key: string,
    issuer: string,
    value: Number,
    maturityDate: Date
  ) {
    const cdb = CDBState.createInstance({ key, issuer, value, maturityDate, status: CDBStatus.ISSUED });
    console.log("Creating cdb", cdb);
    return await ctx.stub.putState(key,CDBState.serialize(cdb));
  }

  public async buy(ctx: FinchainContext, key: string, owner: string) {
    const cdbByes = await ctx.stub.getState(key);
    let cdb = JSON.parse(cdbByes.toString("utf8"));
    if(cdb.status !== CDBStatus.ISSUED) throw new Error("O status do cdb deve ser ISSUED")
    cdb = CDBState.createInstance({ ...cdb, owner, status: CDBStatus.BOUGHT });
    await ctx.stub.putState(key, CDBState.serialize(cdb));
    return cdb;
  }

  public async findCDB(ctx: FinchainContext, key: string) {
    const cdb = await ctx.getState(key);
    if (!cdb) throw new Error("Não foi encontrado cdb com esse id");

    return cdb;
  }

  public async findAllTxsForKey(ctx: FinchainContext, key: string) {
    const txsIterator = await ctx.stub.getHistoryForKey(key);
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

  public async delete(ctx: FinchainContext, key: string) {
    const cdb = await ctx.getState(key);
    if (!cdb) throw new Error("Não foi encontrado cdb com esse id");


    return await ctx.stub.deleteState(key).then( () => {
          return true;
      }
    ).catch( error => {
      console.log(error);
      return false;
    });


  }
}
