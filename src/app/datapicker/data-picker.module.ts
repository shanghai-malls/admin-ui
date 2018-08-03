import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataPickerComponent} from './data-picker.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
    ],
    declarations: [
        DataPickerComponent,
    ],
    exports: [
        DataPickerComponent,
    ]
})
export class DataPickerModule {

}
