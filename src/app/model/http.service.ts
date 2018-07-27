import {Injectable, Injector} from '@angular/core';
import {HttpHeaders} from '@angular/common/http/src/headers';
import {HttpParams} from '@angular/common/http/src/params';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {ArrayTypeDeclaration, Method, ObjectTypeDeclaration, Resource, SimpleTypeDeclaration, TypeDeclaration} from './raml';
import {RamlService} from './raml.service';
import {TypeFactory} from './type-factory';
import {isCompatible} from './function';

export interface HeadersOrParams {
    [header: string]: string | string[];
}



export class Page {
    content: any[] = [];
    totalElements = 0;
    size = 20;
    number = 1;


    constructor(content?: Object[]) {
        if (content) {
            this.content = content;
            this.totalElements = content.length;
        }
    }
}

export declare interface HttpOptions {
    body?: any;
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    reportProgress?: boolean;
    observe?: 'response';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
    withCredentials?: boolean;
    convertResult?: boolean;
}

@Injectable()
export class HttpService {
    private ramlService: RamlService;

    constructor(private injector: Injector, private http: HttpClient, private messageService: NzMessageService) {
        setTimeout(()=>this.ramlService = this.injector.get(RamlService));
    }

    static clean(input: any) {
        if (input) {
            for (const k of Object.getOwnPropertyNames(input)) {
                const propertyValue = input[k];
                if (propertyValue === undefined || propertyValue === null || propertyValue === '') {
                    delete input[k];
                }
            }
        }
        return input;
    }

    getPage(url: string, params?: HttpParams | HeadersOrParams, headers?: HttpHeaders | HeadersOrParams): Promise<Page> {
        return this.get<Page>(url, params, headers).then(this.processPage);
    }

    processPage = (page) => {
        page.number += 1;
        return page;
    };

    get<T = any>(url: string, params?: HttpParams | HeadersOrParams, headers?: HttpHeaders | HeadersOrParams): Promise<T> {
        return this.request<T>('get', url, {params, headers});
    }

    post<T = any>(url: string, body?: any, headers?: HttpHeaders | HeadersOrParams): Promise<T> {
        return this.request<T>('post', url, {body, headers});
    }


    put<T = any>(url: string, body?: any, headers?: HttpHeaders | HeadersOrParams): Promise<T> {
        return this.request<T>('put', url, {body, headers});
    }

    delete<T = any>(url: string, params?: HttpParams | HeadersOrParams, headers?: HttpHeaders | HeadersOrParams): Promise<T> {
        return this.request<T>('delete', url, {params, headers});
    }

    request<T = any>(method: string, url: string, options: HttpOptions = {observe:'response'}): Promise<T> {
        if (options.body) {
            options.body = HttpService.clean(options.body);
        }
        if (options.params) {
            options.params = HttpService.clean(options.params);
        }
        if (options.headers) {
            options.headers = HttpService.clean(options.headers);
        }

        let result = this.http.request(method, url, options).toPromise<T>()
            .then(result => {
                if (method !== 'get') {
                    this.messageService.success('操作成功');
                }
                if(result instanceof HttpResponse) {
                    result = result.body;
                }
                return result as T;
            })
            .catch((resp) => this.handleError(resp));

        if(!options.convertResult) {
            return result;
        }
        // return Promise.all<any, TypeDeclaration>([result, this.getResultType(url, method)]).then(([t1, t2]) => this.convert(t1, t2));


        return result.then((r:T)=>this.convertResult<T>(r,url, method));

    }

    handleError(resp:HttpErrorResponse):never{
        this.messageService.warning(resp.error.message);
        throw resp;
    };

    convertResult<T>(result:T, url: string, httpMethod: string): Promise<T> {

        return this.ramlService.getRaml().then(raml=>{
            let path = url.replace(raml.baseUri,"");//删除baseUri部分

            let parts = path.split('/').filter(p => p).map(p => '/' + p);

            if(parts.length > 0) {
                let iterableResource: { resources: Resource[] } = raml;
                for (const part of parts) {
                    if(iterableResource) {
                        iterableResource = iterableResource.resources.find(item => isCompatible(item.relativeUri , part));
                    }
                }

                if(iterableResource) {
                    let resource = iterableResource as Resource;
                    let method:Method;
                    for (let m of resource.methods) {
                        if(m.method === httpMethod) {
                            method = m;
                        }
                    }
                    for (let response of method.responses) {
                        if(response.code>= 200 && response.code < 300) {
                            result = this.convert(result, response.body[0]) as T;
                        }
                    }
                }
            }

            return result;
        });
    }

    convert(value: any, dec: TypeDeclaration){
        if(value && dec) {
            if(dec instanceof ObjectTypeDeclaration) {
                for (let prop of dec.properties) {
                    value[prop.name] = this.convert(value[prop.name], prop);
                }
                value.__proto__ = TypeFactory.createClass(dec).prototype;
            } else if(dec instanceof ArrayTypeDeclaration) {
                let array = value as any[];
                for (let i = 0; array && i < array.length; i++) {
                    array[i] = this.convert(array[i], dec.items);
                }
            } else if(dec instanceof SimpleTypeDeclaration) {
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


    private getResultType(url: string, httpMethod: string): Promise<TypeDeclaration>{
        if(this.ramlService) {
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

}
