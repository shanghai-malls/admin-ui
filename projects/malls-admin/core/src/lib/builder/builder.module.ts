import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {PublicModule} from '../public/public.module';



import {DWorkspaceComponent} from './d-workspace/d-workspace.component';
import {DMainComponent} from './d-workspace/d-main.component';
import {DesignService} from './d-workspace/design.service';
import {DColumnListComponent} from './d-table/d-column-list.component';
import {DHeaderComponent} from './d-table/d-header.component';
import {DTableComponent} from './d-table/d-table.component';
import {DFormComponent} from './d-form/d-form.component';
import {DFormItemComponent} from './d-form/d-form-item.component';
import {DPartComponent} from './d-part/d-part.component';
import {DDetailComponent} from './d-detail/d-detail.component';
import {DButtonComponent} from './d-button/d-button.component';
import {DCardComponent} from './d-card/d-card.component';
import {DRowComponent} from './d-row/d-row.component';
import {DTabsetComponent} from './d-tabset/d-tabset.component';
import {ButtonSettingComponent} from './settings/button-setting.component';
import {ChoiceSettingComponent} from './settings/choice-setting.component';
import {DataPickerSettingComponent} from './settings/data-picker-setting.component';
import {RateSettingComponent} from './settings/rate-setting.component';
import {FormSettingComponent} from './settings/form-setting.component';
import {InputNumberSettingComponent} from './settings/input-number-setting.component';
import {DatePickerSettingComponent} from './settings/date-picker-setting.component';
import {RichTextSettingComponent} from './settings/rich-text-setting.component';
import {TextAreaSettingComponent} from './settings/text-area-setting.component';
import {SwitchSettingComponent} from './settings/switch-setting.component';
import {RowSettingComponent} from './settings/row-setting.component';
import {TableSettingComponent} from './settings/table-setting.component';
import {TextSettingComponent} from './settings/text-setting.component';
import {TimePickerSettingComponent} from './settings/time-picker-setting.component';
import {UploadPickerSettingComponent} from './settings/upload-picker-setting.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgZorroAntdModule,
        PublicModule,
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
        DCardComponent,
        DRowComponent,
        DTabsetComponent,


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
        DTabsetComponent,
        DCardComponent,
        DRowComponent,
    ],
    entryComponents: [
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
    ],
    providers: [DesignService],
    exports: [DWorkspaceComponent, DMainComponent]
})
export class BuilderModule {

}
