export type Setting = {
    id?: string;
    logo?: string;
    appName: string;
    company: string;
    website: string;
    invisibleQueryParameters?: string[];
    invisibleColumns?: string[];
    invisibleFormProperties?: string[];
    invisibleDetailPageProperties?: string[];
    aliyunOss?: {
        endpoint: string;
        bucket: string;
        folder: string;
        accessKeyId: string;
        accessKeySecret: string;
    };
    styleUrl?: string;
};

export interface Menu {
    language: string;
    path: string;
    index: number;
    displayName: string;
    description: string;
    parent?: string;
    icon?: string;
    children?: Menu[];
}

export interface EditableMenu extends Menu{
    expand?: boolean;
    edit?: boolean;
    focused?: boolean;
    children?: EditableMenu[];
}


export interface View {
    language: string;
    path: string;
    name: string;
    data?: any;
}


export class Page {
    content: any[] = [];
    totalElements = 0;
    size = 20;
    number = 1;


    constructor(content?: Object[]) {
        if (content) {
            this.content = content;
            this.totalElements = content.length;
        }
    }
}

