import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';

import {MacComponent, MacModule} from 'projects/malls-admin/core/src/lib/public_api';
import {HelloComponent} from './hello/hello.component';
import {WORKSPACE_CUSTOMIZER} from '../../projects/malls-admin/core/src/lib/public/service/workspace-customizer';
import {MyWorkspaceCustomizer} from './my-workspace-customizer';


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot([{path: '', component: MacComponent}]),
        NgZorroAntdModule,
        MacModule.forRoot({endpointOfRaml: '/api/api.json'}),
    ],
    providers: [
        {provide: WORKSPACE_CUSTOMIZER, useClass: MyWorkspaceCustomizer},
    ],
    declarations: [
        AppComponent,
        HelloComponent,
    ],
    entryComponents: [HelloComponent],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {

}
