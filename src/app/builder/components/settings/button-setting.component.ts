import {Component, Input} from '@angular/core';
import {Button} from '../../../model/ui';
import {InterfaceListComponent} from '../../../main/management/interface/interface-list.component';
import {ViewManagementComponent} from '../../../main/management/view/view-management.component';

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
                                <label nz-radio nzValue="confirm">确认框</label>
                            </nz-radio-group>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="16" [class.hide]="value.triggerType === 'none' ">
                    <nz-form-item>
                        <nz-form-label nzSpan="4">接口/视图</nz-form-label>
                        <nz-form-control nzSpan="20">
                            <data-picker [view]="interfaceList" [(ngModel)]="value.path" [class.hide]="value.triggerType !== 'confirm'"
                                         placeholder="请选择接口" (ngModelChange)="selectInterface($event)"></data-picker>
                            <data-picker [view]="viewList" [(ngModel)]="value.path" [class.hide]="value.triggerType === 'confirm'"
                                         placeholder="请选择视图" referenceExp="path"></data-picker>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `,
    styles: [`
    `]
})
export class ButtonSettingComponent {
    @Input()
    value: Button;

    interfaceList = InterfaceListComponent;
    viewList = ViewManagementComponent;


    selectInterface(value) {
        let {path, method} = value;
        this.value.path = path;
        this.value.method = method;
    }
}
