import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractDesignerComponent, Cell} from '../../public/model';
import {DesignService} from '../../public/service/design.service';
import {ResizeEvent} from '../../resize/resize.directive';

@Component({
    selector: 'd-wrapper',
    template: `
        <div class="height-100" resize (onResize)="doResize($event)" (onStopResize)="stopResize()" (click)="doSelect()">
            <ng-content></ng-content>
            <ul class="d-actions" [class.visible]="ds.isSelected(cell)">
                <li><i class="anticon anticon-setting"  (click)="triggerSetting()"  [class.disabled]="cell.content == null"></i></li>
                <li><i class="anticon anticon-delete"   (click)="triggerDelete()"   ></i></li>
            </ul>
        </div>
    `,
    styleUrls:['./d-wrapper.component.less']
})
export class DWrapperComponent {

    @Input()
    cell: Cell;

    @Input()
    content: AbstractDesignerComponent;

    @Output()
    onSetting:  EventEmitter<Cell> = new EventEmitter<Cell>();

    @Output()
    onDelete:   EventEmitter<Cell> = new EventEmitter<Cell>();


    constructor(public ds: DesignService){

    }



    triggerDelete(){
        this.cell.width = 0;
        this.onDelete.emit(this.cell);
    }


    triggerSetting(){
        this.onSetting.emit(this.cell);
        if(this.content) {
            let fun = this.content.doSetting;
            if(fun instanceof Function){
                this.content.doSetting(this.cell);
            }
        }
    }

    doSelect(){
        let current = this.cell;
        let prev = this.ds.getSelected();
        if(prev === current) {
            current = null;
        }
        this.ds.selectedCell(current);
    }


    startWidth: number;

    doResize({moveX, hostElement}: ResizeEvent) {
        let row= hostElement.parentElement;
        while(row) {
            if(row.hasAttribute('nz-row') || row.tagName === 'nz-row') {
                break;
            }
            row = row.parentElement;
        }

        let unitWidth = row.clientWidth / 24;

        let moveSpan = Math.round(moveX / unitWidth);
        if (!this.startWidth) {
            this.startWidth = this.cell.width;
        }
        if (this.startWidth + moveSpan <= 24) {
            this.cell.width = this.startWidth + moveSpan;
        }
    }


    stopResize() {
        delete this.startWidth;
    }

}
