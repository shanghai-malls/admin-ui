import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ModalService} from '../public/service/modal.service';
import {ViewService} from '../public/service/view.service';
import {RouterService} from '../public/service/router.service';

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
    styleUrls: ['./data-picker.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DataPickerComponent),
        multi: true
    }]
})
export class DataPickerComponent implements ControlValueAccessor {

    innerValue: any;

    disabled: boolean;

    onChange = (value?: any) => {};

    onTouched = () => {};


    @Input()
    placeholder?: string = '请选择数据';

    @Input()
    objectPath?: string;

    @Input()
    viewPath: string;

    @Output()
    onSelected = new EventEmitter<any>();

    constructor(private modalService: ModalService, private viewService: ViewService, private router:  RouterService) {

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
        let onClose = new EventEmitter<any>();
        let componentType = this.router.getComponent(this.viewPath);
        this.modalService.create<any>({
            nzTitle: this.placeholder,
            nzContent: componentType,
            nzComponentParams: {path: this.viewPath},
            nzWrapClassName: 'data-picker-modal',
            nzAfterClose: onClose,
            nzFooter: null,
        });

        onClose.subscribe(value=>{
            this.onSelected.emit(value);
            if (this.objectPath) {
                let parts = this.objectPath.split('.');
                for (let part of parts) {
                    value = value[part];
                }
            }
            this.value = value;
        })
    }


    doTouched() {
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
        this.innerValue = obj;
    }

}
