import {Injectable} from '@angular/core';
import {
    ArrayTypeDeclaration,
    DocumentationItem,
    Invisible,
    Method,
    ObjectTypeDeclaration,
    PageType,
    Raml,
    Resource,
    Response,
    SimpleTypeDeclaration,
    TypeDeclaration
} from './raml';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {HttpService} from './http.service';
import {I18nService} from './i18n.service';
import {View, ViewService} from './view.service';
import {
    ArrayFieldSet,
    Button,
    Card,
    Cell,
    Column,
    Component,
    DateRangePicker,
    FieldSet,
    Form,
    FormItem,
    InputNumber,
    MapFieldSet,
    Row,
    Select,
    Switch,
    Table,
    Text,
    TextArea,
    UploadPicker
} from './ui';

@Injectable()
export class RamlService {
    private promise: Promise<Raml>;
    private response: any;
    private raml: Raml;

    private views: View[];
    private baseUri: string;

    private url = "/api/actuator/metadata";

    constructor(private http: HttpService, private i18n: I18nService, private viewService: ViewService) {

    }

    public getRaml(): Promise<Raml> {
        if (!this.promise) {
            this.promise = this.http.get<any>(this.url).then(response=> this.mapToRaml(response));
        }
        return this.promise;
    }

    private mapToRaml(response: any): Raml {

        this.raml = new Raml();
        this.raml.title = response.title;
        this.raml.description = response.description;
        this.raml.version = response.version;
        if (response.ramlVersion) {
            this.raml.ramlVersion = response.ramlVersion
        }
        if (response.baseUri) {
            this.raml.baseUri = response.baseUri
        }
        if (response.protocols) {
            this.raml.protocols = response.protocols
        }
        if (response.mediaType) {
            this.raml.mediaType = response.mediaType
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
            this.raml.baseUriParameters = response.baseUriParameters.map(t => this.resolveType(t))
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
            resource.resources = res.resources.map(r => this.mapToResource(r, resource)).sort((a,b)=>{
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
            let referenceType : TypeDeclaration = this.raml.types[object.type];
            if (!referenceType) {
                let referenceObject = this.response.types[object.type];
                if (!referenceObject) {
                    throw new Error("找不到类型" + object.type);
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
        return this.getRaml().then(raml=>{
            this.views = [];
            this.baseUri = this.raml.baseUri;
            if (this.baseUri.endsWith('/')) {
                this.baseUri = this.baseUri.substring(0, this.baseUri.length - 1);
            }
            for (let resource of raml.resources) {
                this.convertResource(resource);
            }
            return this.views;
        });
    }

    private convertResource(resource: Resource) {
        if (resource.methods) {
            for (let method of resource.methods) {
                if(method.method === 'get') {
                    this.createView(resource, method);
                }
            }
        }
        if (resource.resources) {
            for (let subResource of resource.resources) {
                this.convertResource(subResource);
            }
        }
    }

    private createView(resource: Resource, method: Method){
        let view = new View();
        this.views.push(view);

        view.viewId = this.viewService.getCurrentId();
        view.language = this.i18n.getLocale();
        view.name = method.description;
        if(method.method === 'get') {
            view.path = resource.qualifiedPath;
            view.data = this.createGetPage(resource, method);
        } else {
            view.path = resource.qualifiedPath + "." + method.method;
            view.data = this.createNonGetPage(resource, method);
        }

        return view;
    }


    private createGetPage(resource: Resource, action: Method): Row{
        let {queryParameters, responses} = action;
        let response = responses.find(resp => resp.code === 200);
        let body = response.body[0];

        let children = [];
        if (body.type === PageType || body instanceof ArrayTypeDeclaration) {
            children.push(this.createTable(resource, action, body, queryParameters));
        } else {
            children.push(this.createCard(body));
        }

        return new Row({
            children: [
                new Cell({width: 24, children})
            ]
        });
    }

    private createTable(resource: Resource, method: Method, body: TypeDeclaration, queryParameters: TypeDeclaration[]) {
        let table = new Table();
        table.url = this.baseUri + resource.qualifiedPath;
        table.bordered = false;

        let elementType;

        if (body.type === PageType) {
            table.showPagination = true;
            let contentType = (<ObjectTypeDeclaration>body).properties.find(p => p.name === 'content') as ArrayTypeDeclaration;
            elementType = contentType.items as ObjectTypeDeclaration;
        } else {
            elementType = (<ArrayTypeDeclaration>body).items;
        }

        table.columns = this.elementTypeToColumns(elementType);

        if (queryParameters && queryParameters.length > 0) {

            let children = this.queryParametersToForm(queryParameters);
            if (children.length > 0) {
                table.queryForm = new Form({children});
                table.queryButton = new Button({text: this.translateTextToEnglish('查询'), triggerType: 'none', classType: 'primary'});
                table.clearButton = new Button({text: this.translateTextToEnglish('清除'), triggerType: 'none'});
            }
        }

        table.buttons = resource.methods
            .filter(action => action !== method)
            .map(action => this.methodToButton(resource, action));

        if (resource.resources && resource.resources.length > 0) {
            let itemResource = resource.resources[0];
            table.operationColumnButtons = itemResource.methods
                .filter(action => action.method !== 'patch')
                .map(action => this.methodToButton(resource, action));
        }


        return table;
    }

    private createCard( body: TypeDeclaration) {
        let properties = [body];
        if (body instanceof ObjectTypeDeclaration) {
            properties = body.properties;
        }

        return new Card({
            children: [
                new Form({
                    children: properties
                        .map(p => this.propertyToFormItem(p, true))
                        .map(RamlService.wrappedInCell)
                })
            ]
        });
    }

    private createNonGetPage(resource: Resource, action: Method): Form {
        let path = resource.qualifiedPath;
        let method = action.method;

        let {queryParameters, headers, body} = action;
        if (body && body.length > 0) {
            let bodyItem = body[0]; //TODO 后面增加contentType的切换功能，以便能支持同一视图多种形态（目前仅patch存在这种情况)

            let contentType = bodyItem.name;
            let params = [bodyItem];
            if (bodyItem instanceof ObjectTypeDeclaration) {
                params = bodyItem.properties.filter(p => !(p instanceof ArrayTypeDeclaration));
            }
            return this.createForm(params, headers, {path, method, contentType});
        } else if (queryParameters) {
            return this.createForm(queryParameters, headers, {path, method});
        }
    }

    private createForm(params: TypeDeclaration[], headers: TypeDeclaration[], def: any): Form {
        let form = new Form(def);

        let children = [];
        if (headers && headers.length > 0) {
            children.push(
                new FieldSet({
                    field: 'headers',
                    label: '请求头信息',
                    children: headers.map(h => this.propertyToFormItem(h, false))
                })
            );
        }

        for (let param of params) {
            if(param instanceof ArrayTypeDeclaration) {
                if(!(param.items instanceof SimpleTypeDeclaration)) {
                    continue;
                }
            }
            let cell = RamlService.wrappedInCell(this.propertyToFormItem(param, false));
            if(Invisible.formProperties.indexOf(param.name) !== -1) {
                cell.width = 0;
            }
            children.push(cell);
        }

        form.children = children;

        return form;
    }

    private propertyToFormItem(q: TypeDeclaration, readonly: boolean): Component {
        if (q instanceof SimpleTypeDeclaration) {
            let def = {
                field: q.name,
                label: q.displayName,
                description: q.description,
                readonly,
            };

            this.translateToEnglish(def);

            if (q.type === 'boolean') {
                return new Switch(def)
            }

            if (q.hasOwnProperty('options')) {
                return new Select({
                    ...def, options: q['options'],
                })
            }

            if (q.type === 'number' || q.type === 'integer') {
                return new InputNumber({
                    ...def, max: q.maximum, min: q.minimum,
                });
            }

            if (q.type === 'datetime') {
                return new DateRangePicker(def)
            }

            if (q.type === 'date-only') {
                return new DateRangePicker({
                    ...def, showTime: false,
                })
            }

            if (q.type === 'file') {
                return new UploadPicker(def)
            }

            if (q.type === 'any' || q.type === 'string') {
                if (q.maxLength > 255) {
                    return new TextArea({
                        ...def, width: 20,
                    })
                }
            }

            return new Text(def)
        }
        else if (q instanceof ObjectTypeDeclaration) {
            if (q.additionalProperties) {
                let keyTypeDeclaration = {type: 'string', pattern: q.properties[0].name};

                let keyType = new SimpleTypeDeclaration(keyTypeDeclaration);
                keyType.displayName = '请输入key';
                keyType.description = '请输入key';
                keyType.name = 'key';

                let valueType = new SimpleTypeDeclaration(q.properties[0]);
                valueType.displayName = '请输入value';
                valueType.description = '请输入value';
                valueType.name = 'value';

                let children = [
                    new Cell({order: 0, children: [this.propertyToFormItem(keyType, readonly)]}),
                    new Cell({order: 1, children: [this.propertyToFormItem(valueType, readonly)]}),
                ];

                return new MapFieldSet({children});
            } else {
                return new FieldSet({children: q.properties.map(prop => this.propertyToFormItem(prop, readonly)).map(RamlService.wrappedInCell)});
            }
        }
        else if (q instanceof ArrayTypeDeclaration) {
            let itemType = q.items;
            let children;
            if (itemType instanceof ObjectTypeDeclaration) {
                children = itemType.properties.map(prop => this.propertyToFormItem(prop, readonly))
            } else {
                children = [this.propertyToFormItem(itemType, readonly)];
            }
            return new ArrayFieldSet({children: children.map(RamlService.wrappedInCell)});
        }
    }

    private queryParametersToForm(queryParameters: TypeDeclaration[]): Cell[] {
        let children = [];
        for (let q of queryParameters) {
            if (q instanceof SimpleTypeDeclaration) {
                if (Invisible.queryParameters.indexOf(q.name) === -1) {
                    children.push(this.queryParameterToFormItem(q));
                }
            }
        }
        return children.map(RamlService.wrappedInCell);
    }

    private queryParameterToFormItem(q: SimpleTypeDeclaration): FormItem {
        let def = {
            field: q.name,
            label: q.displayName,
            description: q.description
        };
        this.translateToEnglish(def);

        if (q.type === 'boolean') {
            return new Switch(def)
        }

        if (q.hasOwnProperty('options')) {
            return new Select({...def, options: q['options'],})
        }

        if (q.type === 'number' || q.type === 'integer') {
            return new InputNumber({...def, max: q.maximum, min: q.minimum,});
        }

        if (q.type === 'datetime') {
            return new DateRangePicker(def)
        }
        if (q.type === 'date-only') {
            return new DateRangePicker({...def, showTime: false})
        }

        if (q.type === 'any' || q.type === 'string') {
            if (q.maxLength > 255) {
                def['width'] = 20;
                return new TextArea(def)
            }
        }

        return new Text(def)
    }

    private static wrappedInCell(item: Component): Cell {
        if (item instanceof Row) {
            return new Cell({width: 24, children: [item]});
        } else if (item instanceof TextArea) {
            return new Cell({width: 16, children: [item]});
        } else {
            return new Cell({children: [item]});
        }
    }

    private translateToEnglish(def: any){
        if(this.i18n.getLocale() === 'en') {
            if(def.hasOwnProperty('title')) {
                if(/.*[\u4e00-\u9fa5]+.*$/.test(def.title)) {
                    def.title = def.field.replace(/([a-z](?=[A-Z]))/g, '$1 ');
                    def.title = def.title[0].toUpperCase() + def.title.slice(1);
                }
            } else {
                if(/.*[\u4e00-\u9fa5]+.*$/.test(def.label)) {
                    def.label = def.field.replace(/([a-z](?=[A-Z]))/g, '$1 ');
                    def.label = def.label[0].toUpperCase() + def.label.slice(1);
                }
                if(/.*[\u4e00-\u9fa5]+.*$/.test(def.description)) {
                    def.description = def.label;
                }
            }
        }
    }

    private translateTextToEnglish(text: string){
        if(this.i18n.getLocale() === 'en'){
            if(text === '查询') {
                return 'Query';
            }
            if(text === '清除') {
                return 'Clear';
            }
            if(text === '修改') {
                return 'Edit';
            }
            if(text === '删除') {
                return 'Delete';
            }
            if(text === '查看') {
                return 'Go';
            }
        }
        return text;
    }

    private elementTypeToColumns(elementType: ObjectTypeDeclaration): Column[] {
        let columns = [];
        for (let p of elementType.properties) {
            if(p instanceof ArrayTypeDeclaration) {
                continue;
            }
            let def: any = {
                field: p.name,
                title: p.displayName,
                index: columns.length,
            };
            this.translateToEnglish(def);

            if(Invisible.columns.indexOf(p.name) !== -1) {
                def.hide = true;
            }

            if (p instanceof ObjectTypeDeclaration) {
                def.columns = this.elementTypeToColumns(p);
            }
            columns.push(new Column(def));
        }
        return columns;
    }

    private methodToButton(resource: Resource, action: Method): Button {
        const text = this.translateTextToEnglish(action.displayName);
        const description = action.description;
        const method = action.method;
        const path = resource.qualifiedPath;

        if ((action.body && action.body.length > 0) || (action.queryParameters && action.queryParameters.length > 0)) {
            const {path} = this.createView(resource, action);
            return Button.modal({text, description, method, path});
        }

        if (action.method === 'get') {
            return new Button({text, description, method, path});
        }

        return Button.danger({text, description, method, path});
    }
}
