import {EventEmitter} from '@angular/core';

export interface Selectable<T = any> {
    mode: 'select' | 'view';
    onSelect: EventEmitter<T>;
}

