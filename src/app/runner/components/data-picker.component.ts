import {Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, Type} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ModalService} from '../../model/modal.service';
import {ViewService} from '../../model/view.service';
import {Table} from '../../model/ui';
import {NzMessageService} from 'ng-zorro-antd';
import {VTableComponent} from './v-table.component';

@Component({
    selector: 'data-picker',
    templateUrl: 'data-picker.component.html',
    styleUrls: ['data-picker.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DataPickerComponent),
        multi: true
    }]
})
export class DataPickerComponent implements OnInit, OnChanges, ControlValueAccessor {

    value: any;

    hover: boolean;

    disabled: boolean;

    onChange = (value: any) => {};

    onTouched = () => {};


    @Input()
    editable = false;

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
