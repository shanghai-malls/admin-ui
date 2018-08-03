import {Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, Renderer2} from '@angular/core';

export interface ResizeEvent {
    hostElement: Element;
    moveX:number
}

@Component({
    selector: '[resize]',
    template: `
        <ng-content></ng-content>
        <div class="resize-hook" draggable="true" (mousedown)="initResize($event)"></div>
    `,
    styles:[`
        .resize-hook {
            top:0;
            right: 0;
            position: absolute;
            height:100%;
            width:15px;
            cursor: ew-resize;
            opacity: 0;
        }
    `]
})
export class ResizeDirective implements OnInit{

    private readonly el: HTMLElement;

    @Input()
    resize: string;

    @Output()
    onResize: EventEmitter<ResizeEvent> = new EventEmitter<ResizeEvent>();

    @Output()
    onStopResize: EventEmitter<ResizeEvent> = new EventEmitter<ResizeEvent>();

    @HostBinding('style.position')
    position="relative";

    startX: number;
    startWidth: number;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
        this.el = this.elementRef.nativeElement;
    }

    ngOnInit(): void {
    }

    initResize(event:MouseEvent){
        event.stopPropagation();
        event.preventDefault();
        this.startX = event.pageX;

        document.documentElement.addEventListener('mouseup', this.stopResize, false);

        document.documentElement.addEventListener('mousemove', this.doResize, false);
    }

    doResize = (event:MouseEvent)=>{
        let moveX = event.pageX - this.startX;
        this.onResize.next({hostElement: this.el,  moveX});
    };

    stopResize = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        document.documentElement.removeEventListener('mouseup', this.stopResize, false);
        document.documentElement.removeEventListener('mousemove', this.doResize, false);

        let moveX = event.pageX - this.startX;
        this.onStopResize.next({hostElement: this.el,  moveX});
    };

}
