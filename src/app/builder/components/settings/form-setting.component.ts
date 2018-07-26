import {Component, Input} from '@angular/core';
import {Form} from '../../../model/ui';
import {InterfaceListComponent} from '../../../main/management/interface/interface-list.component';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">

                <div nz-col nzSpan="12">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">数据加载接口</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <data-picker [view]="viewType" [placeholder]="'请选择数据加载接口'" [(ngModel)]="value.autoLoadUrl" referenceExp="path"></data-picker>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="12">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">数据提交接口</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <data-picker [view]="viewType" [placeholder]="'请选择数据提交接口'" [(ngModel)]="value.path"
                                         (ngModelChange)="selectSubmit($event)"></data-picker>
                        </nz-form-control>
                    </nz-form-item>
                </div>


                <div nz-col nzSpan="12">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">是否可折叠</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-switch [(ngModel)]="value.collapsible"></nz-switch>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="24">

                    <fieldset>
                        <legend>栅格间距设置</legend>
                        <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                            <div nz-col nzSpan="12">
                                <nz-form-item>
                                    <nz-form-label nzSpan="8">水平</nz-form-label>
                                    <nz-form-control nzSpan="16">
                                        <nz-slider [nzMin]="0" [nzMax]="24" [(ngModel)]="value.horizontal"></nz-slider>
                                    </nz-form-control>
                                </nz-form-item>
                            </div>
                            <div nz-col nzSpan="12">
                                <nz-form-item>
                                    <nz-form-label nzSpan="8">垂直</nz-form-label>
                                    <nz-form-control nzSpan="16">
                                        <nz-slider [(ngModel)]="value.vertical" [nzMin]="0" [nzMax]="48" [nzStep]="3"></nz-slider>
                                    </nz-form-control>
                                </nz-form-item>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>
    `,
})
export class FormSettingComponent  {
    @Input()
    value: Form;
    viewType = InterfaceListComponent;


    selectSubmit(event:any){
        let {method, path, contentType} = event;
        this.value.method = method;
        this.value.path = path;
        this.value.contentType = contentType;
    }
}
