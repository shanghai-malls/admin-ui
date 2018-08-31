import {Injectable, Type} from '@angular/core';
import {Route, Router, UrlSegment} from '@angular/router';
import {MacComponent} from '../../mac.component';


@Injectable({providedIn: 'root'})
export class RouterService {

    public readonly basePath: string;

    public readonly deepestRoutes: Route[] = [];

    constructor(private router: Router) {
        this.extractDeepestComponent(this.router.config, '');
        this.deepestRoutes.sort((a, b) => {
            const aIndex = a.path.indexOf('**');
            const bIndex = b.path.indexOf('**');

            if (aIndex !== -1 && bIndex === -1) {
                return 1;
            }
            if (aIndex === -1 && bIndex !== -1) {
                return -1;
            }
            if (aIndex !== -1 && bIndex !== -1) {
                return bIndex - aIndex;
            }
            return 0;
        });
        for (let route of this.router.config) {
            if (route.component === MacComponent) {
                this.basePath = route.path;
                if (this.basePath) {
                    this.basePath = '/' + this.basePath;
                }
                break;
            }
        }
    }

    getComponent(inputRoute: string): Type<any> {
        inputRoute = this.basePath + inputRoute;
        for (let route of this.deepestRoutes) {
            if (route.path) {
                //由于这是最深的一层路由，因此忽略pathMatch的规则
                const index = route.path.indexOf('**');
                if (index !== -1) {
                    if (inputRoute.startsWith(route.path.substring(0, index))) {
                        return route.component;
                    }
                }
                if (route.path === inputRoute) {
                    return route.component;
                }
            } else if (route.matcher) {
                if (route.matcher([new UrlSegment(inputRoute, {})], null, route)) {
                    return route.component;
                }
            }
        }
    }

    private extractDeepestComponent(routes: Route[], prefix: string) {
        for (let route of routes) {
            if (route.children) {
                this.extractDeepestComponent(route.children, this.concat(prefix, route.path));
            } else if (route.component) {
                const newRoute = {...route};
                if (prefix) {
                    newRoute.path = this.concat(prefix, newRoute.path);
                }
                this.deepestRoutes.push(newRoute);
            }
        }
    }

    private concat(prefix: string, path: string) {
        if (prefix.charAt(0) !== '/') {
            prefix = '/' + prefix;
        }

        if (prefix !== '/') {
            if (path) {
                return prefix + '/' + path;
            } else {
                return prefix;
            }
        }
        return '/' + path;
    }


    getContentComponentPath() {
        let relativeUri = decodeURIComponent(this.router.url)
            .replace(this.basePath, '');

        let i1 = relativeUri.indexOf('?');
        let i2 = relativeUri.indexOf(';');
        let i3 = relativeUri.indexOf('#');
        let indexes = [i1, i2, i3].filter(v => v > 0);
        if (indexes.length > 0) {
            let index = Math.min(...indexes);
            relativeUri = relativeUri.substring(0, index);
        }
        return relativeUri;
    }

    navigate(viewPath: string) {
        this.router.navigate([this.basePath + viewPath]);
    }
}
