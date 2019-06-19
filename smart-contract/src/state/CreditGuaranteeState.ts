import { CreditGuarantee } from "./CreditGuarantee";
import { State } from "./State";

export class CreditGuaranteeState extends State {
    public id: string;
    public name: string;
    public type: string;
    public digitalAddress: string;
    public expirationDate: Date;
    public value: number;
    public units: string;
    public owner?: string;

    constructor(creditGuarantee: CreditGuarantee) {
        super();
        this.id = creditGuarantee.id;
        this.name = creditGuarantee.name;
        this.type = creditGuarantee.type;
        this.digitalAddress = creditGuarantee.digitalAddress;
        this.expirationDate = creditGuarantee.expirationDate;
        this.value = creditGuarantee.value;
        this.units = creditGuarantee.units;
        this.owner = creditGuarantee.owner || "none"
    }

    static createInstance(creditGuarantee: CreditGuarantee) {
        return new CreditGuaranteeState(creditGuarantee);
    }

}
