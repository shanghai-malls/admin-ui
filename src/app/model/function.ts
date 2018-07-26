let currentIndex = 10;

export function modalZIndex(): number {
    return currentIndex++;
}

export function formatPath(path: string, data?: any): string {
    if (data) {
        const parameters = getUriParametersFromObject(path, data);
        if (Object.keys(parameters).length > 0) {
            for (const key of Object.keys(parameters)) {
                const value = parameters[key];
                if (value) {
                    path = path.replace(new RegExp(`({${key}})`, 'g'), value);
                }
            }
        }
    }
    return path;
}

function getUriParametersFromObject(path: string, data: any) {
    const parameters = {};
    let startIdx = -1;
    for (let i = 0; i < path.length; i++) {

        if (path.charAt(i) === '{') {
            startIdx = i;
        }
        if (path.charAt(i) === '}') {
            if (startIdx !== -1) {
                const field = path.substring(startIdx + 1, i);

                parameters[field] = findValueWithoutDepth(field, data);
                startIdx = -1;
            }
        }
    }
    return parameters;
}

function findValueWithoutDepth(key: string, data: any) {
    for (const key1 of Object.keys(data)) {
        const value = data[key1];
        if (key === key1) {
            return value;
        }
        if (isPureObject(value)) {
            return findValueWithoutDepth(key, value);
        }
    }
}

export function isPureObject(value?: any) {
    if (!value) {
        return false;
    }
    if (typeof value === 'number') {
        return false;
    }
    return value.__proto__.constructor === Object;
}

export function extractUriVariables( route: string){
    const variables = [];
    if(route) {
        let routeParts = route.split('/');
        for (let i = 0; i < routeParts.length; i++) {
            let routePart = routeParts[i];
            let start = routePart.indexOf('{');
            let end = routePart.lastIndexOf('}');
            if (start !== -1 && end !== -1 && end > start) {
                variables.push(routePart.substring(start + 1, end));
            }
        }
    }
    return variables;
}

export function extractUriParameters(path: string, route: string){
    if(path === route) {
        return;
    }

    let pathParts = path.split('/');
    let routeParts = route.split('/');
    if (pathParts.length !== routeParts.length) {
        throw new Error("非法的路径字符串" + route);
    }
    const parameters = {};
    for (let i = 0; i < routeParts.length; i++) {
        let routePart = routeParts[i];
        let pathPart = pathParts[i];
        if(routePart === pathPart) {
            continue;
        }
        let start = routePart.indexOf("{");
        let end = routePart.lastIndexOf("}");
        if(start !== -1 && end !== -1 && end > start) {
            let variable = routePart.substring(start + 1, end);

            if(start !== 0) {
                pathPart = pathPart.substring(start + 1);
            }
            if(end !== routePart.length - 1) {
                let suffix = routePart.substring(end + 1);
                pathPart = pathPart.substring(0, pathPart.length - suffix.length);
            }

            parameters[variable] = pathPart;
        } else {
            throw new Error("非法的路由字符串" + route);
        }
    }

    return parameters;
}

export function isCompatible(route: string, inputPath: string): boolean {
    let pathParts = inputPath.substring(1).split('/');
    let routeParts = route.substring(1).split('/');
    if (routeParts.length == pathParts.length) {
        for (let i = 0; i < routeParts.length; i++) {
            let routePart = routeParts[i];
            let pathPart = pathParts[i];
            if(routePart === pathPart) {
                continue;
            }


            let start = routePart.indexOf("{");
            let end = routePart.lastIndexOf("}");
            if(start === -1 || end === -1) { //表示路由为普通字符串，非表达式
                return false;
            }

            if(start > end) {
                throw new Error('非法的路由字符串->' + route);
            }

            if(start > 0) {
                let prefix = routePart.substring(0,start);
                if(!pathPart.startsWith(prefix)) {
                    return false;
                }
            }
            if(end !== routePart.length - 1) {
                let suffix = routePart.substring(end + 1);
                if (!pathPart.endsWith(suffix)) {
                    return false;
                }
            }

            start = pathPart.indexOf("{");
            end = pathPart.lastIndexOf("}");

            if (start !== -1 || end !== -1) {
                return routePart === pathPart;
            }
        }
        return true;
    }
    return false;
}

export function isContainsChinese(text: string) {
    return /.*[\u4e00-\u9fa5]+.*$/.test(text);
}

export function parseCamelCase(text: string){
    return text.replace(/([a-z](?=[A-Z]))/g, '$1 ');
}

export function capitalize(text: string){
    return text[0].toUpperCase() + text.slice(1);
}


export function removeElement<T = any>(array:T[], element: T){
    let index = array.findIndex(e=>element === e);
    array.splice(index, 1);
}

export function likeIgnoreCase(source: string, searchString: string): boolean {
    if (!source) {
        return false;
    }
    if (!searchString) {
        return true;
    }
    return source.toLowerCase().indexOf(searchString.toLowerCase()) !== -1;
}
