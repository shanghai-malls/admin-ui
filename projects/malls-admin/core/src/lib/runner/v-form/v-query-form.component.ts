import {Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {HttpService} from '../../public/service/http.service';
import {TransformService} from '../../public/service/transform.service';
import {AbstractComponent, extractUriParameters, Form, formatPath,} from '../../public/model';
import {AbstractFormComponent} from './abstract-form.component';
import {FormBodyProcessor} from '../../public/service/form-body-processor';

@Component({
    selector: 'v-query-form',
    templateUrl: './v-query-form.component.html',
    styleUrls: ['./v-query-form.component.less']
})
export class VQueryFormComponent extends AbstractFormComponent implements OnInit, OnChanges, AbstractComponent<Form> {
    @Input()
    form: Form;

    @Input()
    path: string;

    @Input()
    route: string;

    @Input()
    value?: any;

    @Output()
    onActions?: EventEmitter<any> = new EventEmitter();

    @HostBinding('class.hide')
    get hide() {
        let {queryParameters, headers} = this.form;
        let length = 0;
        if(queryParameters) {
            length += queryParameters.children.length;
        }
        if(headers) {
            length += headers.children.length;
        }
        return length === 0;
    }

    doCollapse = true;
    markCollapseIndex:number;
    buttonGroupWidth = 8;


    formGroups:{headers?: FormGroup, queryParameters?: FormGroup};

    constructor(http: HttpService, transformer: TransformService, formBodyProcessor: FormBodyProcessor) {
        super(http, transformer, formBodyProcessor);
    }

    ngOnInit(): void {
        this.form = this.processForm(this.form);
        this.formGroups = this.createFormGroups(this.form);
        this.query();
        this.toggleCollapse();

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

    get uriParameters(): { [p: string]: string } {
        return extractUriParameters(this.path, this.route);
    }

    toggleCollapse() {
        if(this.form.queryParameters) {
            let sum = 0;
            let cells = this.form.queryParameters.children;
            //如果form可折叠，并且当前操作为折叠操作，则计算首行中按钮的宽度
            if(this.form.collapsible && this.doCollapse) {
                for (let i = 0; i < cells.length; i++) {
                    sum += cells[i].width;
                    if (sum >= 16) {
                        this.markCollapseIndex = i;
                        break;
                    }
                }
                this.buttonGroupWidth = 24 - sum;
            } else {
                this.markCollapseIndex = cells.length;
                for (let i = 0; i < cells.length; i++) {
                    let cell = cells[i];
                    sum += cell.width;
                }
                this.buttonGroupWidth = 24 - sum % 24;
            }
            this.doCollapse = !this.doCollapse;
        }
    }

    private getFormValue() {
        let queryParams: any = {};
        if(this.formGroups.queryParameters) {
            let queryValue = this.formGroups.queryParameters.value;
            for (let cell of this.form.queryParameters.children) {
                let item = cell.content;
                let fieldValue = queryValue[item.field];
                if(fieldValue) {
                    if (item.op && item.op !== 'eq') {
                        let paramValue = item.op + '(' + fieldValue + ')';
                        if(fieldValue instanceof Array) {
                            if(item.op === 'between' && paramValue.length == 2) {
                                fieldValue.sort((a,b)=>{
                                    if(!isNaN(a) && !isNaN(b)) {
                                        return parseFloat(a) - parseFloat(b);
                                    }
                                    return new Date(a).getTime() - new Date(b).getTime();
                                });
                            }
                            paramValue = item.op + '(' + fieldValue.join(',') + ')';
                        }
                        queryParams[item.field] = paramValue;
                    } else {
                        queryParams[item.field] = fieldValue;
                    }
                }
            }
            return queryParams;
        }
    }

    query(input?: any){
        let params = Object.assign({},this.getFormValue(), input);

        let headers: { [key: string]: string | string[] } = {};

        if (this.form.accept) {
            headers.Accept = this.form.accept;
            headers['Content-Type'] = 'application/json';
        }

        if (this.formGroups.headers) {
            Object.assign(headers, this.formGroups.headers.value);
        }

        let method = this.form.method;
        let url = formatPath(this.form.path, this.uriParameters);

        this.http
            .request(method, url, {params, headers, showMessage: false})
            .then(data => this.transformer.transform(data, url, method))
            .then(data => this.onActions.next(data))
        ;
    }

    clear() {
        if(this.formGroups.queryParameters) {
            this.formGroups.queryParameters.reset({});
        }
        if(this.formGroups.headers) {
            this.formGroups.headers.reset({});
        }
        if (this.onActions) {
            this.onActions.next('cleared');
        }
    }
}
