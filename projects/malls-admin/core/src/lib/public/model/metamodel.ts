/**
 * 组件基类
 */
import {Type} from '@angular/core';

export abstract class Component {
    type: string;

    protected constructor(definition?: any) {
        copy(this, definition);
    }

    static factories = new Map<string, Type<Component>>();

    static create(definition: any): Component {
        if (definition instanceof Component) {
            return definition;
        }
        if (definition.type) {
            let MetamodelType = Component.factories.get(definition.type);
            if (MetamodelType) {
                return new MetamodelType(definition);
            }
            throw new Error('Component.create:::不支持的组件' + definition.type);
        }

        throw new Error('参数错误:::' + definition);
    }

    static registerFactory<T extends Component>(key: string, metamodelType: Type<T>) {
        this.factories.set(key, metamodelType);
    }
}

export abstract class Container<T extends Component = Component> extends Component {
    children: T[] = [];
}

export abstract class Wrapper<T extends Component = Component> extends Component {
    content: T;
    viewPath: string;
}

export class Card extends Wrapper<Component> {
    type = 'card';
    title: string = 'card title';
    bordered: boolean = true;

    constructor(definition?: any) {
        super();
        copy(this, definition);
        if (this.content) {
            this.content = Component.create(this.content);
        }
    }
}

export class Row<C extends Component = Component> extends Container<Cell<C>> {
    type = 'row';
    horizontal = 6;
    vertical = 6;

    constructor(definition?: any) {
        super();
        copy(this, definition);
        if (this.children) {
            this.children = this.children.map(child => new Cell(child));
        }
    }
}

export class Cell<T extends Component = Component> extends Wrapper<T> {
    type = 'cell';
    width: number = 8;


    constructor(definition?: any) {
        super();
        copy(this, definition);
        if (this.content) {
            this.content = <T> Component.create(this.content);
        }
    }
}

export class TabSet extends Container<Tab> {
    type = 'tabset';

    constructor(definition?: any) {
        super();
        copy(this, definition);
        if (this.children) {
            this.children = this.children.map(child => new Tab(child));
        }
    }
}

export class Tab extends Wrapper<Component> {
    type = 'tab';
    title: string;

    constructor(definition?: any) {
        super();
        copy(this, definition);
        if (this.content) {
            this.content = Component.create(this.content);
        }
    }
}

export class List extends Wrapper<Component> {
    type = 'list';
    header: string;
    bordered: boolean;
    split: boolean;
    showPagination: boolean;
    queryForm: Form;
    buttons: Button[];
    operationButtons: Button[];

    constructor(definition?: any) {
        super();
        copy(this, definition);

        if (this.queryForm) {
            this.queryForm = new Form(this.queryForm);
        }
        if (this.buttons) {
            this.buttons.forEach(btn => Object.setPrototypeOf(btn, Button.prototype));
        }
        if (this.operationButtons) {
            this.operationButtons.forEach(btn => Object.setPrototypeOf(btn, Button.prototype));
        }
    }
}

export class Table extends Component {
    type = 'table';
    showPagination: boolean;
    bordered: boolean;
    header: string;
    queryForm: Form;
    buttons: Button[];
    columns: Column[];
    operationButtons: Button[];

    constructor(definition?: any) {
        super();
        copy(this, definition);
        if (this.queryForm) {
            this.queryForm = new Form(this.queryForm);
        }
        if (this.buttons) {
            this.buttons.forEach(btn => Object.setPrototypeOf(btn, Button.prototype));
        }
        if (this.operationButtons) {
            this.operationButtons.forEach(btn => Object.setPrototypeOf(btn, Button.prototype));
        }
        if (this.columns) {
            this.columns.forEach(column => Object.setPrototypeOf(column, Column.prototype));
        }
    }
}

export class Column extends Component{
    type = 'column';

    title: string;
    field: string;
    index: number;
    hide = false;
    columns: Column[];

    constructor(definition: any) {
        super(definition);
        if (this.columns) {
            this.columns = this.columns.map(col => new Column(col));
        }
    }
}

export declare type TriggerType = 'link' | 'modal' | 'none' ;

export declare type ClassType = 'primary' | 'default' | 'danger' | 'dashed';

export class Button extends Component {
    type = 'button';

    triggerType: TriggerType;
    classType: ClassType;
    text: string;
    description: string;

    path: string;

    onclick: (data?: any) => void;

    constructor(definition: any) {
        super();
        copy(this, definition);
    }

    static modal(input: any) {
        let button = new Button(input);
        button.classType = 'primary';
        button.triggerType = 'modal';
        return button;
    }

    static link(input: any) {
        let button = new Button(input);
        button.triggerType = 'link';
        return button;
    }

    static none(input: any) {
        let button = new Button(input);
        button.triggerType = 'none';
        return button;
    }
}

export class DetailPanel extends Component {
    type = 'detail-panel';
    title: string;
    queryForm: Form;
    queryResult: Row<FormItem>;
    tabset: TabSet;

