import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Subject} from 'rxjs';
import {I18nService} from './i18n.service';
import {capitalize, isContainsChinese} from './function';

export interface Menu {
    language: string;
    path: string;
    name: string;
    index: number;
    displayName: string;
    description: string;
    parent?: string;
    icon?: string;
    children?: Menu[];
}

@Injectable()
export class MenuService {
    private url = '/api/menus';
    private menusGroup: { [x: string]: Promise<any[]> } = {};
    private subject = new Subject<Menu[]>();

    constructor(private http: HttpService, private i18n: I18nService) {
        this.i18n.subscribe((language) => this.pushMenus(language, false));
    }

    getMenus(language?: string, reload?: boolean) {
        language = language || this.i18n.getLocale();
        if (!this.menusGroup[language] || reload) {
            this.menusGroup[language] = this.http.get<any[]>(this.url, {language});
        }
        return this.menusGroup[language];
    }

    convertModulesToMenus = () => {
        const language = this.i18n.getLocale();
        return this.http.get<any[]>('/api/modules').then(modules => {
            let menus: Menu[] = [];

            for (let index = 0; index < modules.length; index++) {
                let module = modules[index];
                let {name, path, displayName, description, children} = module;
                let parent = path;

                if(children == null || children.length === 0) {
                    continue;
                }

                if(isContainsChinese(displayName)) {
                    displayName = capitalize(name) + " Management"
                }
                if(isContainsChinese(description)) {
                    description = displayName;
                }

                menus.push({language, name, path, displayName, description, index});


                if (children) {
                    for (let index = 0; index < children.length; index++) {
                        let module = children[index];
                        let {name, path, displayName, description} = module;
                        menus.push({language, name, path, displayName, description, index, parent});
                    }
                }
            }

            return menus;
        });
    };

    saveMenu(menu: any) {
        let body = {menus: [menu], forceUpdate: true};
        return this.http.post<any>(this.url, body).then(() => this.pushMenus(this.i18n.getLocale(), true));
    }

    batchSave = (input: Menu[]) => {
        let body = {menus: input, forceUpdate: false};
        return this.http.post(this.url, body)
            .then(() => this.pushMenus(this.i18n.getLocale(), true));
    };

    deleteMenu(path: string) {
        const params = {paths: [path], language: this.i18n.getLocale()};
        return this.http.delete(this.url, params).then(() => this.pushMenus(this.i18n.getLocale(), true));
    }


    subscribe(next?: (value: Menu[]) => void, error?: (error: any) => void, complete?: () => void) {
        this.subject.subscribe(next, error, complete);
        this.pushMenus(this.i18n.getLocale(), false);
    }

    private pushMenus(language: string, reload: boolean) {
        this.getMenus(language, reload).then(menus=>this.subject.next(menus));
    }

}
