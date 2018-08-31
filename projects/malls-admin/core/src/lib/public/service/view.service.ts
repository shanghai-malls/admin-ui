import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {I18nService} from './i18n.service';
import {Subject} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd';
import {isCompatible, View} from '../model';



@Injectable({providedIn: 'root'})
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
            this.viewsGroup[language] = this.http.get<View[]>(this.url, {params: {language}});
        }
        return this.viewsGroup[language];
    }


    getCompatibleView(inputPath: string): Promise<View>{
        return this.getViews().then(views => {
            try{
                let lastPointPosition = inputPath.lastIndexOf('.');
                let inputSuffix = lastPointPosition > 0 ? inputPath.substring(lastPointPosition) : null;

                let matchedViews = views.filter(view=>isCompatible(view.path, inputPath, inputSuffix));

                if(matchedViews && matchedViews.length > 0) {
                    for (let matchedView of matchedViews) {
                        if(inputSuffix) {

                        }
                        if(matchedView.path === inputPath) {
                            return matchedView;
                        }
                    }
                    return matchedViews[0];
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
        return this.doSave({views: [view], forceUpdate: true});
    }

    batchSave = (input: View[]) => {
        return this.doSave({views: input, forceUpdate: true});
    };

    private doSave(body){
        return this.http.post(this.url, body, {showMessage: true}).then(() => this.pushViews(this.i18n.getLocale(), true));
    }

    deleteView(path: string):Promise<any> {
        const params = {paths: [path], language: this.i18n.getLocale()};
        return this.http.delete(this.url, {params, showMessage: true})
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
