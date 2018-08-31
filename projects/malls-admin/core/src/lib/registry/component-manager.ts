import {
    AbstractComponent,
    AbstractDesignerComponent,
    AbstractDesignerFormControlComponent,
    AbstractFormControlComponent,
    ComponentRegistration,
    FormControlRegistration
} from '../public/model';
import {Inject, Injectable, InjectionToken, Type} from '@angular/core';

export const COMPONENTS_INJECTION_TOKEN = new InjectionToken<ComponentRegistration[]>('COMPONENTS_INJECTION_TOKEN');
export const CONTROLS_INJECTION_TOKEN   = new InjectionToken<FormControlRegistration[]>('CONTROLS_INJECTION_TOKEN');

@Injectable({providedIn: 'root'})
export class ComponentManager {


    constructor(@Inject(COMPONENTS_INJECTION_TOKEN)     private components: ComponentRegistration[][],
                @Inject(CONTROLS_INJECTION_TOKEN)          private items: FormControlRegistration[][]){
    }

    getDesignerComponent(type: string): Type<AbstractDesignerComponent>{
        for (let components1 of this.components) {
            if(components1) {
                for (let registration of components1) {
                    if(registration.type === type) {
                        return registration.designerComponent;
                    }
                }
            }
        }
        throw new Error(`找不到类型：${type}的设计器组件`);
    }


    getComponent(type: string): Type<AbstractComponent>{
        for (let components1 of this.components) {
            if(components1) {
                for (let registration of components1) {
                    if (registration.type === type) {
                        return registration.component;
                    }
                }
            }
        }
        throw new Error(`找不到类型：${type}的组件`);
    }

    getDesignerFormControlComponent(type: string): Type<AbstractDesignerFormControlComponent>{
        for (let items1 of this.items) {
            if(items1) {
                for (let registration of items1) {
                    if(registration.type === type) {
                        return registration.designerComponent;
                    }
                }
            }
        }

        throw new Error(`找不到类型：${type}的设计器表单控件组件`);
    }

    getFormControlComponent(type: string): Type<AbstractFormControlComponent>{
        for (let items1 of this.items) {
            if(items1) {
                for (let registration of items1) {
                    if (registration.type === type) {
                        return registration.component;
                    }
                }
            }
        }
        throw new Error(`找不到类型：${type}的表单控件组件`);
    }

}
