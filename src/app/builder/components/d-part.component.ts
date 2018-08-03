import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {DesignService} from '../../model/design.service';
import {Cell, Component as UIComponent, Container, Form, Row} from '../../model/ui';
import {modalZIndex} from '../../model/function';
import {RowSettingComponent} from './settings/row-setting.component';


@Component({
    selector: 'd-part',
    template: `
        <ng-container *ngIf="type === 'row'">
            
        </ng-container>

        <ng-container *ngIf="type === 'form'">
            <d-form [form]="view"></d-form>
        </ng-container>
        <ng-container *ngIf="type === 'table'">
            <d-table [table]="view"></d-table>
        </ng-container>
        <ng-container *ngIf="type === 'detail-panel'">
            <d-detail [detailPanel]="view"></d-detail>
        </ng-container>

        <ng-container *ngIf="type === 'tab'">
            <nz-tab></nz-tab>
        </ng-container>
        <ng-container *ngIf="type === 'card'">
            <nz-card >
            </nz-card>
        </ng-container>
    `,
    styleUrls:['../../base.less']
})
export class DPartComponent implements OnInit{
    @Input() view: UIComponent;
    @Input() type?: string;

    @ViewChild('modalBody')
    modalBody: TemplateRef<any>;
    setting: Form;
    formValue: any;

    constructor(private modalService: NzModalService, private designService: DesignService) {
    }


    ngOnInit(): void {
        if (!this.type) {
            this.type = this.view.type;
        }
    }

    clear() {
        this.confirm("确定清空？", () => (<Container<UIComponent>>this.view).children = [])
    }

    settings = {
        row: RowSettingComponent
    };

    settingComponent(component: any, event: MouseEvent) {
        event.stopPropagation();
        this.formValue = component;

        let content = this.settings[component.type];
        let agent = this.modalService.create({
            nzWidth: '61.8%',
            nzZIndex: modalZIndex(),
            nzTitle: "设置组件",
            nzContent: content,
            nzComponentParams: {value: component},
            nzMaskStyle: {
                'background-color': 'rgba(0,0,0,0.3)'
            },
            nzBodyStyle: {
                'padding:': '0 40px'
            },
            nzOnCancel: () => agent.destroy(),
            nzOnOk: () => agent.destroy()
        });
    }

    addCell(row: any, event: MouseEvent) {
        let cell = new Cell({order: row.children.length});
        this.designService.selectedCell(cell);
        row.children.push(cell);
        event.stopPropagation();
    }

    zoom(cell: any, expand: boolean) {
        if (expand) {
            if (cell.width < 24) {
                cell.width++;
            }
        } else {
            if (cell.width > 1) {
                cell.width--;
            }
        }
    }

    setSpacing(container: any, horizontal: boolean, expand: boolean) {
        let row = container as Row;
        if (horizontal) {
            if (expand) {
                if (row.horizontal <= 21) {
                    row.horizontal += 3;
                }
            } else {
                if (row.horizontal >= 3) {
                    row.horizontal -= 3;
                }
            }
        } else {
            if (expand) {
                if (row.vertical <= 45) {
                    row.vertical += 3;
                }
            } else {
                if (row.vertical >= 3) {
                    row.vertical -= 3;
                }
            }
        }
    }

    removeChild(parent: any, i: number, parentParent?: any) {
        if (parent.type === 'map') {
            return;
        }
        if (parentParent && parentParent.type === 'map') {
            return;
        }
        this.confirm("确定删除？", () => parent.children.splice(i, 1))
    }

    selectedCell(event: MouseEvent, row: any, i: number) {
        event.stopPropagation();
        this.designService.selectedCell(row.children[i]);
    }

    isSelected(input: any): boolean {
        return this.designService.isSelected(input);
    }


    confirm(title: string, callback: () => void) {
        let agent = this.modalService.confirm({
            nzContent: title,
            nzZIndex: modalZIndex(),
            nzOnCancel: () => agent.destroy(),
            nzOnOk: () => {
                callback();
                agent.destroy();
            }
        });
    }

    startDraggingElement: Element;

    dragstart(y: number, event: DragEvent) {
        event.stopPropagation();
        this.startDraggingElement = event.srcElement;
        event.dataTransfer.setData("index", y + "");
    }

    dragover(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();
    }

    drop(x: number, children: Cell[], event: DragEvent) {
        event.stopPropagation();
        if (this.startDraggingElement === event.toElement) {
            return;
        }
        let y = parseInt(event.dataTransfer.getData("index"));
        let start = children[x];
        children[x] = children[y];
        children[y] = start;
    }


    // @HostListener('document:keydown',['$event'])
    onKeyPress(event: KeyboardEvent){
        event.stopPropagation();
        console.log(event);
    }
}
