import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormItem} from '../../model/ui';
import {ResizeEvent} from '../../resize/resize.directive';

@Component({
    selector: 'd-form-item',
    template: `
        <nz-form-item nzFlex>
            <div nz-col [nzSpan]="24 - item.width" resize (onResize)="doResize($event)">
                <nz-form-label [nzRequired]="item.required" [class.hide]="focused" style="width: 100%">
                    <span (click)="focus()">{{item.label || item.field || 'label'}}</span>
                </nz-form-label>
                <nz-form-control [class.hide]="!focused">
                    <input #labelText nz-input [(ngModel)]="item.label" placeholder="请输入label" (blur)="blur()" (keydown)="keydown($event)"  />
                </nz-form-control>
            </div>
            <nz-form-control [nzSpan]="item.width">
                <ng-content></ng-content>
            </nz-form-control>
        </nz-form-item>
    `,
    styleUrls:['../../base.less']
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
