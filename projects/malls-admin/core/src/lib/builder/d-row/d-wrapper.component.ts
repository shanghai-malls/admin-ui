import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {Cell} from '../../public/model';
import {DesignerService} from '../../public/service/designer.service';
import {ResizeEvent} from '../../resize/resize.directive';

@Component({
    selector: 'd-wrapper',
    template: `
        <div class="height-100 min-h-63" resize (onResize)="doResize($event)" (onStopResize)="stopResize()" (click)="doSelect()">
            <ng-content></ng-content>
            <ul class="d-actions">
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


    @Output()
    onDelete:   EventEmitter<Cell> = new EventEmitter<Cell>();

    @HostBinding('class.d-selected')
    get isSelected() {
        return this.ds.isSelected(this.cell);
    }


    constructor(public ds: DesignerService){

    }


    triggerDelete(){
        this.cell.width = 0;
        this.onDelete.emit(this.cell);
    }


    triggerSetting(){
        this.ds.triggerSetting(this.cell);
    }

    doSelect(){
        this.ds.selectedCell(this.cell);
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
