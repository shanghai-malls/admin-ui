import {FormGroup} from '@angular/forms';

export class Raml {
    ramlVersion: string;
    title: string;
    description: string;
    version: string;
    baseUri: string;
    protocols: string[];
    mediaType: string[];
    documentation: DocumentationItem[];
    types: { [x: string]: TypeDeclaration } = {};
    baseUriParameters: TypeDeclaration[];
    resources: Resource[];
}

export class DocumentationItem {
    title: string;
    content: string;

    constructor(title: string, content: string) {
        this.title = title;
        this.content = content;
    }
}

export class TypeDeclaration {
    name: string;
    displayName: string;
    description: string;
    type: string;
    defaultValue: string;
    required: boolean;

    static isSimple(td: { type: string }): boolean {
        return td.type === null || td.type === undefined || td.type === 'any' || td.type === 'datetime' || td.type === 'date-only' ||
            td.type === 'boolean' || td.type === 'string' || td.type === 'file' || td.type === 'number';
    }

    constructor(td: any) {
        Object.assign<TypeDeclaration, any>(this, td);
        if (!this.displayName) {
            this.displayName = this.name;
        }
        if (!this.description) {
            this.description = this.name;
        }
        if (!this.type) {
            console.warn(this.name + "未指明类型信息");
            this.type = 'string';
        }
    }
}

export class SimpleTypeDeclaration extends TypeDeclaration {
    format: string;
    enumValues: any[];
    pattern: string;
    minLength: number;
    maxLength: number;
    fileTypes: string[];
    minimum: number;
    maximum: number;
    multipleOf: number;
}

export class ObjectTypeDeclaration extends TypeDeclaration {
    properties: TypeDeclaration[];
    minProperties: number;
    maxProperties: number;
    additionalProperties: boolean;
    discriminator: string;
    discriminatorValue: string;

    constructor(td: any, properties: TypeDeclaration[]) {
        super(td);
        this.properties = properties;
    }
}

export class ArrayTypeDeclaration extends TypeDeclaration {
    uniqueItems: boolean;
    items: TypeDeclaration;
    minItems: number;
    maxItems: number;

    constructor(td: any, items: TypeDeclaration) {
        super(td);
        this.items = items;
    }
}

export class Resource {
    relativeUri: string;
    displayName: string;
    description: string;
    parent: Resource;
    resources: Resource[];
    uriParameters: TypeDeclaration[];
    methods: Method[];

    constructor(parent?: Resource) {
        this.parent = parent;
    }

    get qualifiedPath(){
        if(this.parent) {
            return this.parent.qualifiedPath + this.relativeUri;
        }
        return this.relativeUri;
    }
}

export class Method {
    method: string;
    displayName: string;
    description: string;
    protocols: string[];
    body: TypeDeclaration[];
    queryParameters: TypeDeclaration[];
    headers: TypeDeclaration[];
    responses: Response[];
}

export class Response {
    code: number;
    description: string;
    headers: TypeDeclaration[];
    body: TypeDeclaration[];
}

export const PageType = 'org.springframework.data.domain.Page';
export const RevisionType = 'org.springframework.data.history.Revision';
export const PagingParameters = ['page', 'number', 'sort', 'size'];

export const Invisible = {
    queryParameters:['page', 'number', 'sort', 'size', 'version', 'deleted', 'active', 'createdBy', 'updatedBy', 'commandId'],
    columns: ['version', 'deleted', 'active', 'createdBy', 'updatedBy', 'commandId'],
    detailPageProperties: ['version', 'commandId'],
    formProperties: ['version', 'deleted', 'active', 'createdAt','createdBy', 'updatedAt', 'updatedBy', 'commandId']
};


//
/**
 * TODO 现在是为了兼容，将来会删掉这段代码
 * 上面的toString_前后端都提供了实现，是因为要填id为复杂类型序列化为path的坑
 * 下面这两个方法也都是为了填各种奇怪字段的坑，像delete，active这样的字段我实在不知道有何意义？ 如果是为了审计，有更好更细粒度的实现，如果不是为了审计，那么这两个字段也是多余。
 */
export namespace raml{
    export function processQueryParameters(queryParameters: any, headers: any[][]){
        for (let row of headers) {
            for (let header of row) {
                if(header.field === 'deleted'){
                    queryParameters.deleted = false;
                    break;
                }
            }
        }
    }

    export function processFormBody(formGroup: FormGroup){
        if(formGroup.value.hasOwnProperty('active')) {
            if(formGroup.value.active === null || formGroup.value.active === undefined){
                formGroup.patchValue({active: true});
            }
        }
        if(formGroup.value.hasOwnProperty('deleted')) {
            if(formGroup.value.deleted === null || formGroup.value.deleted === undefined){
                formGroup.patchValue({deleted: false});
            }
        }
    }
}

