import {Component, Input, OnInit} from '@angular/core';
import {RamlService} from '../../model/raml.service';
import {Raml, Resource} from '../../model/raml';
import {Subject} from 'rxjs/Subject';

@Component({
    templateUrl: 'interface-list.component.html'
})
export class InterfaceListComponent implements OnInit {
    raml: Raml = new Raml();
    @Input() subject?: Subject<any>;

    constructor(private ramlService: RamlService) {
    }

    ngOnInit(): void {
        this.ramlService.getRaml()
            .then(raml => {
            this.raml = raml;
        })
    }

    selected(resource: Resource) {
        this.subject.next(resource);
    }
}
