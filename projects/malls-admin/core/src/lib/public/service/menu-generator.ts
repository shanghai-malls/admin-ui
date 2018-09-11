import {RamlService} from './raml.service';
import {MenuService} from './menu.service';
import {Inject, Injectable} from '@angular/core';
import {MENU_GENERATOR_CUSTOMIZER, MenuGeneratorCustomizer} from './menu-generator-customizer';
import {Menu} from '../model';
import {I18nService} from './i18n.service';

@Injectable({providedIn: 'root'})
export class MenuGenerator {
    constructor(private i18n: I18nService, private ramlService: RamlService, private menuService: MenuService, @Inject(MENU_GENERATOR_CUSTOMIZER) private customizer: MenuGeneratorCustomizer) {
    }


    generateMenus() {
        return this.ramlService.getRaml().then(raml => {
            let modules = [];
            let classes = Object.keys(raml.types);
            for (let type of classes) {
                if (!type.startsWith('org.springframework')) {
                    let names = type.split('.');
                    if (names.length > 2) {
                        let module = names[names.length - 2];
                        if (module.charCodeAt(0) > 96) {
                            if (modules.findIndex(m => m === module) === -1) {
                                modules.push(module);
                            }
                        }
                    }
                }
            }
            let menus = modules.map<Menu>((module, index) => {
                return {
                    language: this.i18n.getLocale(),
                    displayName: module,
                    description: module,
                    index: index,
                    path: `#${module}`,
                };
            });
            return this.menuService.batchSave(this.customizer.processMenus(menus));
        });
    }

}
