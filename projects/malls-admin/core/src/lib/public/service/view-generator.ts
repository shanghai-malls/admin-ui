import {I18nService} from './i18n.service';

import {
    ArrayField,
    ArrayTypeDeclaration,
    Button,
    capitalize,
    Cell,
    Column,
    Component,
    DatePicker,
    DateRangePicker,
    DetailPanel,
    DisplayText,
    FieldSet,
    Form,
    FormBody,
    FormItem,
    getSuccessResponseBody,
    InputNumber,
    isContainsChinese,
    isPageType,
    List,
    MapField,
    Method,
    ObjectTypeDeclaration,
    PagingParameters,
    parseCamelCase,
    Raml,
    Resource,
    Row,
    Select,
    Setting,
    SimpleTypeDeclaration,
    Switch,
    Tab,
    Table,
    TabSet,
    Text,
    TextArea,
    TypeDeclaration,
    UploadPicker,
    View,
} from '../model';
import {SettingService} from './setting.service';
import {RamlService} from './raml.service';
import {Inject, Injectable} from '@angular/core';
import {VIEW_GENERATOR_CUSTOMIZER, ViewGeneratorCustomizer} from './view-generator-customizer';
import {ViewService} from './view.service';


@Injectable({providedIn: 'root'})
export class ViewGenerator {

    private raml: Raml;
    private setting: Setting;

    constructor(private ramlService: RamlService, private viewService: ViewService,
                @Inject(VIEW_GENERATOR_CUSTOMIZER) private customizer: ViewGeneratorCustomizer,
                private i18n: I18nService, private settingsService: SettingService) {
        this.settingsService.subscribe(setting => this.setting = setting);
    }


    /**
     * 获取默认的视图列表，基于RAML文档转换所得
     */
    generateViews(){
        return this.ramlService.getRaml().then<any>(raml => {
            this.raml = raml;

            let views = [];
            for (let resource of raml.resources) {
                this.convertResource(resource, views);
            }

            if (this.customizer.processViews) {
                return this.customizer.processViews(views);
            }
            return this.viewService.batchSave(views);
        });
    }

    private convertResource(resource: Resource, views: View[]) {

        //该资源是获取raml文档的接口，跳过！
        if (this.raml.baseUri + resource.qualifiedPath === this.ramlService.endpoint) {
            return;
        }

        if (resource.methods) {
            for (let method of resource.methods) {
                if (this.customizer.canBeView(resource, method)) {
                    views.push(this.createView(resource, method));
                }
            }
        }
        if (resource.resources) {
            for (let subResource of resource.resources) {
                this.convertResource(subResource, views);
            }
        }
    }

    private createView(resource: Resource, action: Method): View {

        let path, data;
        if (action.method === 'get') {
            path = resource.qualifiedPath;
            data = this.createGetPage(resource, action);
        } else {
            path = resource.qualifiedPath + '.' + action.method;
            data = this.createNonGetPage(resource, action);
        }

        if (data) {
            if (data instanceof Form) {
                this.processForm(data, resource);
            }
            else if (data instanceof List) {
                this.processQueryForm(data.queryForm);
            }
            else if (data instanceof Table) {
                let {queryForm, columns} = data;
                this.processQueryForm(queryForm);
                this.processColumns(columns);
            }
            else if (data instanceof DetailPanel) {
                let {queryForm, queryResult} = data;
                this.processQueryForm(queryForm);
                this.processQueryResult(queryResult);
            }
        }

        let name = action.description;
        let language = this.i18n.getLocale();

        return {language, name, path, data};
    }

    /**
     * 最好的方式是： 这里能判断哪些属性属于关联属性，需要
     * 处理查询结果的UI元数据
     * @param queryResult
     */
    private processQueryResult(queryResult: Row<FormItem>) {
        if (queryResult) {
            this.hideFormChildren(this.setting.invisibleDetailPageProperties, queryResult.children);
        }
    }

