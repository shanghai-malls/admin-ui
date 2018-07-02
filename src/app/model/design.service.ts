import {Injectable} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {Cell, Component, FormItem} from './ui';

@Injectable()
export class DesignService {

    private cell: Cell;


    constructor(private messageService: NzMessageService) {
    }

    selectedCell(cell: Cell) {
        this.cell = cell;
    }

    isSelected(cell: Cell) {
        return this.cell === cell;
    }

    addComponentToCell(type: string) {
        if (this.cell) {
            try {
                let definition = Component.create({type});
                this.cell.children = [definition];
                if (definition instanceof FormItem) {
                    if (this.cell.children && this.cell.children.length > 0) {
                        let child = this.cell.children[0] as FormItem;
                        Object.assign(definition, {field: child.field, label: child.label});
                    }
                }
                if (type === 'map' || type === 'fieldset' || type === 'array' || type === 'form') {
                    this.cell.width = 24;
                }
            } catch (e) {
                this.messageService.error(e.message);
            }
            console.log(this.cell);
        } else {
            this.messageService.warning("请先在工作台选中容器")
        }
    }

}

