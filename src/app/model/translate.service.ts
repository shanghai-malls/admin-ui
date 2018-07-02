import {Injectable} from '@angular/core';
import {MessageSource} from './message-source';

@Injectable()
export class TranslateService {
    locale: MessageSource;



    translate(path: string, data?: any): string {
        let content = this.getLocaleValue(this.locale, path) as string;
        if (typeof content === 'string') {
            if (data) {
                Object.keys(data).forEach((key) => content = content.replace(new RegExp(`%${key}%`, 'g'), data[key]));
            }
            return content;
        }
        return path;
    }

    setLocale(locale: MessageSource): void {
        this.locale = locale;
    }


    private getLocaleValue(obj: object, path: string): string | object {
        let res = obj;
        const paths = path.split('.');
        const depth = paths.length;
        let index = 0;
        while (res && index < depth) {
            res = res[paths[index++]];
        }
        return index === depth ? res : null;
    }

}