    /**
     * 处理查询表单，去除分页查询的参数
     * @param queryFrom
     */
    private processQueryForm(queryFrom: Form) {
        if (queryFrom.queryParameters) {
            let cells = queryFrom.queryParameters.children;
            for (let i = cells.length - 1; i >= 0; i--) {
                let item = cells[i].content;
                if (PagingParameters.indexOf(item.field) !== -1) {
                    cells.splice(i, 1);
                    continue;
                }
                if (item instanceof DatePicker) {
                    cells[i].content = new DateRangePicker(item);
                    cells[i].content.op = 'between';
                } else {
                    cells[i].content.op = 'eq';
                }
            }
            this.hideFormChildren(this.setting.invisibleQueryParameters, cells);
        }
    }

    /**
     * 隐藏body里的path variable
     * @param {Form} form
     * @param {Resource} resource
     */
    private processForm(form: Form, resource: Resource) {
        let {queryParameters, body} = form;

        let variables = [];
        while (resource) {
            if (resource.uriParameters) {
                for (let p of resource.uriParameters) {
                    variables.push(p.name);
                }
            }
            resource = resource.parent;
        }

        variables.push(...this.setting.invisibleFormProperties);

        //之所以不处理headers，是因为header并非实体的字段
        if (queryParameters) {
            this.hideFormChildren(variables, queryParameters.children);
        }
        if (body && body.length > 0) {
            for (let item of body) {
                this.hideFormChildren(variables, item.children);
            }
        }
    }

    /**
     * 统一处理默认需要隐藏的表单字段
     * @param fields 需要被隐藏的字段
     * @param cells 表单项数组
     */
    private hideFormChildren(fields: string[], cells: Cell<FormItem>[]) {
        if (fields && cells) {
            for (let cell of cells) {
                if (fields.indexOf(cell.content.field) !== -1) {
                    cell.width = 0;
                }
                this.translateToEnglish(cell.content);
            }
        }
        else {
            console.error('有未知的空对象？请注意查看！！！');
        }
    }

    /**
     * 设置需要隐藏的列
     * @param columns
     */
    private processColumns(columns: Column[]) {
        for (let column of columns) {
            if (this.setting.invisibleColumns.indexOf(column.field) !== -1) {
                column.hide = true;
            }
            if (column.columns) {
                this.processColumns(column.columns);
            }
            this.translateToEnglish(column);
        }
    }

    /**
     * 表单项和列的翻译，如果文本包含中文字符，则拆分字段，取字段名
     * @param def
     */
    private translateToEnglish(def: Column | FormItem) {
        if (this.i18n.getLocale() === 'en') {
            if (def instanceof Column) {
                if (isContainsChinese(def.title)) {
                    def.title = capitalize(parseCamelCase(def.field));
                }
                return;
            }

            if (def instanceof FormItem) {
                if (isContainsChinese(def.label)) {
                    def.label = capitalize(parseCamelCase(def.field));
                }
                if (isContainsChinese(def.description)) {
                    def.description = def.label;
                }
            }
        }
    }

    /**
     * 创建get方法的接口视图
     * @param resource
     * @param action
     * @returns
     */
    private createGetPage(resource: Resource, action: Method): Component {
        let body = getSuccessResponseBody(action);
        if (body) {
            if (isPageType(body)) {
                let contentType = (<ObjectTypeDeclaration>body).properties.find(p => p.name === 'content') as ArrayTypeDeclaration;
                return this.createTableOrList(resource, action, contentType.items, true);
            } else if (body instanceof ArrayTypeDeclaration) {
                return this.createTableOrList(resource, action, (<ArrayTypeDeclaration>body).items, false);
            } else {
                return this.createDetailPanel(resource, action, body);
            }
        }
    }


    /**
     * 获取接口的accepts
     * @param action
     * @returns
     */
    private getAccept(action: Method) {
        let responseBody = getSuccessResponseBody(action);
        if (responseBody) {
            return responseBody.name;
        }
    }

