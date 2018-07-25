import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {I18nService} from './i18n.service';
import {Subject} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd';
import {isCompatible} from './function';


export interface View {
    language: string;
    path: string;
    name: string;
    data?: any;
}

@Injectable()
export class ViewService {
    private url = "/api/views";
    private viewsGroup: { [x: string]: Promise<View[]> } = {};
    private subject = new Subject<any[]>();

    constructor(private http: HttpService, private i18n: I18nService, private messageService: NzMessageService) {
        this.i18n.subscribe(language => this.pushViews(language));
    }

    getViews(language?: string, force?: boolean): Promise<View[]>{
        language = language || this.i18n.getLocale();
        if(!this.viewsGroup[language] || force) {
            this.viewsGroup[language] = this.http.get<View[]>(this.url, {language});
        }
        return this.viewsGroup[language];
    }


    getCompatibleView(inputPath: string): Promise<View>{
        return this.getViews().then(views => {
            try{
                let matchedView = views.find(view=>isCompatible(view.path, inputPath));
                if(matchedView) {
                    return matchedView;
                }
            } catch (e) {
                this.messageService.error(e.message);
                throw e;
            }
            this.messageService.error('无法找到对应的视图->' + inputPath);
            throw new Error('无法找到对应的视图->' + inputPath);
        });
    }


    saveOrUpdateView(view: View){
        let body = {views: [view], forceUpdate: true};
        return this.http.post(this.url, body).then(()=>{
            this.getViews().then(views=> {
                if(views.indexOf(view) === -1) {
                    views.push(view); // save
                }
            })
        })
    }

    batchSave = (input: View[]) => {
        let body = {views: input, forceUpdate: true};
        return this.http.post(this.url, body)
            .then(() => this.pushViews(this.i18n.getLocale(), true));
    };

    deleteView(path: string):Promise<any> {
        const params = {paths: [path], language: this.i18n.getLocale()};
        return this.http.delete(this.url, params)
            .then(() => this.getViews())
            .then(views => {
                for (let i = 0; i < views.length; i++) {
                    let v = views[i];
                    if (v.path === path) {
                        views.splice(1, 1);
                        break;
                    }
                }
            });
    }

    subscribe(next?: (value: any[]) => void, error?: (error: any) => void, complete?: () => void) {
        this.subject.subscribe(next, error, complete);
        this.pushViews(this.i18n.getLocale())
    }

    private pushViews(language: string, force?: boolean){
        this.getViews(language, force).then(views=>this.subject.next(views));
    }

}
