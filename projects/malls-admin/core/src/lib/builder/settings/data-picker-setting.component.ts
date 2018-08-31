import {Component, Input, Type} from '@angular/core';
import {DataPicker} from '../../public/model';
import {ViewManagementComponent} from '../../management/view/view-management.component';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                <div nz-col nzSpan="12">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">字段描述</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <input nz-input [(ngModel)]="value.description"/>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="12">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">是否必填</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-switch [(ngModel)]="value.required"></nz-switch>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="12">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">引用表达式</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <input nz-input [(ngModel)]="value.objectPath"/>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">选择数据列表</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <data-picker viewPath="/management/views" objectPath="path" placeholder="请选择一个视图" [(ngModel)]="value.viewPath"></data-picker>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `
})
export class DataPickerSettingComponent {
    @Input()
    value: DataPicker;
}