    /**
     * 将接口转换为一个table或者一个list， 如果类型元数据为一个object，则转换为列表，否则转换为list
     * @param resource
     * @param method
     * @param elementType
     * @param showPagination
     * @returns
     */
    private createTableOrList(resource: Resource, method: Method, elementType: TypeDeclaration, showPagination: boolean) {

        let queryForm = this.createQueryForm(resource, method);

        let buttons = resource.methods
            .filter(action => action !== method)
            .map(action => this.methodToButton(resource, action));

        if (elementType instanceof ObjectTypeDeclaration) {
            let table = new Table();
            table.header = method.description;
            table.queryForm = queryForm;
            table.buttons = buttons;
            table.showPagination = showPagination;
            table.columns = this.elementTypeToColumns(elementType, table);
            table.operationButtons = [];

            if (resource.resources) {
                let collectPathVariable = this.collectPathVariable(table.columns, []);
                outer: for (let itemResource of resource.resources) {
                    if (itemResource.methods) {
                        if (itemResource.uriParameters && itemResource.uriParameters.length > 0) {
                            for (let uriParameter of itemResource.uriParameters) {
                                if (collectPathVariable.indexOf(uriParameter.name) === -1) {
                                    continue outer;
                                }
                            }
                        }
                        table.operationButtons.push(...itemResource.methods.map(action => this.methodToButton(itemResource, action)));
                    }
                }
            }
            this.customizer.processTableView(table, resource, method);

            return table;
        } else {
            let list = new List();
            list.header = method.description;
            list.queryForm = queryForm;
            list.buttons = buttons;
            list.showPagination = showPagination;
            list.bordered = true;
            list.split = true;

            this.customizer.processListView(list, resource, method);

            return list;
        }
    }

    /**
     * 收集所有可能作为path variable的字段
     * @param columns
     * @param candidateVariables
     * @returns
     */
    private collectPathVariable(columns: Column[], candidateVariables: string[]) {
        for (let column of columns) {
            candidateVariables.push(column.field);
            if (column.columns) {
                this.collectPathVariable(column.columns, candidateVariables);
            }
        }
        return candidateVariables;
    }

    private createQueryForm(resource: Resource, action: Method) {
        let form = new Form();
        form.path = this.raml.baseUri + resource.qualifiedPath;
        form.accept = this.getAccept(action);
        form.method = action.method;

        form.submitButton = Button.none({text: this.translateTextToEnglish('查询'), classType: 'primary'});
        form.clearButton = Button.none({text: this.translateTextToEnglish('清除')});


        let queryParameters = action.queryParameters;
        if (queryParameters && queryParameters.length > 0) {
            let children = this.propertiesToCells(queryParameters);
            if (children.length > 0) {
                let collapsible = false;
                let totalWidth = 8; //buttons width

                for (let cell of children) {
                    totalWidth += cell.width;
                }

                if (totalWidth > 24) {
                    collapsible = true;
                }

                form.collapsible = collapsible;
                form.queryParameters = new FormBody({children});
            }
        }

        let headers = action.headers;
        if (headers && headers.length > 0) {
            form.headers = new FormBody({children: this.propertiesToCells(headers)});
        }

        return form;
    }

    private createDetailPanel(resource: Resource, method: Method, body: TypeDeclaration) {
        let detailPanel = new DetailPanel();

        detailPanel.title = method.description;
        detailPanel.queryForm = this.createQueryForm(resource, method);

        if (body instanceof ObjectTypeDeclaration) {
            detailPanel.queryResult = new Row();
            detailPanel.queryResult.children = this.propertiesToCells(body.properties);
        }

        if (resource.resources) {
            let children = [];
            for (let subResource of resource.resources) {
                if (subResource.methods) {
                    for (let subMethod of subResource.methods) {
                        if (subMethod.method === 'get') {
                            let tab = new Tab();
                            tab.viewPath = subResource.qualifiedPath;
                            tab.title = subMethod.description;
                            children.push(tab);
                        }
                    }
                }
            }
            if (children.length > 0) {
                detailPanel.tabset = new TabSet({children});
            }
        }

        this.customizer.processDetailView(detailPanel, resource, method);

        return detailPanel;
    }

