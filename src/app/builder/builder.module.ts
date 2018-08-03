import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {DPartComponent} from './components/d-part.component';
import {UploadPickerSettingComponent} from './components/settings/upload-picker-setting.component';
import {FormSettingComponent} from './components/settings/form-setting.component';
import {DWorkspaceComponent} from './d-workspace.component';
import {DHeaderComponent} from './components/d-header.component';
import {DColumnListComponent} from './components/d-column-list.component';
import {TextSettingComponent} from './components/settings/text-setting.component';
import {ChoiceSettingComponent} from './components/settings/choice-setting.component';
import {DFormItemComponent} from './components/d-form-item.component';
import {DTableComponent} from './components/d-table.component';
import {DatePickerSettingComponent} from './components/settings/date-picker-setting.component';
import {ButtonSettingComponent} from './components/settings/button-setting.component';
import {RowSettingComponent} from './components/settings/row-setting.component';
import {DDetailComponent} from './components/d-detail.component';
import {RichTextSettingComponent} from './components/settings/rich-text-setting.component';
import {ResizeDirective} from '../resize/resize.directive';
import {TimePickerSettingComponent} from './components/settings/time-picker-setting.component';
import {DButtonComponent} from './components/d-button.component';
import {RateSettingComponent} from './components/settings/rate-setting.component';
import {DataPickerSettingComponent} from './components/settings/data-picker-setting.component';
import {TableSettingComponent} from './components/settings/table-setting.component';
import {SwitchSettingComponent} from './components/settings/switch-setting.component';
import {InputNumberSettingComponent} from './components/settings/input-number-setting.component';
import {DFormComponent} from './components/d-form.component';
import {TextAreaSettingComponent} from './components/settings/text-area-setting.component';
import {DMainComponent} from './d-main.component';
import {ResizeModule} from '../resize/resize.module';
import {DataPickerModule} from '../datapicker/data-picker.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgZorroAntdModule,
        ResizeModule,
        DataPickerModule,
    ],
    declarations: [
        DWorkspaceComponent,
        DMainComponent,
        DFormComponent,
        DFormItemComponent,
        DPartComponent,
        DDetailComponent,
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
    ]
})
export class BuilderModule {

}
