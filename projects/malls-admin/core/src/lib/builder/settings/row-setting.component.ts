import {Component, Input, OnInit} from '@angular/core';
import {Row} from '../../public';

@Component({
    template: `
        <fieldset>
            <legend>栅格间距设置</legend>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                <div nz-col nzSpan="12" >
                    <nz-form-item>
                        <nz-form-label nzSpan="8">水平</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-slider [nzMin]="0" [nzMax]="24" [(ngModel)]="value.horizontal" ></nz-slider>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="12" >
                    <nz-form-item>
                        <nz-form-label nzSpan="8">垂直</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-slider [(ngModel)]="value.vertical" [nzMin]="0" [nzMax]="48" [nzStep]="3"></nz-slider>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </fieldset>
    `
})
export class RowSettingComponent implements OnInit{
    @Input()
    value: Row;


    ngOnInit(): void {

    }

}
