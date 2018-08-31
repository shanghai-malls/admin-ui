import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Header} from '../../public/model';

@Component({
    selector: 'd-header',
    template: `
        <span [class.hide]="focused" (click)="focus()" class="keep-word">{{header.title}}</span>
        <input [class.hide]="!focused" style="min-width: 120px" nz-input [(ngModel)]="header.title" (blur)="blur()"
               (keydown.enter)="enter($event)" #input/>
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

    enter(event: KeyboardEvent){
        event.stopPropagation();
        this.blur();
        this.onEnter.emit(this);
    }

    blur() {
        this.focused = false;
        this.input.nativeElement.blur();
    }
}
