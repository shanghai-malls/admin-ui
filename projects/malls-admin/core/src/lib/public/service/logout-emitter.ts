import {EventEmitter, Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class LogoutEmitter {
    private emitter = new EventEmitter<any>();

    subscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void) {
        this.emitter.subscribe(next, error, complete);
    }

    broadcast(){
        this.emitter.emit()
    }
}
