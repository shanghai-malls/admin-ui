import {Injectable} from '@angular/core';
import {MessageSource} from './message-source';

@Injectable()
export class TranslateService {
    locale: MessageSource;



    translate(path: string, data?: any): any {
        let content = this.getLocaleValue(this.locale, path);
        if (typeof content === 'string') {
            if (data) {
                let result = content as string;
                for (let key of Object.keys(data)) {
                    let value:string = data[key] as string;
                    let regexp = new RegExp(`%${key}%`, 'g');
                    result = result.replace(regexp, value);
                }
                return result;
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
