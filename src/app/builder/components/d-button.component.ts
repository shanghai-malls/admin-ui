import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from '../../model/ui';
import {ModalService} from '../../model/modal.service';
import {ButtonSettingComponent} from './settings/button-setting.component';

@Component({
    selector: 'd-button',
    templateUrl: 'd-button.component.html',
    styles: [`
        :host {
            display: inline-block;
            max-width: 130px;
        }
    `]
})
export class DButtonComponent {
    @Input()
    button: Button;

    @Input()
    removeable?: boolean = false;

    @Output()
    onDelete: EventEmitter<Button> = new EventEmitter<Button>();

    focused: boolean;


    constructor(private modalService: ModalService) {
    }

    doDelete() {
        this.onDelete.next(this.button);
    }

    doSetting() {
        this.modalService.openDesignSetting('设置' + this.button.text + '按钮',ButtonSettingComponent, {value: this.button});
    }

    focus(input: HTMLInputElement) {
        this.focused = true;
        setTimeout(() => input.focus(), 50);
    }

    blur(input: HTMLInputElement) {
        setTimeout(() => {
            this.focused = false;
            input.blur();
        }, 300);
    }
}
