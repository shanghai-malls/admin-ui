import {Component} from '@angular/core';


@Component({
    template: `
        <router-outlet></router-outlet>
        <div class="fixed-sider"></div>
        <div class="fixed-background"></div>
        <!--<lib-demo-form-validate-reactive></lib-demo-form-validate-reactive>-->
    `
})
export class AdminComponent {
    test(){
    }
}
