import {Component, Input} from '@angular/core';
import {UploadPicker} from '../../../model/ui';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">字段描述</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <input nz-input [(ngModel)]="value.listType"/>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">正则表达式</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.listType"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">是否必填</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-switch  [(ngModel)]="value.listType"></nz-switch>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">最大长度</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.listType"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">最小长度</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.listType"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `,
    styles: [`
    `]
})
export class UploadPickerSettingComponent  {
    @Input()
    value: UploadPicker;

}
