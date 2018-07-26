import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Route, RouterModule} from '@angular/router';
import {MenuManagementComponent} from './main/management/menu/menu-management.component';
import {IconManagementComponent} from './main/management/icon/icon-management.component';
import {ViewManagementComponent} from './main/management/view/view-management.component';
import {InterfaceListComponent} from './main/management/interface/interface-list.component';
import {RamlService} from './model/raml.service';
import {DWorkspaceComponent} from './builder/d-workspace.component';
import {VPartComponent} from './main/runner/components/v-part.component';
import {DesignService} from './model/design.service';
import {WorkspaceComponent} from './main/workspace.component';
import {VMainComponent} from './main/runner/v-main.component';
import {DPartComponent} from './builder/components/d-part.component';
import {DFormItemComponent} from './builder/components/d-form-item.component';
import {DColumnListComponent} from './builder/components/d-column-list.component';
import {DButtonComponent} from './builder/components/d-button.component';
import {DTableComponent} from './builder/components/d-table.component';
import {ViewService} from './model/view.service';
import {VTableComponent} from './main/runner/components/v-table.component';
import {VFormComponent} from './main/runner/components/v-form.component';
import {TranslatePipe} from './model/translate.pipe';
import {TranslateService} from './model/translate.service';
import {I18nService} from './model/i18n.service';
import {SettingManagementComponent} from './main/management/setting/setting-management.component';
import {SettingService} from './model/setting.service';
import {HttpService} from './model/http.service';
import {MenuService} from './model/menu.service';
import {RowSettingComponent} from './builder/components/settings/row-setting.component';
import {DataPickerComponent} from './main/runner/components/data-picker.component';
import {ModalService} from './model/modal.service';

import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {VDetailComponent} from './main/runner/components/v-detail.component';
import {DFormComponent} from './builder/components/d-form.component';
import {DDetailComponent} from './builder/components/d-detail.component';
import {ButtonSettingComponent} from './builder/components/settings/button-setting.component';
import {DHeaderComponent} from './builder/components/d-header.component';
import {ResizeDirective} from './builder/components/resize.directive';
import {TextSettingComponent} from './builder/components/settings/text-setting.component';
import {SwitchSettingComponent} from './builder/components/settings/switch-setting.component';
import {ChoiceSettingComponent} from './builder/components/settings/choice-setting.component';
import {DatePickerSettingComponent} from './builder/components/settings/date-picker-setting.component';
import {DataPickerSettingComponent} from './builder/components/settings/data-picker-setting.component';
import {FormSettingComponent} from './builder/components/settings/form-setting.component';
import {InputNumberSettingComponent} from './builder/components/settings/input-number-setting.component';
import {RateSettingComponent} from './builder/components/settings/rate-setting.component';
import {RichTextSettingComponent} from './builder/components/settings/rich-text-setting.component';
import {TableSettingComponent} from './builder/components/settings/table-setting.component';
import {TextAreaSettingComponent} from './builder/components/settings/text-area-setting.component';
import {TimePickerSettingComponent} from './builder/components/settings/time-picker-setting.component';
import {UploadPickerSettingComponent} from './builder/components/settings/upload-picker-setting.component';
import {MESSAGE_SOURCE_INJECTION_TOKEN, zh_CN} from './model/message-source';
import {DMainComponent} from './builder/d-main.component';

registerLocaleData(zh);


const routes: Route[] = [
    {
        path: 'd',
        component: DWorkspaceComponent,
        children: [
            {component: DMainComponent, path: '**'}
        ]
    },
    {
        path: '',
        component: WorkspaceComponent,
        children: [
            {
                path: 'management', children: [
                    {component: SettingManagementComponent, path: 'setting'},
                    {component: MenuManagementComponent,    path: 'menus'},
                    {component: IconManagementComponent,    path: 'icons'},
                    {component: ViewManagementComponent,    path: 'views'},
                    {component: InterfaceListComponent,     path: 'interfaces'},
                ]
            },

            {component: VMainComponent, path: '**'},
        ]
    },
];


@NgModule({
    declarations: [
        AppComponent,
        WorkspaceComponent,
        VMainComponent,
        MenuManagementComponent,
        IconManagementComponent,
        ViewManagementComponent,
        InterfaceListComponent,
        SettingManagementComponent,

        //------------------------------//
        VPartComponent,
        VTableComponent,
        VFormComponent,
        VDetailComponent,
        DataPickerComponent,

        //------------------------------//
        DWorkspaceComponent,
        DMainComponent,
        DFormComponent,
        DFormItemComponent,
        DPartComponent,
        DDetailComponent,

        ResizeDirective,

        DTableComponent,
        DHeaderComponent,
        DButtonComponent,
        DColumnListComponent,

        //------------settings---------------//

        ButtonSettingComponent,
        ChoiceSettingComponent,
        DataPickerSettingComponent,
        DatePickerSettingComponent,
        FormSettingComponent,
        InputNumberSettingComponent,
        RateSettingComponent,
        RichTextSettingComponent,
        RowSettingComponent,
        SwitchSettingComponent,
        TableSettingComponent,
        TextAreaSettingComponent,
        TextSettingComponent,
        TimePickerSettingComponent,
        UploadPickerSettingComponent,

        //------------pipe---------------//
        TranslatePipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),
        NgZorroAntdModule
    ],
    providers: [
        RamlService, ViewService, DesignService,
        TranslateService, I18nService, SettingService, HttpService, MenuService, ModalService,
        {provide: MESSAGE_SOURCE_INJECTION_TOKEN, useValue: zh_CN}
    ],

    // 通过modal方式打开某个组件，需要将该组件配置在这个节点下，如果该组件已经存在于路由表中，则可以省略
    entryComponents: [
        VPartComponent,
        VFormComponent,
        VTableComponent,

        ButtonSettingComponent,
        ChoiceSettingComponent,
        DataPickerSettingComponent,
        DatePickerSettingComponent,
        FormSettingComponent,
        InputNumberSettingComponent,
        RateSettingComponent,
        RichTextSettingComponent,
        RowSettingComponent,
        SwitchSettingComponent,
        TableSettingComponent,
        TextAreaSettingComponent,
        TextSettingComponent,
        TimePickerSettingComponent,
        UploadPickerSettingComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
