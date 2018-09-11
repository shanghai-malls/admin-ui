import {Component, Input, OnChanges, OnInit, Optional, SimpleChanges} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {AbstractComponent, AutoLoader, extractUriParameters, Form, formatPath,} from '../../public/model';

import {HttpOptions, HttpService} from '../../public/service/http.service';
import {TransformService} from '../../public/service/transform.service';
import {AbstractFormComponent, FormGroups} from './abstract-form.component';
import {ComponentLifecycleListenerDelegate} from '../../public/service/component-lifecycle-listener';
import {FormGroup} from '@angular/forms';


@Component({
    selector: 'v-form',
    templateUrl: './v-form.component.html',
    styleUrls: ['./v-form.component.less']
})
export class VFormComponent extends AbstractFormComponent implements OnInit, OnChanges, AbstractComponent<Form> {

    @Input()
    form: Form;

    @Input()
    path?: string;

    @Input()
    route: string;

    uriParameters: {[key: string]: string};

    contentType: string;

    confirm = true;

    constructor(private http: HttpService, private transformer: TransformService,
                private delegate: ComponentLifecycleListenerDelegate,
                private messageService: NzMessageService, @Optional() public modalRef: NzModalRef) {
        super();
    }

    ngOnInit(): void {
        this.delegate.preInit(this);

        this.initUriParameters();

        this.markForm();

        this.initContentType();

        this.createFormGroups(this.form);

        this.doAutoLoad();

        this.delegate.postInit(this);
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

    initUriParameters() {
        this.uriParameters = extractUriParameters(this.path, this.route);
    }

    doAutoLoad(){
        for (let key of Object.keys(this.formGroups)) {
            let formGroup = this.formGroups[key];
            let autoLoader = this.form[key].autoLoader;
            if (autoLoader && autoLoader.url) {
                let method = 'get';
                let url = formatPath(autoLoader.url, this.uriParameters);
                let options = {headers: {}};
                if (autoLoader.accept) {
                    options.headers = {Accept: autoLoader.accept};
                }

                this.delegate.preQuery(url, options, this);

                this.http.get(url, options)
                    .then(result => {
                        let value = this.transformer.transform(result, url, method);
                        this.delegate.postQuery(value, this);
                        return value;
                    })
                    .then(value => {
                        formGroup.patchValue(value);
                    });
            }
        }
    }

    initContentType(){
        if (this.form.body && this.form.body.length > 0) {
            this.contentType = this.form.body[0].contentType;
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

        outer: for (let row of array) {
            if (row && row.children) {
                for (let cell of row.children) {
                    if(cell.width > 0) {
                        this.confirm = false;
                        break outer;
                    }
                }
            }
        }

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

        if(this.formGroups.queryParameters) {
            Object.assign(options.params, this.formGroups.queryParameters.value);
        }

        try {
            let method = this.form.method;
            let url = formatPath(this.form.path, this.uriParameters);

            this.delegate.preSubmit(method, url, options, this);

            this.http.request(method, url, options)
                .then((response) => {
                    if (this.modalRef) {
                        this.modalRef.destroy();
                        this.modalRef.triggerOk();
                    }

                    this.delegate.postSubmit(response, this);
                });

        } catch (e) {
            this.messageService.error(e);
        }
    }

    toURLSearchParams(formValue: any): URLSearchParams {
        const searchParams = new URLSearchParams();
        for (let key of Object.keys(formValue)) {
            searchParams.set(key, formValue[key]);
        }
        return searchParams;
    }

    getFormValue(flat?: boolean) {
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
