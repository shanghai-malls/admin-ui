import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DesignService} from '../model/design.service';
import {Row, Component as UIComponent} from '../model/ui';
import {View, ViewService} from '../model/view.service';
import {SettingService} from '../model/setting.service';
import {I18nService} from '../model/i18n.service';
import {VPartComponent} from '../runner/components/v-part.component';
import {ModalService} from '../model/modal.service';

@Component({
    templateUrl: 'design-workspace.component.html',
    styleUrls: ['design-workspace.component.less']
})
export class DesignWorkspaceComponent implements OnInit {

    view: View;

    @ViewChild('modalHeader')
    modalHeader: TemplateRef<any>;

    @ViewChild('saveBody')
    saveBody: TemplateRef<any>;

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
            },{
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

    constructor(private route: ActivatedRoute, private router: Router,
                private modalService: ModalService,
                private designService: DesignService,
                private themeService: SettingService,
                private i18nService: I18nService,
                private viewService: ViewService) {
    }

    ngOnInit(): void {
        let route = decodeURIComponent(this.router.url.replace('/designs', ''));
        if (route === '' || route === '/') {
            this.view = {language: this.i18nService.getLocale(), path: '/please-input-unique-path', name: 'view name', data: new Row()};
        } else {
            this.viewService.getCompatibleView(route).then(view=>this.view = view);
        }
    }

    addComponent(type: string){
        if(this.view.data) {
            this.designService.addComponentToCell(type);
        } else {
            this.view.data = UIComponent.create({type});
        }
    }

    saveView(){
        let agent = this.modalService.create({
            nzWidth: '40%',
            nzTitle: this.modalHeader,
            nzContent: this.saveBody,
            nzOnOk: ()=>{
                if(this.view.name && this.view.path) {
                    this.viewService.saveOrUpdateView(this.view);
                    agent.destroy();
                }
            }
        });
    }

    deleteView(){
        this.viewService.deleteView(this.view.path);
    }

    preview() {
        this.modalService.create({nzWidth: '80%', nzContent: VPartComponent, nzTitle: this.modalHeader});
    }
}
