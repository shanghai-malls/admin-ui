import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http/src/headers';
import {HttpParams} from '@angular/common/http/src/params';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';


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
    showMessage?: boolean;
}

@Injectable({providedIn: 'root'})
export class HttpService {

    constructor(private http: HttpClient, private messageService: NzMessageService) {
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


    get<T = any>(url: string, options: HttpOptions = {}): Promise<T> {
        return this.request<T>('get', url, options);
    }

    post<T = any>(url: string, body?: any, options: HttpOptions = {showMessage: true}): Promise<T> {
        if (body) {
            options.body = body;
        }
        return this.request<T>('post', url, options);
    }

    put<T = any>(url: string, body?: any, options: HttpOptions = {showMessage: true}): Promise<T> {
        if (body) {
            options.body = body;
        }
        return this.request<T>('put', url, options);
    }

    delete<T = any>(url: string, options: HttpOptions = {showMessage: true}): Promise<T> {
        return this.request<T>('delete', url, options);
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

        if (!options.responseType) {
            if (options.headers) {
                let accept = options.headers['Accept'];
                if (accept && accept.indexOf('text') !== -1) {
                    options.responseType = 'text';
                }
            }
        }


        return this.http.request(method, url, options).toPromise<T>()
            .then(result => {
                if (options.showMessage) {
                    this.messageService.success('操作成功');
                }
                if (result instanceof HttpResponse) {
                    result = result.body;
                }
                return result as T;
            })
            .catch((resp: HttpErrorResponse) => {
                console.warn(resp);
                if (options.showMessage) {
                    let message = resp.error.error + '<br/>' + resp.error.message;
                    this.messageService.warning(message);
                }
                throw resp;
            });
    }


}
