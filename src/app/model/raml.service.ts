import {Injectable} from '@angular/core';
import {
    ArrayTypeDeclaration,
    DocumentationItem,
    Method,
    ObjectTypeDeclaration,
    PageType,
    Raml,
    Resource,
    Response, RevisionType,
    SimpleTypeDeclaration,
    TypeDeclaration
} from './raml';

import {HttpService} from './http.service';
import {I18nService} from './i18n.service';
import {View, ViewService} from './view.service';
import {
    ArrayField,
    Button,
    Card,
    Cell,
    Column,
    Component,
    DatePicker,
    DateRangePicker, DetailPanel, DisplayText,
    FieldSet,
    Form,
    FormItem,
    InputNumber,
    MapField,
    Row,
    Select,
    Switch, Tab,
    Table, TabSet,
    Text,
    TextArea,
    UploadPicker
} from './ui';
import {Setting, SettingService} from './setting.service';
import {capitalize, isContainsChinese, parseCamelCase} from './function';

@Injectable()
export class RamlService {
    private promise: Promise<Raml>;
    private response: any;
    private raml: Raml;

    private baseUri: string;

    private url = '/api/api.json';
    private settings: Setting;

    constructor(private http: HttpService, private i18n: I18nService, private viewService: ViewService, private settingsService: SettingService) {
        this.settingsService.subscribe(settings => this.settings = settings);
    }

    public getRaml(): Promise<Raml> {
        if (!this.promise) {
            this.promise = this.http.get<any>(this.url).then(response => this.mapToRaml(response));
        }
        return this.promise;
    }

    private mapToRaml(response: any): Raml {

        this.raml = new Raml();
        this.raml.title = response.title;
        this.raml.description = response.description;
        this.raml.version = response.version;
        if (response.ramlVersion) {
            this.raml.ramlVersion = response.ramlVersion;
        }
        if (response.baseUri) {
            this.raml.baseUri = response.baseUri;
        }
        if (response.protocols) {
            this.raml.protocols = response.protocols;
        }
        if (response.mediaType) {
            this.raml.mediaType = response.mediaType;
        }
        if (response.documentation) {
            this.raml.documentation = response.documentation.map(r => new DocumentationItem(r.title, r.content));
        }
        if (response.types) {
            let types = response.types;
            this.response = response;
            this.response.types = {};
            for (const type of types) {
                response.types[type.name] = type;
            }

            for (let typeName of Object.getOwnPropertyNames(this.response.types)) {
                this.raml.types[typeName] = this.resolveType(this.response.types[typeName]);
            }
        }
        if (response.baseUriParameters) {
            this.raml.baseUriParameters = response.baseUriParameters.map(t => this.resolveType(t));
        }
        if (response.resources) {
            this.raml.resources = response.resources.map(r => this.mapToResource(r));
        }

        return this.raml;
    }

    private mapToResource(res: any, parent?: Resource) {
        let resource = new Resource(parent);
        resource.description = res.description;
        resource.displayName = res.displayName;
        resource.relativeUri = res.relativeUri;

        if (res.uriParameters) {
            resource.uriParameters = res.uriParameters.map(t => this.resolveType(t));
        }
        if (res.methods) {
            resource.methods = res.methods.map(m => this.mapToMethod(m));
        }
        if (res.resources) {
            resource.resources = res.resources.map(r => this.mapToResource(r, resource)).sort((a, b) => {
                if (a.resources) {
                    return 1;
                } else if (b.resources) {
                    return -1;
                }
                return 0;
            });
        }
        return resource;
    }

    private mapToMethod(m: any): Method {
        let method = new Method();
        method.method = m.method;
        method.displayName = m.displayName;
        method.description = m.description;
        if (m.body) {
            method.body = m.body.map(t => this.resolveType(t));
        }
        if (m.queryParameters) {
            method.queryParameters = m.queryParameters.map(t => this.resolveType(t));
        }
        if (m.headers) {
            method.headers = m.headers.map(t => this.resolveType(t));
        }
        if (m.responses) {
            method.responses = m.responses.map(r => this.mapToResponse(r));
        }
        return method;
    }

    private mapToResponse(r: any): Response {
        let response = new Response();
        response.description = r.description;
        response.code = parseInt(r.code);
        if (r.body) {
            response.body = r.body.map(t => this.resolveType(t));
        }
        return response;
    }

