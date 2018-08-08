import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {RouterModule} from '@angular/router';
import {IconManagementComponent} from './icon/icon-management.component';
import {InterfaceListComponent} from './interface/interface-list.component';
import {MenuManagementComponent} from './menu/menu-management.component';
import {SettingManagementComponent} from './setting/setting-management.component';
import {ViewManagementComponent} from './view/view-management.component';
import {PublicModule} from '../public/public.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        RouterModule,
        PublicModule,
    ],
    declarations: [
        IconManagementComponent,
        InterfaceListComponent,
        MenuManagementComponent,
        SettingManagementComponent,
        ViewManagementComponent
    ],
    exports: [
        IconManagementComponent,
        InterfaceListComponent,
        MenuManagementComponent,
        SettingManagementComponent,
        ViewManagementComponent
    ],
})
export class ManagementModule {
}


