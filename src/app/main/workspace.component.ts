import {Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {I18nService} from '../model/i18n.service';
import {Menu, MenuService} from '../model/menu.service';
import {Setting, SettingService} from '../model/setting.service';
import {RouterEvent} from '@angular/router/src/events';
import {NzAutocompleteOptionComponent} from 'ng-zorro-antd';
import {Subject} from 'rxjs';
import {delay} from 'rxjs/operators';
import {likeIgnoreCase} from '../model/function';

@Component({
    selector: 'workspace',
    templateUrl: 'workspace.component.html',
    styleUrls: ['workspace.component.less']
})
export class WorkspaceComponent{

    focusSearch = false;
    isCollapsed = false;
    links: { path: string; text: string }[];
    user = {name: 'admin'};
    setting: Setting;
    menusForSearch : Menu[];
    subjectForSearch = new Subject<string>();

    menus: Menu[];
    language: string;
    searchText: string;
    currentRoute: string;

    constructor(private router: Router,
                private i18n: I18nService,
                private settingsService: SettingService,
                private menuService: MenuService) {
        this.router.events.subscribe(this.initRouterView);
        this.settingsService.subscribe(setting => this.setting = setting);
        this.menuService.subscribe(menus => {
            this.menus = menus;
            this.menusForSearch = menus;
            this.subjectForSearch.pipe(delay(300)).subscribe((text)=>{
                if(!text){
                    this.menusForSearch = this.menus;
                    return;
                }
                let menusForSearch = [];
                for (let g of menus) {
                    let group = {displayName: g.displayName, path: g.path, children: []};
                    if(g.children) {
                        for (let child of g.children) {
                            let {displayName, path} = child;

                            if (displayName && path) {
                                if(likeIgnoreCase(displayName, text) || likeIgnoreCase(path, text)) {
                                    group.children.push({displayName, path});
                                }
                            }
                        }
                        if(group.children.length > 0) {
                            menusForSearch.push(group);
                        }
                    }
                }
                this.menusForSearch = menusForSearch;
            })
        });
        this.language = this.i18n.getLocale();
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
        this.router.navigate([this.currentRoute])
    }




    searchMenus(text: string) {
        this.subjectForSearch.next(text);
    }

    selectionChange(selectedOption: NzAutocompleteOptionComponent) {
        this.currentRoute = selectedOption.nzValue;
        this.router.navigate([this.currentRoute]);
    }
}
