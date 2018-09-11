import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {HttpOptions} from './http.service';


export interface ComponentLifecycleListener<C = any> {

    preInit?(componentInstance: C);

    postInit?(componentInstance: C);

    preQuery?(url: string, options: HttpOptions, componentInstance: C);

    postQuery?(data: any, componentInstance: C);

    preSubmit?(method: string, url: string, options: HttpOptions, componentInstance: C);

    postSubmit?(response: any, componentInstance: C);
}

export let COMPONENT_LIFECYCLE_LISTENER = new InjectionToken<ComponentLifecycleListener>('SUBMIT_INTERCEPTORS');


@Injectable({providedIn: 'root'})
export class ComponentLifecycleListenerDelegate implements ComponentLifecycleListener{


    constructor(@Optional() @Inject(COMPONENT_LIFECYCLE_LISTENER) private $processors: ComponentLifecycleListener[]) {

    }

    get processors(){
        return this.$processors || [];
    }

    preInit(componentInstance: any) {
        for (let processor of this.processors) {
            if(processor.preInit) {
                processor.preInit(componentInstance);
            }
        }
    }
    postInit(componentInstance: any) {
        for (let processor of this.processors) {
            if(processor.postInit) {
                processor.postInit(componentInstance);
            }
        }
    }

    preQuery(url: string, options: HttpOptions, componentInstance: any) {
        for (let processor of this.processors) {
            if(processor.preQuery) {
                processor.preQuery(url, options, componentInstance);
            }
        }
    }

    postQuery(data: any, componentInstance: any) {
        for (let processor of this.processors) {
            if(processor.postQuery) {
                processor.postQuery(data, componentInstance);
            }
        }
    }

    postSubmit(response: any, componentInstance: any) {
        for (let processor of this.processors) {
            if(processor.postSubmit) {
                processor.postSubmit(response, componentInstance);
            }
        }
    }

    preSubmit(method: string, url: string, options: HttpOptions, componentInstance: any) {
        for (let processor of this.processors) {
            if(processor.preSubmit) {
                processor.preSubmit(method, url, options, componentInstance);
            }
        }
    }



}
