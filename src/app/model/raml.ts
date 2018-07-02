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
