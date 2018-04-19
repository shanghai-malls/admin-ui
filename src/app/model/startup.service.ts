import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {
    Action,
    ArrayTypeDeclaration,
    Column,
    DetailView,
    im,
    ListView,
    mapToColumns,
    Menu,
    MenuGroup,
    Metadata,
    ObjectTypeDeclaration,
    Response,
    SimpleTypeDeclaration,
    sortAction,
    sortTabResources,
    StringAny,
    StringType,
    TypeDeclaration,
    View
} from './model';


@Injectable()
export class StartupService {
    private metadata: Metadata;
    private promise: Promise<Metadata>;

    constructor(private http: HttpClient) {
        this.initMetadata();
    }

    private initMetadata(): void {
        if (this.promise == undefined) {
            this.promise = this.http.get(im.entrance).map(metadata => this.mapToMetadata(metadata)).toPromise().catch((error) => {
                console.error('无法调用入口api', error); // for demo purposes only
                return Promise.resolve(error.message || error);
            });
        }
    }

    private mapToMetadata(response: any): Metadata {
        let raml = response.raml;
        let application = response.application;
        this.metadata = new Metadata(application.displayName);

        let types = this.resolveTypes(raml);
        let resources = this.mapToResources(raml);

        for (let moduleName of Object.getOwnPropertyNames(application.modules)) {
            let module = application.modules[moduleName];
            let menuGroup = new MenuGroup(module.displayName, module.description);
            if (module.aggregates) {
                for (let aggregateName of Object.getOwnPropertyNames(module.aggregates)) {
                    let aggregate = module.aggregates[aggregateName];
                    let resource = resources[aggregate.path];
                    let menu = new Menu(aggregate.path, aggregate.displayName, aggregate.description);
                    this.createAggregateView(resource, aggregate, types);
                    menuGroup.addMenu(menu)
                }
            }
            if (module.services) {
                for (let serviceName of Object.getOwnPropertyNames(module.services)) {
                    let service = module.aggregates[serviceName];
                    let resource = resources[service.path];
                    let menu = new Menu(service.path, service.displayName, service.description);
                    this.createServiceView(resource, types);
                    menuGroup.addMenu(menu)
                }
            }
            this.metadata.addMenuGroup(menuGroup)
        }
        return this.metadata;
    }

    private mapToResources(raml: any): StringAny {
        let resources: StringAny = {};


        let putResources = function (parentUri: string, input: any) {
            if (input.relativeUri) {
                input.path = parentUri + input.relativeUri;
                input.baseUri = raml.baseUri;
                resources[input.path] = input;
                parentUri = input.path;
            }

            if (input.resources) {
                for (let resource of input.resources) {
                    putResources(parentUri, resource);
                }
            }
        };

        putResources('', raml);
        return resources;
    }

    private resolveTypes(raml: any): StringType {
        if (raml.types) {
            let types: StringAny = {};
            raml.types.forEach(type => {
                types[type.name] = type;
            });


            let types1: StringType = {};

            raml.types.forEach(type => {
                let typed = this.resolveType(type, types);
                types1[typed.name] = typed;
            });
            return types1;
        }
    }

    private resolveType(object: any, types: StringAny | StringType): TypeDeclaration {
        if (object instanceof TypeDeclaration) {
            return object;
        }

        if (!object.type) {
            console.warn(object.name + "未指明类型信息");
            object.type = "string";
            return new SimpleTypeDeclaration(object);
        }
        if (TypeDeclaration.isSimple(object)) {
            return new SimpleTypeDeclaration(object);
        }

        if (object.type === 'object') {
            return this.resolveReferenceType(object, types);
        }

        if (object.type === 'array') {
            return new ArrayTypeDeclaration(object, this.resolveType(object['items'], types));
        }

        return this.resolveReferenceType(object, types);
    }

    private resolveReferenceType(object: any, types: StringAny | StringType): TypeDeclaration {

        let properties = [];

        if (object.name !== object.type && object.type !== 'object') {
            let referenceObject = types[object.type];
            if (!referenceObject) {
                throw new Error("找不到类型" + object.type);
            }
            let referenceType = this.resolveType(referenceObject, types);
            if (referenceType instanceof SimpleTypeDeclaration) {
                return referenceType;
            }
            if (referenceType instanceof ObjectTypeDeclaration) {
                properties.push(...referenceType.properties);
            }
        }

        if (object.properties) {
            properties = properties.concat(object.properties.map(prop => this.resolveType(prop, types)));
        }

        return new ObjectTypeDeclaration(object, properties);
    }

    private createAggregateView(resource: any, aggregate: any, types: StringType, parentView?: DetailView) {
        if (!resource.methods && !resource.resources) {
            return;
        }

        let listView = new ListView();
        this.metadata.addView(listView);
        for (let method of resource.methods) {
            let action = this.createAction(resource, method, types);

            if (action.method == 'get') {
                listView.api = action;
                this.processListViewHeaders(listView, action.getDomainModel());
                if (parentView) {
                    parentView.tabs.push(action);
                }
            } else {
                listView.topActions.push(action);
            }
        }

        if (resource.resources) {
            let itemResource = resource.resources[0];
            let detailView = new DetailView();
            this.metadata.addView(detailView);

            for (let method of itemResource.methods) {
                let action = this.createAction(itemResource, method, types);
                if (action.method === 'get') {
                    detailView.api = action;
                } else {
                    detailView.actions.push(action);
                }
                listView.rowActions.push(action);
            }
            //判断这个view是聚合的view
            if (aggregate.path === resource.path) {
                let actions = this.commandActions(itemResource, aggregate, types);
                detailView.actions.push(...actions);
                listView.rowActions.push(...actions);
            }
            if (itemResource.resources) {
                itemResource.resources.sort(sortTabResources);
                for (let subResource of itemResource.resources) {
                    this.createAggregateView(subResource, aggregate, types, detailView);
                }
            }

            detailView.actions.sort(sortAction);
        }
        listView.topActions.sort(sortAction);
        listView.rowActions.sort(sortAction);
    }

