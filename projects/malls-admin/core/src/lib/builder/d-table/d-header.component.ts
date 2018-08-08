import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Header} from '../../public';

@Component({
    selector: 'd-header',
    template: `
        <span [class.hide]="focused" (click)="focus()">{{header.title}}</span>
        <input [class.hide]="!focused" style="min-width: 150px" nz-input [(ngModel)]="header.title" (blur)="blur()" (keydown)="keydown($event)"  #input/>
    `,
    styleUrls: ['../../base.less']
})
export class DHeaderComponent {
    @Input()
    header: Header;
    focused = false;

    @ViewChild("input")
    input: ElementRef;

    @Output()
    onEnter: EventEmitter<DHeaderComponent> = new EventEmitter<DHeaderComponent>();

    focus() {
        this.focused = true;
        setTimeout(() => this.input.nativeElement.focus(), 50);
    }

    keydown(event: KeyboardEvent){
        event.stopPropagation();
        if(event.key === 'Enter') {
            this.blur();
            this.onEnter.next(this);
        }
    }

    blur() {
        this.focused = false;
        this.input.nativeElement.blur();
    }
}
