import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Route, RouterModule} from '@angular/router';
import {MainComponent} from './workspace/main/main.component';
import {WorkspaceComponent} from './workspace/workspace.component';
import {HeaderComponent} from './workspace/header/header.component';
import {FooterComponent} from './workspace/footer/footer.component';
import {SiderComponent} from './workspace/sider/sider.component';
import {TableComponent} from './workspace/main/components/table.component';
import {DetailComponent} from './workspace/main/components/detail.component';
import {FormItemComponent} from './workspace/main/components/form-item.component';
import {StartupService} from './model/startup.service';

const routes: Route[] = [
    {component: MainComponent, path: '**'},
];


@NgModule({
    declarations: [
        AppComponent,
        WorkspaceComponent,
        HeaderComponent,
        SiderComponent,
        FooterComponent,
        MainComponent,
        TableComponent,
        DetailComponent,
        FormItemComponent
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
    providers: [StartupService,{provide: NZ_I18N, useValue: zh_CN}],
    entryComponents: [TableComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