    private createNonGetPage(resource: Resource, action: Method): Form {
        let {queryParameters, headers, body, description, method} = action;
        let form = new Form();

        form.path = this.raml.baseUri + resource.qualifiedPath;
        form.method = method;
        form.title = description;

        form.submitButton = Button.none({text: this.translateTextToEnglish('提交'), classType: 'primary'});
        form.clearButton = Button.none({text: this.translateTextToEnglish('取消')});


        if (headers && headers.length > 0) {
            form.headers = new FormBody({children: this.propertiesToCells(headers)});
        }

        if (queryParameters && queryParameters.length > 0) {
            form.queryParameters = new FormBody({children: this.propertiesToCells(queryParameters)});
        }


        if (body && body.length > 0) {

            form.body = body.map((item) => {
                let bodyItem = new FormBody({contentType: item.name});
                if (item instanceof ObjectTypeDeclaration) {
                    bodyItem.children = this.propertiesToCells(item.properties) || [];
                } else if (item instanceof ArrayTypeDeclaration) {
                    bodyItem.children = [];// TODO 还要修改
                }
                return bodyItem;
            });

        }

        this.customizer.processFormView(form, resource, action);

        return form;
    }

    /**
     * 降属性转换为cell
     * @param properties
     * @returns
     */
    private propertiesToCells(properties: TypeDeclaration[]): Cell<FormItem>[] {
        let items: FormItem[] = [];
        for (let property of properties) {
            this.flatTypeDeclarationAndConvertToFormItem(items, property);
        }
        let cells = [];
        for (let item of items) {
            cells.push(new Cell<FormItem>({width: 8, content: item}));
        }
        return cells;
    }

    /**
     * 展开复杂类型的属性，将其转换为form item
     * @param items
     * @param property
     * @param prefix
     */
    private flatTypeDeclarationAndConvertToFormItem(items: FormItem[], property: TypeDeclaration, prefix?: string) {
        //如何判断普通的数组和实体类呢？


        if (property instanceof ObjectTypeDeclaration) {
            if (property.additionalProperties) {
                let {required, description, name, displayName, defaultValue} = property;
                items.push(new MapField({required, description, name, displayName, defaultValue}));
            } else {
                for (let innerProperty of property.properties) {
                    let currentPrefix = property.name;
                    if (prefix) {
                        currentPrefix = prefix + '.' + currentPrefix;
                    }
                    this.flatTypeDeclarationAndConvertToFormItem(items, innerProperty, currentPrefix);
                }
            }
        } else if (property instanceof SimpleTypeDeclaration) {
            items.push(this.convertToFormItem(property, prefix));
        } else if (property instanceof ArrayTypeDeclaration) {
            let {required, description, name, displayName, defaultValue, minItems, maxItems} = property;
            let arrayField = new ArrayField();
            arrayField.required = required;
            arrayField.description = description;
            arrayField.field = name;
            arrayField.label = displayName;
            arrayField.value = defaultValue;
            arrayField.maxLength = maxItems;
            arrayField.minLength = minItems;

            items.push(arrayField); //TODO
        }
    }

