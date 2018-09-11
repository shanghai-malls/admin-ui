import {EventEmitter, Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd';
import {Cell, Component, Component as UIComponent, FormItem} from '../model';

@Injectable({providedIn: 'root'})
export class DesignerService {

    private cell: Cell;


    constructor(private messageService: NzMessageService) {
    }

    selectedCell(cell: Cell) {
        if(this.cell == cell) {
            cell = null;
        }
        this.cell = cell;
    }

    isSelected(cell: Cell) {
        return this.cell === cell;
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


    onSetting:  EventEmitter<Cell> = new EventEmitter<Cell>();

    triggerSetting(cell: Cell) {
        this.onSetting.emit(cell);
    }

    subscribeOnSetting(next?: (value: Cell) => void, error?: (error: any) => void, complete?: () => void) : Subscription{
        return this.onSetting.subscribe(next, error, complete);
    }
}

