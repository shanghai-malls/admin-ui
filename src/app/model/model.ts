import {HttpClient} from '@angular/common/http';
import {format as formatDate} from 'date-fns'
import {ValidationErrors} from '@angular/forms/src/directives/validators';
import {AbstractControl} from '@angular/forms/src/model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

const PageType = 'org.springframework.data.domain.Page';
const RevisionType = 'org.springframework.data.history.Revision';

declare var metadata: any;

export let im = {
    filterQueryParameters(api: Action): SimpleTypeDeclaration[] {
        if (metadata.filterQueryParameters) {
            return metadata.filterQueryParameters(api);
        }
        return api.queryParameters.filter(value => !(value.name === 'page' || value.name === 'size' || value.name == 'sort'));
    },
    filterColumns(domainModel: ObjectTypeDeclaration) {
        if (metadata.filterColumns) {
            return metadata.filterColumns(domainModel);
        }
        return domainModel.properties.filter(property => {
            if ((property.name === 'revisionNumber' || property.name === 'revisionDate') && domainModel.type === RevisionType) {
                return false;
            }
            return !(property instanceof ArrayTypeDeclaration);
        });
    },
    filterProperties(bodyType: ObjectTypeDeclaration){
        if (metadata.filterProperties) {
            return metadata.filterProperties(bodyType);
        }
        // return bodyType.properties;
        return bodyType.properties.filter(prop => !(prop instanceof ArrayTypeDeclaration));
    },
    filterRequestBodyProperties(bodyType: ObjectTypeDeclaration) {
        if (metadata.filterRequestBodyProperties) {
            return metadata.filterRequestBodyProperties(bodyType);
        }
        return this.filterProperties(bodyType);
    },
    filterDisplayProperties(bodyType: ObjectTypeDeclaration) {
        if (metadata.filterRequestBodyProperties) {
            return metadata.filterRequestBodyProperties(bodyType);
        }
        return this.filterProperties(bodyType);
    },
    sortProperties(a: TypeDeclaration, b: TypeDeclaration) {
        if (metadata.sortProperties) {
            return metadata.sortProperties(a, b);
        }
        if (a instanceof SimpleTypeDeclaration) {
            return -1;
        } else if (b instanceof SimpleTypeDeclaration) {
            return 1;
        }
        return 0;
    },
    formControl(itemType: FormItemType, property: TypeDeclaration, action: Action): FormItemControl {
        if(property.stereotype && property.stereotype !== 'NORMAL') {
            return;
        }
        if (metadata.formControl) {
            return metadata.formControl(itemType, property, action);
        }
        if (itemType === 'display') {
            return new FormItemControl('display-text');
        }

        if (property.ref) {
            return new FormItemControl("input-ref",this.defaultWidth(),{expression: property.ref})
        }

        if (property instanceof SimpleTypeDeclaration) {
            if (property.type === 'any') {
                return new FormItemControl('input-text');
            } else if (property.type === 'boolean') {
                return new FormItemControl('select');
            } else if (property.type === 'number') {
                return new FormItemControl('input-number');
            } else if (property.type === 'file' && itemType === 'edit') {
                return new FormItemControl('input-file');
            } else if (property.type === 'string') {
                if (property.options) {
                    return new FormItemControl('select');
                } else if (property.maxLength > 255 && itemType == 'edit') {
                    return new FormItemControl('input-textarea', 24);
                }
                return new FormItemControl('input-text');
            } else if (property.type === 'datetime') {
                if (itemType === 'search') {
                    return new FormItemControl('datetime-range');
                }
                return new FormItemControl('input-datetime');
            } else if (property.type === 'date-only') {
                if (itemType === 'search') {
                    return new FormItemControl('date-range');
                }
                return new FormItemControl('input-date');
            }
        }
    },
    processAction(action: Action) {
        if (action.method === 'get') {
            if (action.responseBodyIterable()) {
                action.mode = 'search';
            } else {
                action.mode = 'link';
            }
        }

        if (action.method === 'post' || action.method === 'put') {
            if (action.body && action.body.length > 0) {
                action.mode = 'modal';
            } else {
                action.mode = 'confirm';
            }
        }

        if (action.method == 'patch') {
            action.mode = 'none';
        }

        if (action.method === 'delete') {
            if (action.queryParameters && action.queryParameters.length > 0) {
                action.mode = 'batch';
            } else {
                action.mode = 'confirm';
            }
        }
        if (metadata.processAction) {
            metadata.processAction(action);
        }
    },
    defaultWidth(): number {
        if (metadata.defaultWidth) {
            return metadata.defaultWidth();
        }
        return 8;
    },
    get entrance(){
        if(metadata.url) {
            return metadata.url;
        }
        return 'api/actuator/metadata';
    },
    get copyright(){
        let company = '上海市猫仕电子商务有限公司';
        let website = 'http://www.tonglukuaijian.com';
        if (metadata.copyright) {
            return metadata.copyright;
        }
        return {company, website};
    }
};


