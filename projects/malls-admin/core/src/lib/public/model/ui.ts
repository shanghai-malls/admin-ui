import {Type} from '@angular/core';

/**
 * 组件基类
 */
export class Component {
    type: string;

    [x:string]: any;

    constructor(definition?: any) {
        if (definition) {
            Object.assign<Component, any>(this, definition);
        }
    }

    static create(definition: any): Component {
        if (definition instanceof Component) {
            return definition;
        }
        if (definition.type == 'row') {
            return new Row(definition);
        }
        if (definition.type == 'cell') {
            return new Cell(definition);
        }
        if (definition.type == 'card') {
            return new Card(definition);
        }
        if (definition.type == 'tab-set') {
            return new TabSet(definition);
        }
        if (definition.type == 'tab') {
            return new Tab(definition);
        }
        if (definition.type == 'table') {
            return new Table(definition);
        }
        if (definition.type == 'list') {
            return new List(definition);
        }
        if (definition.type == 'form') {
            return new Form(definition);
        }
        if (definition.type == 'fieldset') {
            return new FieldSet(definition);
        }
        if (definition.type == 'array') {
            return new ArrayFieldSet(definition);
        }
        if (definition.type == 'map') {
            return new MapFieldSet(definition);
        }
        if (definition.type == 'text') {
            return new Text(definition);
        }
        if (definition.type == 'number') {
            return new InputNumber(definition);
        }
        if (definition.type == 'textarea') {
            return new TextArea(definition);
        }
        if (definition.type == 'rich-text') {
            return new TextArea(definition);
        }
        if (definition.type == 'date') {
            return new DatePicker(definition);
        }
        if (definition.type == 'date-range') {
            return new DateRangePicker(definition);
        }
        if (definition.type == 'time') {
            return new TimePicker(definition);
        }
        if (definition.type == 'switch') {
            return new Switch(definition);
        }
        if (definition.type == 'slider') {
            return new Slider(definition);
        }
        if (definition.type == 'rate') {
            return new Rate(definition);
        }
        if (definition.type == 'select') {
            return new Select(definition);
        }
        if (definition.type == 'radio') {
            return new Radio(definition);
        }
        if (definition.type == 'checkbox') {
            return new Checkbox(definition);
        }
        if (definition.type == 'cascader') {
            return new Cascader(definition);
        }
        if (definition.type == 'upload') {
            return new UploadPicker(definition);
        }
        if (definition.type == 'data-picker') {
            return new DataPicker(definition);
        }

        throw new Error("不支持的组件" + definition.type);
    }

}

export class Container<T extends Component = Component> extends Component {
    children: T[] = [];
}

export class Wrapper<T extends Component = Component> extends Component {
    content: T;
}

