import {Component, Input} from '@angular/core';
import {Button} from '../../public/model';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">按钮文本</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <input nz-input [(ngModel)]="value.text"/>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="16">
                    <nz-form-item>
                        <nz-form-label nzSpan="4">按钮描述</nz-form-label>
                        <nz-form-control nzSpan="20">
                            <textarea nz-input [(ngModel)]="value.description" nzAutosize="false"></textarea>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">按钮样式</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-radio-group [(ngModel)]="value.classType">
                                <label nz-radio nzValue="primary">主按钮</label>
                                <label nz-radio nzValue="default">次按钮</label>
                                <label nz-radio nzValue="dashed">虚线按钮</label>
                                <label nz-radio nzValue="danger">危险按钮</label>
                            </nz-radio-group>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">触发动作</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-radio-group [(ngModel)]="value.triggerType">
                                <label nz-radio nzValue="none">内建实现</label>
                                <label nz-radio nzValue="link">跳&nbsp;&nbsp;&nbsp;&nbsp;转</label>
                                <label nz-radio nzValue="modal">模态框</label>
                            </nz-radio-group>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="16" *ngIf="value.triggerType === 'link' || value.triggerType === 'modal'">
                    <nz-form-item>
                        <nz-form-label nzSpan="4">接口/视图</nz-form-label>
                        <nz-form-control nzSpan="20">
                            <data-picker viewPath="/management/views" objectPath="path" placeholder="请选择视图" [(ngModel)]="value.path"></data-picker>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `
})
export class ButtonSettingComponent{
    @Input()
    value: Button;
}
