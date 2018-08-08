import {Component, HostBinding, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Cell, Component as UIComponent, extractUriVariables, Form, FormItem, ModalService, ResizeEvent} from '../../public';
import {DFormItemComponent} from './d-form-item.component';
import {NzMessageService} from 'ng-zorro-antd';
import {FormSettingComponent} from '../settings/form-setting.component';
import {DatePickerSettingComponent} from '../settings/date-picker-setting.component';
import {RateSettingComponent} from '../settings/rate-setting.component';
import {InputNumberSettingComponent} from '../settings/input-number-setting.component';
import {UploadPickerSettingComponent} from '../settings/upload-picker-setting.component';
import {RichTextSettingComponent} from '../settings/rich-text-setting.component';
import {TextSettingComponent} from '../settings/text-setting.component';
import {TextAreaSettingComponent} from '../settings/text-area-setting.component';
import {DataPickerSettingComponent} from '../settings/data-picker-setting.component';
import {SwitchSettingComponent} from '../settings/switch-setting.component';
import {TimePickerSettingComponent} from '../settings/time-picker-setting.component';
import {ChoiceSettingComponent} from '../settings/choice-setting.component';
import {DesignService} from '../d-workspace/design.service';

@Component({
    selector: 'd-form',
    templateUrl: 'd-form.component.html',
    styleUrls: ['d-form.component.less']
})
export class DFormComponent implements OnInit {
    @Input()
    form: Form;

    variables: string[];

    markCollapseIndex = 0;
    buttonGroupWidth = 0;

    @HostBinding('class.hide')
    get hide() {
        return this.form.children.length === 0;
    }

    constructor(private messageService: NzMessageService, private modalService: ModalService, private designService: DesignService) {
    }

    ngOnInit(): void {
        this.variables = extractUriVariables(this.form.path);
        this.processForm();

        this.markCollapseIndex = this.form.children.length;
        this.toggleCollapse();
    }

    processForm() {
        this.form.children = this.form.children.filter(cell => {
            let formItem = cell.content as FormItem;
            let type = formItem.type;
            if (type === 'fieldset' || type === 'array' || type === 'map') {
                console.warn(`不支持${formItem.type}类型的表单项`);
                return false;
            }
            return true;
        });
        for (let cell of this.form.children) {
            let formItem = cell.content as FormItem;
            if (formItem.type === 'date' || formItem.type === 'date-range'
                || formItem.type === 'rich-text' || formItem.type === 'textarea'
                || formItem.type === 'cascader' || formItem.type === 'checkbox') {
                cell.content = UIComponent.create(formItem);
            }

            if (this.variables) {
                let parts = formItem.field.split('.');
                for (let part of parts) {
                    if (this.variables.indexOf(part) != -1) {
                        cell.width = 0;
                    }
                }
            }
        }
    }

    toggleCollapse() {
        let collapsible = this.form.collapsible;
        let buttonsPlacement = this.form.buttonsPlacement;
        if (collapsible && buttonsPlacement === 'line-end') {
            let doCollapse = this.markCollapseIndex === this.form.children.length;
            let sum = 0;
            if (doCollapse) {
                for (let i = 0; i < this.form.children.length; i++) {
                    sum += this.form.children[i].width;
                    if (sum >= 16) {
                        this.markCollapseIndex = i;
                        this.buttonGroupWidth = 24 - sum;
                        break;
                    }
                }
            } else {
                this.markCollapseIndex = this.form.children.length;
                for (let i = 0; i < this.form.children.length; i++) {
                    let cell = this.form.children[i];
                    sum += cell.width;
                }
                this.buttonGroupWidth = 24 - sum % 24;
            }
        } else if (buttonsPlacement === 'footer') {
            this.buttonGroupWidth = 24;
        }
    }


    dragstart(y: number, event: DragEvent) {
        event.stopPropagation();
        event.dataTransfer.setData('index', y + '');
    }

    dragover(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();
    }

    drop(x: number, event: DragEvent) {
        event.stopPropagation();
        let y = parseInt(event.dataTransfer.getData('index'));
        if (y) {
            let start = this.form.children[x];
            this.form.children[x] = this.form.children[y];
            this.form.children[y] = start;
            return;
        }
        let type = event.dataTransfer.getData('componentType');
        if (type) {
            let target = this.form.children[x];
            if (target.content) {
                target.content.type = type;
            } else {
                target.content = UIComponent.create({type});
            }
        }
    }

    inDesigning: boolean;
    currentSelected: Cell;

    select(x: number) {
        let cell = this.form.children[x];
        if (this.designService.isSelected(cell)) {
            this.designService.selectedCell(null);
            this.currentSelected = null;
        } else {
            this.designService.selectedCell(cell);
            this.currentSelected = cell;
        }
        this.inDesigning = this.designService.isSelected(cell);
    }

    focused: boolean;

    focus(title: HTMLInputElement) {
        this.focused = true;
        setTimeout(() => title.focus(), 50);
    }

    blur(title: HTMLInputElement) {
        this.focused = false;
        title.blur();
    }


    @ViewChildren(DFormItemComponent)
    viewChildren: QueryList<DFormItemComponent>;

    focusChild(child: DFormItemComponent) {
        let children = this.viewChildren.toArray();
        let index = children.findIndex(item => item === child);
        if (index < children.length - 1) {
            children[index + 1].focus();
        }
    }


    doResize({moveX, hostElement}: ResizeEvent, cell: any) {
        let unitWidth = hostElement.parentElement.parentElement.clientWidth / 24;
        let moveSpan = Math.round(moveX / unitWidth);
        if (!cell.startWidth) {
            cell.startWidth = cell.width;
        }
        if (cell.startWidth + moveSpan <= 24) {
            cell.width = cell.startWidth + moveSpan;
        }

        console.log(cell.width);
    }

    stopResize(cell: any) {
        delete cell.startWidth;
    }


    showFormSetting() {
        let title = '设置表单';
        let params = {value: this.form};

        this.modalService.openDesignSetting(title, FormSettingComponent, params);
    }

    recover(item: Cell) {
        item.width = 8;
        (<FormItem>item.content).hide = false;
    }

    deleteFormItem(formItem: FormItem, cell: any) {
        formItem.hide = true;
        (cell as Cell).width = 0;
    }


    settings = {
        'cascader': ChoiceSettingComponent,
        'select': ChoiceSettingComponent,
        'radio': ChoiceSettingComponent,
        'checkbox': ChoiceSettingComponent,
        'data-picker': DataPickerSettingComponent,
        'date': DatePickerSettingComponent,
        'date-range': DatePickerSettingComponent,
        'time': TimePickerSettingComponent,
        'number': InputNumberSettingComponent,
        'slider': InputNumberSettingComponent,
        'rate': RateSettingComponent,
        'rich-text': RichTextSettingComponent,
        'switch': SwitchSettingComponent,
        'textarea': TextAreaSettingComponent,
        'text': TextSettingComponent,
        'upload-picker': UploadPickerSettingComponent
    };

    showFormItemSetting(item: FormItem) {
        if (item) {
            let title = '设置表单字段' + item.label;
            let componentType = this.settings[item.type];
            let params = {value: item};

            this.modalService.openDesignSetting(title, componentType, params);
        }
    }
}
