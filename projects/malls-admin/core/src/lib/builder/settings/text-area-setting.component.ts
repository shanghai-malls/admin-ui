import {Component, Input} from '@angular/core';
import {TextArea} from '../../public/model';

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
                        <nz-form-label nzSpan="8">正则表达式</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.pattern"></nz-input-number>
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
                        <nz-form-label nzSpan="8">最大长度</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.maxLength"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">最小长度</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.minLength"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">高度自适应</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-switch  [(ngModel)]="value.auto"></nz-switch>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="8" *ngIf="!value.auto">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">最多几行</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.maxRows"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8" *ngIf="!value.auto">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">最少几行</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.minRows"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `
})
export class TextAreaSettingComponent  {
    @Input()
    value: TextArea;

}
