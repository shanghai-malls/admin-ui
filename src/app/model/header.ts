import {Column} from './ui';

export class Header{
    column: Column;

    parent: Header;
    children: Header[];

    _rowspan: number;


    constructor(column: Column, parent?: Header) {
        this.column = column;
        this.parent = parent;
        if(this.column.columns) {
            this.children = this.column.columns.map(c => new Header(c, this));
        }
    }

    get colspan(){
        if(this.children) {
            return this.children.filter(c => !c.hide).reduce((prev, current) => prev + current.colspan, 0) || 1;
        }
        return 1;
    }

    get rowspan(){
        return this._rowspan;
    }

    set rowspan(rowspan: number){
        this._rowspan = rowspan;
    }

    get field(){
        return this.column.field;
    }

    get title(){
        return this.column.title;
    }

    set title(title: string){
        this.column.title = title;
    }

    get index(){
        return this.column.index;
    }

    set index(index: number){
        this.column.index = index;
    }

    get hide(){
        return this.column.hide;
    }

    set hide(hide: boolean){
        this.column.hide = hide;
    }

    get show(){
        if(this.parent) {
            return !this.column.hide && this.parent.show;
        }
        return !this.column.hide;
    }

    get parentsRowspan(){
        let p = this.parent;
        let count = 0;
        while(p) {
            count ++;
            p = p.parent;
        }
        return count;
    }
}
