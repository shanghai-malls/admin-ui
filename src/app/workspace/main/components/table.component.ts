import {Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {Subject} from 'rxjs/Subject';
import {
    Action,
    ArrayTypeDeclaration,
    FormItem,
    ListView,
    mapToRequestBodyFormItems,
    modalZIndex,
    ObjectTypeDeclaration,
    Options,
    Page,
    propertyToFormControl,
    TypeDeclaration,
    uuid
} from '../../../model/model';

import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
    selector: 'app-table',
    templateUrl: 'table.component.html',
})
export class TableComponent implements OnChanges , OnInit{
    @Input() path: string;
    @Input() view: ListView;
    @Input() subject?: Subject<any>;
    page: Page;
    searchForm: FormGroup;

    totalCols: number;
    isCollapse: boolean;

    @ViewChild('modalBody')
    modalBody: TemplateRef<any>;

    modalAgent: NzModalRef;
    modalFormItems: FormItem[];
    modalForm: FormGroup;

    constructor(private fb: FormBuilder, private router: Router, private messageService: NzMessageService,
                private modalService: NzModalService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initSearchForm();
        this.search();
    }

    ngOnInit(): void {
        if(!this.searchForm) {
            this.initSearchForm();
            this.search();
        }
    }

    initSearchForm() {
        this.searchForm = this.fb.group({});
        this.totalCols = 0;
        this.isCollapse = true;
        for (let formItem of this.view.searchFormItems) {
            this.totalCols += formItem.width;
            this.searchForm.addControl(formItem.property.name, new FormControl());
            if (this.totalCols > 24) {
                formItem.hide = true;
            }
        }
    }

    search() {
        let options = new Options();
        let queryParameters = this.searchForm.value;
        if (this.page) {
            queryParameters['size'] = this.page.size;
            queryParameters['page'] = this.page.number - 1;
        }
        options.params = queryParameters;
        this.page = new Page([]);
        this.view.api.execute(this.path, options).then(result => {
            let body = result.body;
            if (body instanceof Array) {
                this.page = new Page(body);
            } else {
                this.page = body;
                this.page.number += 1;
            }
        });
    }

    toggleCollapse() {
        this.isCollapse = !this.isCollapse;
        let total = 0;
        this.view.searchFormItems.forEach((formItem) => {
            total += formItem.width;
            if (this.isCollapse) {
                formItem.hide = total > 24;
            } else {
                formItem.hide = false
            }
        });
    }


    convertKeyValuePairArrayToMap(value: any, type: TypeDeclaration) {
        if (typeof value === 'object' && value) {
            if (value instanceof Array) {
                if (type instanceof ObjectTypeDeclaration && type.additionalProperties) {
                    let valueType = type.properties[0];
                    let map: { [k: string]: any } = {};
                    for (let kvPair of value) {
                        map[kvPair.key] = this.convertKeyValuePairArrayToMap(kvPair.value, valueType);
                    }
                    return map;
                } else if (type instanceof ArrayTypeDeclaration) {
                    let itemType = type.items;
                    for (let i = 0; i < value.length; i++) {
                        value[i] = this.convertKeyValuePairArrayToMap(value[i], itemType);
                    }
                }
            } else if (type instanceof ObjectTypeDeclaration) {
                for (let propertyName of Object.getOwnPropertyNames(value)) {
                    let propertyType = type.getProperty(propertyName);
                    let propertyValue = value[propertyName];
                    value[propertyName] = this.convertKeyValuePairArrayToMap(propertyValue, propertyType);
                }
            }
        }
        return value;
    }

    showModal(action: Action, path?: string, item?: any) {
        let bodyType = action.body[0];
        if (bodyType instanceof ObjectTypeDeclaration) {

            this.modalForm = this.fb.group({});
            let formValue = {};
            if (item) {
                for (let key of Object.getOwnPropertyNames(item)) {
                    let value = item[key];
                    if (typeof value == 'boolean') {
                        value = String(value);
                    }
                    formValue[key] = value;
                }
            }

            this.modalFormItems = mapToRequestBodyFormItems(bodyType, action);
            for (let formItem of this.modalFormItems) {
                this.modalForm.addControl(formItem.property.name, propertyToFormControl(formItem.property));
                if (formItem.property.stereotype === 'COMMAND_ID') {
                    formValue[formItem.property.name] = uuid();
                }
                if (formItem.property.id && path) {
                    if (formItem.property instanceof ObjectTypeDeclaration) {
                        formValue[formItem.property.name] = action.extractSegment(path);
                    } else {
                        formValue[formItem.property.name] = action.extractSegment(path)[formItem.property.name];
                    }
                }
                if(formItem.property instanceof ArrayTypeDeclaration) {
                    formValue[formItem.property.name] = formValue[formItem.property.name] || [];
                }
            }

            this.modalForm.patchValue(formValue);
            this.modalAgent = this.modalService.create({
                nzWidth: '61.8%',
                nzZIndex: modalZIndex(),
                nzTitle: action.description,
                nzContent: this.modalBody,
                nzFooter: [{
                    label: '取消',
                    type: 'default',
                    onClick: () => {
                        this.modalAgent.destroy();
                    }
                }, {
                    label: '提交',
                    type: 'primary',
                    disabled: () => {
                        return !this.modalForm.valid;
                    },
                    onClick: () => {
                        let options = new Options();
                        options.body = this.convertKeyValuePairArrayToMap(this.modalForm.value, bodyType);
                        console.log(options.body);
                        action.execute(path, options).then(result => {
                            if (result.code == 200) {
                                this.modalAgent.destroy();
                                this.messageService.success("操作成功");
                                this.search();
                            } else {
                                this.messageService.success("操作失败");
                            }
                        });
                    }
                }]
            })
        } else {
            this.messageService.warning(`目前暂不支持${action.displayName}操作`)
        }
    }

    showConfirm(action: Action, path?: string) {
        this.modalAgent = this.modalService.confirm({
            nzContent: `确定执行“${action.displayName}”操作？`,
            nzZIndex: modalZIndex(),
            nzOnCancel: () => {
                this.modalAgent.destroy();
            },
            nzOnOk: () => {
                action.execute(path).then(result => {
                    this.modalAgent.destroy();
                    if (result.code === 200) {
                        this.messageService.success("操作成功");
                        this.search();
                    } else {
                        this.messageService.error("操作失败");
                        console.log("操作失败，失败原因：" + result.text);
                    }
                });
            }
        })
    }

    navigate(path?: string) {
        this.router.navigateByUrl(path);
    }

    triggerAction(action: Action, path?: string, item?: any) {
        switch (action.mode) {
            case 'modal':
                this.showModal(action, path, item);
                break;
            case 'inline-row':
                //TODO
                break;
            case 'link':
                this.navigate(path);
                break;
            case 'confirm':
                this.showConfirm(action, path);
                break;
            case 'none':
                break;
        }
    }

    select(item: any) {
        this.subject.next(item);
    }
}

