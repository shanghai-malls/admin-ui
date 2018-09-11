import {Component, Input, OnInit} from '@angular/core';
import {AbstractDesignerComponent, DetailPanel} from '../../public/model';
import {RowSettingComponent} from '../settings/row-setting.component';
import {ModalService} from '../../public/service/modal.service';


@Component({
    selector: 'd-detail',
    templateUrl: 'd-detail.component.html',
    styleUrls: ['d-detail.component.less']
})
export class DDetailComponent implements OnInit, AbstractDesignerComponent<DetailPanel> {

    @Input()
    detailPanel: DetailPanel;


    constructor(private modalService: ModalService) {

    }

    ngOnInit(): void {

    }

    initComponent(component: DetailPanel) {
        this.detailPanel = component;
    }


    focused: boolean;

    focus(title: HTMLInputElement) {
        this.focused = true;
        setTimeout(() => title.focus(), 50);
    }

    blur(title: HTMLInputElement) {
        this.focused = false;
        title.blur();
    }


    showRowSetting() {
        let title = '设置字段间隔';
        let params = {value: this.detailPanel.queryResult};

        this.modalService.openDesignSetting(title, RowSettingComponent, params);
    }
}