let currentIndex = 10;

export function modalZIndex(): number {
    return currentIndex++;
}

export function uuid() :string{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function uniqueKeyValidator(input: FormControl): ValidationErrors | null{
    if(input.parent) {
        let currentValue = input.value;
        let formArray = input.parent.parent as FormArray;
        for(let i = 0; i < formArray.length; i++) {
            let control = (<FormGroup>formArray.at(i)).controls['key'];
            if(input === control) {
                continue;
            }
            if (currentValue === control.value) {
                return {uniqueKey: `key不能重复，当前值与第${i + 1}行的key重复了`};
            }
        }
    }
    return null;
}

export function propertyToFormControl(prop: TypeDeclaration, ignorePatternKey?: boolean): AbstractControl {
    if(prop.patternKey && !ignorePatternKey) {
        let pattern = prop.name.substring(1, prop.name.length - 1);
        return new FormGroup({
            key: new FormControl(null, [Validators.pattern(pattern), uniqueKeyValidator]),
            value: propertyToFormControl(prop, true)
        })
    }

    if (prop instanceof SimpleTypeDeclaration) {
        const validators = [];
        if (prop.required) {
            validators.push(Validators.required);
        }
        if (prop.maximum) {
            validators.push(Validators.max(prop.maximum));
        }
        if (prop.minimum) {
            validators.push(Validators.min(prop.minimum));
        }
        if (prop.maxLength) {
            validators.push(Validators.maxLength(prop.maxLength));
        }
        if (prop.minLength) {
            validators.push(Validators.minLength(prop.minLength));
        }
        if (prop.pattern) {
            validators.push(Validators.pattern(prop.pattern));
        }
        return new FormControl(prop.defaultValue, validators);
    } else if (prop instanceof ObjectTypeDeclaration) {
        if(prop.additionalProperties) {
            let valueType = prop.properties[0];
            return new FormArray([propertyToFormControl(valueType)]);
        } else {
            let controls: { [key: string]: AbstractControl } = {};
            for (let inner of im.filterRequestBodyProperties(prop)) {
                controls[inner.name] = propertyToFormControl(inner);
            }
            return new FormGroup(controls);
        }
    } else if (prop instanceof ArrayTypeDeclaration) {
        return new FormArray([propertyToFormControl(prop.items)])
    }
}

export function isNotEmpty(id: any, checkAll: boolean): boolean{
    if(id) {
        if(typeof id === 'object') {
            let propertyNames = Object.getOwnPropertyNames(id);
            if(propertyNames.length > 0) {
                let notEmpty = true;
                for (let propertyName of propertyNames) {
                    let propertyValue = id[propertyName];
                    if(checkAll) {
                        notEmpty = notEmpty && isNotEmpty(propertyValue, true);
                    } else if(isNotEmpty(id[propertyName], false)) {
                        return true;
                    }
                }
                return notEmpty;
            }
            return false;
        }
        return true;
    }
    return false;
}

export function cleanCopy(input: any) {
    if (input) {
        for (let k of Object.getOwnPropertyNames(input)) {
            let propertyValue = input[k];
            if (propertyValue === undefined || propertyValue === null || propertyValue === "") {
                delete input[k];
            }
        }
    }
}

export function formatString(path: string, uriParameters: HttpParam): string {
    function flat(input: any): string {
        if (typeof input !== 'object') {
            if (input instanceof Date) {
                return input.toJSON();
            }
            return input;
        } else {
            let parts = [];
            if (input instanceof Array) {
                for (let item of input) {
                    parts.push(flat(item));
                }
            } else {
                for (let key of Object.keys(input)) {
                    parts.push(flat(input[key]));
                }
            }
            return parts.join(',');
        }
    }

    for (let key of Object.getOwnPropertyNames(uriParameters)) {
        let value = uriParameters[key];
        if (value) {
            let reg = new RegExp("({" + key + "})", "g");
            path = path.replace(reg, flat(value));
        }
    }
    return path;
}

export function mapToColumns(domainModel: ObjectTypeDeclaration, parent?: Column): Column[] {
    return im.filterColumns(domainModel).sort(im.sortProperties).map(p => new Column(p, parent));
}

export function mapToRequestBodyFormItems(bodyType: ObjectTypeDeclaration,action: Action): FormItem[] {
    return im.filterRequestBodyProperties(bodyType).sort(im.sortProperties).map(p => propertyToFormItem('edit', p, action));
}

export function sortAction(a: Action, b: Action) {
    if (a.method === 'get') {
        return -1;
    } else if (b.method == 'get') {
        return 1;
    }

    if (a.method == 'delete') {
        return 1;
    } else if (b.method == 'delete') {
        return -1;
    }
    return 0;
}

export function sortTabResources(a, b) {
    if (a.relativeUri === '/revisions') {
        return 1;
    } else if (b.relativeUri === '/revisions') {
        return -1;
    }
    return 0;
}

export type Option = { label: string; value: boolean | string };
export type HttpParam = { [p: string]: string | string[]};
export type StringAny = { [x: string]: any };
export type StringType = { [x: string]: TypeDeclaration };
declare type Stereotype = 'VERSION' | 'DELETE' | 'GENERATED' | 'COMMAND_ID' | 'LAST_MODIFIED_DATE' | 'LAST_MODIFIED_BY' | 'CREATED_BY' | 'CREATED_DATE' | 'NORMAL';
declare type FormItemType = 'edit' | 'search' | 'display';

export class Metadata {
    name: string;
    menuGroups: MenuGroup[] = [];
    views: View[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addMenuGroup(group: MenuGroup) {
        this.menuGroups.push(group);
    }

    addView(view: ListView | DetailView) {
        this.views.push(view)
    }
}

export class MenuGroup {
    icon?: string;
    displayName: string;
    description?: string;
    menus: Menu[] = [];

    constructor(displayName: string, description?: string, icon?: string) {
        this.displayName = displayName;
        this.description = description;
        this.icon = icon;
    }

    addMenu(menu: Menu) {
        this.menus.push(menu);
    }

}

export class Menu {
    icon?: string;
    displayName: string;
    description?: string;
    path: string;


    constructor(path: string, displayName: string, description?: string, icon?: string) {
        this.displayName = displayName;
        this.description = description;
        this.path = path;
        this.icon = icon;
    }
}

export class View {
    action: Action;
    searchFormItems: FormItem[] = [];

    set api(api: Action) {
        this.action = api;
        if (api.queryParameters) {
            this.searchFormItems = im.filterQueryParameters(api)
                .sort(im.sortProperties)
                .map(prop => propertyToFormItem('search', prop, api));
        }
    }

    get api() {
        return this.action;
    }

    isCompatible(path: string): boolean {
        let specs = this.action.path.substring(1).split('/');
        let segments = path.split('/');
        if (specs.length == segments.length) {
            for (let i = 0; i < specs.length; i++) {
                let spec = specs[i];
                let segment = segments[i];
                let placeholder = spec.length > 2 && spec.charAt(0) == '{' && spec.charAt(spec.length - 1) == '}';
                if (spec == segment || placeholder) {
                    continue;
                }
                return false;
            }
            return true;
        }
        return false;
    }

}

export class ListView extends View {
    topActions: Action[] = [];
    rowActions: Action[] = [];

    headers: Column[][];
    columns: Column[] = [];
    showCheckbox: boolean;
}

export class DetailView extends View {
    actions: Action[] = [];
    tabs: Action[] = [];
    displayFormItems: FormItem[];

    set api(action: Action) {
        this.action = action;
        let responseBody = action.getDomainModel();
        if (responseBody) {
            this.displayFormItems = im.filterDisplayProperties(responseBody)
                .sort(im.sortProperties)
                .map(prop => propertyToFormItem('display', prop, action));
        }
    }

    get api() {
        return this.action;
    }
}

export class Column {
    name: string;
    displayName: string;
    propertyType: string;
    options?: Option[];

    rowspan: number;
    colspan: number;

    parent: Column;
    columns: Column[];
    parentsRowspan: number;
    fullName: string;

    constructor(property: TypeDeclaration, parent?: Column) {
        this.name = property.name;
        this.colspan = 1;
        this.displayName = property.displayName || this.name;
        this.parent = parent;
        if (parent) {
            this.fullName = parent.fullName + '.' + this.name;
            this.parentsRowspan = parent.parentsRowspan + 1;
        } else {
            this.fullName = this.name;
            this.parentsRowspan = 0;
        }

        if (property instanceof ObjectTypeDeclaration) {
            this.propertyType = 'object';
            this.columns = mapToColumns(property, this);
            this.colspan = this.columns.reduce((prev, current) => prev + current.colspan, 0) || 1;
        } else if (property instanceof ArrayTypeDeclaration) {
            this.propertyType = 'array';
        } else if (property instanceof SimpleTypeDeclaration) {
            this.options = property.options;
            this.propertyType = property.type;
        }
    }

    formatText(item: any) {
        let parts = this.fullName.split('.');
        for (let part of parts) {
            item = item[part];
        }
        if (this.options) {
            for (let option of this.options) {
                if (option.value === String(item)) {
                    return option.label;
                }
            }
        }
        if (this.propertyType == 'datetime' && item) {
            return formatDate(new Date(item), "YYYY-MM-DD HH:mm:ss");
        }
        if (this.propertyType == 'date-only' && item) {
            return formatDate(new Date(item), "YYYY-MM-DD");
        }
        return item || "";
    }
}

export class FormItemControl {
    type: string;
    width: number;
    attributes?: { [p: string]: string };


    constructor(type: string, width?: number, attributes?: { [p: string]: string }) {
        this.type = type;
        this.width = width || im.defaultWidth();
        this.attributes = attributes;
    }
}

function propertyToFormItem(itemType: FormItemType, property: TypeDeclaration, action?: Action): FormItem {
    if (property instanceof ObjectTypeDeclaration) {
        if(property.additionalProperties) {
            return new MapFormItem(itemType, property, action);
        }
        return new ObjectFormItem(itemType, property, action);
    }
    if (property instanceof ArrayTypeDeclaration) {
        return new ArrayFormItem(itemType, property, action);
    }
    if (property instanceof SimpleTypeDeclaration) {
        return new SimpleFormItem(itemType, property, action);
    }
    throw new Error("无法找到对应类型的form item");
}

export class FormItem<T extends TypeDeclaration> {
    property: T;
    hide: boolean;
    itemType: FormItemType;
    width: number;

    constructor(itemType: FormItemType, property: T) {
        this.property = property;
        this.itemType = itemType;
    }
}

export class SimpleFormItem extends FormItem<SimpleTypeDeclaration> {
    control: FormItemControl;
    constructor(itemType: FormItemType, property: SimpleTypeDeclaration, action?: Action) {
        super(itemType,property);
        this.control = im.formControl(itemType, property, action);
        this.hide = !(this.control);
        this.width = this.hide ? 0 : this.control.width;
    }
}

export class ObjectFormItem extends FormItem<ObjectTypeDeclaration> {
    formItems: FormItem[];
    constructor(itemType: FormItemType, property: ObjectTypeDeclaration, action?: Action) {
        super(itemType,property);
        this.width = 24;
        this.formItems = im.filterProperties(property).sort(im.sortProperties).map(ip=>propertyToFormItem(itemType,ip,action));
    }
}

export class ArrayFormItem extends FormItem<ArrayTypeDeclaration> {
    items: FormItem;
    constructor(itemType: FormItemType, property: ArrayTypeDeclaration, action?: Action) {
        super(itemType,property);
        this.width = 24;
        this.items = propertyToFormItem(itemType, property.items, action);
    }
}

export class MapFormItem extends FormItem<ObjectTypeDeclaration> {
    key: FormItem;
    value: FormItem;
    constructor(itemType: FormItemType, property: ObjectTypeDeclaration, action?: Action) {
        super(itemType,property);
        this.width = 24;
        let valueType = property.properties[0];
        valueType.displayName = '请输入value';
        valueType.description = '请输入value';

        let keyType = new SimpleTypeDeclaration({
            type: 'string',
            pattern: valueType.name,
            displayName: '请输入key',
            description: '请输入key'
        });
        this.value = propertyToFormItem(itemType, valueType, action);
        this.key = propertyToFormItem(itemType, keyType, action)
    }
}

export class Action {
    http: HttpClient;
    method: string;
    path: string;
    baseUri: string;
    displayName?: string;
    description?: string;
    queryParameters?: SimpleTypeDeclaration[];
    uriParameters?: TypeDeclaration[];
    headers?: SimpleTypeDeclaration[];
    body?: TypeDeclaration[];
    responses?: Response[];

    mode?: 'modal' | 'link' | 'inline-row' | 'search' | 'confirm' | 'batch' | 'none';

    get actionType() {
        switch (this.mode) {
            case 'modal':
                return 'primary';
            case 'link':
                return 'default';
            case 'inline-row':
                return 'primary';
            case 'search':
                return 'default';
            case 'confirm':
                return 'danger';
            default:
                return 'default';
        }
    }

    responseBody(code: number, index = 0): TypeDeclaration {
        let successResponse = this.responses.find(r => r.code == code);
        if (successResponse && successResponse.body.length > 0) {
            return successResponse.body[index];
        }
    }

    responseBodyIterable() {
        let responseBody = this.responseBody(200);
        return !!(responseBody && (responseBody.type === 'array' || responseBody.type === PageType));
    }

    responseBodyIsPagination() {
        let responseBody = this.responseBody(200);
        return responseBody && responseBody.type === PageType;
    }

    getDomainModel(): ObjectTypeDeclaration {
        let responseBody = this.responseBody(200);
        if (responseBody.type === 'array') {
            return (responseBody as ArrayTypeDeclaration).items as ObjectTypeDeclaration;
        }
        if (responseBody.type === PageType) {
            let properties = (responseBody as ObjectTypeDeclaration).properties;
            for (let property of properties) {
                if (property.name === 'content') {
                    let content = property as ArrayTypeDeclaration;
                    return content.items as ObjectTypeDeclaration;
                }
            }
        }
        return responseBody as ObjectTypeDeclaration;
    }

    execute(path?: string, options = new Options()): Promise<Result> {
        let pathVariable = path || this.path;
        while (pathVariable.startsWith('/')) {
            pathVariable = pathVariable.substring(1);
        }
        let url = this.baseUri + pathVariable;
        this.deleteExcess(this.headers, this.toHttpParam(options.headers));
        this.deleteExcess(this.queryParameters, this.toHttpParam(options.params));

        let requestBody = options.body || null;
        if (this.body && this.body.length > 0) {
            let bodyType = this.body[0];
            if (requestBody) {
                if (bodyType instanceof ObjectTypeDeclaration) {
                    this.deleteExcess(bodyType.properties, cleanCopy(options.body));
                } else if (bodyType instanceof ArrayTypeDeclaration) {
                    let itemType = bodyType.items;
                    let arrayBody = requestBody as Array<any>;
                    if (itemType instanceof ObjectTypeDeclaration) {
                        for (let item of arrayBody) {
                            this.deleteExcess(itemType.properties, cleanCopy(item));
                        }
                    }
                }
                if (bodyType.name === 'application/x-www-form-urlencoded') {
                    requestBody = this.toURLSearchParams(requestBody);
                }
            }
            options.headers['Content-Type'] = bodyType.name;
        }

        let responseBody = this.responseBody(200);
        let handleError = function (error) {
            console.error(`调用远程接口失败->${url}`, error);
            return Promise.resolve(new Result(error.status, error.statusText));
        };

        if (this.method === 'get') {
            return this.http.get(url, options).map(resp => new Result(resp.status, resp.statusText, resp.body, responseBody)).toPromise().catch(handleError);
        }

        if (this.method === 'put') {
            return this.http.put(url, requestBody, options).map(resp => new Result(resp.status, resp.statusText, resp.body, responseBody)).toPromise().catch(handleError);
        }

        if (this.method === 'post') {
            return this.http.post(url, requestBody, options).map(resp => new Result(resp.status, resp.statusText, resp.body, responseBody)).toPromise().catch(handleError);
        }

        if (this.method === 'patch') {
            return this.http.patch(url, requestBody, options).map(resp => new Result(resp.status, resp.statusText, resp.body, responseBody)).toPromise().catch(handleError);
        }

        if (this.method === 'delete') {
            return this.http.delete(url, options).map(resp => new Result(resp.status, resp.statusText, resp.body, responseBody)).toPromise().catch(handleError);
        }
    }

    deleteExcess(specs: TypeDeclaration[], params: any) {
        if (specs && params) {
            for (let name of Object.getOwnPropertyNames(params)) {
                if (!specs.find(spec => spec.name === name)) {
                    delete params[name];
                }
            }
            for (let spec of specs) {
                if (spec.defaultValue && !params.hasOwnProperty(spec.name)) {
                    params[spec.name] = spec.defaultValue;
                }
            }
        }
    }

    toHttpParam(input: any): HttpParam {
        cleanCopy(input);
        for (let key of Object.getOwnPropertyNames(input)) {
            let q = input[key];
            if (q instanceof Array) {
                for (let i = 0; i < q.length; i++) {
                    if (q[i] instanceof Date) {
                        q[i] = (q[i] as Date).toJSON();
                    }
                }
            } else if (q instanceof Date) {
                input[key] = (q as Date).toJSON();
            }
        }
        return input as HttpParam;
    }

    toURLSearchParams(requestBody: any){
        return Object.keys(requestBody).map(k => {
            let value = requestBody[k];
            if(typeof value == 'object') {
                value = JSON.stringify(value);
            }
            return `${encodeURIComponent(k)}=${encodeURIComponent(value)}`
        }).join('&');
    }

    format(entity: any, domainType: ObjectTypeDeclaration): string {
        let id = domainType.properties.find(p => p.id);
        if(id instanceof ObjectTypeDeclaration) {
            return formatString(this.path, entity[id.name]);
        } else {
            return formatString(this.path, entity);
        }
    }

    extractSegment(path: string):{[key:string]: any}{
        let specs = this.path.split('/').filter(p => p.trim().length > 0);
        let segments = path.split('/').filter(p => p.trim().length > 0);
        let params = {};
        if (specs.length == segments.length) {
            for (let i = 0; i < specs.length; i++) {
                let spec = specs[i];
                let segment = segments[i];
                let placeholder = spec.length > 2 && spec.charAt(0) == '{' && spec.charAt(spec.length - 1) == '}';
                if(placeholder){
                    let key = spec.substring(1, spec.length - 1);
                    params[key] = segment;
                }
            }
        }
        return params;
    }
}

export class TypeDeclaration {
    name: string;
    displayName?: string;
    description?: string;
    type?: string;
    defaultValue?: string;
    required?: boolean;
    id?: boolean;
    stereotype?: Stereotype;
    ref?: string;
    owner?: ObjectTypeDeclaration | ArrayTypeDeclaration;

    static ADDITIONAL_PROPERTIES = "additionalProperties";


    static isSimple(td: { type: string }): boolean {
        return td.type === 'any' || td.type === 'datetime' || td.type === 'date-only' || td.type === 'boolean' || td.type === 'string' || td.type === 'file' || td.type === 'number';
    }

    convert(value: any) {
        if ((this.type == 'datetime' || this.type == 'date-only') && value) {
            return new Date(value);
        }
        return value;
    }


    constructor(td: any) {
        Object.assign<TypeDeclaration,any>(this, td);
        if (!this.displayName) {
            this.displayName = this.name;
        }
        if (!this.description) {
            this.description = this.name;
        }
    }

    get patternKey(){
        if(this.owner) {
            if(this.owner instanceof ObjectTypeDeclaration) {
                return this.owner.additionalProperties && this.name.startsWith("/") && this.name.endsWith("/");
            }
        }
        return false;
    }

    idLike(){
        if(this.id) {
            return true;
        }
        if(this.owner) {
            return this.owner.idLike();
        }
        return false;
    }
}

export class SimpleTypeDeclaration extends TypeDeclaration {
    enum?: string[];
    options?: Option[];
    format?: string;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
}

export class ArrayTypeDeclaration extends TypeDeclaration {
    items?: TypeDeclaration;

    convert(value: any) {
        let array = value as any[];
        for (let i = 0; array && i < array.length; i++) {
            array[i] = this.items.convert(array[i]);
        }
        return array;
    }


    constructor(td: any, items: TypeDeclaration) {
        super(td);
        items.owner = this;
        this.items = items;
    }
}

export class ObjectTypeDeclaration extends TypeDeclaration {
    domainType?: 'AggregateRoot' | 'Entity' | 'ValueObject';
    properties: TypeDeclaration[] = [];
    additionalProperties: boolean;

    addProperty(property: TypeDeclaration) {
        this.properties.push(property);
    }

    getProperty(propertyName: string): TypeDeclaration{
        for (let p of this.properties) {
            if(p.name === propertyName) {
                return p;
            }
        }
        return null;
    }

    convert(value: any) {
        for (let prop of this.properties) {
            value[prop.name] = prop.convert(value[prop.name]) || null;
        }
        return value;
    }

    constructor(td: any, properties: TypeDeclaration[]) {
        super(td);
        this.properties = properties;
        for (let property of properties) {
            property.owner = this;
        }
    }
}

export class Response {
    code: number;
    description: string;
    body: TypeDeclaration[] = [];
}

export class Result {
    body?: any;
    code: number;
    text?: string;

    constructor(code?: number, text?: string, body?: any, responseBody?: TypeDeclaration) {
        this.code = code;
        this.text = text;
        if (body && responseBody) {
            this.body = responseBody.convert(body);
        }
    }
}

export class Options {
    params?: HttpParam = {};
    headers?: HttpParam = {};
    body?: any;
    observe: 'response' = 'response';
    responseType?: 'json' = 'json';

    constructor() {
    }

}

export class Page {
    content: any[] = [];
    totalElements: number = 0;
    size: number = 20;
    number: number = 0;


    constructor(content?: Object[]) {
        if (content) {
            this.number = 1;
            this.content = content;
            this.totalElements = content.length;
        }
    }
}
