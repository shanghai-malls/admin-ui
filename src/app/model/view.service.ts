import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {I18nService} from './i18n.service';
import {Subject} from 'rxjs/Subject';
import {MainComponent} from '../runner/v.main.component';
import {NzMessageService} from 'ng-zorro-antd';


export class View {
    viewId: number;
    language: string;
    path: string;
    name: string;
    data: any;
    constructor(){

    }
}

@Injectable()
export class ViewService {
    private url = "/api/views";
    private maxId: number;
    private viewsGroup: { [x: string]: Promise<View[]> } = {};
    private subject = new Subject<any[]>();

    constructor(private http: HttpService, private i18n: I18nService, private messageService: NzMessageService) {
        this.i18n.subscribe(language => this.pushViews(language));
        this.http.get<number>(`${this.url}/max-view-id`).then(maxId => this.maxId = maxId);
    }

    getViews(language?: string, force?: boolean): Promise<View[]>{
        language = language || this.i18n.getLocale();
        if(!this.viewsGroup[language] || force) {
            this.viewsGroup[language] = this.http.get<View[]>(this.url, {language});
        }
        return this.viewsGroup[language];
    }

    getViewById(viewId: string, language?: string) : Promise<View> {
        return this.getViews(language).then(views=>{
            for (let v of views) {
                if(v.viewId === parseInt(viewId)) {
                    return v;
                }
            }
        });
    }

    getCompatibleView(inputPath: string): Promise<View>{

        return this.getViews().then(views => {
            for (let view of views) {
                if(ViewService.isCompatible(view, inputPath)) {
                    return view;
                }
            }
            this.messageService.error('无法找到对应的视图->' + inputPath);
            throw new Error('无法找到对应的视图->' + inputPath);
        });
    }

    static isCompatible(view: View, inputPath: string): boolean {
        let segments = inputPath.substring(1).split('/');
        let specs = view.path.substring(1).split('/');
        if (specs.length == segments.length) {
            for (let i = 0; i < specs.length; i++) {
                let spec = specs[i];
                let segment = segments[i];
                let placeholder = spec.length > 2 && spec.charAt(0) == '{' && spec.charAt(spec.length - 1) == '}';
                if (spec == segment || placeholder) {
                    continue;
                }
                return false;
            }
            return true;
        }
        return false;
    }

    saveOrUpdateView(view: View){
        let update = true;
        if(!view.viewId) {
            view.viewId = this.getCurrentId();
            update = false;
        }
        return this.http.post<any>(this.url, [view]).then(()=>{
            if(!update) {
                this.getViews().then(views=> {
                    views.push(view);
                })
            }
        })
    }

    executeBatchSaveViews = (input: View[]) => {
        return this.http.post<any>(this.url, input)
            .then(() => this.getViews(this.i18n.getLocale(), true));
    };

    deleteView(viewId: number):Promise<any> {
        let values = [this.http.delete<any>(`${this.url}/${viewId}`), this.getViews()];

        return Promise.all(values).then((result) => {
            let views = result[1] as View[];
            for (let i = 0; i < views.length; i++) {
                let v = views[i];
                if(v.viewId === viewId) {
                    views.splice(1, 1);
                    break;
                }
            }
        });
    }

    getCurrentId(){
        return ++this.maxId;
    }

    subscribe(next?: (value: any[]) => void, error?: (error: any) => void, complete?: () => void) {
        this.subject.subscribe(next, error, complete);
        this.pushViews(this.i18n.getLocale())
    }

    private pushViews(language: string){
        this.getViews(language).then(views => this.subject.next(views));
    }

}
