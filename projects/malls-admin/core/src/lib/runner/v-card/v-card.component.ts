import {Component, OnInit} from '@angular/core';
import {AbstractComponent, Card} from '../../public/model';

@Component({
    selector: 'v-card',
    templateUrl: './v-card.component.html',
    styleUrls: ['./v-card.component.less']
})
export class VCardComponent implements OnInit, AbstractComponent<Card> {

    constructor() {
    }

    ngOnInit() {
    }

    initComponent(component: Card, path: string, route: string) {
        this.ngOnInit();
    }


}