    private resolveType(object: any): TypeDeclaration {
        if (object instanceof TypeDeclaration) {
            return object;
        }

        if (TypeDeclaration.isSimple(object)) {
            return new SimpleTypeDeclaration(object);
        }

        if (object.type === 'array') {
            return new ArrayTypeDeclaration(object, this.resolveType(object['items']));
        }


        if (object.type === 'object') {
            return this.resolveReferenceType(object);
        }

        return this.resolveReferenceType(object);
    }

    private resolveReferenceType(object: any): TypeDeclaration {

        let properties = [];

        if (object.name !== object.type && object.type !== 'object') {
            let referenceType: TypeDeclaration = this.raml.types[object.type];
            if (!referenceType) {
                let referenceObject = this.response.types[object.type];
                if (!referenceObject) {
                    throw new Error('找不到类型' + object.type);
                }
                referenceType = this.resolveType(referenceObject);
            }

            if (referenceType instanceof SimpleTypeDeclaration) {
                return referenceType;
            }

            if (referenceType instanceof ObjectTypeDeclaration) {
                properties.push(...referenceType.properties);
            }
        }
        let objectType = new ObjectTypeDeclaration(object, properties);
        if (this.response.types[objectType.name]) {
            this.raml.types[objectType.name] = objectType;
        }

        if (object.properties) {
            objectType.properties = objectType.properties.concat(object.properties.map(prop => this.resolveType(prop)));
        }
        return objectType;
    }


    /**
     * 获取默认的视图列表，基于RAML文档转换所得
     * @returns {Promise<View[]>}
     */
    getViews(): Promise<View[]> {
        return this.getRaml().then(raml => {
            let views = [];
            this.baseUri = this.raml.baseUri;
            if (this.baseUri.endsWith('/')) {
                this.baseUri = this.baseUri.substring(0, this.baseUri.length - 1);
            }
            for (let resource of raml.resources) {
                this.convertResource(resource, views);
            }
            return views;
        });
    }

    private convertResource(resource: Resource, views: View[]) {
        if (resource.methods) {
            for (let method of resource.methods) {
                views.push(this.createView(resource, method));
            }
        }
        if (resource.resources) {
            for (let subResource of resource.resources) {
                this.convertResource(subResource, views);
            }
        }
    }

    private createView(resource: Resource, method: Method): View {

        let language = this.i18n.getLocale();
        let name = method.description;

        let path, data;
        if (method.method === 'get') {
            path = resource.qualifiedPath;
            data = this.createGetPage(resource, method);
        } else {
            path = resource.qualifiedPath + '.' + method.method;
            data = this.createNonGetPage(resource, method);
        }

        return {language, name, path, data};
    }

    private createGetPage(resource: Resource, action: Method): Component {
        let {queryParameters, responses} = action;
        let response = responses.find(resp => resp.code === 200);
        let body = response.body[0];

        if (body.type === PageType || body instanceof ArrayTypeDeclaration) {
            return this.createTable(resource, action, body, queryParameters);
        } else {
            return this.createDetailPanel(resource, action, body);
        }

    }

    private createTable(resource: Resource, method: Method, body: TypeDeclaration, queryParameters: TypeDeclaration[]) {
        let table = new Table();

        let elementType;

        if (body.type === PageType) {
            table.showPagination = true;
            let contentType = (<ObjectTypeDeclaration>body).properties.find(p => p.name === 'content') as ArrayTypeDeclaration;
            elementType = contentType.items as ObjectTypeDeclaration;
        } else {
            elementType = (<ArrayTypeDeclaration>body).items;
        }

        table.columns = this.elementTypeToColumns(elementType, table);

        let path = this.baseUri + resource.qualifiedPath;
        table.queryForm = new Form({
            path,
            method: 'get',
            buttonsPlacement: 'line-end',
            submitButton:   new Button({text: this.translateTextToEnglish('查询'), triggerType: 'none', classType: 'primary'}),
            clearButton:    new Button({text: this.translateTextToEnglish('清除'), triggerType: 'none'})
        });

        if (queryParameters && queryParameters.length > 0) {
            let children = this.propertiesToCells('q', queryParameters);
            if (children.length > 0) {
                let collapsible = false;
                let totalWidth = 8; //buttons width
                for (let cell of children) {
                    totalWidth += cell.width;
                }
                if (totalWidth > 24) {
                    collapsible = true;
                }
                table.queryForm.collapsible = collapsible;
                table.queryForm.children = children;
            }
        }

        table.buttons = resource.methods
            .filter(action => action !== method)
            .map(action => this.methodToButton(resource, action));

        if (resource.resources && resource.resources.length > 0) {
            let itemResource = resource.resources[0];
            table.operationColumnButtons = itemResource.methods
                .filter(action => action.method !== 'patch')
                .map(action => this.methodToButton(itemResource, action));
        }


        return table;
    }