    private processListViewHeaders(listView: ListView, domainModel: ObjectTypeDeclaration) {

        let headers: Column[][] = [];
        let firstRow = mapToColumns(domainModel);
        let secondRow = [];
        for (let column of firstRow) {
            if (column.columns) {
                secondRow.push(...column.columns);
            }
        }
        headers.push(firstRow);

        while (secondRow.length > 0) {
            headers.push(secondRow);
            let thirdRow = [];
            for (let column of secondRow) {
                if (column.columns) {
                    thirdRow.push(...column.columns);
                }
            }
            secondRow = thirdRow;
        }


        let maxRowspan = headers.length;

        let fillToPropertyNames = function (column: Column) {
            if (column.columns) {
                for (let col of column.columns) {
                    fillToPropertyNames(col);
                }
            } else {
                listView.columns.push(column)
            }
        };


        for (let row of headers) {
            for (let header of row) {
                if (header.columns === undefined) {
                    header.rowspan = maxRowspan - header.parentsRowspan;
                } else {
                    header.rowspan = 1;
                }
                if (row == firstRow) {
                    fillToPropertyNames(header)
                }
            }
        }
        listView.headers = headers;
    }

    private commandActions(itemResource: any, aggregate: any, types: StringType): Action[] {
        let actions = [];
        if (aggregate.methods) {
            let resources = this.itemResourceToMap(itemResource);
            for (let methodName of Object.getOwnPropertyNames(aggregate.methods)) {
                let businessMethod = aggregate.methods[methodName];
                let fullPath = itemResource.path + '/' + businessMethod.path;
                for (let i = 0; i < itemResource.resources.length; i++) {
                    let subResource = itemResource.resources[i];
                    if (fullPath.startsWith(subResource.path)) {
                        itemResource.resources.splice(i, 1);
                        break;
                    }
                }

                let matchedResource = resources[fullPath];
                if (matchedResource && matchedResource.methods) {
                    for (let ramlMethod of matchedResource.methods) {
                        actions.push(this.createAction(matchedResource, ramlMethod, types));
                    }
                }
            }
        }

        return actions;
    }

    private itemResourceToMap(itemResource: any): StringAny {
        let resources: StringAny = {};

        let putResourceToMap = function (res: any) {
            resources[res.path] = res;
            if (res.resources) {
                for (let subResource of res.resources) {
                    putResourceToMap(subResource);
                }
            }
        };
        putResourceToMap(itemResource);
        return resources;
    }

    private createServiceView(resource: any, types: StringType, detailView?: DetailView) {
        detailView = detailView || new DetailView();
        for (let method of resource.methods) {
            detailView.actions.push(this.createAction(resource, method, types));
        }
        if (resource.resources) {
            for (let subResource of resource.resources) {
                this.createServiceView(subResource, types, detailView)
            }
        }
    }

    private createAction(resource: any, method: any, types: StringType): Action {
        let action = new Action();
        action.http = this.http;
        action.baseUri = resource.baseUri;
        action.path = resource.path;
        action.method = method.method;
        action.displayName = method.displayName;
        action.description = method.description;

        if (resource.uriParameters) {
            action.uriParameters = resource.uriParameters.map(uriParameter => this.resolveType(uriParameter, types));
        }

        if (method.queryParameters) {
            action.queryParameters = method.queryParameters.map(queryParameter => this.resolveType(queryParameter, types) as SimpleTypeDeclaration);
        }

        if (method.headers) {
            action.headers = method.headers.map(header => this.resolveType(header, types) as SimpleTypeDeclaration);
        }

        if (method.body) {
            action.body = method.body.map(body => this.resolveType(body, types));
        }

        if (method.responses) {
            action.responses = method.responses.map(response => this.resolveResponse(response, types));
        }

        im.processAction(action);

        return action;
    }

    private resolveResponse(response: any, types: StringType): Response {
        let r = new Response();
        r.code = parseInt(response.code);
        r.description = response.description;
        if (response.body) {
            r.body = response.body.map(item => this.resolveType(item, types));
        }
        return r;
    }

    public getView(path: string): Promise<View> {
        return this.promise.then(metadata => {
            for (let view of metadata.views) {
                if (view.isCompatible(path)) {
                    return view;
                }
            }
        });
    }

    public getViewByType(type: string): View {
        for (let view of this.metadata.views) {
            if (view.api.getDomainModel().type === type) {
                return view;
            }
        }
    }

    public getViewByAction(action: Action): View {
        for (let view of this.metadata.views) {
            if (view.api === action) {
                return view;
            }
        }
    }

    public getAppName(): Promise<string> {
        return this.promise.then(metadata => metadata.name);
    }

    public getMenus(): Promise<MenuGroup[]> {
        return this.promise.then(metadata => metadata.menuGroups);
    }
}
