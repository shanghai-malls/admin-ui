import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {Cell, FormBody, FormItem} from '../../public/model';
import {DFormItemComponent} from './d-form-item.component';

@Component({
    selector: 'd-form-body',
    templateUrl: 'd-form-body.component.html',
    styleUrls:['d-form-body.component.less']
})
export class DFormBodyComponent {

    @Input()
    bodies: FormBody[];

    @Output()
    onSetting: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren(DFormItemComponent)
    viewChildren: QueryList<DFormItemComponent>;


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
