import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Component as UIComponent} from '../../public/model';
import {NzMessageService} from 'ng-zorro-antd';
import {ComponentManager} from '../../registry/component-manager';

@Component({
    selector: 'd-part',
    templateUrl: './d-part.component.html',
    styleUrls: ['./d-part.component.less']
})
export class DPartComponent implements OnInit {
    @Input()
    component: UIComponent;


    @ViewChild('container', {read: ViewContainerRef})
    container: ViewContainerRef;

    constructor(private resolver: ComponentFactoryResolver, private messageService: NzMessageService, private componentManager: ComponentManager) {
    }

    ngOnInit(): void {
        let component = this.componentManager.getDesignerComponent(this.component.type);
        if (component) {
            const factory = this.resolver.resolveComponentFactory(component);
            const componentRef = this.container.createComponent(factory);
            componentRef.instance.initComponent(this.component);
        } else {
            this.messageService.error(`不支持的组件=> ${this.component.type}`);
        }
    }

}


