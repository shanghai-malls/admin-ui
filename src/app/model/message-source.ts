import {InjectionToken} from '@angular/core';

import {MessageSource} from './message-source';

export interface MessageSource {
    header: {
        'search-placeholder': string
    };
}

export const MESSAGE_SOURCE_INJECTION_TOKEN = new InjectionToken<MessageSource>('MESSAGE_SOURCE_INJECTION_TOKEN');

export let zh_CN = {
    operation: '操作',
    header: {
        'search-placeholder': '搜索: 菜单'
    }
};


export let en_US = {
    operation: 'Operation',
    header: {
        'search-placeholder': 'Search for menu'
    }
};


export let LANG = {
    zh: '中文',
    en: 'English',
};
