import {Component, Input} from '@angular/core';
import {Switch} from '../../public/model';

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
                        <nz-form-label nzSpan="8">是否必填</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-switch [(ngModel)]="value.required"></nz-switch>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">外观模式</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-radio-group [(ngModel)]="value.mode">
                                <label nz-radio nzValue="switch">开关</label>
                                <label nz-radio nzValue="checkbox">复选框</label>
                            </nz-radio-group>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `
})
export class SwitchSettingComponent {
    @Input()
    value: Switch;

}
