import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http/src/headers';
import {HttpParams} from '@angular/common/http/src/params';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {RamlService} from './raml.service';

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
}

@Injectable()
export class HttpService {

    constructor(private http: HttpClient, private messageService: NzMessageService) {}

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

    request<T = any>(method: string, url: string, options: HttpOptions = {observe: 'response'}): Promise<T> {
        if (options.body) {
            options.body = HttpService.clean(options.body);
        }
        if (options.params) {
            options.params = HttpService.clean(options.params);
        }
        if (options.headers) {
            options.headers = HttpService.clean(options.headers);
        }

        return this.http.request(method, url, options).toPromise<T>()
            .then(result => {
                if (method !== 'get') {
                    this.messageService.success('操作成功');
                }
                if (result instanceof HttpResponse) {
                    result = result.body;
                }
                return result as T;
            })
            .catch((resp) => this.handleError(resp));
    }

    handleError(resp: HttpErrorResponse): never {
        this.messageService.warning(resp.error.message);
        throw resp;
    };

}
