import {Component, Input} from '@angular/core';
import {Component as UIComponent} from '../../public';

@Component({
    selector: 'd-part',
    templateUrl: './d-part.component.html',
    styleUrls: ['./d-part.component.less']
})
export class DPartComponent {
    @Input()
    view: UIComponent;


    // @HostListener('document:keydown',['$event'])
    onKeyPress(event: KeyboardEvent) {
        event.stopPropagation();
        console.log(event);
    }
}
