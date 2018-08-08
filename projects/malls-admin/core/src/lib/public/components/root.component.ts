import {Component} from '@angular/core';


@Component({
    selector: 'admin-root',
    template: `
        <router-outlet></router-outlet>
        <div class="fixed-sider"></div>
        <div class="fixed-background"></div>
    `
})
export class RootComponent {

}
