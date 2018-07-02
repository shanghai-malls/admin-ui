import {Component, HostListener, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {DesignService} from '../../model/design.service';
import {Cell, Component as UIComponent, Container, Form, Row} from '../../model/ui';
import {modalZIndex} from '../../model/function';
import {metadata} from '../../model/design-metadata';


@Component({
    selector: 'd-part',
    templateUrl: 'd-part.component.html',
    styleUrls: ['d-part.component.less']
})
export class DesignablePartComponent implements OnInit{
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
        this.confirm("确定清空？", () => (<Container>this.view).children = [])
    }

    settingComponent(component: any, event: MouseEvent) {
        event.stopPropagation();
        this.setting = metadata[component.type];
        this.formValue = component;

        let agent = this.modalService.create({
            nzWidth: '61.8%',
            nzZIndex: modalZIndex(),
            nzTitle: "设置组件",
            nzContent: this.modalBody,
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

    hasChildren(cell: Cell){
        return cell.children && cell.children.length > 0;
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


    @HostListener('document:keydown',['$event'])
    onKeyPress(event: KeyboardEvent){
        event.stopPropagation();
        console.log(event);
    }
}
