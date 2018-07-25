import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {I18nService} from '../model/i18n.service';
import {Menu, MenuService} from '../model/menu.service';
import {Setting, SettingService} from '../model/setting.service';
import {TranslateService} from '../model/translate.service';
import {RouterEvent} from '@angular/router/src/events';

@Component({
    selector: 'r-workspace',
    templateUrl: 'workspace.component.html',
    styleUrls: ['workspace.component.less']
})
export class WorkspaceComponent{

    focusSearch = false;
    isCollapsed = false;
    links: { path: string; text: string }[];
    user = {name: 'admin', avatar: 'https://cipchk.github.io/ng-alain/assets/tmp/img/avatar.jpg'};
    settings: Setting;
    menus: Promise<Menu[]>;
    language: string;
    searchText: string;
    searchHint: string;
    currentRoute: string;

    constructor(private router: Router,
                private i18n: I18nService,
                private settingsService: SettingService,
                private menuService: MenuService,
                private translateService: TranslateService) {
        this.router.events.subscribe(this.initRouterView);
        this.settingsService.subscribe(settings => this.settings = settings);
        this.menuService.subscribe(menus => this.menus = Promise.resolve(menus));
        this.language = this.i18n.getLocale();
        this.searchHint = this.translateService.translate('header.search-placeholder');
    }



    private initRouterView = (event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
            let fullPath = this.router.url;


            let i1 = this.router.url.indexOf('?');
            let i2 = this.router.url.indexOf(';');
            let i3 = this.router.url.indexOf('#');
            let indexes = [i1, i2, i3].filter(v => v > 0);
            if(indexes.length > 0) {
                let index = Math.min(...indexes);
                fullPath = fullPath.substring(0, index);
            }
            this.currentRoute = fullPath;


            let parts = fullPath
                .split('/')
                .filter(p => p !== '');

            this.links = [];
            let path = "";
            for (let text of parts) {
                path += "/" + text;
                this.links.push({text, path});
            }
        }

    };

    isOpen(menu: Menu){
        if(menu.children && this.currentRoute) {
            return menu.children.find(sb => sb.path === this.currentRoute) != null;
        }
        return false;
    }

    switchLanguage(lang: string) {
        this.i18n.setLocale(lang);
        this.searchHint = this.translateService.translate('header.search-placeholder');
    }

    searchMenus(path: string) {
        this.currentRoute = path;
        this.router.navigate([path]);
    }
}
