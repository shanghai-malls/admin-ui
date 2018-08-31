import {Injectable} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {Cell, Component, Component as UIComponent, FormItem} from '../model';

@Injectable({providedIn: 'root'})
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

    getSelected(){
        return this.cell;
    }

    addComponentToCell(type: string) {
        try {
            if(type && this.cell) {
                if(this.cell.content) {
                    if(this.cell.content.hasOwnProperty('field')) {
                        let {field, label, description, value, required,width} = this.cell.content as FormItem;
                        this.cell.content = Component.create({field, label, description, value, required, width, type});
                    }
                } else {
                    this.cell.content = UIComponent.create({type});
                }
            }
        } catch (e) {
            this.messageService.error(e.message);
        }
    }

}

