import {Component, Input, OnInit} from '@angular/core';
import {AbstractDesignerComponent, Card} from '../../public/model';

@Component({
    selector: 'd-card',
    templateUrl: './d-card.component.html',
    styleUrls: ['./d-card.component.less']
})
export class DCardComponent implements OnInit, AbstractDesignerComponent<Card> {

    @Input()
    card: Card;


    focused: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    initComponent(component: Card) {
        this.card =component;
    }


    focus(title: HTMLInputElement) {
        this.focused = true;
        setTimeout(() => title.focus(), 50);
    }

    blur(title: HTMLInputElement) {
        this.focused = false;
        title.blur();
    }
}
