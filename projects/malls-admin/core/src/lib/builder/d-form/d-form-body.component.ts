import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {Cell, FormBody, FormItem} from '../../public/model';
import {DesignService} from '../../public/service/design.service';
import {DFormItemComponent} from './d-form-item.component';
import {FormBodyProcessor} from '../../public/service/form-body-processor';

@Component({
    selector: 'd-form-body',
    templateUrl: 'd-form-body.component.html',
    styleUrls:['d-form-body.component.less']
})
export class DFormBodyComponent implements OnInit{

    @Input()
    bodies: FormBody[];

    @Input()
    spacing: {vertical: number, horizontal: number};

    @Output()
    onSetting: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren(DFormItemComponent)
    viewChildren: QueryList<DFormItemComponent>;

    constructor(public ds: DesignService, private formBodyProcessor: FormBodyProcessor) {

    }

    ngOnInit(): void {
        for (let body of this.bodies) {
            body.vertical = this.spacing.vertical;
            body.horizontal = this.spacing.horizontal;
            this.formBodyProcessor.process(body);
        }
    }


    focusChild(child: DFormItemComponent) {
        let children = this.viewChildren.toArray();
        let index = children.findIndex(item => item === child);
        if (index < children.length - 1) {
            children[index + 1].focus();
        }
    }

    /**
     * 恢复隐藏的表单
     * @param cell
     */
    recover(cell: Cell<FormItem>) {
        cell.width = 8;
    }

    triggerSetting() {
        this.onSetting.emit();
    }
}
