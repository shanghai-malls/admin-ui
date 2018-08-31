import {Component, FormBody, FormItem} from '../model';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class FormBodyProcessor {


    process(formBody: FormBody) {
        formBody.children = formBody.children.filter(cell => {
            let formItem = cell.content;
            let type = formItem.type;
            if (type === 'fieldset' || type === 'array' || type === 'map') {
                console.warn(`不支持${formItem.type}类型的表单项=>${formItem.field}`);
                return false;
            }
            return true;
        });

        // for (let cell of formBody.children) {
        //     let formItem = cell.content as FormItem;
        //     if (   formItem.type === 'date'
        //         || formItem.type === 'date-range'
        //         || formItem.type === 'rich-text'
        //         || formItem.type === 'textarea'
        //         || formItem.type === 'cascader'
        //         || formItem.type === 'checkbox') {
        //         cell.content = Component.create(formItem) as FormItem;
        //     }
        // }
    }



}
