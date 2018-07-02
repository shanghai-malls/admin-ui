import {Component, Input, OnInit} from '@angular/core';
import {modalZIndex} from '../../model/function';
import {NzModalService} from 'ng-zorro-antd';
import {Subject} from 'rxjs/Subject';
import {ArrayFieldSet, DataPicker, FieldSet, FormItem, ObjectSelector} from '../../model/ui';

@Component({
    selector: 'v-part',
    templateUrl: 'v-part.component.html',
    styleUrls: ['v-part.component.less']
})
export class ViewablePartComponent implements OnInit {

    @Input() view: any;

    @Input() type?: string;

    @Input() parentValue?: any;

    ngOnInit(): void {
        if (!this.type) {
            this.type = this.view.type;
        }
        if(!this.parentValue) {
            if(this.view instanceof FormItem || this.view instanceof FieldSet) {
                this.parentValue = this.view.parentValue;
            }
        }
    }

    constructor(private modalService: NzModalService) {

    }

    showReferenceDialog() {
        let datapicker = this.view as DataPicker;
        if (typeof datapicker.view === 'string') {

        } else {
            let subject = new Subject<any>();
            let agent = this.modalService.create({
                nzWidth: '61.8%',
                nzZIndex: modalZIndex(),
                nzTitle: "选择数据",
                nzContent: datapicker.view,
                nzComponentParams: {subject},
                nzOnCancel: () => agent.destroy(),
                nzOnOk: () => agent.destroy()
            });
            subject.subscribe(result => {
                datapicker.value = result[datapicker.ref];
                datapicker.onReceive(result);
                agent.destroy();
            });
        }
    }

    addDynamicChildren() {
        let arrayField = (this.view as ArrayFieldSet);
        let arrayValue = this.parentValue[arrayField.field];

        let items = ObjectSelector.querySelectorAll<FormItem>(arrayField, d => d !== arrayField && d.hasOwnProperty('field'));
        let newElement: any = {};
        for (let fieldItem of items) {
            newElement[fieldItem.field] = null;
        }
        arrayValue.push(newElement);
    }

    removeDynamicChildren(i:number){
        let arrayField = (this.view as ArrayFieldSet);
        let arrayValue = this.parentValue[arrayField.field];
        arrayValue.splice(i, 1);
    }


}
