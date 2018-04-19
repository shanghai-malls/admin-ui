import {Component, OnInit} from '@angular/core';
import {im} from '../../model/model';

@Component({
    selector: 'app-footer',
    template: `
        <div class="content-section">
            <span><a [attr.href]="website">{{company}}</a>, Copyright © {{year}}</span>
        </div>
    `,
    styles: [`
        .content-section {
            display: block;
            overflow: hidden;
            background-color: #f5f7f8;
        }
    `]
})
export class FooterComponent implements OnInit {
    website: string;
    company: string;
    year: number;

    ngOnInit(): void {
        let copyright = im.copyright;
        this.website = copyright.website;
        this.company = copyright.company;
        this.year = new Date().getFullYear();
    }
}
