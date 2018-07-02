import {Component, Input} from '@angular/core';

@Component({
    selector: 'r-submenu',
    template: `
        <li *ngIf="menu.children" nz-submenu>

            <a *ngIf="menu.path" [routerLink]="menu.path" routerLinkActive="active" title="{{menu.displayName}}">
                <i *ngIf="menu.icon" [ngClass]="menu.icon"></i>{{menu.displayName}}
            </a>
            <span *ngIf="!menu.path" title>
                <i *ngIf="menu.icon" [ngClass]="menu.icon"></i>
                <span class="nav-text">{{menu.displayName}}</span>
            </span>
            
            <ul>
                <ng-container *ngFor="let submenu of menu.children">
                    <r-submenu [menu]="submenu"></r-submenu>
                </ng-container>
            </ul>
        </li>
        <li *ngIf="!menu.children" nz-menu-item>
            <a [routerLink]="menu.path" routerLinkActive="active" title="{{menu.displayName}}"><i *ngIf="menu.icon" [ngClass]="menu.icon"></i>{{menu.displayName}}</a>
        </li>
    `,
    styles: [`
        :host {
            display: block;
        }

    `]
})
export class SubmenuComponent {
    @Input() menu: any;

}
