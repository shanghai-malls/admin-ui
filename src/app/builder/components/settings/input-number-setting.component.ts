import {Component, Input} from '@angular/core';
import {InputNumber} from '../../../model/ui';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                <div nz-col nzSpan="16">
                    <nz-form-item>
                        <nz-form-label nzSpan="4">字段描述</nz-form-label>
                        <nz-form-control nzSpan="20">
                            <input nz-input [(ngModel)]="value.description"/>
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
                        <nz-form-label nzSpan="8">间隔数</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.stride"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">最小值</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.min"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">最大值</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.max"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `,
    styles: [`
    `]
})
export class InputNumberSettingComponent  {
    @Input()
    value: InputNumber;

}
