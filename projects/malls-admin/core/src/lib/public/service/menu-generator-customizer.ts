import {InjectionToken} from '@angular/core';
import {Menu} from '../model';


export const MENU_GENERATOR_CUSTOMIZER = new InjectionToken<MenuGeneratorCustomizer>('VIEW_GENERATOR_CUSTOMIZER');

export class MenuGeneratorCustomizer {
    processMenus(menus: Menu[]) {
        return menus;
    }
}
