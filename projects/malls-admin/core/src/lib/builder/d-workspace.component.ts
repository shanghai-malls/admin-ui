import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {DesignService} from '../public/service/design.service';
import {Cell, Component as UIComponent, Row, View} from '../public/model';
import {ModalService} from '../public/service/modal.service';
import {ViewService} from '../public/service/view.service';
import {RouterService} from '../public/service/router.service';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {Subscription} from 'rxjs';
import {I18nService} from '../public/service/i18n.service';
import {ComponentManager} from '../registry/component-manager';


export interface ComponentGroup {
    icon: string;
    name: string;
    components: { type: string; name: string }[];
}


@Component({
    selector: 'd-workspace',
    templateUrl: './d-workspace.component.html',
    styleUrls: ['./d-workspace.component.less']
})
export class DWorkspaceComponent implements OnDestroy, OnInit {

    view: View;

    rawData: any;

    un: Subscription;

    groups: ComponentGroup[] = [];

    basePath: string;

    language: string;

    constructor(private router: Router,
                private routerService: RouterService,
                private modalService: ModalService,
                private designService: DesignService,
                private viewService: ViewService,
                private componentManager: ComponentManager,
                i18nService: I18nService) {
        this.basePath = routerService.basePath;
        this.language = i18nService.getLocale();
        this.un = this.router.events.subscribe(this.initResource);
    }

    ngOnInit(): void {
        let registrations = this.componentManager.getAllComponentRegistrations();

        this.groups.push({
            icon:'layout',
            name:'布局',
            components: registrations.filter(reg=>reg.group === 'layout').map(({type,name})=>({type,name}))
        });

        this.groups.push({
            icon:'table',
            name:'数据展示',
            components: registrations.filter(reg=>reg.group === 'display').map(({type,name})=>({type,name}))
        });

        this.groups.push({
            icon:'form',
            name:'表单控件',
            components: this.componentManager.getAllFormControlRegistrations().map(({type,name})=>({type,name}))
        })
    }



    ngOnDestroy(): void {
        this.un.unsubscribe();
    }


    initResource = (event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
            let path = this.routerService.getContentComponentPath().substring(2); //remove`/d`prefix
            if(path) {
                this.viewService.getCompatibleView(decodeURIComponent(path)).then(view => {
                    this.view = view;
                    this.rawData = view.data;
                    this.view.data = UIComponent.create(view.data);
                });
            } else{
                this.view = {
                    language: this.language,
                    path: '/please-input-unique-path',
                    name: 'view name',
                    data: new Row({children: [new Cell(), new Cell(), new Cell()]})
                };
            }
        }
    };


    addComponent(type: string) {
        if (this.view.data) {
            this.designService.addComponentToCell(type);
        } else {
            this.view.data = UIComponent.create({type});
        }
    }


    saveView(header: TemplateRef<any>, content: TemplateRef<any>) {
        let agent = this.modalService.create({
            nzWidth: '40%',
            nzTitle: header,
            nzContent: content,
            nzOnOk: () => {
                if (this.view.name && this.view.path) {
                    if(this.rawData) {
                        this.viewService.saveOrUpdateView(this.view);
                        agent.destroy();
                    }
                    else {
                        this.viewService.exists(decodeURIComponent(this.view.path))
                            .then(exists=> {
                                if (exists) {
                                    let confirmAgent = this.modalService.confirm({
                                        nzTitle: '强制覆盖视图',
                                        nzContent: `视图${this.view.path}已经存在，是否直接覆盖？`,
                                        nzOnOk: ()=>{
                                            this.viewService.saveOrUpdateView(this.view);
                                            confirmAgent.destroy();
                                        }
                                    })
                                } else {
                                    this.viewService.saveOrUpdateView(this.view);
                                    agent.destroy();
                                }
                            })
                    }
                }
            }
        });
    }


    deleteView() {
        let confirmAgent = this.modalService.confirm({
            nzTitle: '删除视图？',
            nzContent: `确认删除视图${this.view.path}？`,
            nzOnOk: ()=>{
                this.viewService.deleteView(this.view.path);
                confirmAgent.destroy();
            }
        })

    }

    revert() {
        this.view.data = UIComponent.create(this.rawData);
    }
}
