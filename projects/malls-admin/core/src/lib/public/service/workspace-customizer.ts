import {InjectionToken, Type} from '@angular/core';
import {NzPlacement} from 'ng-zorro-antd';


export const WORKSPACE_CUSTOMIZER = new InjectionToken<WorkspaceCustomizer>('VIEW_GENERATOR_CUSTOMIZER');

export interface ToolbarProperties {
    icon: string;
    onclick: (toolbar: ToolbarProperties) => void;
}

export interface ToolbarComponentProperties extends ToolbarProperties {
    component: Type<any>
    triggerType?: 'click' | 'hover';
    placementType?: NzPlacement;
}

export class WorkspaceCustomizer {

    showManagementMenus(): boolean {
        return true;
    }

    showTopSearchBar(): boolean {
        return true;
    }

    customizedLeftToolbars(toolbars: ToolbarProperties[]): ToolbarProperties[] {
        return toolbars;
    }

    customizedRightToolbars(toolbars: ToolbarComponentProperties[]): ToolbarComponentProperties[] {
        return toolbars;
    }

}
