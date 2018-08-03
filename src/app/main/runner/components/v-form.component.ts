import {Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Component as UIComponent, Form, FormItem} from '../../../model/ui';
import {FormArray, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {HttpOptions, HttpService} from '../../../model/http.service';
import {extractUriParameters, formatPath} from '../../../model/function';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'v-form',
    template: `
        <form nz-form>
            <div class="v-header" *ngIf="form.header">
                <div class="title">{{form.header}}</div>
            </div>

            <div class="v-body">
                <div nz-row [nzGutter]="form.horizontal * 2" [formGroup]="formGroup" nzType="flex" nzJustify="start" nzAlign="top" >
                    <div nz-col *ngFor="let cell of form.children; let i = index" [nzSpan]="cell.width"
                         [style.marginTop.px]="form.vertical"
                         [style.marginBottom.px]="form.vertical" [class.hide]="i > markCollapseIndex">
                        <nz-form-item nzFlex [nzGutter]="12" >
                            <nz-form-label [nzSpan]="24 - cell.content.width" [nzRequired]="cell.content.required">{{cell.content.label}}</nz-form-label>
                            <nz-form-control [nzSpan]="cell.content.width">
                                <ng-container *ngIf="cell.content.type === 'display-text'">
                                    {{formGroup.value[cell.content.field] || '无'}}
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'date'">
                                    <nz-date-picker [formControlName]="cell.content.field" [nzShowTime]="cell.content.showTime" [nzFormat]="cell.content.format" [nzDisabledDate]="cell.content.disabledDate" [nzDisabled]="cell.content.readonly"></nz-date-picker>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'date-range'">
                                    <nz-range-picker [formControlName]="cell.content.field" [nzShowTime]="cell.content.showTime" [nzFormat]="cell.content.format" [nzDisabledDate]="cell.content.disabledDate" [nzDisabled]="cell.content.readonly"></nz-range-picker>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'time'">
                                    <nz-time-picker [formControlName]="cell.content.field" [nzFormat]="cell.content.format" [nzDisabled]="cell.content.readonly"></nz-time-picker>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'textarea'">
                                    <textarea nz-input [formControlName]="cell.content.field" [placeholder]="cell.content.description || cell.content.label" [nzAutosize]="cell.content.auto || cell.content.size" [readonly]="cell.content.readonly"></textarea>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'rich-text'">
                                    <textarea nz-input [formControlName]="cell.content.field" [placeholder]="cell.content.description || cell.content.label" [nzAutosize]="cell.content.auto || cell.content.size" [readonly]="cell.content.readonly"></textarea>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'text'">
                                    <input nz-input [formControlName]="cell.content.field" [readonly]="cell.content.readonly"/>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'number'">
                                    <nz-input-number [formControlName]="cell.content.field" [nzStep]="cell.content.stride" [nzMax]="cell.content.max" [nzMin]="cell.content.min" [nzDisabled]="cell.content.readonly"></nz-input-number>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'slider'">
                                    <nz-slider [formControlName]="cell.content.field" [nzStep]="cell.content.stride" [nzMax]="cell.content.max" [nzMin]="cell.content.min" [nzDisabled]="cell.content.readonly"></nz-slider>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'rate'">
                                    <nz-rate [formControlName]="cell.content.field" [nzAllowHalf]="cell.content.half" [nzCount]="cell.content.count" [nzDisabled]="cell.content.readonly"></nz-rate>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'select'">
                                    <nz-select [nzPlaceHolder]="cell.content.description" [formControlName]="cell.content.field" [nzDisabled]="cell.content.readonly">
                                        <nz-option *ngFor="let option of cell.content.options" [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
                                    </nz-select>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'cascader'">
                                    <nz-cascader [formControlName]="cell.content.field" [nzOptions]="cell.content.options" [nzDisabled]="cell.content.readonly"></nz-cascader>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'radio'">
                                    <nz-radio-group [formControlName]="cell.content.field" [nzDisabled]="cell.content.readonly">
                                        <label *ngFor="let option of cell.content.options" nz-radio [nzValue]="option.value">{{option.label}}</label>
                                    </nz-radio-group>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'checkbox'">
                                    <nz-checkbox-group [formControlName]="cell.content.field" [nzDisabled]="cell.content.readonly"></nz-checkbox-group>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'switch'">
                                    <nz-switch *ngIf="cell.content.mode == 'switch'" [formControlName]="cell.content.field" [nzDisabled]="cell.content.readonly"></nz-switch>
                                    <label nz-checkbox *ngIf="cell.content.mode == 'checkbox'" [formControlName]="cell.content.field" [nzDisabled]="cell.content.readonly"></label>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'data-picker'">
                                    <data-picker [formControlName]="cell.content.field" [view]="cell.content.view" [referenceExp]="cell.content.ref" ></data-picker>
                                </ng-container>
                                <ng-container *ngIf="cell.content.type === 'upload'">
                                    <nz-upload nzAction="/api/settings/aliyun-oss" [nzListType]="cell.content.listType" [nzShowButton]="cell.content.multiple">
                                        <i class="anticon anticon-plus"></i>
                                        <div class="ant-upload-text">Upload</div>
                                    </nz-upload>
                                </ng-container>
                            </nz-form-control>
                        </nz-form-item>
                    </div>
                    <div nz-col *ngIf="form.buttonsPlacement ==='line-end'"
                         [nzSpan]="buttonGroupWidth"
                         [style.marginTop.px]="form.vertical"
                         [style.marginBottom.px]="form.vertical"
                         style="text-align: right">
                        <a class="motion-collapse" (click)="toggleCollapse()">
                            <i class="anticon" [class.anticon-down]="markCollapseIndex !== form.children.length" [class.anticon-up]="markCollapseIndex === form.children.length"></i>
                        </a>
                        <button nz-button [nzType]="form.submitButton.classType" (click)="submit()">{{form.submitButton.text}}</button>
                        <button nz-button [nzType]="form.clearButton.classType" (click)="cancel()">{{form.clearButton.text}}</button>
                    </div>
                </div>
            </div>

            <div class="v-footer" *ngIf="form.buttonsPlacement ==='footer'">
                <button nz-button [nzType]="form.submitButton.classType" (click)="submit()">{{form.submitButton.text}}</button>
                <button nz-button [nzType]="form.clearButton.classType" (click)="cancel()">{{form.clearButton.text}}</button>
            </div>
        </form>
    `,
    styleUrls: ['../../../base.less'],
})
export class VFormComponent implements OnInit, OnChanges {
    @Input()
    form: Form;

