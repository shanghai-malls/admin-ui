import {Component, TemplateRef, ViewChild} from '@angular/core';
import {DesignService} from '../model/design.service';
import {Component as UIComponent} from '../model/ui';
import {ViewService} from '../model/view.service';
import {VPartComponent} from '../main/runner/components/v-part.component';
import {ModalService} from '../model/modal.service';
import {DMainComponent} from './d-main.component';
import {Setting, SettingService} from '../model/setting.service';

@Component({
    templateUrl: 'd-workspace.component.html',
    styleUrls: ['d-workspace.component.less']
})
export class DWorkspaceComponent {

    routerChild: DMainComponent;

    @ViewChild('modalHeader')
    modalHeader: TemplateRef<any>;

    @ViewChild('saveBody')
    saveBody: TemplateRef<any>;

    setting: Setting;

    groups: { icon: string; name: string; components: { type: string; name: string }[] }[] = [
        {
            icon: 'layout',
            name: '布局/容器',
            components: [{
                type: 'row',
                name: '栅格'
            }, {
                type: 'card',
                name: '卡片'
            }, {
                type: 'tab',
                name: '标签页'
            }]
        }, {
            icon: 'table',
            name: '数据展示',
            components: [{
                type: 'table',
                name: '表格'
            }, {
                type: 'list',
                name: '列表'
            }]
        }, {
            icon: 'form',
            name: '表单控件',
            components: [{
                type: 'form',
                name: '表单'
            }, {
                type: 'fieldset',
                name: '字段集'
            }, {
                type: 'array',
                name: '数组字段'
            }, {
                type: 'map',
                name: 'map字段'
            }, {
                type: 'text',
                name: '文本'
            }, {
                type: 'number',
                name: '数字'
            }, {
                type: 'textarea',
                name: '多行文本'
            }, {
                type: 'rich-text',
                name: '富文本'
            }, {
                type: 'date',
                name: '日期'
            }, {
                type: 'date-range',
                name: '日期区间'
            }, {
                type: 'time',
                name: '时间'
            }, {
                type: 'switch',
                name: '开关'
            }, {
                type: 'slider',
                name: '滑动条'
            }, {
                type: 'rate',
                name: '评分'
            }, {
                type: 'select',
                name: '下拉选择'
            }, {
                type: 'radio',
                name: '单选框'
            }, {
                type: 'checkbox',
                name: '多选框'
            }, {
                type: 'upload',
                name: '上传'
            }, {
                type: 'data-picker',
                name: '数据引用'
            }, {
                type: 'display-text',
                name: '文本展示'
            }]
        }
    ];

    constructor(private modalService: ModalService,
                private designService: DesignService,
                private settingsService: SettingService,
                private viewService: ViewService) {
        this.settingsService.subscribe(setting => this.setting = setting);
    }


    addComponent(type: string) {
        if (this.view.data) {
            this.designService.addComponentToCell(type);
        } else {
            this.view.data = UIComponent.create({type});
        }
    }

    saveView() {
        let agent = this.modalService.create({
            nzWidth: '40%',
            nzTitle: this.modalHeader,
            nzContent: this.saveBody,
            nzOnOk: () => {
                if (this.view.name && this.view.path) {
                    this.viewService.saveOrUpdateView(this.view);
                    agent.destroy();
                }
            }
        });
    }

    deleteView() {
        this.viewService.deleteView(this.view.path);
    }

    preview() {
        this.modalService.create({nzWidth: '80%', nzContent: VPartComponent, nzTitle: this.modalHeader});
    }

    activate(event: DMainComponent) {
        this.routerChild = event;
    }

    get view(){
        return this.routerChild.view;
    }
}
