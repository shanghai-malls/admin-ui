import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormItem} from '../../public/model';
import {NzMessageService} from 'ng-zorro-antd';
import {ComponentManager} from '../../registry/component-manager';

@Component({
    selector: 'v-form-control',
    templateUrl: './v-form-control.component.html',
    styleUrls: ['./v-form-control.component.less']
})
export class VFormControlComponent implements OnInit{


    @Input()
    item: FormItem;

    @Input()
    formGroup: FormGroup;

    @ViewChild("control", { read: ViewContainerRef })
    container: ViewContainerRef;

    constructor(private resolver: ComponentFactoryResolver, private messageService: NzMessageService, private componentManager:ComponentManager) {}

    ngOnInit(): void {
        let component = this.componentManager.getFormControlComponent(this.item.type);
        if(component) {
            const factory = this.resolver.resolveComponentFactory(component);
            const componentRef = this.container.createComponent(factory);
            componentRef.instance.initComponent(this.item, this.formGroup);
        } else {
            this.messageService.error(`不支持的表单=>${this.item.field} : ${this.item.type}`);
        }
    }

}


