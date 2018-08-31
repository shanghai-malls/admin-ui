import {ComponentRegistration, FormControlRegistration} from './public/model';
import {ViewGeneratorCustomizer} from './public/service/view-generator-customizer';
import {Type} from '@angular/core';
import {FormViewProcessor} from './public/service/form-view-processor';


export interface MacModuleOptions {
    /**
     * RAML 文档地址
     */
    endpointOfRaml?: string;

    /**
     * 用于接收动态组件的注册信息
     */
    components?: ComponentRegistration[];

    /**
     * 用于接收动态表单控件的注册信息
     */
    controls?: FormControlRegistration[];

    /**
     * 自定义的视图生成逻辑类
     */
    viewGeneratorCustomizer?: Type<ViewGeneratorCustomizer>;

    /**
     * 自定义表单视图处理类
     */
    formViewProcessor?: Type<FormViewProcessor>;

}
