import {Component, OnInit} from '@angular/core';
import {IconManagementComponent} from '../icon/icon-management.component';
import {ViewManagementComponent} from '../view/view-management.component';
import {MenuService} from '../../../model/menu.service';
import {I18nService} from '../../../model/i18n.service';
import {ModalService} from '../../../model/modal.service';

@Component({
    templateUrl: 'menu-management.component.html',
    styleUrls: ['../../../base.less'],
})
export class MenuManagementComponent implements OnInit{
    menus: any[] = [];
    copyMenu: any;

    mmc = ViewManagementComponent;

    constructor(private modalService: ModalService, private menuService: MenuService,  private i18n: I18nService) {

    }

    ngOnInit(): void {
        this.menuService.getMenus().then(menus => this.menus = menus);
        this.i18n.subscribe(language => this.menuService.getMenus(language, false).then(menus => this.menus = menus));
    }

    addMenu(menu?: any) {
        if (menu) {
            if (!menu.children) {
                menu.children = [];
            }
            menu.expand = true;
            menu.children.push({
                parent: menu.path,
                language: this.i18n.getLocale(),
                index: menu.children.length,
                displayName: '菜单名字',
                description: '菜单描述',
                edit: true,
                path: '#'
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
        menus[i].focused = true;
    }

    doDelete(menus: any[], i: number) {
        this.menuService.deleteMenu(menus[i].path).then(() => {
            menus.splice(i, 1);
        })
    }

    saveEdit(menus: any[], i: number) {
        menus[i].focused = false;
        this.menuService.saveMenu(menus[i]).then(menu => {
            Object.assign(menus[i], menu);
        });
    }

    cancelEdit(menus: any[], i: number) {
        menus.splice(i, 1, this.copyMenu);
    }

    selectIcon(menus: any[], i: number) {
        let agent = this.modalService.create({
            nzTitle: "请选择图标",
            nzContent: IconManagementComponent,
            channels: {
                onSelect: (result)=>{
                    menus[i].icon = result;
                    agent.destroy();
                }
            },
            nzFooter: null
        });
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
