import {Component, Input, OnInit, Type} from '@angular/core';
import {Form, FormBody} from '../../public/model';
import {InterfaceListComponent} from '../../management/interface/interface-list.component';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                <ng-container *ngIf="value.queryParameters">
                    <div nz-col nzSpan="12" >
                        <nz-form-item>
                            <nz-form-label nzSpan="8" >
                                <div class="wrap-label">
                                    form表单查询参数
                                </div>
                            </nz-form-label>
                            <nz-form-control nzSpan="16">
                                <data-picker viewPath="/management/interfaces"  objectPath="path" placeholder="请选择数据加载接口"
                                             [(ngModel)]="value.queryParameters.autoLoader.url" (onSelected)="urlChange($event, value.queryParameters)"></data-picker>
                                <input [(ngModel)]="value.queryParameters.autoLoader.accept" nz-input readonly/>
                            </nz-form-control>
                        </nz-form-item>
                    </div>
                </ng-container>
                <ng-container *ngIf="value.body">
                    <ng-container *ngFor="let item of value.body">
                        <div nz-col nzSpan="12" >
                            <nz-form-item>
                                <nz-form-label nzSpan="8" >
                                    <div class="wrap-label">
                                        请求体{{item.contentType}}
                                    </div>
                                </nz-form-label>
                                <nz-form-control nzSpan="16">
                                    <data-picker viewPath="/management/interfaces"  objectPath="path" placeholder="请选择数据加载接口"
                                                 [(ngModel)]="item.autoLoader.url" (onSelected)="urlChange($event, item)"></data-picker>
                                    <input [(ngModel)]="item.autoLoader.accept" nz-input readonly/>
                                </nz-form-control>
                            </nz-form-item>
                        </div>
                    </ng-container>
                </ng-container>

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
            </div>
        </div>
    `,
})
export class FormSettingComponent  implements OnInit{

    @Input()
    value: Form;


    ngOnInit(): void {
        if(this.value.headers) {
            this.value.headers.autoLoader = this.value.headers.autoLoader || {};
        }
        if(this.value.queryParameters) {
            this.value.queryParameters.autoLoader = this.value.queryParameters.autoLoader || {};
        }
        if(this.value.body) {
            for (let item of this.value.body) {
                item.autoLoader = item.autoLoader || {};
            }
        }
    }

    spacingChange(value: number, field: string){
        if(this.value.headers) {
            this.value.headers[field] = value;
        }
        if(this.value.queryParameters) {
            this.value.queryParameters[field] = value;
        }
        if(this.value.body) {
            for (let item of this.value.body) {
                item.children[field] = value;
            }
        }
    }

    urlChange(value: any, formBody: FormBody){
        formBody.autoLoader.accept = value.accept;
    }
}
