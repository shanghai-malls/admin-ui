import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Subject} from 'rxjs';
import {Setting} from '../model';



@Injectable({providedIn: 'root'})
export class SettingService {

    url = '/api/setting';

    setting: Promise<Setting>;

    private subject = new Subject<Setting>();

    constructor(private http: HttpService) {
    }

    getSetting(): Promise<Setting> {
        if (!this.setting) {
            this.setting = this.http.get<Setting>(this.url);
        }
        return this.setting;
    }

    setSetting(body: Setting): Promise<Setting> {
        return this.http.post(this.url, body, {showMessage: true}).then<Setting>(setting => {
            this.setting = Promise.resolve(setting);
            this.subject.next(setting);
            return this.setting;
        });
    }

    subscribe(next?: (value: Setting) => void, error?: (error: any) => void, complete?: () => void) {
        this.subject.subscribe(next, error, complete);
        this.getSetting().then(settings => this.subject.next(settings));
    }
}
