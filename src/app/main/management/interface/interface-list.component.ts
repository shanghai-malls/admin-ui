import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RamlService} from '../../../model/raml.service';
import {Method, Raml, Resource} from '../../../model/raml';
import {Router} from '@angular/router';
import {Selectable} from '../../../model/Selectable';

@Component({
    templateUrl: 'interface-list.component.html',
    styleUrls: ['../../../base.less']
})
export class InterfaceListComponent implements OnInit, Selectable {
    raml = new Raml();

    @Output()
    onSelect: EventEmitter<any> = new EventEmitter();

    @Input()
    mode: 'select' | 'view' = 'view';

    constructor(private ramlService: RamlService, private router: Router) {
    }

    ngOnInit(): void {
        this.ramlService.getRaml().then(raml => this.raml = raml);
    }

    emit(resource: Resource, method: Method) {
        let contentType;
        if (method.body && method.body.length > 0) {
            contentType =method.body[0].name;
        }

        let path = resource.qualifiedPath;

        if(this.raml.baseUri.endsWith('/')) {
            path = this.raml.baseUri.substring(0, this.raml.baseUri.length - 1) + path;
        }

        this.onSelect.next({method: method.method, path, contentType});
    }

    navigate(resource: Resource, method: Method) {
        let url = '/d' + resource.qualifiedPath;
        if (method.method !== 'get') {
            url += '.' + method.method;
        }
        this.router.navigate([url]);
    }
}
