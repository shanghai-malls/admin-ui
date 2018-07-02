import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Subject} from 'rxjs/Subject';


export type Settings = {
    id?: string;
    logo?: string;
    appName: string;
    company: string;
    website: string;
    invisibleQueryParameters?: string[];
    invisibleColumns?:string[];
    invisibleFormProperties?:string[];
    invisibleDetailPageProperties?:string[];
    aliyunOss?:{
        endpoint: string;
        bucket: string;
        folder: string;
        accessKeyId: string;
        accessKeySecret: string;
    };
    styleUrl?: string;
};

@Injectable()
export class SettingsService {

    url = "/api/settings";

    settings: Promise<Settings>;

    private subject = new Subject<Settings>();

    constructor(private http: HttpService) {
    }

    getSettings(): Promise<Settings> {
        if(!this.settings) {
            this.settings = this.http.get<Settings>(`${this.url}`);
        }
        return this.settings;
    }

    setSettings(settings: Settings): Promise<Settings> {
        return this.http.post<Settings>(`${this.url}`, settings).then(settings => {
            this.settings = Promise.resolve(settings);
            this.subject.next(settings);
            return this.settings;
        });
    }

    subscribe(next?: (value: Settings) => void, error?: (error: any) => void, complete?: () => void) {
        this.subject.subscribe(next, error, complete);
        this.getSettings().then(settings => this.subject.next(settings));
    }
}
