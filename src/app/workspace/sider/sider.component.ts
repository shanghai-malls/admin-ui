import {Component, OnInit} from '@angular/core';
import {MenuGroup} from '../../model/model';
import {StartupService} from '../../model/startup.service';

@Component({
    selector: 'app-sider',
    templateUrl: 'sider.component.html',
    styleUrls: ['sider.component.less']
})
export class SiderComponent implements OnInit {

    menuGroups: MenuGroup[];

    constructor(private startupService: StartupService) {
    }

    ngOnInit(): void {
        this.startupService.getMenus().then(menuGroups => this.menuGroups = menuGroups);
    }

    isExpand(group: MenuGroup): boolean {
        const path = location.pathname;
        if (path) {
            return group.menus.find(menu => path.startsWith(menu.path)) != undefined;
        }
        return false;
    }
}