export class Row extends Container<Cell> {
    type = 'row';
    horizontal = 6;
    vertical = 6;

    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class Cell extends Wrapper<Component> {
    type = 'cell';
    width: number = 8;


    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class Table extends Component {
    type = 'table';

    showPagination: boolean;

    bordered: boolean;

    url: string;

    queryForm: Form;
    queryButton: Button;
    clearButton: Button;
    buttons: Button[];
    columns: Column[];
    operationColumnButtons: Button[];

    constructor(def?: any) {
        super();
        if (def) {
            if (def.queryForm) {
                this.queryForm = new Form(def.queryForm);
            }
            if (def.queryButton) {
                this.queryButton = new Button(def.queryButton);
            }
            if (def.clearButton) {
                this.clearButton = new Button(def.clearButton);
            }
            if (def.buttons) {
                this.buttons = def.buttons.map(bdef => new Button(bdef));
            }
            if (def.operationColumnButtons) {
                this.operationColumnButtons = def.operationColumnButtons.map(bdef => new Button(bdef));
            }
            if (def.columns) {
                this.columns = def.columns.map(cdef => new Column(cdef))
            }
            this.showPagination = def.showPagination;
            this.url = def.url;
            this.bordered = def.bordered;
        }
    }
}

export class Column {
    title: string;
    field: string;
    type: string;
    columns: Column[];
    index: number;
    hide = false;


    constructor(def: any) {
        Object.assign<Column, any>(this, def);
        if (def.headers) {
            this.columns = def.headers.map(col => new Column(col));
        }
    }
}

export declare type TriggerType = "link" | "modal" | "confirm" | 'none' ;

export declare type ClassType = 'primary' | 'default' | 'danger' | 'dashed';

export class Button extends Component {
    type = 'button';

    triggerType: TriggerType = 'link';
    classType: ClassType = 'default';
    text: string;
    description: string;

    path: string;
    method: string;


    constructor(button: any) {
        super();
        copy(this, button);
    }

    static danger(input: any) {
        let button = new Button(input);
        button.classType = 'danger';
        button.triggerType = 'confirm';
        return button;
    }
    static modal(input: any){
        let button = new Button(input);
        button.classType = 'primary';
        button.triggerType = 'modal';
        return button;
    }
    static link(input: any){
        return new Button(input);
    }
}

export class DetailPanel extends Component {
    type = 'detail-panel';
    title: string;
    resultForm: Form;
    tabset: TabSet;
    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class TabSet extends Container<Tab> {
    type = 'tab-set';
    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class Tab extends Wrapper<Component> {
    type = 'tab';
    title: string;
    path: string;
    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class Form extends Row {
    type = 'form';
    path: string;
    method: string;
    contentType: string;
    collapsible = false;
    /**
     * 如果不为null，则从后台获取数据
     */
    autoLoadUrl: string;
    header: string;
    buttonsPlacement: 'footer' | 'line-end' | 'none' = 'footer';
    submitButton: Button;
    clearButton: Button;
    constructor(definition?: any) {
        super();
        copy(this, definition);
        if (! this.submitButton) {
            this.submitButton = new Button({classType: 'primary', text: '提交'});

            this.clearButton = new Button({classType: 'default', text: '取消'});
        }
    }
}

export class FormItem extends Component {
    field: string;
    label: string;
    description: string;
    value: any;
    required: boolean = false;
    hide: boolean = false;
    width: number = 16;

    constructor(definition?: any) {
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
        Object.assign<FieldSet, Row>(this, new Row());
        copy(this, definition);
    }
}

export class ArrayField extends FormItem {
    type = 'array';
    items: FormItem | FieldSet;
    minLength: number;
    maxLength: number;

    constructor(definition?: any) {
        super();
        copy(this, definition);
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
    }
}

export class Text extends FormItem {
    type = 'text';
    pattern: string;
    minLength: number;
    maxLength: number;
}

export class TextArea extends Text {
    type = 'textarea';
    auto: boolean = true;
    minRows: number = 1;
    maxRows: number = 3;

    get size() {
        return {minRows: this.minRows, maxRows: this.maxRows}
    }

    constructor(definition: any) {
        super();
        copy(this, definition);
    }

    static repair(textarea: TextArea){
        Object.setPrototypeOf(textarea, TextArea.prototype);
    }
}

export class RichText extends TextArea {
    type = 'rich-text';
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

export type Option = {
    label: string;
    value: string | number | boolean;
    children?: Option[];
    checked?: boolean;
    isLeaf?: boolean;
}

export class Choice extends FormItem {
    static DEFAULT_OPTIONS: Option[]= [
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
    options= Cascader.DEFAULT_OPTIONS;


    constructor(definition: any) {
        super();
        copy(this, definition);
        Cascader.updateOptionsLeaf(this.options);
    }

    static updateOptionsLeaf(options: Option[]){
        for (let option of options) {
            if(!option.children) {
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

    static updateOptionsChecked(options: Option[], array: any[]){
        if(array) {
            for (let value of array) {
                for (let option of options) {
                    if(option.value == value) {
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

    constructor(definition: any) {
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

}

export class DateRangePicker extends DatePicker {
    type = 'date-range';
}

export class TimePicker extends FormItem {
    type = 'time';
    format: string = "HH:mm:ss";

    constructor(definition: any) {
        super();
        copy(this, definition);
    }
}

export class UploadPicker extends FormItem {
    type = 'upload-picker';
    fileType: string[];
    listType: 'text' | 'picture' | 'picture-card';
    size: number;
    multiple: boolean; //是否允许上传多个文件
    limit: number;// 单次最大上传文件数（在允许单次上传多个文件的情况下有效）
}

export class DataPicker extends FormItem {
    type = 'data-picker';
    ref: string;
    view: string | Type<any>;


    constructor(definition: any) {
        super();
        copy(this, definition);
    }
}

export class DisplayText extends FormItem {
    type = 'display-text';
}

/******************************************************************************************************/

export class List extends Container<ListItem> {
    type = 'list';
    header: string;
    footer: string;
}

export class ListItem extends Container<Component> {
    type = 'list-item';
}

export class Card extends Container {
    type = 'card';
    title: string;

    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

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
        if (definition.children) {
            target.children = definition.children.map(e=>Component.create(e));
        }
    }
}
