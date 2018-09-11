import {EventEmitter, Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {I18nService} from './i18n.service';
import {capitalize, isContainsChinese, EditableMenu, Menu} from '../model';



@Injectable({providedIn: 'root'})
export class MenuService {
    private url = '/api/menus';
    private menusGroup: { [x: string]: Promise<Menu[]> } = {};
    private emitter = new EventEmitter<Menu[]>();

    constructor(private http: HttpService, private i18n: I18nService) {
        this.i18n.subscribe((language) => this.pushMenus(language, false));
    }

    getMenus(language?: string, reload?: boolean) {
        language = language || this.i18n.getLocale();
        if (!this.menusGroup[language] || reload) {
            this.menusGroup[language] = this.http.get<Menu[]>(this.url, {params: {language}});
        }
        return this.menusGroup[language];
    }


    saveMenu(menu: EditableMenu) {
        delete menu.expand;
        delete menu.edit;
        delete menu.focused;
        return this.doSave({menus: [menu], forceUpdate: true})
    }

    batchSave = (input: Menu[]) => {
        return this.doSave({menus: input, forceUpdate: false})
    };

    private doSave(body){
        return this.http.post(this.url, body, {showMessage: true}).then(() => this.pushMenus(this.i18n.getLocale(), true));
    }

    deleteMenu(path: string) {
        const params = {paths: [path], language: this.i18n.getLocale()};
        return this.http.delete(this.url, {params, showMessage: true}).then(() => this.pushMenus(this.i18n.getLocale(), true));
    }


    subscribe(next?: (value: Menu[]) => void, error?: (error: any) => void, complete?: () => void) {
        this.emitter.subscribe(next, error, complete);
        this.pushMenus(this.i18n.getLocale(), false);
    }

    private pushMenus(language: string, reload: boolean) {
        this.getMenus(language, reload).then(menus=>this.emitter.emit(menus));
    }

}
