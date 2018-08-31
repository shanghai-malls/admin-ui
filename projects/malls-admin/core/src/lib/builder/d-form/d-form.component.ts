import {Component, Input, OnInit} from '@angular/core';
import {AbstractDesignerComponent, Form, FormBody, FormItem, Row} from '../../public/model';
import {FormSettingComponent} from '../settings/form-setting.component';
import {DesignService} from '../../public/service/design.service';
import {ModalService} from '../../public/service/modal.service';

@Component({
    selector: 'd-form',
    templateUrl: 'd-form.component.html',
    styleUrls: ['d-form.component.less']
})
export class DFormComponent implements OnInit , AbstractDesignerComponent<Form>{
    @Input()
    form: Form;

    bodies: FormBody[];

    confirm: boolean;

    contentType: string;

    constructor(private modalService: ModalService, public ds: DesignService) {
    }

    ngOnInit(): void {
        this.processForm();
    }

    initComponent(component: Form) {
        this.form = component;
    }

    /**
     * 处理form
     */
    processForm() {
        this.bodies = [];
        this.pushFormBody(this.form.headers);
        this.pushFormBody(this.form.queryParameters);
        if (this.form.body && this.form.body.length > 0) {
            this.contentType = this.form.body[0].contentType;
            this.form.body.forEach(item=>{
                this.pushFormBody(item);
            })
        }

        this.markForm();
    }

    /**
     * 处理form
     * @param row
     */
    pushFormBody(row: Row<FormItem>){
        if(row) {
            this.bodies.push(row);
        }
    }

    /**
     * 标记该form对象是否为一个confirm form
     */
    markForm(){
        let array = [this.form.headers, this.form.queryParameters];
        if(this.form.body) {
            for (let formBody of this.form.body) {
                array.push(formBody);
            }
        }
        for (let row of array) {
            if(row && row.children) {
                for (let cell of row.children) {
                    if(cell.width > 0) {
                        this.confirm = false;
                        return;
                    }
                }
            }
        }
    }

    focused: boolean;

    focus(title: HTMLInputElement) {
        this.focused = true;
        setTimeout(() => title.focus(), 50);
    }

    blur(title: HTMLInputElement) {
        this.focused = false;
        title.blur();
    }

    showFormSetting() {
        this.modalService.openDesignSetting('设置表单', FormSettingComponent, {value: this.form});
    }

}
