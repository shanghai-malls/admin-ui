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



export interface ComponentDefinition{
    type: string;
    name: string;
    group: 'display' | 'layout' | 'chart' | string;
    metamodelType?: Type<any>;
    componentType: Type<AbstractComponent>;
    designerComponentType?: Type<AbstractDesignerComponent>
}

export interface FormControlDefinition{
    type: string;
    name: string;
    metamodelType?: Type<any>;
    componentType: Type<AbstractFormControlComponent>;
    designerComponentType?: Type<AbstractDesignerFormControlComponent>
}
