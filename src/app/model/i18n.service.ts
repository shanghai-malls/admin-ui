import {Injectable} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import en from '@angular/common/locales/en';
import * as zorro from 'ng-zorro-antd';
import {TranslateService} from './translate.service';
import * as ms from './message-source';
import {Subject} from 'rxjs';

@Injectable()
export class I18nService {
    private locale: string;
    private localeKey = 'locale';
    private localeSubject = new Subject();

    constructor(private nzI18n: zorro.NzI18nService, private translateService: TranslateService) {

    }


    setLocale(locale: string) {
        if (this.locale !== locale) {
            this.locale = locale;
            localStorage.setItem(this.localeKey, locale);
            this.localeSubject.next(locale);
            if (this.locale === 'zh') {
                registerLocaleData(zh);
                this.nzI18n.setLocale(zorro.zh_CN);
                this.translateService.setLocale(ms.zh_CN);
            } else if (this.locale === 'en') {
                registerLocaleData(en);
                this.nzI18n.setLocale(zorro.en_US);
                this.translateService.setLocale(ms.en_US);
            }
        }
    }

    getLocale() {
        if (!this.locale) {
            const locale = localStorage.getItem(this.localeKey);
            if (locale) {
                this.setLocale(locale);
            } else {
                this.setLocale(navigator.language.substring(0, 2));
            }
        }
        return this.locale;
    }

    subscribe(next?: (value: string) => void, error?: (error: any) => void, complete?: () => void) {
        this.localeSubject.subscribe(next, error, complete);
    }
}
