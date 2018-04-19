import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd';
import {Subject} from 'rxjs/Subject';
import {
    ArrayFormItem,
    FormItem,
    im, isNotEmpty,
    MapFormItem,
    modalZIndex,
    ObjectFormItem,
    propertyToFormControl,
    SimpleFormItem
} from '../../../model/model';
import {TableComponent} from './table.component';
import {StartupService} from '../../../model/startup.service';
import {AbstractControl} from '@angular/forms/src/model';


@Component({
    selector: 'form-item',
    templateUrl: 'form-item.component.html'
})
export class FormItemComponent implements OnInit {
    @Input() item: FormItem;
    @Input() formGroup: FormGroup | FormArray;
    @Input() key?: string | number;
    @Input() showLabel?: boolean = true;
    control: AbstractControl;


    constructor(private fb: FormBuilder, private startupService: StartupService, private modalService: NzModalService) {
    }

    required: boolean;
    labelWidth: number;
    controlType: string;
    simpleControlType: string;

    formItems: FormItem[];
    arrayItems: FormItem;
    keyItem: FormItem;
    valueItem: FormItem;



    ngOnInit(): void {

        this.key = this.key == null ? this.item.property.name : this.key;
        this.control = this.formGroup.controls[this.key];

        if (this.item instanceof ObjectFormItem) {
            this.controlType = 'fieldset';
            this.formItems = this.item.formItems;
        } else if (this.item instanceof ArrayFormItem) {
            this.controlType = 'array';
            this.arrayItems = this.item.items;
        } else if (this.item instanceof MapFormItem) {
            this.controlType = 'map';
            this.keyItem = this.item.key;
            this.valueItem = this.item.value;
        } else if (this.item instanceof SimpleFormItem) {
            this.controlType = 'simple';
            this.simpleControlType = this.item.control.type;
            this.required = this.item.itemType === 'edit' ? this.item.property.required : false;
            this.labelWidth = this.item.itemType == 'display' ? 15 : 12 / this.item.width * im.defaultWidth();
        }

    }


    remove(i: number) {
        let formArray = this.control as FormArray;
        if(formArray.length > 1) {
            formArray.removeAt(i);
        }
    }

    add() {
        let formArray = this.control as FormArray;
        if(this.arrayItems) {
            formArray.push(propertyToFormControl(this.arrayItems.property));
        } else {
            formArray.push(propertyToFormControl(this.valueItem.property));
        }
    }

    hide() {
        let property = this.item.property;
        if (this.item.itemType == 'edit' && property.idLike() && isNotEmpty(this.formGroup.value[property.name], true)) {
            return true;
        }
        return this.item.hide;
    }

    showReferenceDialog() {
        let prop = this.item.property;
        let item = this.item as SimpleFormItem;
        let attributes = item.control.attributes;
        let expression = attributes['expression'];
        let type = expression.substring(0, expression.lastIndexOf("."));
        let fieldName = expression.substring(expression.lastIndexOf(".") + 1);
        fieldName = fieldName.substring(0, 1).toLowerCase() + fieldName.substring(1);
        let view = this.startupService.getViewByType(type);
        let path = view.api.path;
        let subject = new Subject<any>();
        let agent = this.modalService.create({
            nzTitle: '请选择' + prop.description,
            nzContent: TableComponent,
            nzComponentParams: {
                view, subject, path
            },
            nzWidth: '61.8%',
            nzZIndex: modalZIndex(),
            nzFooter: null
        });
        subject.subscribe(result => {
            this.formGroup.value[prop.name] = result[fieldName];
            agent.destroy();
        });
    }
}
