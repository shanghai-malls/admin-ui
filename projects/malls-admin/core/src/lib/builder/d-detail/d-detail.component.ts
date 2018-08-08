import {Component, Input, OnInit} from '@angular/core';
import {DetailPanel, Form, removeElement, Tab, TabSet, ViewService} from '../../public';


@Component({
    selector: 'd-detail',
    templateUrl: 'd-detail.component.html',
    styleUrls:['d-detail.component.less']
})
export class DDetailComponent implements OnInit {
    @Input()
    detailPanel: DetailPanel;

    resultForm: Form;

    tabset: TabSet;
    tabIndex: number = 0;

    constructor(private viewService: ViewService) {
    }

    ngOnInit(): void {
        this.resultForm = this.detailPanel.resultForm;
        this.tabset = this.detailPanel.tabset;
        if(this.tabset) {
            for (let tab of this.tabset.children) {
                let {content,path} = tab;
                if(!content) {
                    this.viewService.getCompatibleView(path).then(v => tab.content = v.data);
                }
            }
        }
    }


    focus(input: HTMLInputElement, tab: Tab) {
        tab.focused = true;
        setTimeout(() => input.focus(), 50);
    }

    blur(title: HTMLInputElement, tab: Tab) {
        tab.focused = false;
        title.blur();
    }

    doDelete(tab: any){
        removeElement(this.tabset.children, tab);
    }

}
