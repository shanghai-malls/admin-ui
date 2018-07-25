import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Subject} from 'rxjs';


export type Setting = {
    id?: string;
    logo?: string;
    appName: string;
    company: string;
    website: string;
    invisibleQueryParameters?: string[];
    invisibleColumns?: string[];
    invisibleFormProperties?: string[];
    invisibleDetailPageProperties?: string[];
    aliyunOss?: {
        endpoint: string;
        bucket: string;
        folder: string;
        accessKeyId: string;
        accessKeySecret: string;
    };
    styleUrl?: string;
};

@Injectable()
export class SettingService {

    url = '/api/setting';

    settings: Promise<Setting>;

    private subject = new Subject<Setting>();

    constructor(private http: HttpService) {
    }

    getSettings(): Promise<Setting> {
        if (!this.settings) {
            this.settings = this.http.get<Setting>(`${this.url}`);
        }
        return this.settings;
    }

    setSettings(settings: Setting): Promise<Setting> {
        return this.http.post<Setting>(`${this.url}`, settings).then(settings => {
            this.settings = Promise.resolve(settings);
            this.subject.next(settings);
            return this.settings;
        });
    }

    subscribe(next?: (value: Setting) => void, error?: (error: any) => void, complete?: () => void) {
        this.subject.subscribe(next, error, complete);
        this.getSettings().then(settings => this.subject.next(settings));
    }
}
