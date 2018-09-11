import {
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {AbstractDesignerComponent, AbstractDesignerFormControlComponent, Cell, FormItem} from '../../public/model';
import {ResizeEvent} from '../../resize/resize.directive';
import {ComponentManager} from '../../public/service/component-manager';
import {DesignerService} from '../../public/service/designer.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'd-form-item',
    templateUrl: './d-form-item.component.html',
    styleUrls: ['./d-form-item.component.less'],
})
export class DFormItemComponent implements OnInit, OnChanges, OnDestroy, AbstractDesignerComponent<FormItem> {
    private readonly el: HTMLElement;

    @Input()
    item: FormItem;

    @Output()
    onEnter: EventEmitter<DFormItemComponent> = new EventEmitter<DFormItemComponent>();

    focused = false;

    startWidth: number;

    @ViewChild('labelText')
    labelText: ElementRef;

    @ViewChild('control', {read: ViewContainerRef})
    container: ViewContainerRef;

    innerComponent: AbstractDesignerFormControlComponent;

    unsetting: Subscription;

    constructor(private elementRef: ElementRef, private resolver: ComponentFactoryResolver,
                private messageService: NzMessageService, private componentManager: ComponentManager,
                designerService: DesignerService) {
        this.el = elementRef.nativeElement;
        this.unsetting = designerService.subscribeOnSetting(this.doSetting);
    }

    ngOnInit(): void {
        let component = this.componentManager.getDesignerFormControlComponent(this.item.type);
        if (component) {
            const factory = this.resolver.resolveComponentFactory(component);
            const componentRef = this.container.createComponent(factory);
            componentRef.instance.initComponent(this.item);
            this.innerComponent = componentRef.instance;
        } else {
            this.messageService.error(`不支持的表单=>${this.item.field} : ${this.item.type}`);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.innerComponent) {
            this.container.clear();
            this.ngOnInit();
        }
    }

    ngOnDestroy(): void {
        if (this.unsetting) {
            this.unsetting.unsubscribe();
        }
    }


    initComponent(component: FormItem) {
        this.item = component;
    }

    doSetting = (event: Cell) => {
        if (event.content === this.item) {
            this.innerComponent.doSetting(event);
        }
    };

    focus() {
        this.focused = true;
        setTimeout(() => this.labelText.nativeElement.focus(), 50);
    }

    enter(event: KeyboardEvent) {
        event.stopPropagation();
        this.blur();
        this.onEnter.next(this);
    }

    blur() {
        this.focused = false;
        this.labelText.nativeElement.blur();
    }


    doResize({moveX}: ResizeEvent) {

        let unitWidth = this.el.clientWidth / 24;
        let moveSpan = Math.round(moveX / unitWidth);

        if (!this.startWidth) {
            this.startWidth = this.item.width;
        }

        let newWidth = this.startWidth - moveSpan;

        if (newWidth > 5 && newWidth < 24) {
            this.item.width = newWidth;
        }
    }

}

