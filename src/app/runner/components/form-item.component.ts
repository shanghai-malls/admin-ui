import {Component, Input} from '@angular/core';
import {FormItem} from '../../model/ui';

@Component({
    selector: 'form-item',
    templateUrl: 'form-item.component.html',
    styles: [`
        :host {
            display: block;
        }
    `]
})
export class FormItemComponent {
    @Input() item: FormItem;

}
