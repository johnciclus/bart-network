import { CDBStatus } from './enum/CDBStatus';
export interface CDB{
    key:string;
    value: Number;
    issuer: string;
    status: CDBStatus;
    owner?: string;
    maturityDate?: Date;
}