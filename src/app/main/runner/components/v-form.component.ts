import {Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ArrayField, Cell, DatePicker, Form, FormItem, MapField, TextArea} from '../../../model/ui';
import {FormArray, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {HttpOptions, HttpService} from '../../../model/http.service';
import {extractUriParameters, formatPath} from '../../../model/function';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'v-form',
    templateUrl: 'v-form.component.html',
    styleUrls: ['v-form.component.less']
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
        this.formGroup = this.initFormGroup();
        this.processForm();
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

            if (formItem.type === 'date' || formItem.type === 'date-range') {
                Object.setPrototypeOf(formItem, DatePicker.prototype);
            }

            if (formItem.type === 'rich-text' || formItem.type === 'textarea') {
                Object.setPrototypeOf(formItem, TextArea.prototype);
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
            console.log(this.uriParameters);
            console.log(formatPath(this.form.autoLoadUrl, this.uriParameters));
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
