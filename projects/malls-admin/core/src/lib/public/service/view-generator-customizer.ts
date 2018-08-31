import {
    ArrayTypeDeclaration,
    DetailPanel,
    Form,
    List,
    Method,
    ObjectTypeDeclaration,
    Resource,
    RevisionType,
    Table,
    TypeDeclaration,
    View,
} from '../model';
import {InjectionToken} from '@angular/core';


export const VIEW_GENERATOR_CUSTOMIZER = new InjectionToken<ViewGeneratorCustomizer>('VIEW_GENERATOR_CUSTOMIZER');

/**
 * 视图生成器定制
 */
export class ViewGeneratorCustomizer {

    /**
     * 资源可否被转换为视图
     * @param  resource
     * @param  action
     * @returns
     */
    canBeView(resource: Resource, action: Method) {
        return true;
    }

    /**
     * 视图集合后置处理器
     * @param  views
     * @returns
     */
    processViews(views: View[]): View[] {
        let processed = [];
        for (let view of views) {
            if (view.path.indexOf('.patch') === -1) {
                processed.push(view);
            }
        }
        return processed;
    }

    /**
     * 处理表单视图
     * @param  form
     * @param  resource
     * @param  action
     * @returns
     */
    processFormView(form: Form, resource: Resource, action: Method) {

        if (form.body) {
            let responseBodies;
            for (let m1 of resource.methods) {
                if (m1.method === 'get') {
                    if (m1.responses) {
                        let response = m1.responses.find(resp => resp.code >= 200 && resp.code < 300);
                        if (response && response.body && response.body.length > 0) {
                            responseBodies = response.body;
                            break;
                        }
                    }
                }
            }

            return action.body.map((item, i) => {
                if (responseBodies) {
                    let responseBody = responseBodies.find(rb => rb.type === item.type);
                    if (responseBody) {
                        form.body[i].autoLoader = {url: resource.qualifiedPath, accept: responseBody.name};
                    }
                }
            });
        }
    }

    /**
     * 处理列表数据
     * @param  list
     * @param  resource
     * @param  action
     */
    processListView(list: List, resource: Resource, action: Method) {
        if (list) {
            if (list.itemButtons) {
                list.itemButtons = list.itemButtons.filter(btn => {
                    return btn.path.indexOf('.patch') === -1;
                });
            }
        }
    }

    /**
     * 处理详情页视图
     * @param detailPanel
     * @param resource
     * @param action
     */
    processDetailView(detailPanel: DetailPanel, resource: Resource, action: Method) {
    }

    /**
     * 属性是否可以映射为列
     * @param elementType
     * @param property
     * @returns
     */
    canMappedToColumn(elementType: ObjectTypeDeclaration, property: TypeDeclaration) {
        if (property instanceof ArrayTypeDeclaration) {
            return false;
        }

        if (elementType.type === RevisionType) {
            if (property.name === 'revisionNumber' || property.name === 'revisionDate') {
                return false;
            }
        }
        return true;
    }

    /**
     * 处理table视图
     * @param table
     * @param resource
     * @param action
     */
    processTableView(table: Table, resource: Resource, action: Method) {
        if (table) {
            if (table.operationColumnButtons) {
                table.operationColumnButtons = table.operationColumnButtons.filter(btn => {
                    return btn.path.indexOf('.patch') === -1;
                });
            }
        }
    }
}
