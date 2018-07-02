import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Route, RouterModule} from '@angular/router';
import {MenuManagementComponent} from './main/menu/menu-management.component';
import {IconManagementComponent} from './main/icon/icon-management.component';
import {ViewManagementComponent} from './main/view/view-management.component';
import {InterfaceListComponent} from './main/interface/interface-list.component';
import {RamlService} from './model/raml.service';
import {DesignWorkspaceComponent} from './builder/design-workspace.component';
import {ViewablePartComponent} from './runner/components/v-part.component';
import {DesignService} from './model/design.service';
import {WorkspaceComponent} from './main/workspace.component';
import {MainComponent} from './runner/v.main.component';
import {FormItemComponent} from './runner/components/form-item.component';
import {DesignablePartComponent} from './builder/components/d-part.component';
import {DesignableFormItemComponent} from './builder/components/d-form-item.component';
import {DesignableColumnListComponent} from './builder/components/d-column-list.component';
import {DesignableButtonComponent} from './builder/components/d-button.component';
import {DesignableTableComponent} from './builder/components/d-table.component';
import {ViewService} from './model/view.service';
import {ViewableTableComponent} from './runner/components/v-table.component';
import {ViewableFormComponent} from './runner/components/v-form.component';
import {TranslatePipe} from './model/translate.pipe';
import {TranslateService} from './model/translate.service';
import {I18nService} from './model/i18n.service';
import {SettingsComponent} from './main/settings/settings.component';
import {SettingsService} from './model/settings.service';
import {HttpService} from './model/http.service';
import {MenuService} from './model/menu.service';
import {SubmenuComponent} from './main/submenu/submenu.component';

const routes: Route[] = [
    {
        path: 'views/design',
        component: DesignWorkspaceComponent
    },
    {
        path: '',
        component: WorkspaceComponent,
        children: [
            {component: SettingsComponent, path: 'settings'},
            {component: MenuManagementComponent, path: 'menus'},
            {component: IconManagementComponent, path: 'icons'},
            {component: ViewManagementComponent, path: 'views'},
            {component: InterfaceListComponent, path: 'interfaces'},
            {component: MainComponent, path: '**'},
        ]
    },
];


@NgModule({
    declarations: [
        AppComponent,
        SubmenuComponent,
        WorkspaceComponent,
        MainComponent,
        MenuManagementComponent,
        IconManagementComponent,
        ViewManagementComponent,
        InterfaceListComponent,
        SettingsComponent,

        //------------------------------//
        FormItemComponent,
        ViewablePartComponent,
        ViewableTableComponent,
        ViewableFormComponent,

        //------------------------------//
        DesignWorkspaceComponent,
        DesignablePartComponent,
        DesignableFormItemComponent,
        DesignableTableComponent,
        DesignableButtonComponent,
        DesignableColumnListComponent,

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
        NgZorroAntdModule.forRoot()
    ],
    providers: [
        RamlService, ViewService, DesignService,
        TranslateService, I18nService, SettingsService, HttpService, MenuService,
        // {provide: MESSAGE_SOURCE_INJECTION_TOKEN, useValue: zh_CN}
    ],
    entryComponents: [InterfaceListComponent, ViewManagementComponent, ViewablePartComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