    @Input()
    path?: string;

    @Input()
    route: string;

    @Input()
    value?: any;

    @Input()
    @Output()
    onActions?: EventEmitter<any> = new EventEmitter();


    @HostBinding("class.hide")
    get hide(){
        return this.form.children.length == 0;
    }

    uriParameters: {[p:string]:string};
    markCollapseIndex = 0;
    buttonGroupWidth = 0;


    formGroup: FormGroup;

    constructor(private http: HttpService, private messageService: NzMessageService) {
    }

    ngOnInit(): void {
        this.uriParameters = extractUriParameters(this.path, this.route);
        this.processForm();
        this.formGroup = this.initFormGroup();
        this.onActions.emit({eventType: 'init'});
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.formGroup) {
            if (changes.hasOwnProperty('form')) {
                this.ngOnInit();
            }
        }
    }


    processForm(){
        this.form.children = this.form.children.filter(cell=>{
            let formItem = cell.content as FormItem;
            let type = formItem.type;
            if (type === 'fieldset' || type === 'array' || type === 'map') {
                console.warn(`不支持${formItem.type}类型的表单项`);
                return false;
            }
            return true;
        });
        for (let cell of this.form.children) {
            let formItem = cell.content as FormItem;

            if (formItem.type === 'date' || formItem.type === 'date-range'
                || formItem.type === 'rich-text' || formItem.type === 'textarea'
                || formItem.type === 'cascader' || formItem.type === 'checkbox' ) {
                cell.content = UIComponent.create(formItem)
            }


            if(this.uriParameters) {
                let parts = formItem.field.split('.');
                for (let part of parts) {
                    if(this.uriParameters.hasOwnProperty(part)) {
                        cell.width = 0;
                    }
                }
            }
        }
        this.markCollapseIndex = this.form.children.length;
        this.toggleCollapse();
    }

    toggleCollapse() {
        let collapsible = this.form.collapsible;
        let buttonsPlacement = this.form.buttonsPlacement;
        if (collapsible && buttonsPlacement === 'line-end') {
            let doCollapse = this.markCollapseIndex === this.form.children.length;
            let sum = 0;
            if (doCollapse) {
                for (let i = 0; i < this.form.children.length; i++) {
                    sum += this.form.children[i].width;
                    if (sum >= 16) {
                        this.markCollapseIndex = i;
                        this.buttonGroupWidth = 24 - sum;
                        break;
                    }
                }
            } else {
                this.markCollapseIndex = this.form.children.length;
                for (let i = 0; i < this.form.children.length; i++) {
                    let cell = this.form.children[i];
                    sum += cell.width;
                }
                this.buttonGroupWidth = 24 - sum % 24;
            }
        } else if(buttonsPlacement === 'footer') {
            this.buttonGroupWidth = 24;
        }
    }

    initFormGroup(){
        let formGroup = new FormGroup({});
        this.addToFormGroup(this.form, formGroup);
        if (this.value) {
            formGroup.patchValue(this.value);
        } else if(this.form.autoLoadUrl) {
            this.http
                .request('get', formatPath(this.form.autoLoadUrl, this.uriParameters), {convertResult: true})
                .then(value=>this.formGroup.patchValue(value));
        }
        return formGroup;
    }

    addToFormGroup(node: any, formGroup: FormGroup) {
        if (node.field) {
            formGroup.addControl(node.field, this.formItemToControl(node));
            return;
        }

        if (node.children) {
            for (let child of node.children) {
                this.addToFormGroup(child, formGroup);
            }
        }

        if (node.content) {
            this.addToFormGroup(node.content, formGroup);
        }
    }

    formItemToControl(node: any) {
        let validators = [];
        if (node.required) {
            validators.push(Validators.required);
        }

        if (node.type === 'fieldset') {
            let formGroup = new FormGroup({}, validators);
            for (let child of node.children) {
                this.addToFormGroup(child, formGroup);
            }
            return formGroup;
        }

        if (node.minLength) {
            validators.push(Validators.minLength(node.minLength));
        }
        if (node.maxLength) {
            validators.push(Validators.maxLength(node.maxLength));
        }

        if (node.type === 'array') {
            return new FormArray([this.formItemToControl(node.items)], validators);
        }

        if (node.type === 'map') {
            return new FormArray([
                new FormGroup({
                    key: this.formItemToControl(node.key),
                    val: this.formItemToControl(node.val),
                })
            ], [...validators, this.uniqueKeyValidator]);
        }

        if (node.pattern) {
            validators.push(Validators.pattern(node.pattern));
        }
        if (node.min) {
            validators.push(Validators.min(node.min));
        }
        if (node.max) {
            validators.push(Validators.max(node.max));
        }

        return new FormControl(node.value, validators);
    }

    uniqueKeyValidator(input: FormControl): ValidationErrors | null {
        if (input.parent) {
            let currentValue = input.value;
            let formArray = input.parent.parent as FormArray;
            for (let i = 0; i < formArray.length; i++) {
                let control = (<FormGroup>formArray.at(i)).controls.key;
                if (input === control) {
                    continue;
                }
                if (currentValue === control.value) {
                    return {uniqueKey: `key不能重复，当前值与第${i + 1}行的key重复了`};
                }
            }
        }
        return null;
    }



    submit(params?: any) {
        let options: HttpOptions = {
            headers: {
                'Content-Type': this.form.contentType || 'application/x-www-form-urlencoded'
            },
            convertResult: this.form.method === 'get'
        };
        let value = {};
        if(params) {
            Object.assign(value, params);
        }
        Object.assign(value , this.getFormValue());


        if (options.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            options.params = value;
        } else {
            options.body = value;
        }

        try {
            this.http.request(this.form.method, formatPath(this.form.path, this.uriParameters), options).then((data) => {
                if (this.onActions) {
                    this.onActions.next({eventType: 'submitted', data});
                }
            });
        } catch (e) {
            this.messageService.error(e);
        }
    }

    private getFormValue(){
        let value = this.formGroup.value;
        for (let key of Object.keys(value)) {
            if (key.indexOf('.') !== -1) {
                let propertyValue = value[key];
                delete value[key];

                let parts = key.split('.');
                let obj = value;
                for (let i = 0; i < parts.length; i++) {
                    let part = parts[i];
                    if(i < parts.length  - 1) {
                        if(obj[part] == null) {
                            obj[part] = {};
                        }
                        obj = obj[part];
                    } else {
                        obj[part] = propertyValue;
                    }
                }
            }
        }
        return value;
    }

    cancel() {
        this.formGroup.reset({});
        if (this.onActions) {
            this.onActions.next({eventType: 'canceled'});
        }
    }
}
