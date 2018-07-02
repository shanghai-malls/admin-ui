import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DesignService} from '../model/design.service';
import { Row} from '../model/ui';
import {View, ViewService} from '../model/view.service';
import {modalZIndex} from '../model/function';
import {NzModalService} from 'ng-zorro-antd';
import {SettingsService} from '../model/settings.service';
import {I18nService} from '../model/i18n.service';

@Component({
    templateUrl: 'design-workspace.component.html',
    styleUrls: ['design-workspace.component.less']
})
export class DesignWorkspaceComponent implements OnInit {
    data = new Row();
    view: View;

    isCollapsed: boolean;


    @ViewChild('modalHeader')
    modalHeader: TemplateRef<any>;

    @ViewChild('saveBody')
    saveBody: TemplateRef<any>;

    @ViewChild('previewBody')
    previewBody: TemplateRef<any>;


    groups: { icon: string; name: string; components: { type: string; name: string }[] }[] = [
        {
            icon: 'layout',
            name: '布局/容器',
            components: [{
                type: 'data',
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
            }]
        }
    ];

    constructor(private route: ActivatedRoute, private modalService: NzModalService,
                private designService: DesignService,
                private themeService: SettingsService,
                private i18nService: I18nService,
                private viewService: ViewService) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params=>{
            let id = params.id;
            if (id) {
                this.viewService.getViewById(id).then(view => {
                    if(view) {
                        this.view = view;
                        if(view.data) {
                            this.data = view.data;
                        } else {
                            this.view.data = this.data;
                        }
                    } else {
                        this.view = new View();
                        this.view.data = this.data;
                        this.view.language = this.i18nService.getLocale();
                    }
                });
            } else {
                this.view = new View();
                this.view.data = this.data;
                this.view.language = this.i18nService.getLocale();
            }
        });
    }

    addComponent(type: string){
        this.designService.addComponentToCell(type);
    }

    saveView(){
        let agent = this.modalService.create({
            nzWidth: '40%',
            nzZIndex: modalZIndex(),
            nzTitle: this.modalHeader,
            nzContent: this.saveBody,
            nzFooter: [{
                label: '取消',
                type: 'default',
                onClick: () => {
                    agent.destroy();
                }
            }, {
                label: '提交',
                type: 'primary',
                disabled: () => {
                    return !(this.view.name && this.view.path);
                },
                onClick: () => {
                    this.view.data = this.data;
                    this.viewService.saveOrUpdateView(this.view);
                    agent.destroy();
                }
            }]
        });
    }

    deleteView(){
        this.viewService.deleteView(null);
    }

    preview(){
        let agent = this.modalService.create({
            nzWidth: '80%',
            nzZIndex: modalZIndex(),
            nzContent: this.previewBody,
            nzTitle: this.modalHeader,
            nzOnCancel: () => agent.destroy(),
            nzOnOk: () => agent.destroy()
        });
    }
}