    /**
     * 将类型元数据转换为表单项
     * @param q
     * @param prefix
     * @returns
     */
    private convertToFormItem(q: SimpleTypeDeclaration, prefix?: string) {

        let {
            name, required, description,type,
            minLength, maxLength,
            displayName: label,
            defaultValue: value,
            maximum: max, minimum: min
        } = q;

        let def = {} as FormItem;

        def.field = prefix ? prefix + '.' + name : name;
        def.value = value;
        def.required = required;
        def.label = label;
        def.description = description;

        if (type === 'display-text') {
            return new DisplayText(def);
        }

        if (type === 'boolean') {
            return new Switch(def);
        }

        if (q.enumValues) {
            let select = new Select(def);
            select.options = q.enumValues.map(e => ({label: e, value: e}));
            return select;
        }

        if (type === 'number' || type === 'integer') {
            return new InputNumber({...def, max, min});
        }

        if (type === 'datetime') {
            return new DatePicker(def);
        }

        if (type === 'datetime-range') {
            return new DateRangePicker(def);
        }

        if (type === 'date-only') {
            return DatePicker.dateonly(def);
        }

        if (type === 'date-range') {
            return DateRangePicker.dateonly(def);
        }

        if (type === 'file') {
            return new UploadPicker(def);
        }

        if (type === 'any' || type === 'string') {

            if (q.maxLength > 255) {
                return new TextArea({...def, minLength, maxLength});
            }
        }

        return new Text({...def, minLength, maxLength});
    }

    /**
     * 将类型元数据转换为table的列
     * @param elementType
     * @param table
     * @returns
     */
    private elementTypeToColumns(elementType: ObjectTypeDeclaration, table: Table): Column[] {
        let columns = [];
        for (let p of elementType.properties) {
            if (this.customizer.canMappedToColumn(elementType, p)) {
                let def: any = {
                    field: p.name,
                    title: p.displayName,
                    index: columns.length
                };

                if (p instanceof ObjectTypeDeclaration) {
                    def.columns = this.elementTypeToColumns(p, table);
                    table.bordered = true;
                }

                columns.push(new Column(def));
            }
        }

        return columns;
    }

    /**
     * 将一个接口映射为一个按钮
     * @param resource
     * @param action
     * @returns
     */
    private methodToButton(resource: Resource, action: Method): Button {
        const text = this.translateTextToEnglish(action.displayName);
        const description = action.description;
        if (action.method === 'get') {
            return Button.link({text, description, path: resource.qualifiedPath});
        } else {
            return Button.modal({text, description, path: resource.qualifiedPath + '.' + action.method});
        }
    }

    /**
     * 文本翻译
     * @param text
     * @returns
     */
    private translateTextToEnglish(text: string) {
        if (this.i18n.getLocale() === 'en') {
            if (text === '查询') {
                return 'Query';
            }
            if (text === '清除') {
                return 'Clear';
            }
            if (text === '修改') {
                return 'Edit';
            }
            if (text === '删除') {
                return 'Delete';
            }
            if (text === '查看') {
                return 'Go';
            }
            if (text === '新建') {
                return 'New';
            }
            if (text === '提交') {
                return 'Submit';
            }
            if (text === '取消') {
                return 'Cancel';
            }
        }
        return text;
    }

    /************************************下面都是标注为不用的代码********************************************/

    /**
     * @deprecated
     * @param item
     * @returns
     */
    private isSimpleFormItem(item: FormItem): boolean {
        return !(item instanceof FieldSet || item instanceof MapField || item instanceof ArrayField);
    }

    /**
     * @deprecated
     * @param item
     * @returns
     */
    private isSimpleFormItemOrFieldSet(item: FormItem): boolean {
        return item instanceof FieldSet || !(item instanceof MapField || item instanceof ArrayField);
    }

