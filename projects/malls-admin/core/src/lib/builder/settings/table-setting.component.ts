import {Component, Input} from '@angular/core';
import {Table} from '../../public/model';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">字段描述</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <input nz-input [(ngModel)]="value.bordered"/>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `
})
export class TableSettingComponent  {
    @Input()
    value: Table;

}
