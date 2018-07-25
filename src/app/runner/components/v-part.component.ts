import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
    selector: 'v-part',
    templateUrl: 'v-part.component.html',
    styleUrls: ['v-part.component.less']
})
export class VPartComponent implements OnInit{

    @Input()
    data: any;

    @Input()
    path: string;

    @Input()
    route: string;

    @Input()
    initValue?: any;

    @Input()
    @Output()
    onActions?: EventEmitter<any> = new EventEmitter();

    ngOnInit(): void {

    }


}
