import {Component, OnInit} from '@angular/core';
import {StartupService} from '../../model/startup.service';

function nativeWindow(): Window {
    return window;
}

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.less']
})
export class HeaderComponent implements OnInit{

    title: string;
    collapsed: boolean;
    constructor(private startupService: StartupService) {}

    ngOnInit(): void {
        let window = nativeWindow();
        this.startupService.getAppName().then(title => {
            this.title = title;
            window.document.title = title;
        });
    }
}
