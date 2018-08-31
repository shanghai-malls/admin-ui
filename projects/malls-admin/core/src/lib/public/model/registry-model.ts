import {Component, FormItem} from './metamodel';
import {FormGroup} from '@angular/forms';
import {Type} from '@angular/core';

export interface AbstractFormControlComponent<T extends FormItem=FormItem> {
    initComponent(item: T, group: FormGroup);
}


export interface AbstractComponent<T extends Component = Component> {
    initComponent(component: T, path: string, route: string);
}


export interface AbstractDesignerComponent<T extends Component = Component> {
    initComponent(component: T);

    doSetting?(event: any);
}

export interface AbstractDesignerFormControlComponent<T extends FormItem=FormItem> extends AbstractDesignerComponent<T> {
    doSetting(event: any);
}

export class FormControlRegistration{
    type: string;
    modelType?: Type<any>;
    component: Type<AbstractFormControlComponent>;
    designerComponent?: Type<AbstractDesignerFormControlComponent>
}

export class ComponentRegistration{
    type: string;
    group: string;
    modelType?: Type<any>;
    component: Type<AbstractComponent>;
    designerComponent?: Type<AbstractDesignerComponent>
}

