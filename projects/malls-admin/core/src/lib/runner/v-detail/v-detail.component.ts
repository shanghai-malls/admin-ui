import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {AbstractComponent, DetailPanel} from '../../public/model';
import {VQueryFormComponent} from '../v-form/v-query-form.component';
import {ComponentLifecycleListenerDelegate} from '../../public/service/component-lifecycle-listener';

@Component({
    selector: 'v-detail',
    templateUrl: './v-detail.component.html',
    styleUrls: ['./v-detail.component.less']
})
export class VDetailComponent implements OnInit, OnChanges, AbstractComponent<DetailPanel> {

    @Input()
    component: DetailPanel;

    @Input()
    path?: string;

    @Input()
    route: string;

    result: any;

    @ViewChild('queryForm')
    queryForm: VQueryFormComponent;


    constructor(private delegate: ComponentLifecycleListenerDelegate) {
    }

    ngOnInit(): void {
        this.delegate.preInit(this);

        this.result = {};
        if (this.component.tabset && this.component.queryResult) {
            let queryResult = this.component.queryResult;
            queryResult.children = queryResult.children.filter(cell =>
                cell.content.type !== 'fieldset' && cell.content.type !== 'array' && cell.content.type !== 'map');

        }

        this.delegate.postInit(this);
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (this.result) {
            this.ngOnInit();
        }
    }


    receive(value: any): void {
        if (value === 'cleared') {
            this.queryForm.query();
        } else {
            this.result = value;
            this.delegate.postQuery(this.result, this);
        }
    }

    initComponent(component: DetailPanel, path: string, route: string) {
        this.component = component;
        this.path = path;
        this.route = route;
    }

}