    /**
     * @deprecated
     * @param q
     * @param readonly
     * @returns
     */
    private propertyToFormItem2(q: TypeDeclaration, readonly: boolean): FormItem | FieldSet {
        let def: any = {
            required: q.required,
            field: q.name,
            label: q.displayName,
            description: q.description,
            readonly,
        };
        this.translateToEnglish(def);

        if (q instanceof SimpleTypeDeclaration) {
            if (q.type === 'boolean') {
                return new Switch(def);
            }

            if (q.hasOwnProperty('options')) {
                return new Select({
                    ...def, options: q['options'],
                });
            }

            if (q.type === 'number' || q.type === 'integer') {
                return new InputNumber({
                    ...def, max: q.maximum, min: q.minimum,
                });
            }

            if (q.type === 'datetime') {
                return new DatePicker(def);
            }

            if (q.type === 'date-only') {
                return new DatePicker({
                    ...def, showTime: false,
                });
            }

            if (q.type === 'file') {
                return new UploadPicker(def);
            }

            def.minLength = q.minLength;
            def.maxLength = q.maxLength;

            if (q.type === 'any' || q.type === 'string') {
                if (q.maxLength > 255) {
                    return new TextArea({
                        ...def, width: 20,
                    });
                }
            }

            return new Text(def);
        }
        else if (q instanceof ObjectTypeDeclaration) {
            if (q.additionalProperties) {
                let valueType = q.properties[0];
                let pattern = valueType.name;


                if (valueType instanceof SimpleTypeDeclaration) {
                    valueType = new SimpleTypeDeclaration(valueType);
                }
                else if (valueType instanceof ObjectTypeDeclaration) {
                    valueType = new ObjectTypeDeclaration(valueType, valueType.properties);
                }
                else if (valueType instanceof ArrayTypeDeclaration) {
                    valueType = new ArrayTypeDeclaration(valueType, valueType.items);
                }
                valueType.displayName = '请输入value';
                valueType.description = '请输入value';
                valueType.name = 'val';

                let keyType = new SimpleTypeDeclaration({
                    name: 'key',
                    type: 'string',
                    required: true,
                    pattern: pattern,
                    displayName: '请输入key',
                    description: '请输入key'
                });


                def.key = this.propertyToFormItem2(keyType, readonly);
                def.val = this.propertyToFormItem2(valueType, readonly);
                def.minLength = q.minProperties;
                def.maxLength = q.maxProperties;

                return new MapField(def);
            } else {
                // def.children = q.properties.map(prop => this.propertyToFormItem2(prop, readonly)).map(RamlService.wrappedInCell);
                return new FieldSet(def);
            }
        }
        else if (q instanceof ArrayTypeDeclaration) {
            def.minLength = q.minItems;
            def.maxLength = q.maxItems;
            def.items = this.propertyToFormItem2(q.items, readonly);
            return new ArrayField(def);
        }
    }

    /**
     * @deprecated
     * @param q
     */
    private queryParameterToFormItem(q: SimpleTypeDeclaration): FormItem {
        let def = {
            field: q.name,
            label: q.displayName,
            description: q.description
        };

        if (q.type === 'boolean') {
            return new Switch(def);
        }

        if (q.hasOwnProperty('options')) {
            return new Select({...def, options: q['options']});
        }

        if (q.type === 'number' || q.type === 'integer') {
            return new InputNumber({...def,});
        }

        if (q.type === 'datetime') {
            return new DateRangePicker(def);
        }
        if (q.type === 'date-only') {
            return new DateRangePicker({...def, showTime: false});
        }

        if (q.type === 'any' || q.type === 'string') {
            if (q.maxLength > 255) {
                def['width'] = 20;
                return new TextArea(def);
            }
        }

        return new Text(def);
    }

    /**
     * @deprecated
     * @param item
     * @returns
     */
    private static wrappedInCell(item: FormItem | FieldSet): Cell {

        if (item instanceof Row || item instanceof ArrayField || item instanceof MapField) {
            return new Cell({width: 24, content: item});
        } else if (item instanceof TextArea) {
            return new Cell({width: 16, content: item});
        } else {
            return new Cell({width: 8, content: item});
        }
    }

    /**
     * @deprecated
     * @param queryParameters
     * @returns
     */
    private queryParametersToForm(queryParameters: TypeDeclaration[]): Cell[] {
        let children = [];
        for (let queryParameter of queryParameters) {
            this.flatTypeDeclarationAndConvertToFormItem(children, queryParameter);
        }
        // this.processInvisibleItems(children);
        return null;
    }

}



