import {Component, Input, OnChanges, OnInit, Optional, SimpleChanges} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {AbstractComponent, extractUriParameters, Form, formatPath,} from '../../public/model';

import {HttpOptions, HttpService} from '../../public/service/http.service';
import {TransformService} from '../../public/service/transform.service';
import {AbstractFormComponent, FormGroups} from './abstract-form.component';
import {FormBodyProcessor} from '../../public/service/form-body-processor';
import {FormViewProcessorDelegate} from '../../public/service/form-view-processor';

/**
 * form group wrapper
 */

@Component({
    selector: 'v-form',
    templateUrl: './v-form.component.html',
    styleUrls: ['./v-form.component.less']
})
export class VFormComponent extends AbstractFormComponent implements OnInit, OnChanges, AbstractComponent<Form>  {
    @Input()
    form: Form;

    @Input()
    path?: string;

    @Input()
    route: string;


    contentType: string;

    formGroups: FormGroups;

    confirm: boolean;

    constructor(http: HttpService, transformer: TransformService, formBodyProcessor: FormBodyProcessor,
                private delegate: FormViewProcessorDelegate,
                private messageService: NzMessageService, @Optional() public modalRef: NzModalRef) {
        super(http, transformer, formBodyProcessor);
    }


    ngOnInit(): void {
        this.form = this.processForm();
        this.delegate.preLoad(this.form, this.route, this.path);
        this.formGroups = this.createFormGroups(this.form);
        if (this.form.body && this.form.body.length > 0) {
            this.contentType = this.form.body[0].contentType;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.formGroups) {
            this.ngOnInit();
        }
    }

    initComponent(component: Form, path: string, route: string) {
        this.form = component;
        this.path = path;
        this.route = route;
    }

    processForm(): Form{
        let form = super.processForm(this.form);
        this.markForm();
        return form;
    }

    get uriParameters(): { [p: string]: string } {
        return extractUriParameters(this.path, this.route);
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

        this.processModalRef();
        for (let row of array) {
            if (row && row.children) {
                for (let cell of row.children) {
                    if(cell.width > 0) {
                        this.confirm = false;
                        return;
                    }
                }
            }
        }
        this.confirm = true;

    }

    processModalRef(){
        if(this.modalRef) {
            let modalComponent = this.modalRef.getInstance();
            if(this.confirm) {
                modalComponent.nzWidth = 416;
                modalComponent.nzClosable = false;
                modalComponent.nzClassName = "ant-confirm ant-confirm-confirm"
            } else {
                modalComponent.nzBodyStyle = {padding: 0}
            }
        }
    }

    preSubmit(formValue: any, form: Form, route: string, path: string) {
        this.delegate.preSubmit(formValue, form, route, path);
    }

    submit() {
        let options:HttpOptions = {};
        options.showMessage = true;
        options.params = {};

        options.headers = {'Content-Type': this.contentType};
        if (this.formGroups.headers) {
            Object.assign(options.headers, this.formGroups.headers.value);
        }


        let formSubmit = this.contentType === 'application/x-www-form-urlencoded';
        let formValue = this.getFormValue(formSubmit);
        if (formValue) {
            if (formSubmit) {
                options.body = this.toURLSearchParams(formValue);
            } else {
                options.body = formValue;
            }
        }

        this.preSubmit(options, this.form, this.route, this.path);

        if(this.formGroups.queryParameters) {
            Object.assign(options.params, this.formGroups.queryParameters.value);
        }

        try {
            let method = this.form.method;
            let url = formatPath(this.form.path, this.uriParameters);


            this.http.request(method, url, options)
                .then(() => {
                    if (this.modalRef) {
                        this.modalRef.destroy();
                        this.modalRef.triggerOk();
                    }
                });

        } catch (e) {
            this.messageService.error(e);
        }
    }

    private toURLSearchParams(formValue: any): URLSearchParams {
        const searchParams = new URLSearchParams();
        for (let key of Object.keys(formValue)) {
            searchParams.set(key, formValue[key]);
        }
        return searchParams;
    }

    private getFormValue(flat?: boolean) {
        if(this.form.body) {
            let bodyIndex = this.form.body.findIndex(item => item.contentType === this.contentType);
            let value = this.formGroups.body[bodyIndex].value;
            if(flat) {
                return value;
            }

            for (let key of Object.keys(value)) {
                if (key.indexOf('.') !== -1) {
                    let propertyValue = value[key];
                    delete value[key];

                    let parts = key.split('.');
                    let obj = value;
                    for (let i = 0; i < parts.length; i++) {
                        let part = parts[i];
                        if (i < parts.length - 1) {
                            if (obj[part] == null) {
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
    }

    cancel() {
        if(this.form.body) {
            let bodyIndex = this.form.body.findIndex(item => item.contentType === this.contentType);
            this.formGroups.body[bodyIndex].reset({});
        }

        if(this.formGroups.headers) {
            this.formGroups.headers.reset({});
        }

        if(this.formGroups.queryParameters) {
            this.formGroups.queryParameters.reset({});
        }

        if (this.modalRef) {
            this.modalRef.triggerCancel();
        }
    }

}
