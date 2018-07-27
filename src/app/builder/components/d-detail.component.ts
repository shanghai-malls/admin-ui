import {Component, Input, OnInit} from '@angular/core';
import {DetailPanel, Form, TabSet} from '../../model/ui';
import {ViewService} from '../../model/view.service';
import {removeElement} from '../../model/function';


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


    focus(input: HTMLInputElement, tab: any) {
        tab.focused = true;
        setTimeout(() => input.focus(), 50);
    }

    blur(title: HTMLInputElement, tab: any) {
        tab.focused = false;
        title.blur();
    }

    doDelete(tab: any){
        removeElement(this.tabset.children, tab);
    }

}