    constructor(definition?: any) {
        super();
        copy(this, definition);
        if (this.queryForm) {
            this.queryForm = new Form(this.queryForm);
        }
        if (this.queryResult) {
            this.queryResult = new Row<FormItem>(this.queryResult);
        }
        if (this.tabset) {
            this.tabset = new TabSet(this.tabset);
        }
    }
}

export interface AutoLoader {
    url?: string;
    accept?: string;
}

export class FormBody extends Row<FormItem> {
    contentType?: string;
    autoLoader?: AutoLoader;

    constructor(definition?: any) {
        super(definition);
    }
}

export class Form extends Component {
    type = 'form';
    title: string;
    path: string;
    method: string;
    accept: string;

    collapsible: boolean = false;

    submitButton: Button;
    clearButton: Button;

    horizontal = 6;
    vertical = 6;

    headers: FormBody;
    queryParameters: FormBody;
    body: FormBody[];

    constructor(definition?: any) {
        super();
        copy(this, definition);

        if (this.headers) {
            this.headers = new FormBody(this.headers);
        }
        if (this.queryParameters) {
            this.queryParameters = new FormBody(this.queryParameters);
        }
        if (this.body) {
            this.body = this.body.map(item => new FormBody(item));
        }
    }
}

export abstract class FormItem extends Component {
    field: string;
    label: string;
    description: string;
    value: any;
    required: boolean = false;
    hide: boolean = false;
    width: number = 16;
    op: 'ne' | 'eq' | 'ge' | 'gt' | 'le' | 'lt' | 'in' | 'like' | 'between';

    protected constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class FieldSet extends FormItem implements Row {

    type = 'fieldset';
    children: Cell[];
    horizontal: number;
    vertical: number;

    constructor(definition?: any) {
        super();
        copy(this, definition);
        if(this.children) {
            this.children.forEach(child=>Object.setPrototypeOf(child, Cell.prototype));
        }
    }
}

export class ArrayField extends FormItem {
    type = 'array';
    items: FormItem;
    minLength: number;
    maxLength: number;

    constructor(definition?: any) {
        super();
        copy(this, definition);
        if(this.items) {
            this.items = Component.create(this.items) as FormItem;
        }
    }
}

export class MapField extends FormItem {
    type = 'map';
    key: Text;
    val: FormItem | FieldSet;
    minLength: number;
    maxLength: number;

    constructor(definition?: any) {
        super();
        copy(this, definition);

        if(this.key) {
            Object.setPrototypeOf(this.key, Text.prototype);
        }

        if(this.val) {
            this.val = Component.create(this.val) as FormItem;
        }
    }
}

export class Text extends FormItem {
    type = 'text';
    pattern: string;
    minLength: number;
    maxLength: number;
    constructor(definition?: any) {
        super(definition);
    }
}

export class TextArea extends Text {
    type = 'textarea';
    auto: boolean = true;
    minRows: number = 1;
    maxRows: number = 3;

    get size() {
        return {minRows: this.minRows, maxRows: this.maxRows};
    }

    constructor(definition: any) {
        super();
        copy(this, definition);
    }

}

export class RichText extends TextArea {
    type = 'rich-text';
    constructor(definition: any) {
        super(definition);
    }
}

export class InputNumber extends FormItem {
    type = 'number';
    min: number;
    max: number;
    stride: number = 1; //步幅
    constructor(definition?: any) {
        super();
        copy(this, definition);
    }

}

export class Slider extends InputNumber {
    type = 'slider';
    min = 0;
    max = 100;

    constructor(definition: any) {
        super();
        copy(this, definition);
    }
}

export interface Option {
    label: string;
    value: string | number | boolean;
    children?: Option[];
    checked?: boolean;
    isLeaf?: boolean;
}

export class Choice extends FormItem {
    static DEFAULT_OPTIONS: Option[] = [
        {label: '选项1', value: 1},
        {label: '选项2', value: 2},
        {label: '选项3', value: 3},
    ];
    options: Option [] = Choice.DEFAULT_OPTIONS;

    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class Cascader extends Choice {
    type = 'cascader';
    static DEFAULT_OPTIONS = [
        {label: '选项1', value: 1, isLeaf: true},
        {label: '选项2', value: 2, isLeaf: true},
        {label: '选项3', value: 3, isLeaf: true},
    ];
    options = Cascader.DEFAULT_OPTIONS;


    constructor(definition: any) {
        super();
        copy(this, definition);
        if(this.options) {
            Cascader.updateOptionsLeaf(this.options);
        }
    }

    static updateOptionsLeaf(options: Option[]) {
        for (let option of options) {
            if (!option.children) {
                option.isLeaf = true;
            } else {
                this.updateOptionsLeaf(option.children);
            }
        }
    }

}

export class Select extends Choice {
    type = 'select';
}

export class Radio extends Choice {
    type = 'radio';
}

export class Checkbox extends Choice {
    type = 'checkbox';


