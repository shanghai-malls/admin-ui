import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http/src/headers';
import {HttpParams} from '@angular/common/http/src/params';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {TypeDeclaration} from './raml';

export type HeadersOrParams = {
    [header: string]: string | string[];
};


function convert(body: any, spec: TypeDeclaration): any{
    return body;
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



@Injectable()
export class HttpService {
    constructor(private http: HttpClient, private messageService: NzMessageService) {

    }

    static clean(input: any) {
        if (input) {
            for (let k of Object.getOwnPropertyNames(input)) {
                let propertyValue = input[k];
                if (propertyValue === undefined || propertyValue === null || propertyValue === "") {
                    delete input[k];
                }
            }
        }
        return input;
    }

    get<T>(url: string, params?: HttpParams | HeadersOrParams, headers?: HttpHeaders | HeadersOrParams): Promise<T> {
        return this.http.get(url, {
                observe: 'response',
                params: HttpService.clean(params),
                headers: HttpService.clean(headers)
            })
            .toPromise().then(result => {
                if (result.status == 200) {
                    return result.body as T;
                } else {
                    this.messageService.warning(result.statusText);
                    throw new Error(result.statusText);
                }
            });
    }


    getPage(url: string, params?: HttpParams | HeadersOrParams, headers?: HttpHeaders | HeadersOrParams): Promise<Page> {
        return this.get<Page>(url,params,headers).then(page=>{
            page.number += 1;
            return page;
        })
    }


    post<T>(url: string, body: any | null, headers?: HttpHeaders | HeadersOrParams): Promise<T> {
        return this.http.post(url, body, {
                headers: HttpService.clean(headers),
                observe: 'response',
            })
            .toPromise().then(result => {
                if (result.status === 200) {
                    this.messageService.success("操作成功");
                    return result.body as T;
                } else {
                    this.messageService.warning(result.statusText);
                    throw new Error(result.statusText);
                }
            });
    }

    delete<T>(url: string, params?: HttpParams | HeadersOrParams, headers?: HttpHeaders | HeadersOrParams): Promise<T>{
        return this.http.delete(url, {
                observe: 'response',
                params: HttpService.clean(params),
                headers: HttpService.clean(headers)
            })
            .toPromise().then(resp=>{
                if (resp.status === 200) {
                    this.messageService.success("操作成功");
                    return resp.body as T;
                } else {
                    this.messageService.warning(resp.statusText);
                    throw new Error(resp.statusText);
                }
            })
    }
}
