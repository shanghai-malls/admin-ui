import {Component, Input} from '@angular/core';
import {DatePicker} from '../../../model/ui';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">字段描述</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <input nz-input [(ngModel)]="value.description"/>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">日期格式</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <input nz-input [(ngModel)]="value.format" />
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">是否必填</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-switch  [(ngModel)]="value.required"></nz-switch>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">开始时间</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-date-picker [(ngModel)]="value.startDate" [nzShowTime]="value.showTime" [nzDisabledDate]="value.disabledDate"></nz-date-picker>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">结束时间</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-date-picker [(ngModel)]="value.endDate"  [nzShowTime]="value.showTime" [nzDisabledDate]="value.disabledDate"></nz-date-picker>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">时间可选</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-switch  [(ngModel)]="value.showTime"></nz-switch>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `
})
export class DatePickerSettingComponent  {
    @Input()
    value: DatePicker;

}
