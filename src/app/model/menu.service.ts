import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Subject} from 'rxjs/Subject';
import {I18nService} from './i18n.service';

@Injectable()
export class MenuService {
    private url = "/api/menus";
    private menusGroup: { [x: string]: Promise<any[]> } = {};
    private subject = new Subject<any[]>();

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


    saveMenu(menu: any) {
        return this.http.post<any>(this.url, menu).then(() => this.pushMenus(this.i18n.getLocale(), true));
    }


    deleteMenu(id: any) {
        return this.http.delete(`${this.url}/${id}`).then(() => this.pushMenus(this.i18n.getLocale(), true));
    }


    subscribe(next?: (value: any[]) => void, error?: (error: any) => void, complete?: () => void) {
        this.subject.subscribe(next, error, complete);
        this.pushMenus(this.i18n.getLocale(), false);
    }

    private pushMenus(language: string, reload: boolean) {
        this.getMenus(language, reload).then(menus => this.subject.next(menus));
    }

}
