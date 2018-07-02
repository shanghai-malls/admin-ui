import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {IconManagementComponent} from '../icon/icon-management.component';
import {Subject} from 'rxjs/Subject';
import {ViewManagementComponent} from '../view/view-management.component';
import {modalZIndex} from '../../model/function';
import {MenuService} from '../../model/menu.service';
import {I18nService} from '../../model/i18n.service';

@Component({
    templateUrl: 'menu-management.component.html',
    styleUrls: ['menu-management.component.less'],
})
export class MenuManagementComponent implements OnInit{
    menus: any[] = [];
    copyMenu: any;


    constructor(private modalService: NzModalService, private menuService: MenuService,  private i18n: I18nService) {
        this.menuService.subscribe(menus => this.menus = menus)
    }

    ngOnInit(): void {

    }

    addMenu(menu?: any) {
        if (menu) {
            if (!menu.children) {
                menu.children = [];
            }
            menu.expand = true;
            menu.children.push({
                parentId: menu.menuId,
                language: this.i18n.getLocale(),
                index: menu.children.length,
                displayName: '菜单名字',
                description: '菜单描述',
                edit: true,
            })
        } else {
            this.menus.push({
                language: this.i18n.getLocale(),
                index: this.menus.length,
                icon: 'anticon anticon-appstore-o',
                displayName: '菜单组名字',
                description: '菜单组描述',
                edit: true
            });
        }

    }

    startEdit(menus: any[], i: number) {
        this.copyMenu = {...menus[i]};
        menus[i].edit = true;
    }

    doDelete(menus: any[], i: number) {
        this.menuService.deleteMenu(menus[i].menuId).then(() => {
            menus.splice(i, 1);
        })
    }

    saveEdit(menus: any[], i: number) {
        menus[i].edit = false;
        this.menuService.saveMenu(menus[i]).then(menu => {
            Object.assign(menus[i], menu);
        });
    }

    cancelEdit(menus: any[], i: number) {
        menus.splice(i, 1, this.copyMenu);
    }

    selectIcon(menus: any[], i: number) {
        let subject = new Subject<any>();
        let agent = this.modalService.create({
            nzWidth: '61.8%',
            nzZIndex: modalZIndex(),
            nzTitle: "请选择图标",
            nzContent: IconManagementComponent,
            nzComponentParams: {subject},
            nzFooter: null
        });
        subject.subscribe(result => {
            menus[i].icon = result;
            agent.destroy();
        });
    }

    selectView(menus: any[], i: number) {
        let subject = new Subject<any>();
        let agent = this.modalService.create({
            nzWidth: '61.8%',
            nzZIndex: modalZIndex(),
            nzTitle: "请选择视图",
            nzContent: ViewManagementComponent,
            nzComponentParams: {subject},
            nzFooter: null
        });
        subject.subscribe(result => {
            menus[i].viewId = result.viewId;
            menus[i].path = result.path;
            agent.destroy();
        });
    }

    clearView(item: any) {
        item.viewId = null;
        item.path = null;
    }

    up(menus: any[], i: number) {
        let current = menus[i];
        if (i > 0) {
            let prev = menus[i - 1];
            prev.index = i;
            current.index = i - 1;

            this.reorder(menus, current, prev);
        }
    }

    down(menus: any[], i: number) {
        let current = menus[i];
        if (i < menus.length - 1) {
            let next = menus[i + 1];
            next.index = i;

            current.index = i + 1;

            this.reorder(menus, current, next);
        }
    }

    reorder(menus: any[], menu1: any, menu2: any) {
        let step1 = () => this.menuService.saveMenu(menu1);
        let step2 = () => this.menuService.saveMenu(menu2);
        let step3 = () => menus.sort((a, b) => a.index - b.index);

        step1().then(step2).then(step3);
    }

}
