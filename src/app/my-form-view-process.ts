import {FormViewProcessor} from '../../projects/malls-admin/core/src/lib/public/service/form-view-processor';
import {Form} from '../../projects/malls-admin/core/src/lib/public/model';
import {Inject, Injector} from '@angular/core';
import {RAML_ENDPOINT_INJECTION_TOKEN} from '../../projects/malls-admin/core/src/lib/public/service/raml.service';
import {HttpService} from '../../projects/malls-admin/core/src/lib/public/service/http.service';

export class MyFormViewProcess implements FormViewProcessor{
    constructor(private injector: Injector, private http: HttpService, @Inject(RAML_ENDPOINT_INJECTION_TOKEN)private $url: string){
        console.log($url)
    }

    preLoad(form: Form, route: string, path: string): any {
        console.log('call pre load with ' + this.injector);
    }

}
