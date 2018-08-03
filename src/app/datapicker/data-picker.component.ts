import {Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, Type} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ModalService} from '../model/modal.service';
import {ViewService} from '../model/view.service';
import {Table} from '../model/ui';
import {NzMessageService} from 'ng-zorro-antd';
import {VTableComponent} from '../main/runner/components/v-table.component';

@Component({
    selector: 'data-picker',
    template: `
        <nz-input-group [nzSuffix]="inputSuffix">
            <input nz-input [placeholder]="placeholder" (blur)="doTouched()" [(ngModel)]="value"/>
        </nz-input-group>
        <ng-template #inputSuffix>
            <i class="anticon lighter-icon anticon-filter" (click)="showReferenceDialog()"></i>
        </ng-template>
    `,
    styleUrls: ['../base.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DataPickerComponent),
        multi: true
    }]
})
export class DataPickerComponent implements OnInit, OnChanges, ControlValueAccessor {

    innerValue: any;

    disabled: boolean;

    onChange = (value: any) => {};

    onTouched = () => {};


    @Input()
    placeholder?: string = '请选择数据';

    @Input()
    view: Type<any> | string;

    @Input()
    referenceExp?: string;

    table: Table;


    constructor(private modalService: ModalService, private viewService: ViewService, private messageService: NzMessageService) {

    }

    ngOnInit(): void {
        if (this.view instanceof String) {
            this.viewService.getCompatibleView(this.view as string).then(view => {
                if (view.data.type === 'table') {
                    this.table = view.data as Table;
                } else {
                    this.messageService.error('无法选择目标视图');
                }
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.ngOnInit();
    }


    get value() {
        return this.innerValue;
    }

    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChange(v);
        }
    }


    showReferenceDialog() {

        let content, params: any = {mode: 'select'};
        if (this.view instanceof String) {
            content = VTableComponent;
            Object.assign(params,{
                table: this.table,
                route: this.view
            });
        } else {
            content = this.view;
        }

        let agent = this.modalService.create<any>({
            nzTitle: this.placeholder,
            nzContent: content,
            nzComponentParams: params,
            channels: {
                onSelect: (value: any) => {
                    if(this.referenceExp) {
                        let parts = this.referenceExp.split('.');
                        for (let part of parts) {
                            value = value[part];
                        }
                    }
                    this.value = value;
                    this.onChange(value);
                    agent.destroy();
                }
            },
            nzBodyStyle: {
                'background': '#f5f5f5'
            },
            nzFooter: null,
        });
    }

    doClear() {
        if(this.value) {
            this.onChange(null);
            this.value = null;
        }
    }

    doTouched(){
        this.onTouched();
    }


    registerOnChange(fn: (value: any) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: (value?: any) => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: any): void {
        this.value = obj;
    }

}
