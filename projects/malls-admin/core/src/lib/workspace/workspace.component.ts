import {Component, OnDestroy} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {RouterEvent} from '@angular/router/src/events';
import {NzAutocompleteOptionComponent} from 'ng-zorro-antd';
import {Subject, Subscription} from 'rxjs';
import {delay} from 'rxjs/operators';
import {likeIgnoreCase, Menu, Setting} from '../public/model';

import {I18nService} from '../public/service/i18n.service';
import {SettingService} from '../public/service/setting.service';
import {MenuService} from '../public/service/menu.service';
import {LogoutEmitter} from '../public/service/logout-emitter';
import {RouterService} from '../public/service/router.service';

@Component({
    templateUrl: 'workspace.component.html',
    styleUrls: ['./workspace.component.less']
})
export class WorkspaceComponent implements OnDestroy {

    focusSearch = false;
    isCollapsed = false;
    links: { path: string; text: string }[];
    user = {name: 'admin'};
    setting: Setting;
    menusForSearch: Menu[];
    subjectForSearch = new Subject<string>();

    basePath: string;
    menus: Menu[];
    language: string;
    searchText: string;
    currentRoute: string;
    un: Subscription;

    constructor(private router: Router, private routerService: RouterService, private i18n: I18nService, private settingsService: SettingService, private menuService: MenuService, private logoutEmitter: LogoutEmitter) {
        this.un = this.router.events.subscribe(this.initRouterView);
        this.settingsService.subscribe(setting => this.setting = setting);
        this.menuService.subscribe(this.receive);
        this.language = this.i18n.getLocale();
        this.basePath = routerService.basePath;
    }

    ngOnDestroy(): void {
        if (this.un) {
            this.un.unsubscribe();
        }
    }

    receive = menus => {
        this.menus = [...menus];
        let language = this.i18n.getLocale();
        this.menus.push({
            language: language,
            path: '#expansion',
            displayName: '扩展管理',
            description: '扩展管理',
            index: menus.length,
            icon: 'anticon anticon-usb',
            children: [
                {
                    language: language,
                    path: '/management/setting',
                    displayName: '主题定制',
                    description: '主题定制',
                    index: 0,
                    icon: 'anticon anticon-skin',
                },
                {
                    language: language,
                    path: '/management/icons',
                    displayName: '图标定制',
                    description: '图标定制',
                    index: 1,
                    icon: 'anticon anticon-picture',
                },
                {
                    language: language,
                    path: '/management/menus',
                    displayName: '菜单定制',
                    description: '菜单定制',
                    index: 2,
                    icon: 'anticon anticon-menu-unfold',
                },
                {
                    language: language,
                    path: '/management/views',
                    displayName: '视图定制',
                    description: '视图定制',
                    index: 3,
                    icon: 'anticon anticon-file',
                },
                {
                    language: language,
                    path: '/management/interfaces',
                    displayName: '完整接口列表',
                    description: '完整接口列表',
                    index: 4,
                    icon: 'anticon anticon-api',
                },
            ]
        });
        this.menusForSearch = menus;
        this.subjectForSearch.pipe(delay(300)).subscribe((text) => {
            if (!text) {
                this.menusForSearch = this.menus;
                return;
            }
            let menusForSearch = [];
            for (let g of menus) {
                let group = {displayName: g.displayName, path: g.path, children: []};
                if (g.children) {
                    for (let child of g.children) {
                        let {displayName, path} = child;

                        if (displayName && path) {
                            if (likeIgnoreCase(displayName, text) || likeIgnoreCase(path, text)) {
                                group.children.push({displayName, path});
                            }
                        }
                    }
                    if (group.children.length > 0) {
                        menusForSearch.push(group);
                    }
                }
            }
            this.menusForSearch = menusForSearch;
        });
    };

    private initRouterView = (event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
            this.currentRoute = this.routerService.getContentComponentPath();


            let parts = this.currentRoute.split('/').filter(i => i !== '');
            this.links = [];
            let path = this.basePath;
            for (let i = 0; i < parts.length; i++) {
                let text = parts[i];
                path += '/' + parts[i];
                this.links.push({text, path});
            }
        }
    };

    isOpen(menu: Menu) {
        if (menu.children && this.currentRoute) {
            return menu.children.find(sb => sb.path === this.currentRoute) != null;
        }
        return false;
    }

    switchLanguage(lang: string) {
        this.i18n.setLocale(lang);
        this.router.navigate([this.currentRoute]);
    }

    searchMenus(text: string) {
        this.subjectForSearch.next(text);
    }

    selectionChange(selectedOption: NzAutocompleteOptionComponent) {
        this.currentRoute = selectedOption.nzValue;
        this.router.navigate([this.currentRoute]);
    }

    logout() {
        this.logoutEmitter.broadcast();
    }
}
