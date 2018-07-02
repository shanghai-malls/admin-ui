import {Component, Input, OnInit} from '@angular/core';
import {Form} from '../../model/ui';
import {FormHelper} from '../../model/form';

@Component({
    selector: 'v-form',
    templateUrl: 'v-form.component.html',
    styleUrls: ['v-form.component.less']
})
export class ViewableFormComponent implements OnInit{
    @Input() form: Form;
    @Input() value?: any;


    ngOnInit(): void {
        if(!this.value) {
            this.value = {};
        }
        this.form = FormHelper.valueBindForm(this.form, this.value);

    }


}
