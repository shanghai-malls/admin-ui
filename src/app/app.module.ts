import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';

import {MallsAdminModule, baseRoutes} from 'projects/malls-admin/core/src/lib/malls-admin.module';
// import {MallsAdminModule, baseRoutes} from '@malls-admin/core';
import {AppComponent} from './app.component';
import {PublicModule} from '../../projects/malls-admin/core/src/lib/public/public.module';
import {BuilderModule} from '../../projects/malls-admin/core/src/lib/builder/builder.module';
import {RunnerModule} from '../../projects/malls-admin/core/src/lib/runner/runner.module';
import {ManagementModule} from '../../projects/malls-admin/core/src/lib/management/management.module';

registerLocaleData(zh);


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        RouterModule.forRoot(baseRoutes, {onSameUrlNavigation: 'reload'}),
        NgZorroAntdModule,
        PublicModule,
        RunnerModule,
        BuilderModule,
        ManagementModule,
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {

}
