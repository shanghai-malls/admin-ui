import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {Router, RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

import {DListComponent} from './builder/d-list/d-list.component';
import {RateSettingComponent} from './builder/settings/rate-setting.component';
import {DQueryFormFormComponent} from './builder/d-form/d-query-form.component';
import {DFormControlRadioComponent} from './builder/d-form/d-form-control-radio.component';
import {DFormControlUploadComponent} from './builder/d-form/d-form-control-upload.component';
import {DFormBodyComponent} from './builder/d-form/d-form-body.component';
import {DFormControlRichTextComponent} from './builder/d-form/d-form-control-rich-text.component';
import {DTabsetComponent} from './builder/d-tabset/d-tabset.component';
import {DFormControlDateComponent} from './builder/d-form/d-form-control-date.component';
import {DFormControlDataPickerComponent} from './builder/d-form/d-form-control-data-picker.component';
import {DFormControlSwitchComponent} from './builder/d-form/d-form-control-switch.component';
import {DisplayTextSettingComponent} from './builder/settings/display-text-setting.component';
import {UploadPickerSettingComponent} from './builder/settings/upload-picker-setting.component';
import {DHeaderComponent} from './builder/d-table/d-header.component';
import {DFormControlDateRangeComponent} from './builder/d-form/d-form-control-date-range.component';
import {DatePickerSettingComponent} from './builder/settings/date-picker-setting.component';
import {ButtonSettingComponent} from './builder/settings/button-setting.component';
import {TextSettingComponent} from './builder/settings/text-setting.component';
import {ChoiceSettingComponent} from './builder/settings/choice-setting.component';
import {DPartComponent} from './builder/d-part/d-part.component';
import {InputNumberSettingComponent} from './builder/settings/input-number-setting.component';
import {DWorkspaceComponent} from './builder/d-workspace.component';
import {DTableComponent} from './builder/d-table/d-table.component';
import {DFormControlRateComponent} from './builder/d-form/d-form-control-rate.component';
import {DFormControlNumberComponent} from './builder/d-form/d-form-control-number.component';
import {DWrapperComponent} from './builder/d-row/d-wrapper.component';
import {TableSettingComponent} from './builder/settings/table-setting.component';
import {DFormControlSelectComponent} from './builder/d-form/d-form-control-select.component';
import {QueryFormSettingComponent} from './builder/settings/query-form-setting.component';
import {DButtonComponent} from './builder/d-button/d-button.component';
import {SwitchSettingComponent} from './builder/settings/switch-setting.component';
import {DFormControlCheckboxComponent} from './builder/d-form/d-form-control-checkbox.component';
import {DFormComponent} from './builder/d-form/d-form.component';
import {DDetailComponent} from './builder/d-detail/d-detail.component';
import {DFormItemComponent} from './builder/d-form/d-form-item.component';
import {DFormControlTextareaComponent} from './builder/d-form/d-form-control-textarea.component';
import {DFormControlTimeComponent} from './builder/d-form/d-form-control-time.component';
import {TextAreaSettingComponent} from './builder/settings/text-area-setting.component';
import {DFormControlDisplayTextComponent} from './builder/d-form/d-form-control-display-text.component';
import {DCardComponent} from './builder/d-card/d-card.component';
import {FormSettingComponent} from './builder/settings/form-setting.component';
import {DRowComponent} from './builder/d-row/d-row.component';
import {DFormControlCascaderComponent} from './builder/d-form/d-form-control-cascader.component';
import {DataPickerSettingComponent} from './builder/settings/data-picker-setting.component';
import {DFormControlSliderComponent} from './builder/d-form/d-form-control-slider.component';
import {RowSettingComponent} from './builder/settings/row-setting.component';
import {TimePickerSettingComponent} from './builder/settings/time-picker-setting.component';
import {DFormControlTextComponent} from './builder/d-form/d-form-control-text.component';
import {DColumnListComponent} from './builder/d-table/d-column-list.component';
import {MenuManagementComponent} from './management/menu/menu-management.component';
import {ViewManagementComponent} from './management/view/view-management.component';
import {IconManagementComponent} from './management/icon/icon-management.component';
import {SettingManagementComponent} from './management/setting/setting-management.component';
import {InterfaceListComponent} from './management/interface/interface-list.component';
import {DataPickerComponent} from './datapicker/data-picker.component';
import {WorkspaceComponent} from './workspace/workspace.component';
import {MacComponent} from './mac.component';
import {TranslatePipe} from './translate/translate.pipe';
import {ENDPOINT_OF_RAML, RAML_ENDPOINT_INJECTION_TOKEN} from './public/service/raml.service';


import {VFormControlSliderComponent} from './runner/v-form/v-form-control-slider.component';
import {VFormControlTimeComponent} from './runner/v-form/v-form-control-time.component';
import {VFormComponent} from './runner/v-form/v-form.component';
import {VListComponent} from './runner/v-list/v-list.component';
import {VFormControlComponent} from './runner/v-form/v-form-control.component';
import {VFormControlSwitchComponent} from './runner/v-form/v-form-control-switch.component';
import {VFormControlCheckboxComponent} from './runner/v-form/v-form-control-checkbox.component';
import {VFormControlDateComponent} from './runner/v-form/v-form-control-date.component';
import {VFormControlRateComponent} from './runner/v-form/v-form-control-rate.component';
import {VRowComponent} from './runner/v-row/v-row.component';
import {VTabsetComponent} from './runner/v-tabset/v-tabset.component';
import {VFormControlDataPickerComponent} from './runner/v-form/v-form-control-data-picker.component';
import {VFormControlDateRangeComponent} from './runner/v-form/v-form-control-date-range.component';
import {VFormControlDisplayTextComponent} from './runner/v-form/v-form-control-display-text.component';
import {VFormControlNumberComponent} from './runner/v-form/v-form-control-number.component';
import {VPartComponent} from './runner/v-part/v-part.component';
import {VDetailComponent} from './runner/v-detail/v-detail.component';
import {VFormControlCascaderComponent} from './runner/v-form/v-form-control-cascader.component';
import {VCardComponent} from './runner/v-card/v-card.component';
import {VMainComponent} from './runner/v-main.component';
import {VFormControlRadioComponent} from './runner/v-form/v-form-control-radio.component';
import {VFormControlSelectComponent} from './runner/v-form/v-form-control-select.component';
import {VFormControlTextComponent} from './runner/v-form/v-form-control-text.component';
import {VFormControlTextareaComponent} from './runner/v-form/v-form-control-textarea.component';
import {VFormControlUploadComponent} from './runner/v-form/v-form-control-upload.component';
import {VTableComponent} from './runner/v-table/v-table.component';
import {VFormControlRichTextComponent} from './runner/v-form/v-form-control-rich-text.component';
import {VQueryFormComponent} from './runner/v-form/v-query-form.component';
import {ResizeDirective} from './resize/resize.directive';
import {builtInComponents, builtInFormControls} from './registry/built-in-components';
import {COMPONENTS_INJECTION_TOKEN, CONTROLS_INJECTION_TOKEN} from './registry/component-manager';
import {MacModuleOptions} from './mac-module-options';
import {VIEW_GENERATOR_CUSTOMIZER, ViewGeneratorCustomizer} from './public/service/view-generator-customizer';
import {FORM_VIEW_PROCESSORS, NoopFormViewProcessor} from './public/service/form-view-processor';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        NgZorroAntdModule,
    ],

    providers: [
        {provide: RAML_ENDPOINT_INJECTION_TOKEN, useValue: ENDPOINT_OF_RAML},
        {provide: VIEW_GENERATOR_CUSTOMIZER, useClass: ViewGeneratorCustomizer},
        {provide: COMPONENTS_INJECTION_TOKEN, useValue: builtInComponents, multi: true},
        {provide: CONTROLS_INJECTION_TOKEN, useValue: builtInFormControls, multi: true},
    ],

    declarations: [
        TranslatePipe,

        DFormComponent,
        DQueryFormFormComponent,
        DFormItemComponent,
        DPartComponent,
        DDetailComponent,
        DTableComponent,
        DHeaderComponent,
        DButtonComponent,
        DColumnListComponent,
        DCardComponent,
        DRowComponent,
        DTabsetComponent,
        DWrapperComponent,
        DFormBodyComponent,

        DFormControlCascaderComponent,
        DFormControlCheckboxComponent,
        DFormControlDataPickerComponent,
        DFormControlDateComponent,
        DFormControlDateRangeComponent,
        DFormControlDisplayTextComponent,
        DFormControlNumberComponent,
        DFormControlRadioComponent,
        DFormControlRateComponent,
        DFormControlRichTextComponent,
        DFormControlSelectComponent,
        DFormControlSliderComponent,
        DFormControlSwitchComponent,
        DFormControlTextComponent,
        DFormControlTextareaComponent,
        DFormControlTimeComponent,
        DFormControlUploadComponent,


        ButtonSettingComponent,
        ChoiceSettingComponent,
        DataPickerSettingComponent,
        DatePickerSettingComponent,
        DisplayTextSettingComponent,
        FormSettingComponent,
        InputNumberSettingComponent,
        QueryFormSettingComponent,
        RateSettingComponent,
        RowSettingComponent,
        SwitchSettingComponent,
        TableSettingComponent,
        TextAreaSettingComponent,
        TextSettingComponent,
        TimePickerSettingComponent,
        UploadPickerSettingComponent,
        DTabsetComponent,
        DCardComponent,
        DRowComponent,
        DListComponent,

        DWorkspaceComponent,

        IconManagementComponent,
        InterfaceListComponent,
        MenuManagementComponent,
        SettingManagementComponent,
        ViewManagementComponent,

        DataPickerComponent,
        ResizeDirective,
        WorkspaceComponent,
        MacComponent,

        VCardComponent,
        VDetailComponent,
        VFormComponent,
        VListComponent,
        VPartComponent,
        VRowComponent,
        VTableComponent,
        VTabsetComponent,

        VQueryFormComponent,
        VFormControlComponent,

        VFormControlCascaderComponent,
        VFormControlCheckboxComponent,
        VFormControlDataPickerComponent,
        VFormControlDateComponent,
        VFormControlDateRangeComponent,
        VFormControlDisplayTextComponent,
        VFormControlNumberComponent,
        VFormControlRadioComponent,
        VFormControlRateComponent,
        VFormControlRichTextComponent,
        VFormControlSelectComponent,
        VFormControlSliderComponent,
        VFormControlSwitchComponent,
        VFormControlTextComponent,
        VFormControlTextareaComponent,
        VFormControlTimeComponent,
        VFormControlUploadComponent,

        VMainComponent,
    ],

    entryComponents: [

        /**
         * 设计器组件，由DPartComponent动态创建，需要配置到entryComponents中
         */
        DCardComponent,
        DDetailComponent,
        DFormComponent,
        DListComponent,
        DRowComponent,
        DTableComponent,
        DTabsetComponent,

        /**
         * 表单控件组件，由DFormItemComponent动态创建，需要配置到entryComponents中
         */
        DFormControlCascaderComponent,
        DFormControlCheckboxComponent,
        DFormControlDataPickerComponent,
        DFormControlDateComponent,
        DFormControlDateRangeComponent,
        DFormControlDisplayTextComponent,
        DFormControlNumberComponent,
        DFormControlRadioComponent,
        DFormControlRateComponent,
        DFormControlRichTextComponent,
        DFormControlSelectComponent,
        DFormControlSliderComponent,
        DFormControlSwitchComponent,
        DFormControlTextComponent,
        DFormControlTextareaComponent,
        DFormControlTimeComponent,
        DFormControlUploadComponent,

        /**
         * 由模态框打开，需要配置到entryComponents中
         */
        ButtonSettingComponent,
        ChoiceSettingComponent,
        DataPickerSettingComponent,
        DatePickerSettingComponent,
        DisplayTextSettingComponent,
        FormSettingComponent,
        InputNumberSettingComponent,
        QueryFormSettingComponent,
        RateSettingComponent,
        RowSettingComponent,
        SwitchSettingComponent,
        TableSettingComponent,
        TextAreaSettingComponent,
        TextSettingComponent,
        TimePickerSettingComponent,
        UploadPickerSettingComponent,

        /**
         * 绑定了路由的组件，但由于放在了library中，无法静态提取，所以必须要配置在entryComponents中
         */
        DWorkspaceComponent,

        /**
         * 绑定了路由的组件，但由于放在了library中，无法静态提取，所以必须要配置在entryComponents中
         */
        IconManagementComponent,
        InterfaceListComponent,
        MenuManagementComponent,
        SettingManagementComponent,
        ViewManagementComponent,

        /**
         * 绑定了路由的组件，但由于放在了library中，无法静态提取，所以必须要配置在entryComponents中
         */
        WorkspaceComponent,

        /**
         * 设计器组件，由VPartComponent动态创建，需要配置到entryComponents中
         */
        VCardComponent,
        VDetailComponent,
        VFormComponent,
        VListComponent,
        VRowComponent,
        VTableComponent,
        VTabsetComponent,

        /**
         * 模态框打开了它
         */
        VPartComponent,
        /**
         * 设计器组件，由VFormItemComponent动态创建，需要配置到entryComponents中
         */
        VFormControlCascaderComponent,
        VFormControlCheckboxComponent,
        VFormControlDataPickerComponent,
        VFormControlDateComponent,
        VFormControlDateRangeComponent,
        VFormControlDisplayTextComponent,
        VFormControlNumberComponent,
        VFormControlRadioComponent,
        VFormControlRateComponent,
        VFormControlRichTextComponent,
        VFormControlSelectComponent,
        VFormControlSliderComponent,
        VFormControlSwitchComponent,
        VFormControlTextComponent,
        VFormControlTextareaComponent,
        VFormControlTimeComponent,
        VFormControlUploadComponent,

        /**
         * 绑定了路由的组件，但由于放在了library中，无法静态提取，所以必须要配置在entryComponents中
         */
        VMainComponent
    ],

    exports: [
        DWorkspaceComponent,

        IconManagementComponent,
        InterfaceListComponent,
        MenuManagementComponent,
        SettingManagementComponent,
        ViewManagementComponent,


        TranslatePipe,
        DataPickerComponent,
        ResizeDirective,
        WorkspaceComponent,
        MacComponent,

        VMainComponent,
    ]
})
export class MacModule {
    static forRoot(config: MacModuleOptions): ModuleWithProviders<MacModule> {
        return {
            ngModule: MacModule,
            providers: [
                {provide: FORM_VIEW_PROCESSORS, useClass: config.formViewProcessor || NoopFormViewProcessor, multi: true},
                {provide: COMPONENTS_INJECTION_TOKEN, useValue: config.components, multi: true},
                {provide: CONTROLS_INJECTION_TOKEN, useValue: config.controls, multi: true},
                {provide: RAML_ENDPOINT_INJECTION_TOKEN, useValue: config.endpointOfRaml || ENDPOINT_OF_RAML},
                {provide: VIEW_GENERATOR_CUSTOMIZER, useClass: config.viewGeneratorCustomizer || ViewGeneratorCustomizer}
            ]
        };
    }

    constructor(router: Router) {
        let routes = [...router.config];
        for (let route of routes) {
            if (route.component === MacComponent) {
                let children = route.children || [];
                route.children = [
                    {
                        path: 'd',
                        children: [
                            {component: DWorkspaceComponent, path: '**'}
                        ]
                    },
                    {
                        path: '',
                        component: WorkspaceComponent,
                        children: [
                            ...children,
                            {
                                path: 'management',
                                children: [
                                    {component: SettingManagementComponent, path: 'setting'},
                                    {component: MenuManagementComponent, path: 'menus'},
                                    {component: IconManagementComponent, path: 'icons'},
                                    {component: ViewManagementComponent, path: 'views'},
                                    {component: InterfaceListComponent, path: 'interfaces'},
                                ]
                            },
                            {component: VMainComponent, path: '**'},
                        ]
                    }
                ];
            }
        }
        router.onSameUrlNavigation = 'reload';
        router.resetConfig(routes);
        router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        }
    }
}

