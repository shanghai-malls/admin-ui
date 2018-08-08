import {Route} from '@angular/router';

import {DMainComponent} from '../builder/d-workspace/d-main.component';
import {DWorkspaceComponent} from '../builder/d-workspace/d-workspace.component';

import {IconManagementComponent} from '../management/icon/icon-management.component';
import {InterfaceListComponent} from '../management/interface/interface-list.component';
import {MenuManagementComponent} from '../management/menu/menu-management.component';
import {SettingManagementComponent} from '../management/setting/setting-management.component';
import {ViewManagementComponent} from '../management/view/view-management.component';


import {VMainComponent} from '../runner/v-main.component';
import {WorkspaceComponent} from './components/workspace.component';


export const baseRoutes: Route[] = [
    {
        path: 'd',
        component: DWorkspaceComponent,
        children: [
            {component: DMainComponent, path: '**'}
        ]
    },
    {
        path: '',
        component: WorkspaceComponent,
        children: [
            {
                path: 'management', children: [
                    {component: SettingManagementComponent, path: 'setting'},
                    {component: MenuManagementComponent, path: 'menus'},
                    {component: IconManagementComponent, path: 'icons'},
                    {component: ViewManagementComponent, path: 'views'},
                    {component: InterfaceListComponent, path: 'interfaces'},
                ]
            },
            {component: VMainComponent, path: '**'},
        ]
    },
];
