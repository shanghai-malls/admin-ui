import {Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
    selector: 'app-workspace',
    templateUrl: 'workspace.component.html',
    styleUrls: ['workspace.component.less']
})
export class WorkspaceComponent {


    links: { path: string; text: string }[];


    constructor(private router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.initBreadcrumbs()
            }
        });
    }



    private initBreadcrumbs(){
        let fullPath = this.router.url;
        let parts = fullPath.split('/');
        this.links = [];
        for (let text of parts) {
            if(text) {
                if(text.indexOf('?') != -1){
                    text = text.substring(0, text.indexOf('?'));
                }
                this.links.push({text: text, path: text});
            }
        }
        this.links.forEach((value,index)=>{
            let segments = [];
            for(let i = 0; i < index; i++) {
                segments.push(this.links[i].text);
            }
            segments.push(value.text);
            value.path = '/' + segments.join('/');
        });
    }


}
