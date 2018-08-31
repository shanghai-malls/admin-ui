import {Component, Input} from '@angular/core';
import {DisplayText} from '../../public/model';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                <div nz-col nzSpan="24">
                    <nz-form-item>
                        <nz-form-label nzSpan="4" >文本内容</nz-form-label>
                        <nz-form-control nzOffset="1" nzSpan="16">
                            <input nz-input [(ngModel)]="value.value"/>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `
})
export class DisplayTextSettingComponent  {
    @Input()
    value: DisplayText;

}
