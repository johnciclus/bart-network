export interface CreditGuarantee{
    id: string;
    name: string;
    type: string;
    digitalAddress: string;
    expirationDate?: Date;
    value: number;
    units: string;
    owner: string;
}
