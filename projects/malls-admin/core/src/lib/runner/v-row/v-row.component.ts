import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {AbstractComponent, Row} from '../../public/model';

@Component({
    selector: 'v-row',
    templateUrl: './v-row.component.html',
    styleUrls: ['./v-row.component.less']
})
export class VRowComponent implements OnInit, AbstractComponent<Row> {

    @Input()
    row: Row;

    @Input()
    path: string;

    @Input()
    route: string;

    @Input()
    renderItem?: TemplateRef<void>;

    @Input()
    endItem: TemplateRef<void>;

    constructor() {
    }

    ngOnInit() {
    }

    initComponent(component: Row, path: string, route: string) {
        this.row = component;
        this.path = path;
        this.route = route;
    }

}
