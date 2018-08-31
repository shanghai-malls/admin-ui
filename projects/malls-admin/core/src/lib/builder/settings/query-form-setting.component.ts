import {Component, Input} from '@angular/core';
import {Form} from '../../public/model';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">

                <div nz-col nzSpan="12">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">水平间隔距离</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-slider [nzMin]="0" [nzMax]="24" [(ngModel)]="value.horizontal"
                                       (ngModelChange)="spacingChange($event, 'horizontal')"></nz-slider>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">垂直间隔距离</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-slider [nzMin]="0" [nzMax]="48" [nzStep]="3" [(ngModel)]="value.vertical"
                                       (ngModelChange)="spacingChange($event, 'vertical')"></nz-slider>
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
            </div>
        </div>
    `,
})
export class QueryFormSettingComponent {
    @Input()
    value: Form;


    spacingChange(value: number, field: string){
        if(this.value.headers) {
            this.value.headers[field] = value;
        }
        if(this.value.queryParameters) {
            this.value.queryParameters[field] = value;
        }
    }
}
