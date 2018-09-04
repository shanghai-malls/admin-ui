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


    constructor(@Inject(COMPONENTS_INJECTION_TOKEN)     private componentRegistrationGroups: ComponentRegistration[][],
                @Inject(CONTROLS_INJECTION_TOKEN)          private itemRegistrationGroups: FormControlRegistration[][]){
    }

    getDesignerComponent(type: string): Type<AbstractDesignerComponent>{
        for (let componentRegistrationGroup of this.componentRegistrationGroups) {
            if(componentRegistrationGroup) {
                for (let registration of componentRegistrationGroup) {
                    if(registration.type === type) {
                        return registration.designerComponent;
                    }
                }
            }
        }
        throw new Error(`找不到类型：${type}的设计器组件`);
    }


    getComponent(type: string): Type<AbstractComponent>{
        for (let componentRegistrationGroup of this.componentRegistrationGroups) {
            if(componentRegistrationGroup) {
                for (let registration of componentRegistrationGroup) {
                    if (registration.type === type) {
                        return registration.component;
                    }
                }
            }
        }
        throw new Error(`找不到类型：${type}的组件`);
    }

    getDesignerFormControlComponent(type: string): Type<AbstractDesignerFormControlComponent>{
        for (let itemRegistrationGroup of this.itemRegistrationGroups) {
            if(itemRegistrationGroup) {
                for (let registration of itemRegistrationGroup) {
                    if(registration.type === type) {
                        return registration.designerComponent;
                    }
                }
            }
        }

        throw new Error(`找不到类型：${type}的设计器表单控件组件`);
    }

    getFormControlComponent(type: string): Type<AbstractFormControlComponent>{
        for (let itemRegistrationGroup of this.itemRegistrationGroups) {
            if(itemRegistrationGroup) {
                for (let registration of itemRegistrationGroup) {
                    if (registration.type === type) {
                        return registration.component;
                    }
                }
            }
        }
        throw new Error(`找不到类型：${type}的表单控件组件`);
    }

    getAllComponentRegistrations(): ComponentRegistration[]{
        let registrations = [];
        for (let componentRegistrationGroup of this.componentRegistrationGroups) {
            if(componentRegistrationGroup && componentRegistrationGroup.length > 0) {
                registrations.push(...componentRegistrationGroup);
            }
        }
        return registrations;
    }

    getAllFormControlRegistrations(): FormControlRegistration[]{
        let registrations = [];
        for (let itemRegistrationGroup of this.itemRegistrationGroups) {
            if(itemRegistrationGroup && itemRegistrationGroup.length > 0) {
                registrations.push(...itemRegistrationGroup);
            }
        }
        return registrations;
    }
}
