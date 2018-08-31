import {Component, Input, OnInit} from '@angular/core';
import {AbstractDesignerComponent, removeElement, Tab, TabSet} from '../../public/model';
import {ViewService} from '../../public/service/view.service';
import {ModalService} from '../../public/service/modal.service';
import {ViewManagementComponent} from '../../management/view/view-management.component';

@Component({
    selector: 'd-tabset',
    templateUrl: './d-tabset.component.html',
    styleUrls: ['./d-tabset.component.less']
})
export class DTabsetComponent implements OnInit, AbstractDesignerComponent<TabSet> {

    @Input()
    tabset: TabSet;
    tabIndex: number = 0;
    focused: { [x: number]: boolean } = {};

    constructor(private viewService: ViewService, private modalService: ModalService) {
    }

    ngOnInit() {
        if (this.tabset) {
            for (let tab of this.tabset.children) {
                let {content, viewPath} = tab;
                if (!content) {
                    this.viewService.getCompatibleView(viewPath).then(v => tab.content = v.data);
                }
            }
        }
    }

    initComponent(component: TabSet) {
        this.tabset = component;
    }



    focus(input: HTMLInputElement, i: number) {
        this.focused[i] = true;
        setTimeout(() => input.focus(), 50);
    }

    blur(title: HTMLInputElement, i: number) {
        this.focused[i] = false;
        title.blur();
    }

    doDelete(tab: any) {
        removeElement(this.tabset.children, tab);
    }


    dragstart(y: number, event: DragEvent) {
        event.stopPropagation();
        event.dataTransfer.setData('index', y + '');
    }

    dragover(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();
    }

    drop(x: number, event: DragEvent) {
        event.stopPropagation();
        console.log(this.tabset.children);
        let y = parseInt(event.dataTransfer.getData('index'));
        if (y != null) {
            let start = this.tabset.children[x];
            this.tabset.children[x] = this.tabset.children[y];
            this.tabset.children[y] = start;
        }
    }

    addTab() {
        let agent = this.modalService.create({
            nzTitle: '选择一个视图',
            nzContent: ViewManagementComponent,
            nzComponentParams: {
                mode: 'select'
            },
            channels: {
                onSelect: (value: any) => {
                    if (!this.tabset.children) {
                        this.tabset.children = [];
                    }

                    this.tabset.children.push(new Tab({title: value.name, path: value.path}));
                    agent.destroy();
                }
            },
            nzBodyStyle: {
                'background': '#f5f5f5',
            },
            nzFooter: null,
        });
    }
}
