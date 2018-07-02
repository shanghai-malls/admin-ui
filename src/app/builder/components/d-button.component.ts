import {Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {Button, Form} from '../../model/ui';
import {NzModalService} from 'ng-zorro-antd';
import {FormHelper} from '../../model/form';

@Component({
    selector: 'd-button',
    templateUrl: 'd-button.component.html',
    styles:[`
        :host {
            display: inline-block;
            max-width: 130px;
        }
    `]
})
export class DesignableButtonComponent{
    @Input() button:Button;
    @Input() buttons: Button[];

    setting: boolean;

    buttonMetadata: Form;

    @ViewChild('modalBody')
    modalBody: TemplateRef<any>;


    constructor(private modalService: NzModalService) {

    }

    deleteIt(){
        let index = this.buttons.indexOf(this.button);
        this.buttons.splice(index, 1);
    }

    openButtonSettingModal(){
        this.buttonMetadata = FormHelper.valueBindForm(  Button.metadata  as Form,  this.button);
        let agent = this.modalService.create({
            nzTitle: '设置' + this.button.text +"按钮",
            nzContent: this.modalBody,
            nzWidth: '61.8%',
            nzMaskStyle: {
                'background-color': 'rgba(0,0,0,0.35)'
            },
            nzBodyStyle: {
                'padding:': '0 40px'
            },
            nzOnCancel: () => agent.destroy(),
            nzOnOk: () => agent.destroy()
        })
    }
}
