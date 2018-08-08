import {Component, Input, OnInit} from '@angular/core';
import {Choice, Option} from '../../public';

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

                <div nz-col nzSpan="24">
                    <button nz-button [nzType]="'primary'" (click)="value.options.push({label:'文本', value: '值'})">添加选项</button>
                    <nz-table [nzData]="value.options" [nzBordered]="false" [nzShowPagination]="false">
                        <thead>
                        <tr>
                            <th nzShowExpand></th>
                            <th >选项文本</th>
                            <th >选项值</th>
                            <th style="max-width: 150px">操作</th>
                        </tr>
                        </thead>
                        <tbody >
                        <ng-template #optionTpl let-options="options" let-level="level">
                            <ng-container *ngFor="let option of options; let i = index">
                                <tr>
                                    <td [nzShowExpand]="option.children" [(nzExpand)]="option.expand"></td>
                                    <td [nzIndentSize]="level*30" >
                                        <input nz-input [(ngModel)]="option.label" style="width: 60%"/>
                                    </td>
                                    <td>
                                        <input nz-input [(ngModel)]="option.value" style="width: 60%"/>
                                    </td>
                                    <td>
                                        <a (click)="addSubOption(option)" *ngIf="value.type === 'cascader' ">添加子选项</a>
                                        &nbsp;&nbsp;&nbsp;
                                        <a (click)="options.splice(i, 1)"> 删除</a>
                                    </td>
                                </tr>
                                <ng-container *ngIf="option.expand">
                                    <ng-container *ngTemplateOutlet="optionTpl;context:{options: option.children, level: level + 1 }"></ng-container>
                                </ng-container>
                            </ng-container>
                        </ng-template>
                        <ng-container *ngTemplateOutlet="optionTpl;context:{options: value.options, level: 0 }"></ng-container>
                        </tbody>
                    </nz-table>
                </div>
            </div>
        </div>
    `
})
export class ChoiceSettingComponent implements OnInit{
    @Input()
    value: Choice;

    ngOnInit(): void {
        if(!this.value.options) {
            this.value.options = [...Choice.DEFAULT_OPTIONS];
        }
    }


    addSubOption(option: Option) {
        if(!option.children) {
            option.children = [];
        }

        option.children.push({label: '子选项文本', value: '子选项值'});
    }
}
