import {Component, EventEmitter, OnInit} from '@angular/core';
import {IconManagementComponent} from '../icon/icon-management.component';
import {ViewManagementComponent} from '../view/view-management.component';
import {ModalService} from '../../public/service/modal.service';
import {I18nService} from '../../public/service/i18n.service';
import {MenuService} from '../../public/service/menu.service';
import {EditableMenu, Menu} from '../../public/model';



@Component({
    templateUrl: 'menu-management.component.html',
    styleUrls: ['../../base.less'],
})
export class MenuManagementComponent implements OnInit {
    menus: EditableMenu[] = [];
    copyMenu: EditableMenu;
    inBuilding: boolean;

    constructor(private modalService: ModalService, private menuService: MenuService, private i18n: I18nService) {

    }

    ngOnInit(): void {
        this.menuService.getMenus().then(menus => this.menus = menus);
        this.i18n.subscribe(language => this.menuService.getMenus(language, false).then(menus => this.menus = menus));
    }

    addMenu(parent?: EditableMenu) {
        if (parent) {
            if (!parent.children) {
                parent.children = [];
            }
            parent.expand = true;

            let child: EditableMenu = {
                language: this.i18n.getLocale(),
                path: '#',
                index: parent.children.length,
                displayName: '菜单名字',
                description: '菜单描述',
                parent: parent.path,
                edit: true,
            };

            parent.children.push(child);
        } else {
            this.menus.push({
                language: this.i18n.getLocale(),
                path: '#',
                index: this.menus.length,
                icon: 'anticon anticon-appstore-o',
                displayName: '菜单组名字',
                description: '菜单组描述',
                edit: true,
            });
        }

    }

    startEdit(menus: EditableMenu[], i: number) {
        this.copyMenu = {...menus[i]};
        menus[i].focused = true;
    }

    doDelete(menus: EditableMenu[], i: number) {
        this.menuService.deleteMenu(menus[i].path).then(() => {
            menus.splice(i, 1);
        });
    }

    saveEdit(menus: EditableMenu[], i: number) {
        menus[i].focused = false;
        this.menuService.saveMenu(menus[i]).then(menu => {
            Object.assign(menus[i], menu);
        });
    }

    cancelEdit(menus: Menu[], i: number) {
        menus.splice(i, 1, this.copyMenu);
    }

    showIconModal(menu: EditableMenu) {
        let onClose = new EventEmitter<any>();
        this.modalService.create({
            nzTitle: '请选择图标',
            nzContent: IconManagementComponent,
            nzAfterClose: onClose,
            nzFooter: null
        });
        onClose.subscribe(icon => {
            menu.icon = icon
        });
    }


    up(menus: Menu[], i: number) {
        let current = menus[i];
        if (i > 0) {
            let prev = menus[i - 1];
            prev.index = i;
            current.index = i - 1;

            this.reorder(menus, current, prev);
        }
    }

    down(menus: Menu[], i: number) {
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

    buildMenusFromRaml() {
        this.inBuilding = true;
        this.menuService.convertModulesToMenus()
            .then(this.menuService.batchSave) //save menus
            .then(() => this.inBuilding = false)
            .catch((error) => {
                this.inBuilding = false;
                console.error(error);
            });
    }
}
