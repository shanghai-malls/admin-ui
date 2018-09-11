import {Component, HostBinding, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Cell, Form, FormItem, Row} from '../../public/model';
import {ModalService} from '../../public/service/modal.service';

import {DFormItemComponent} from './d-form-item.component';
import {DesignerService} from '../../public/service/designer.service';
import {QueryFormSettingComponent} from '../settings/query-form-setting.component';

@Component({
    selector: 'd-query-form',
    templateUrl: 'd-query-form.component.html',
    styleUrls: ['d-query-form.component.less']
})
export class DQueryFormFormComponent implements OnInit{
    @Input()
    form: Form;


    @HostBinding('class.hide')
    get hide() {
        let {queryParameters, headers} = this.form;
        let length = 0;
        if(queryParameters) {
            length += queryParameters.children.length;
        }
        if(headers) {
            length += headers.children.length;
        }
        return length === 0;
    }

    doCollapse = true;
    markCollapseIndex:number;
    buttonGroupWidth = 8;


    constructor(private modalService: ModalService, public ds: DesignerService) {
    }

    ngOnInit(): void {
        this.toggleCollapse();
    }

    toggleCollapse() {
        if(this.form.queryParameters) {
            let sum = 0;
            let cells = this.form.queryParameters.children;
            //如果form可折叠，并且当前操作为折叠操作，则计算首行中按钮的宽度
            if(this.form.collapsible && this.doCollapse) {
                for (let i = 0; i < cells.length; i++) {
                    sum += cells[i].width;
                    if (sum >= 16) {
                        this.markCollapseIndex = i;
                        break;
                    }
                }
                this.buttonGroupWidth = 24 - sum;
            } else {
                this.markCollapseIndex = cells.length;
                for (let i = 0; i < cells.length; i++) {
                    let cell = cells[i];
                    sum += cell.width;
                }
                this.buttonGroupWidth = 24 - sum % 24;
            }
            this.doCollapse = !this.doCollapse;
        }
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



    showFormSetting() {
        this.modalService.openDesignSetting('设置查询表单', QueryFormSettingComponent, {value: this.form});
    }

    /**
     * 恢复隐藏的表单
     * @param cell
     */
    recover(cell: Cell<FormItem>) {
        cell.width = 8;
    }


    dragstart(y: number, event: DragEvent) {
        event.stopPropagation();
        event.dataTransfer.setData('index', y + '');
    }

    dragover(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();
    }

    drop(row: Row<FormItem>, x: number, event: DragEvent) {
        event.stopPropagation();
        let y = parseInt(event.dataTransfer.getData('index'));
        if (y != null) {
            let start = row.children[x];
            row.children[x] = row.children[y];
            row.children[y] = start;
            return;
        }
    }
}
