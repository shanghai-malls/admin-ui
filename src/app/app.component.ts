import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
        <router-outlet></router-outlet>
        <!--<custom-input name="someValue"-->
                      <!--[(ngModel)]="dataModel" (ngModelChange)="change($event)" >-->
            <!--Write in this wrapper control:-->
        <!--</custom-input>-->
    `
})
export class AppComponent {
    dataModel: string = "";


    test(event){
        console.log(event, this.dataModel);
    }
    change(event){
        console.log(event)
    }
}
