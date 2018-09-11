import {Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ToolbarComponentProperties} from '../public/service/workspace-customizer';

@Component({
    selector: 'toolbar-overlay',
    templateUrl: 'toolbar-overlay.component.html',
    styleUrls: ['toolbar-overlay.component.less']
})
export class ToolbarOverlayComponent implements OnInit {
    @Input()
    toolbar: ToolbarComponentProperties;

    @ViewChild('container', {read: ViewContainerRef})
    containerRef: ViewContainerRef;

    componentRef: ComponentRef<any>;

    constructor(private resolver: ComponentFactoryResolver) {
    }

    ngOnInit(): void {
        const factory = this.resolver.resolveComponentFactory(this.toolbar.component);
        this.componentRef = this.containerRef.createComponent(factory);
    }

}
