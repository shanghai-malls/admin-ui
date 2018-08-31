import {Component, ComponentFactoryResolver, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {Component as UIComponent} from '../../public/model';
import {ComponentManager} from '../../registry/component-manager';

@Component({
    selector: 'v-part',
    templateUrl: './v-part.component.html',
    styleUrls: ['./v-part.component.less'],
})
export class VPartComponent implements OnInit, OnChanges{

    @Input()
    component: UIComponent;

    @Input()
    path: string;

    @Input()
    route: string;

    @ViewChild("container", { read: ViewContainerRef })
    container: ViewContainerRef;

    constructor(private resolver: ComponentFactoryResolver, private messageService: NzMessageService, private componentManager: ComponentManager) {}

    ngOnInit(): void {
        let component = this.componentManager.getComponent(this.component.type);
        if(component) {
            const factory = this.resolver.resolveComponentFactory(component);
            const componentRef = this.container.createComponent(factory);
            componentRef.instance.initComponent(this.component, this.path, this.route);
        } else {
            this.messageService.error(`不支持的组件=> ${this.component.type}`);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(this.container.length > 0) {
            this.container.clear();
            this.ngOnInit();
        }
    }

}

