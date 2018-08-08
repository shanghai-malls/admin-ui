import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {RamlService} from './raml.service';
import {ArrayTypeDeclaration, Method, ObjectTypeDeclaration, Resource, SimpleTypeDeclaration, TypeDeclaration} from './raml';
import {isCompatible} from './function';
import {TypeFactory} from './type-factory';

@Injectable()
export class TransformService {

    constructor(private http: HttpService, private ramlService: RamlService) {

    }


    transform<T>(result: T, url: string, httpMethod: string): Promise<T> {
        return this.ramlService.getRaml().then(raml => {
            let path = url.replace(raml.baseUri, '');//删除baseUri部分

            let parts = path.split('/').filter(p => p).map(p => '/' + p);

            if (parts.length > 0) {
                let iterableResource: { resources: Resource[] } = raml;
                for (const part of parts) {
                    if (iterableResource) {
                        iterableResource = iterableResource.resources.find(item => isCompatible(item.relativeUri, part));
                    }
                }

                if (iterableResource) {
                    let resource = iterableResource as Resource;
                    let method: Method;
                    for (let m of resource.methods) {
                        if (m.method === httpMethod) {
                            method = m;
                        }
                    }
                    for (let response of method.responses) {
                        if (response.code >= 200 && response.code < 300) {
                            result = this.transformValue(result, response.body[0]) as T;
                        }
                    }
                }
            }

            return result;
        });
    }

    transformValue(value: any, dec: TypeDeclaration) {
        if (value && dec) {
            if (dec instanceof ObjectTypeDeclaration) {
                for (let prop of dec.properties) {
                    value[prop.name] = this.transformValue(value[prop.name], prop);
                }
                value.__proto__ = TypeFactory.createClass(dec).prototype;
            } else if (dec instanceof ArrayTypeDeclaration) {
                let array = value as any[];
                for (let i = 0; array && i < array.length; i++) {
                    array[i] = this.transformValue(array[i], dec.items);
                }
            } else if (dec instanceof SimpleTypeDeclaration) {
                if (dec.type == 'datetime') {
                    value = new Date(value);
                    Object.setPrototypeOf(value, TypeFactory.DateTime.prototype);
                } else if (dec.type == 'date-only') {
                    value = new Date(value);
                    Object.setPrototypeOf(value, TypeFactory.DateOnly.prototype);
                }
            }
        }
        return value;
    }


    private getResultType(url: string, httpMethod: string): Promise<TypeDeclaration> {
        return this.ramlService.getRaml().then(raml => {
            let iterableResource: { resources: Resource[] } = raml;
            let parts = url.split('/').filter(p => p).map(p => '/' + p);
            for (const part of parts) {
                if (iterableResource) {
                    iterableResource = iterableResource.resources.find(item => item.relativeUri === part);
                }
            }

            if (iterableResource) {
                let resource = iterableResource as Resource;
                let method: Method;
                for (let m of resource.methods) {
                    if (m.method === httpMethod) {
                        method = m;
                    }
                }
                for (let response of method.responses) {
                    if (response.code >= 200 && response.code < 300) {
                        return response.body[0];
                    }
                }
            }
        });
    }

}
