import {ArrayTypeDeclaration, ObjectTypeDeclaration, TypeDeclaration} from './raml';
import {format} from 'date-fns'

export namespace TypeFactory{
    export class DateTime extends Date {
        toString(){
            return format(this, "YYYY-MM-DD HH:mm:ss");
        }
    }
    export class DateOnly extends Date {
        toString(){
            return format(this, "YYYY-MM-DD");
        }
    }


    let types: { [type: string]: ObjectTypeDeclaration } = {};
    let dynamicClasses: { [type: string]: Function } = {};

    export function createClass(dec: ObjectTypeDeclaration): Function {
        let fun = dynamicClasses[dec.type];
        if (fun == null) {
            fun = new Function('console.log(this.dynamicName)');
            fun.prototype = {
                dynamicName: dec.type,
                toString: function () {
                    return types[this.dynamicName].properties.map(p => this[p.name]).join(',');
                }
            };
            dynamicClasses[dec.type] = fun;
            types[dec.type] = dec;
        }
        return fun;
    }

    export function myToString(){
        if(this.typedef.type === 'date-only') {
            return format(this, "YYYY-MM-DD");
        }
        if(this.typedef.type === 'datetime') {
            return format(this, "YYYY-MM-DD HH:mm:ss");
        }

        if(this.typedef.hasOwnProperty('options')) {
            let options = this.typedef.options;
            for (let option of options) {
                if(option.value === this) {
                    return option.label;
                }
            }
        }
        if(this.typedef instanceof ObjectTypeDeclaration) {
            // return this.typedef.properties.map(p => this[p.name]).join(',');
        }
        if(this.typedef instanceof ArrayTypeDeclaration) {
            // return this.join(',');
        }
        return this;
    }
}
