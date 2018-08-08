import {NgModule} from '@angular/core';

import {BuilderModule} from './builder/builder.module';
import {ManagementModule} from './management/management.module';
import {RunnerModule} from './runner/runner.module';
import {PublicModule} from './public/public.module';

export * from './builder';
export * from './management';
export * from './runner';
export * from './public';


@NgModule({
    exports: [
        PublicModule,
        RunnerModule,
        BuilderModule,
        ManagementModule,
    ]
})
export class MallsAdminModule {

}
