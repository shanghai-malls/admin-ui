import {
    ArrayTypeDeclaration,
    DetailPanel,
    Form, FormBody, FormItem,
    List,
    Method,
    ObjectTypeDeclaration,
    Resource,
    RevisionType, Row,
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

    private filteredComplexTypeField(row: Row<FormItem>){
        if(row && row.children) {
            row.children = row.children.filter(cell => {
                let formItem = cell.content;
                let type = formItem.type;
                if (type === 'fieldset' || type === 'array' || type === 'map') {
                    console.warn(`不支持${formItem.type}类型的表单项=>${formItem.field}`);
                    return false;
                }
                return true;
            });
        }
    }

    /**
     * 处理表单视图
     * @param  form
     * @param  resource
     * @param  action
     * @returns
     */
    processFormView(form: Form, resource: Resource, action: Method) {
        if(form) {
            if(form.headers) {
                this.filteredComplexTypeField(form.headers);
            }

            if(form.queryParameters) {
                this.filteredComplexTypeField(form.queryParameters);
            }

            if (form.body) {
                form.body.forEach(this.filteredComplexTypeField);
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
    }

    /**
     * 处理详情页视图
     * @param detailPanel
     * @param resource
     * @param action
     */
    processDetailView(detailPanel: DetailPanel, resource: Resource, action: Method) {
        if (detailPanel) {
            this.filteredComplexTypeField(detailPanel.queryResult);
            if(detailPanel.queryForm) {
                this.filteredComplexTypeField(detailPanel.queryForm.headers);
                this.filteredComplexTypeField(detailPanel.queryForm.queryParameters);
            }
        }
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
            if(table.queryForm) {
                this.filteredComplexTypeField(table.queryForm.headers);
                this.filteredComplexTypeField(table.queryForm.queryParameters);
            }
            if(table.operationButtons) {
                table.operationButtons = table.operationButtons.filter(btn => btn.path.indexOf('.patch') === -1);
            }
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
            if (list.queryForm) {
                this.filteredComplexTypeField(list.queryForm.headers);
                this.filteredComplexTypeField(list.queryForm.queryParameters);
            }
            if (list.operationButtons) {
                list.operationButtons = list.operationButtons.filter(btn => btn.path.indexOf('.patch') === -1);
            }
        }
    }
}
