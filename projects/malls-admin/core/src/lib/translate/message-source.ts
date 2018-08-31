import {MessageSource} from './message-source';

export interface MessageSource {
    operation: string;
    header: {
        'search-placeholder': string
    };
}


export let zh_CN: MessageSource = {
    operation: '操作',
    header: {
        'search-placeholder': '搜索: 菜单'
    }
};


export let en_US: MessageSource = {
    operation: 'Operation',
    header: {
        'search-placeholder': 'Search for menu'
    }
};


export let LANG = {
    zh: '中文',
    en: 'English',
};
