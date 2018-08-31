import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';

import {MacComponent, MacModule} from 'projects/malls-admin/core/src/lib/public_api';
import {MyFormViewProcess} from './my-form-view-process';
import {HelloComponent} from './hello/hello.component';

// from '@malls-admin/core';


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot([{path: '', component: MacComponent}]),
        NgZorroAntdModule,
        MacModule.forRoot({formViewProcessor: MyFormViewProcess, endpointOfRaml: '/api/api.json'}),
    ],
    declarations: [
        AppComponent,
        HelloComponent,
    ],
    entryComponents: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {

}

