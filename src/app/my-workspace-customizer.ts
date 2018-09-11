import {ToolbarComponentProperties, WorkspaceCustomizer} from '../../projects/malls-admin/core/src/lib/public/service/workspace-customizer';
import {HelloComponent} from './hello/hello.component';

export class MyWorkspaceCustomizer extends WorkspaceCustomizer {

    customizedRightToolbars(toolbars: ToolbarComponentProperties[]): ToolbarComponentProperties[] {
        toolbars.push({
            icon: 'api',
            component: HelloComponent,
            onclick: ()=>{},
        });
        return toolbars;
    }

}
