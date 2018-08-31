import {Component, OnInit, Optional} from '@angular/core';
import {Method, Raml, Resource} from '../../public/model';
import {Router} from '@angular/router';
import {RamlService} from '../../public/service/raml.service';
import {NzModalRef} from 'ng-zorro-antd';
import {RouterService} from '../../public/service/router.service';

@Component({
    templateUrl: 'interface-list.component.html',
    styleUrls: ['../../base.less']
})
export class InterfaceListComponent implements OnInit {
    raml = new Raml();

    constructor(private ramlService: RamlService, private routerService: RouterService, @Optional() public modalRef: NzModalRef) {
    }

    ngOnInit(): void {
        this.ramlService.getRaml().then(raml => this.raml = raml);
    }

    emit(resource: Resource, action: Method) {
        let contentType;
        if (action.body && action.body.length > 0) {
            contentType =action.body[0].name;
        }
        let accept;
        if (action.responses && action.responses.length > 0) {
            let responseBody =action.responses[0].body;
            if(responseBody && responseBody.length > 0) {
                accept = responseBody[0].name;
            }
        }
        let method = action.method;

        let path = resource.qualifiedPath;

        if(this.raml.baseUri.endsWith('/')) {
            path = this.raml.baseUri.substring(0, this.raml.baseUri.length - 1) + path;
        }
        if(this.modalRef) {
            this.modalRef.destroy({method, path, contentType, accept})
        }
    }

    navigate(resource: Resource, method: Method) {
        let path = '/d' + resource.qualifiedPath;
        if (method.method !== 'get') {
            path += '.' + method.method;
        }
        this.routerService.navigate(path);
    }
}