    constructor(definition: any) {
        super();
        copy(this, definition);
        Checkbox.updateOptionsChecked(this.options, this.value);
    }

    static updateOptionsChecked(options: Option[], array: any[]) {
        if (array) {
            for (let value of array) {
                for (let option of options) {
                    if (option.value == value) {
                        option.checked = true;
                    }
                }
            }
        }
    }
}

export class Switch extends FormItem {
    type = 'switch';
    mode: 'switch' | 'checkbox' = 'switch';

    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class Rate extends FormItem {
    type = 'rate';
    count: number = 5;
    half: boolean = true;

    constructor(definition: any) {
        super();
        copy(this, definition);
    }
}

export class DatePicker extends FormItem {
    type = 'date';
    format: string = 'yyyy-MM-dd HH:mm:ss';
    showTime: boolean = true;
    startDate: Date;
    endDate: Date;

    disabledDate = (current: Date) => {
        let result = false;
        if (this.startDate) {
            result = current.getTime() < this.startDate.getTime();
        }
        if (this.endDate) {
            result = result || current.getTime() > this.endDate.getTime();
        }
        return result;
    };

    constructor(definition: any) {
        super();
        copy(this, definition);
    }

    static dateonly(def: any) {
        return new DatePicker({...def, showTime: false});
    }
}

export class DateRangePicker extends DatePicker {
    type = 'date-range';

    static dateonly(def: any) {
        return new DateRangePicker({...def, showTime: false});
    }
}

export class TimePicker extends FormItem {
    type = 'time';
    format: string = 'HH:mm:ss';

    constructor(definition: any) {
        super();
        copy(this, definition);
    }
}

export class UploadPicker extends FormItem {
    type = 'upload-picker';
    fileType: string[];
    listType: 'text' | 'picture' | 'picture-card';
    size: number = 100; //默认为100KB
    multiple: boolean; //是否允许上传多个文件
    limit: number;// 单次最大上传文件数（在允许单次上传多个文件的情况下有效）

    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class DataPicker extends FormItem {
    type = 'data-picker';
    /**
     * 提取选中的对象路径
     */
    objectPath: string;
    /**
     * 引用的目标视图地址
     */
    viewPath: string;


    constructor(definition: any) {
        super(definition);
    }
}

export class DisplayText extends FormItem {
    type = 'display-text';

    constructor(definition: any) {
        super(definition);
    }
}

/******************************************************************************************************/

export class ArrayFieldSet extends FieldSet {
    type = 'array';
    label = '数组字段';

    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class MapFieldSet extends FieldSet {
    type = 'map';
    label = 'Map字段';
    children = [
        new Cell({
            order: 0,
            children: [
                new Text({
                    label: '请输入key',
                    field: 'key'
                })
            ]
        }),
        new Cell({
            order: 1,
            children: [
                new Text({
                    label: '请输入value',
                    field: 'value'
                })
            ]
        })
    ];

    constructor(definition: any) {
        super();
        copy(this, definition);
    }
}


/***********************************不会被持久化的模型***********************************************/

export class Header {
    column: Column;

    parent: Header;
    children: Header[];

    _rowspan: number;


    constructor(column: Column, parent?: Header) {
        this.column = column;
        this.parent = parent;
        if (this.column.columns) {
            this.children = this.column.columns.map(c => new Header(c, this));
        }
    }

    get colspan() {
        if (this.children) {
            return this.children.filter(c => !c.hide).reduce((prev, current) => prev + current.colspan, 0) || 1;
        }
        return 1;
    }

    get rowspan() {
        return this._rowspan;
    }

    set rowspan(rowspan: number) {
        this._rowspan = rowspan;
    }

    get field() {
        return this.column.field;
    }

    get title() {
        return this.column.title;
    }

    set title(title: string) {
        this.column.title = title;
    }

    get index() {
        return this.column.index;
    }

    set index(index: number) {
        this.column.index = index;
    }

    get hide() {
        return this.column.hide;
    }

    set hide(hide: boolean) {
        this.column.hide = hide;
    }

    get show() {
        if (this.parent) {
            return !this.column.hide && this.parent.show;
        }
        return !this.column.hide;
    }

    get parentsRowspan() {
        let p = this.parent;
        let count = 0;
        while (p) {
            count++;
            p = p.parent;
        }
        return count;
    }
}

export class DataColumn extends Column {

    parent: DataColumn;

    constructor(column: any, parent?: DataColumn) {
        super(column);
        this.parent = parent;
        if (column.columns) {
            this.columns = column.columns.map(c => new DataColumn(c, this));
        }
    }

    formatText(data: any) {
        const fields = [this.field];
        let p = this.parent;
        while (p) {
            fields.push(p.field);
            p = p.parent;
        }

        let value = data;
        for (const field of fields.reverse()) {
            value = value[field];
        }

        return value;
    }
}


function copy(target: any, definition?: any) {
    if (definition) {
        Object.assign(target, definition);
    }
}
