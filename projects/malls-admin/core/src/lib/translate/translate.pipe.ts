import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from './translate.service';

@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {
    constructor(private translateService: TranslateService) {
    }

    transform(path: string, keyValue?: object): any {
        return this.translateService.translate(path, keyValue);
    }
}
