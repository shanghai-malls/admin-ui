import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {AbstractDesignerComponent, Row} from '../../public/model';

@Component({
    selector: 'd-row',
    templateUrl: './d-row.component.html',
    styleUrls: ['./d-row.component.less']
})
export class DRowComponent implements OnInit, AbstractDesignerComponent<Row> {


    @Input()
    row: Row;

    @Input()
    renderItem: TemplateRef<void>;

    @Input()
    endItem: TemplateRef<void>;

    constructor() {
    }

    ngOnInit() {
    }

    initComponent(component: Row) {
        this.row = component;
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
        if (y != null) {
            let start = this.row.children[x];
            this.row.children[x] = this.row.children[y];
            this.row.children[y] = start;
            return;
        }
    }

}
