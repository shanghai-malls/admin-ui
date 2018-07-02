import {Type} from '@angular/core';

/**
 * 组件基类
 */
export class Component {
    type: string;
    static metadata: any = {};

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
        if (definition.type == 'tab') {
            return new Tab(definition);
        }
        if (definition.type == 'tab-item') {
            return new TabItem(definition);
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

export class Container<T extends Component> extends Component {
    children: T[] = [];
}

interface RowInterface {
    flex: boolean;
    justify: string;
    align: string;
    horizontal: number;
    vertical: number;
}

interface FieldInterface {
    field: string;
    label: string;
    required: boolean;
    parentValue: any;
}

export class Row extends Container<Cell> implements RowInterface {
    type = 'row';
    flex = true;
    justify = 'start';
    align = 'top';
    horizontal = 6;
    vertical = 6;

    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class Cell extends Container<Component> {
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

declare type TriggerType = "link" | "modal" | "confirm" | 'none' ;
declare type ClassType = 'primary' | 'default' | 'danger' | 'dashed';

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
}

export class List extends Container<ListItem> {
    type = 'list';
    header: string;
    footer: string;
}

export class ListItem extends Container<Component> {
    type = 'list-item';
}

export class Card extends Container<Component> {
    type = 'card';
    title: string;

    constructor(definition?: any) {
        super();
        copy(this, definition);
    }
}

export class Tab extends Container<TabItem> {
    type = 'tab';
}

export class TabItem extends Container<Component> {
    type = 'tab-item';
    title: string;
}

export class Form extends Row {
    type = 'form';
    path: string;
    method: string;
    contentType: string;
}

export class FieldSet extends Row implements FieldInterface {

    type = 'fieldset';
    label = '字段集';
    field: string;
    required = false;
    parentValue: any;

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

export class MapFieldSet extends ArrayFieldSet {
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

export class FormItem extends Component implements FieldInterface {
    field: string;
    label: string;
    description: string;
    value: any;
    required: boolean = false;
    readonly: boolean = false;
    width: number = 16;
    parentValue: any;

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
}

export class Choice extends FormItem {
    options: Option [] = [
        {label: '选项1', value: 1},
        {label: '选项2', value: 2},
        {label: '选项3', value: 3},
    ];

    constructor(definition: any) {
        super();
        copy(this, definition);
    }
}

export class Cascader extends Choice {
    type = 'cascader';
}

export class Select extends Choice {
    type = 'select';
}

export class Radio extends Choice {
    type = 'radio';
}

export class Checkbox extends Choice {
    type = 'checkbox';
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

    onReceive(selectedRow: any) {

    }

    constructor(definition: any) {
        super();
        copy(this, definition);
    }
}

function copy(target: any, definition?: any) {
    if (definition) {
        Object.assign<any, any>(target, definition);
        if (definition.children) {
            target.children = definition.children.map(e=>Component.create(e));
        }
    }
}

declare type SelectorFunction = (component: any) => boolean;

export class ObjectSelector {

    static querySelectorAll<T>(node: any, ...filters: SelectorFunction[]): T[] {
        let result = [];
        let matchAll = true;
        for (let filter of filters) {
            matchAll = matchAll && filter(node);
        }
        if (matchAll) {
            result.push(node);
        }
        if (node.hasOwnProperty('children')) {
            for (let child of node.children) {
                result.push(...ObjectSelector.querySelectorAll(child, ...filters));
            }
        }
        return result as T[];
    }

    static querySelector<T>(node: any, ...filters: SelectorFunction[]): T {
        let matchAll = true;
        for (let filter of filters) {
            matchAll = matchAll && filter(node);
        }
        if (matchAll) {
            return node as T;
        }
        if (node.hasOwnProperty('children')) {
            for (let child of node.children) {
                let matchedResult = ObjectSelector.querySelector<T>(child, ...filters);
                if (matchedResult) {
                    return matchedResult;
                }
            }
        }
    }
}
