import {EventEmitter, Injectable, TemplateRef, Type} from '@angular/core';
import {ConfirmType, ModalOptionsForService, NzModalRef, NzModalService, OnClickCallback} from 'ng-zorro-antd';
import {modalZIndex} from './function';


export interface ModalCreateOptions<T = any> extends ModalOptionsForService<T> {
    channels?: { [x: string]: EventEmitter<T> | OnClickCallback<T> }
}

@Injectable()
export class ModalService {
    constructor(private service: NzModalService) {

    }

    create<T = any>(options: ModalCreateOptions<T>): NzModalRef<T> {
        if(!options.nzZIndex) {
            options.nzZIndex =  modalZIndex()
        }
        if(!options.nzWidth) {
            options.nzWidth = '61.8%';
        }
        let ms = new Date().getTime();

        const ref = this.service.create<T>(options);
        ref.afterOpen.subscribe(()=>{
            const component = ref.getContentComponent();
            if(options.channels) {
                for (const method of Object.keys(options.channels)) {
                    const emitter = component[method] as EventEmitter<any>;
                    if (emitter) {
                        emitter.subscribe(options.channels[method]);
                    }
                }
            }
            console.log('耗时:' + (new Date().getTime() - ms) +"ms");
        });
        return ref;
    }

    confirm<T>(options?: ModalOptionsForService<T>, confirmType?: ConfirmType): NzModalRef<T> {
        if(!options.nzZIndex) {
            options.nzZIndex =  modalZIndex()
        }
        return this.service.confirm(options, confirmType);
    }

    openDesignSetting<T = any>(title: string, content: string | TemplateRef<{}> | Type<T>, params?: object){
        let agent = this.create({
            nzTitle: title,
            nzContent: content,
            nzComponentParams: params,
            nzFooter: [{
                label: '确定',
                type: 'primary',
                onClick: ()=>agent.destroy()
            }],
            nzMaskStyle: {
                'background-color': 'rgba(0,0,0,0.05)'
            }
        });
    }
}
