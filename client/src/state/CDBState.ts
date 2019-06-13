import { CDB } from "./CDB";
import { State } from "./State";
import { CDBStatus } from './enum/CDBStatus';

export class CDBState extends State {
  public key: string;
  public value: Number;
  public issuer: string;
  public maturityDate: Date;
  public status: CDBStatus;
  public owner: string;

  constructor(cdb: CDB) {
    super();
    this.key = cdb.key;
    this.value = cdb.value;
    this.issuer = cdb.issuer;
    this.status = cdb.status;
    this.maturityDate = cdb.maturityDate;
    this.status = cdb.status;
    this.owner = cdb.owner || "noone"
  }

  static createInstance(cdb: CDB) {
    return new CDBState(cdb);
  }

}
