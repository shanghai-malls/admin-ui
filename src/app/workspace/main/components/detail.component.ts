import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AbstractControl} from '@angular/forms/src/model';
import {StartupService} from '../../../model/startup.service';
import {
    Action,
    DetailView,
    ListView,
    ObjectTypeDeclaration, propertyToFormControl,
    SimpleTypeDeclaration,
    TypeDeclaration,
    View
} from '../../../model/model';

@Component({
    selector: 'app-detail',
    templateUrl: 'detail.component.html'
})
export class DetailComponent implements OnChanges {
    @Input() view: DetailView;
    @Input() path: string;
    detailForm: FormGroup;
    tabViews: { [p: string]: View } = {};

    constructor(private route: ActivatedRoute, private fb: FormBuilder, private startupService: StartupService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.init();
    }

    init(): void {
        this.detailForm = this.fb.group({});
        for (let formItem of this.view.displayFormItems) {
            this.detailForm.addControl(formItem.property.name, propertyToFormControl(formItem.property));
        }
        for (let tab of this.view.tabs) {
            this.tabViews[tab.path] = this.startupService.getViewByAction(tab);
        }
        this.view.api.execute(this.path).then(result => {
            this.detailForm.patchValue(result.body);
        });
    }

    getView(path: string): ListView {
        return this.tabViews[path] as ListView;
    }

    format(action: Action): string {
        let parts = action.path.split('/');

        return this.path + '/' + parts[parts.length - 1];
    }
}
