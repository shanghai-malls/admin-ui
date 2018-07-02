import {Column} from './ui';

export class DataColumn extends Column{

    parent: DataColumn;

    constructor(column: any, parent?: DataColumn) {
        super(column);
        this.parent = parent;
        if(column.columns) {
            this.columns = column.columns.map(c => new DataColumn(c, this));
        }
    }

    formatText(data: any){
        let fields = [this.field];
        let p = this.parent;
        while (p) {
            fields.push(p.field);
            p = p.parent;
        }

        let value = data;
        for (let field of fields.reverse()) {
            value = value[field];
        }
        return value;
    }
}
