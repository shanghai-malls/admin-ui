import {Component, Input, OnInit} from '@angular/core';
import {AbstractDesignerComponent, List} from '../../public/model';

@Component({
    selector: 'd-list',
    templateUrl: './d-list.component.html',
    styleUrls: ['./d-list.component.less']
})
export class DListComponent implements OnInit, AbstractDesignerComponent<List> {
    @Input()
    list: List;

    constructor() {
    }

    ngOnInit() {
    }

    initComponent(component: List) {
        this.list = component;
    }


}
