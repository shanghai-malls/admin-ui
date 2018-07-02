import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {I18nService} from '../model/i18n.service';
import {MenuService} from '../model/menu.service';
import {Settings, SettingsService} from '../model/settings.service';

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
    settings: Settings;
    menus: Promise<any>;
    language: string;

    constructor(private router: Router, private changeDetectorRef: ChangeDetectorRef,
                private i18n: I18nService,
                private settingsService: SettingsService,
                private menuService: MenuService) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.initBreadcrumbs()
            }
        });
        this.settingsService.subscribe(settings => this.settings = settings);
        this.menuService.subscribe(menus => this.menus = Promise.resolve(menus));
        this.language = this.i18n.getLocale();
    }



    private initBreadcrumbs() {
        let fullPath = this.router.url;
        let parts = fullPath.split('/');
        this.links = [];
        for (let text of parts) {
            if (text) {
                if (text.indexOf('?') != -1) {
                    text = text.substring(0, text.indexOf('?'));
                }
                this.links.push({text: text, path: text});
            }
        }
        this.links.forEach((value, index) => {
            let segments = [];
            for (let i = 0; i < index; i++) {
                segments.push(this.links[i].text);
            }
            segments.push(value.text);
            value.path = '/' + segments.join('/');
        });
    }

    switchLanguage(lang: string) {
        this.i18n.setLocale(lang);
        // this.changeDetectorRef.detectChanges();
    }

}
