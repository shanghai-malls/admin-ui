import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormItem} from '../../model/ui';
import {ResizeEvent} from './resize.directive';

@Component({
    selector: 'd-form-item',
    template: `
        <nz-form-item nzFlex>
            <nz-form-label [nzSpan]="24 - item.width">
                <span class="form-label" resize (onResize)="doResize($event)">
                    <input #labelText nz-input [(ngModel)]="item.label" placeholder="请输入label" (blur)="blur()" (keydown)="keydown($event)"  [class.hide]="!focused"/>
                    <span (click)="focus()" [class.hide]="focused" [class.required]="item.required" class="label">{{item.label || item.field || 'label'}}</span>
                </span>
            </nz-form-label>
            <nz-form-control [nzSpan]="item.width">
                <ng-content></ng-content>
            </nz-form-control>
        </nz-form-item>
    `,
    styleUrls:['d-form-item.component.less']
})
export class DFormItemComponent {
    private readonly el: HTMLElement;

    @Input()
    item: FormItem;


    @Output()
    onEnter: EventEmitter<DFormItemComponent> = new EventEmitter<DFormItemComponent>();

    focused = false;

    startWidth: number;

    @ViewChild("labelText")
    labelText: ElementRef;


    constructor(private elementRef: ElementRef){
        this.el = elementRef.nativeElement;
    }


    focus() {
        this.focused = true;
        setTimeout(() => this.labelText.nativeElement.focus(), 50);
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
        this.labelText.nativeElement.blur();
    }


    doResize({moveX}:ResizeEvent){

        let unitWidth = this.el.clientWidth / 24;
        let moveSpan = Math.round(moveX/unitWidth);

        if(!this.startWidth) {
            this.startWidth = this.item.width;
        }

        let newWidth = this.startWidth - moveSpan;

        if(newWidth > 5 && newWidth < 24) {
            this.item.width = newWidth;
        }
    }

}
