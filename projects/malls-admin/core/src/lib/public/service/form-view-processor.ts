import {Form} from '../model';
import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';

export let FORM_VIEW_PROCESSORS = new InjectionToken<FormViewProcessor[]>('SUBMIT_INTERCEPTORS');

export interface FormViewProcessor {
    preLoad?(form: Form, route: string, path: string): any;

    preSubmit?(formValue: any, form: Form, route: string, path: string);
}

export class NoopFormViewProcessor implements FormViewProcessor {

}

@Injectable({providedIn: 'root'})
export class FormViewProcessorDelegate implements FormViewProcessor {
    constructor(@Optional() @Inject(FORM_VIEW_PROCESSORS) private interceptors: FormViewProcessor[]) {
        console.log('injected =>' + interceptors);
    }

    preLoad(form: Form, route: string, path: string): any {
        if (this.interceptors) {

            for (let interceptor of this.interceptors) {
                if(interceptor.preLoad) {
                    interceptor.preLoad(form, route, path);
                }
            }
        }
    }


    preSubmit(formValue: any, form: Form, route: string, path: string) {
        if (this.interceptors) {
            for (let interceptor of this.interceptors) {
                if(interceptor.preSubmit) {
                    interceptor.preSubmit(formValue, form, route, path);
                }
            }
        }
    }

}
