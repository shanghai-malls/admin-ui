import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {NgZorroAntdModule} from 'ng-zorro-antd';

import {HttpService} from './model/http.service';
import {I18nService} from './model/i18n.service';
import {MenuService} from './model/menu.service';
import {ModalService} from './model/modal.service';
import {ViewService} from './model/view.service';
import {TranslateService} from './model/translate.service';
import {RamlService} from './model/raml.service';
import {MESSAGE_SOURCE_INJECTION_TOKEN, zh_CN} from './model/message-source';
import {SettingService} from './model/setting.service';
import {TranslatePipe} from './model/translate.pipe';
import {DataPickerComponent} from './components/data-picker.component';
import {WorkspaceComponent} from './components/workspace.component';
import {ResizeDirective} from './components/resize.directive';
import {RootComponent} from './components/root.component';
import {TransformService} from './model/transform.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        NgZorroAntdModule,
    ],
    declarations: [
        TranslatePipe,
        DataPickerComponent,
        WorkspaceComponent,
        RootComponent,
        ResizeDirective,
    ],
    providers: [
        HttpService,
        RamlService,
        TransformService,
        ViewService,
        TranslateService,
        I18nService,
        SettingService,
        MenuService,
        ModalService,
        {provide: MESSAGE_SOURCE_INJECTION_TOKEN, useValue: zh_CN}
    ],
    exports: [
        TranslatePipe,
        DataPickerComponent,
        ResizeDirective,
        WorkspaceComponent,
        RootComponent,
    ]
})
export class PublicModule {
}