    private createDetailPanel(resource: Resource, method: Method, body: TypeDeclaration) {

        let path = this.baseUri + resource.qualifiedPath;


        let properties = [body];
        if (body instanceof ObjectTypeDeclaration) {
            properties = body.properties;
        }

        let resultForm = new Form({
            autoLoadUrl: path,
            buttonsPlacement: 'none',
            header: method.description,
            children: this.propertiesToCells('d', properties),
        });

        let tabset;
        if (resource.resources) {
            let children = [];
            for (let subResource of resource.resources) {
                if (subResource.methods) {
                    for (let subMethod of subResource.methods) {
                        if (subMethod.method === 'get') {
                            let path = subResource.qualifiedPath;
                            let title = subMethod.description;
                            children.push(new Tab({path, title}));
                        }
                    }
                }
            }
            if (children.length > 0) {
                tabset = new TabSet({children});
            }
        }

        return new DetailPanel({
            title: method.description, resultForm, tabset
        });
    }

    private createNonGetPage(resource: Resource, action: Method): Form {
        let {queryParameters, headers, body, description, method} = action;
        let path = this.baseUri + resource.qualifiedPath;
        let contentType = 'application/x-www-form-urlencoded';
        let formParameters = queryParameters;
        let header = description;
        let autoLoadUrl;


        if (body && body.length > 0) {
            let bodyItem = body[0]; //TODO 后面增加contentType的切换功能，以便能支持同一视图多种形态（目前仅patch存在这种情况)
            contentType = bodyItem.name;
            let bodyParameters = [bodyItem];
            if (bodyItem instanceof ObjectTypeDeclaration) {
                bodyParameters = bodyItem.properties;
            }
            formParameters = bodyParameters;

            if (method === 'put') {
                for (let m1 of resource.methods) {
                    if (m1.method === 'get') {
                        for (let resp of m1.responses) {
                            if (resp.code < 300 && resp.code > 199) {
                                if (resp.body[0].type === body[0].type) {
                                    autoLoadUrl = path;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (headers && headers.length > 0) {
            // formParameters.splice(0, 0, new ObjectTypeDeclaration({name: "Header", type: 'object'}, headers));
        }

        let children = this.propertiesToCells('f', formParameters || []);


        return new Form({
            path,
            method,
            contentType,
            header,
            children,
            autoLoadUrl
        });
    }

    private propertiesToCells(mode: string, properties: TypeDeclaration[]) {
        let items: FormItem[] = [];
        for (let property of properties) {
            this.flatTypeDeclarationAndConvertToFormItem(mode, items, property);
        }
        this.processI18NInvisible(mode, items);

        let cells = [];
        for (let item of items) {
            if (item.hide) {
                cells.push(new Cell({width: 0, content: item}));
            } else if (item instanceof FieldSet || item instanceof ArrayField || item instanceof MapField) {
                cells.push(new Cell({width: 24, content: item}));
            } else {
                cells.push(new Cell({width: 8, content: item}));
            }
        }
        return cells;
    }

    private flatTypeDeclarationAndConvertToFormItem(mode: string, items: FormItem[], property: TypeDeclaration, prefix?: string) {
        if (property instanceof ObjectTypeDeclaration) {
            if(property.additionalProperties) {
                let {required, description, name, displayName, defaultValue} = property;
                items.push(new MapField({required, description, name, displayName, defaultValue}));
            } else {
                for (let innerProperty of property.properties) {
                    let currentPrefix = property.name;
                    if (prefix) {
                        currentPrefix = prefix + '.' + currentPrefix;
                    }
                    this.flatTypeDeclarationAndConvertToFormItem(mode, items, innerProperty, currentPrefix);
                }
            }
        } else if (property instanceof SimpleTypeDeclaration) {
            items.push(this.convertToFormItem(mode, property, prefix));
        } else if (property instanceof ArrayTypeDeclaration) {
            let {required, description, name, displayName, defaultValue} = property;
            items.push(new ArrayField({required, description, name, displayName, defaultValue}));
        }
    }

    private convertToFormItem(mode: string, q: SimpleTypeDeclaration, prefix?: string){

        let {required, description, name, displayName, defaultValue} = q;

        let field = prefix ? prefix + '.' + name : name;

        let def: any = {
            required,
            field,
            description,
            label: displayName,
            value: defaultValue,
        };

        this.translateToEnglish(def);

        if(mode === 'd') {
            return new DisplayText(def);
        }

        if(mode === 'f') {
            if (q.type === 'boolean') {
                return new Switch(def);
            }

            if (q.hasOwnProperty('options')) {
                return new Select({...def, options: q['options']});
            }

            if (q.type === 'number' || q.type === 'integer') {
                return new InputNumber({...def, max: q.maximum, min: q.minimum,});
            }

            if (q.type === 'datetime') {
                return new DatePicker(def);
            }

            if (q.type === 'date-only') {
                return new DatePicker({...def, showTime: false});
            }

            if (q.type === 'file') {
                return new UploadPicker(def);
            }

            def.minLength = q.minLength;
            def.maxLength = q.maxLength;

            if (q.type === 'any' || q.type === 'string') {
                if (q.maxLength > 255) {
                    return new TextArea({...def, width: 20});
                }
            }

            return new Text(def);
        }

        if(mode === 'q') {
            if (q.type === 'boolean') {
                return new Switch(def);
            }

            if (q.hasOwnProperty('options')) {
                return new Select({...def, options: q['options']});
            }

            if (q.type === 'number' || q.type === 'integer') {
                return new InputNumber({...def,});
            }

            if (q.type === 'datetime') {
                return new DateRangePicker(def);
            }
            if (q.type === 'date-only') {
                return new DateRangePicker({...def, showTime: false});
            }

            if (q.type === 'any' || q.type === 'string') {
                if (q.maxLength > 255) {
                    return new TextArea({...def, width: 20});
                }
            }
            return new Text(def);
        }

    }

    private elementTypeToColumns(elementType: ObjectTypeDeclaration, table: Table): Column[] {
        let columns = [];
        for (let p of elementType.properties) {

            if(p instanceof ArrayTypeDeclaration) {
                continue;
            }

            if(elementType.type === RevisionType) {
                if(p.name === 'revisionNumber' || p.name === 'revisionDate') {
                    continue;
                }
            }

            let def: any = {
                type: p.type,
                field: p.name,
                title: p.displayName,
                index: columns.length
            };
            this.translateToEnglish(def);

            if (this.settings.invisibleColumns.indexOf(p.name) !== -1) {
                def.hide = true;
            }

            if (p instanceof ObjectTypeDeclaration) {
                def.columns = this.elementTypeToColumns(p, table);
                table.bordered = true;
            }

            columns.push(new Column(def));
        }
        return columns;
    }

    private processI18NInvisible(mode: string, items: FormItem[]){
        let hideProperties;
        if (mode === 'q') {
            hideProperties = this.settings.invisibleQueryParameters;
        } else if (mode === 'd') {
            hideProperties = this.settings.invisibleDetailPageProperties;
        } else if (mode === 'f') {
            hideProperties = this.settings.invisibleFormProperties;
        }

        if(hideProperties) {
            items.forEach(item => item.hide = hideProperties.indexOf(item.field) !== -1);
        }
    }

    private translateToEnglish(def: any) {
        if (this.i18n.getLocale() === 'en') {
            if (def.hasOwnProperty('title')) {
                if (isContainsChinese(def.title)) {
                    def.title = capitalize(parseCamelCase(def.field));
                }
            } else if (def.hasOwnProperty('label')) {
                if (isContainsChinese(def.label)) {
                    def.label = capitalize(parseCamelCase(def.field));
                }
                if (isContainsChinese(def.description)) {
                    def.description = def.label;
                }
            }
        }
    }

    private translateTextToEnglish(text: string) {
        if (this.i18n.getLocale() === 'en') {
            if (text === '查询') {
                return 'Query';
            }
            if (text === '清除') {
                return 'Clear';
            }
            if (text === '修改') {
                return 'Edit';
            }
            if (text === '删除') {
                return 'Delete';
            }
            if (text === '查看') {
                return 'Go';
            }
            if (text === '新建') {
                return 'New';
            }
        }
        return text;
    }

    private methodToButton(resource: Resource, action: Method): Button {
        const text = this.translateTextToEnglish(action.displayName);
        const description = action.description;
        const method = action.method;
        let path = this.baseUri + resource.qualifiedPath;

        if ((action.body && action.body.length > 0) || (action.queryParameters && action.queryParameters.length > 0)) {
            path = resource.qualifiedPath + '.' + action.method;
            return Button.modal({text, method, description, path});
        }

        if (action.method === 'get') {
            path = resource.qualifiedPath;
            return Button.link({text, method, description, path});
        }

        return Button.danger({text, method, description, path});
    }


    /************************************不用的代码********************************************/

    private isSimpleFormItem(item: FormItem): boolean {
        return !(item instanceof FieldSet || item instanceof MapField || item instanceof ArrayField);
    }

    private isSimpleFormItemOrFieldSet(item: FormItem): boolean {
        return item instanceof FieldSet || !(item instanceof MapField || item instanceof ArrayField);
    }

    private propertyToFormItem2(q: TypeDeclaration, readonly: boolean): FormItem | FieldSet {
        let def: any = {
            required: q.required,
            field: q.name,
            label: q.displayName,
            description: q.description,
            readonly,
        };
        this.translateToEnglish(def);

        if (q instanceof SimpleTypeDeclaration) {
            if (q.type === 'boolean') {
                return new Switch(def);
            }

            if (q.hasOwnProperty('options')) {
                return new Select({
                    ...def, options: q['options'],
                });
            }

            if (q.type === 'number' || q.type === 'integer') {
                return new InputNumber({
                    ...def, max: q.maximum, min: q.minimum,
                });
            }

            if (q.type === 'datetime') {
                return new DatePicker(def);
            }

            if (q.type === 'date-only') {
                return new DatePicker({
                    ...def, showTime: false,
                });
            }

            if (q.type === 'file') {
                return new UploadPicker(def);
            }

            def.minLength = q.minLength;
            def.maxLength = q.maxLength;

            if (q.type === 'any' || q.type === 'string') {
                if (q.maxLength > 255) {
                    return new TextArea({
                        ...def, width: 20,
                    });
                }
            }

            return new Text(def);
        }
        else if (q instanceof ObjectTypeDeclaration) {
            if (q.additionalProperties) {
                let valueType = q.properties[0];
                let pattern = valueType.name;


                if (valueType instanceof SimpleTypeDeclaration) {
                    valueType = new SimpleTypeDeclaration(valueType);
                }
                else if (valueType instanceof ObjectTypeDeclaration) {
                    valueType = new ObjectTypeDeclaration(valueType, valueType.properties);
                }
                else if (valueType instanceof ArrayTypeDeclaration) {
                    valueType = new ArrayTypeDeclaration(valueType, valueType.items);
                }
                valueType.displayName = '请输入value';
                valueType.description = '请输入value';
                valueType.name = 'val';

                let keyType = new SimpleTypeDeclaration({
                    name: 'key',
                    type: 'string',
                    required: true,
                    pattern: pattern,
                    displayName: '请输入key',
                    description: '请输入key'
                });


                def.key = this.propertyToFormItem2(keyType, readonly);
                def.val = this.propertyToFormItem2(valueType, readonly);
                def.minLength = q.minProperties;
                def.maxLength = q.maxProperties;

                return new MapField(def);
            } else {
                def.children = q.properties.map(prop => this.propertyToFormItem2(prop, readonly)).map(RamlService.wrappedInCell);
                return new FieldSet(def);
            }
        }
        else if (q instanceof ArrayTypeDeclaration) {
            def.minLength = q.minItems;
            def.maxLength = q.maxItems;
            def.items = this.propertyToFormItem2(q.items, readonly);
            return new ArrayField(def);
        }
    }

    private queryParameterToFormItem(q: SimpleTypeDeclaration): FormItem {
        let def = {
            field: q.name,
            label: q.displayName,
            description: q.description
        };

        if (q.type === 'boolean') {
            return new Switch(def);
        }

        if (q.hasOwnProperty('options')) {
            return new Select({...def, options: q['options']});
        }

        if (q.type === 'number' || q.type === 'integer') {
            return new InputNumber({...def,});
        }

        if (q.type === 'datetime') {
            return new DateRangePicker(def);
        }
        if (q.type === 'date-only') {
            return new DateRangePicker({...def, showTime: false});
        }

        if (q.type === 'any' || q.type === 'string') {
            if (q.maxLength > 255) {
                def['width'] = 20;
                return new TextArea(def);
            }
        }

        return new Text(def);
    }

    private static wrappedInCell(item: FormItem | FieldSet): Cell {

        if (item instanceof Row || item instanceof ArrayField || item instanceof MapField) {
            return new Cell({width: 24, content: item});
        } else if (item instanceof TextArea) {
            return new Cell({width: 16, content: item});
        } else {
            return new Cell({width: 8, content: item});
        }
    }

    private queryParametersToForm(queryParameters: TypeDeclaration[]): Cell[] {
        let children = [];
        for (let queryParameter of queryParameters) {
            this.flatTypeDeclarationAndConvertToFormItem('q', children, queryParameter)
        }
        this.processI18NInvisible('q', children);
        return null;
    }


}
