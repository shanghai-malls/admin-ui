import {InterfaceListComponent} from '../main/interface/interface-list.component';
import {ViewManagementComponent} from '../main/view/view-management.component';
import {
    ArrayFieldSet,
    Button,
    Cascader,
    Cell,
    Checkbox,
    Choice,
    Column,
    Component,
    DataPicker,
    DatePicker,
    DateRangePicker,
    FieldSet,
    Form,
    FormItem,
    InputNumber,
    MapFieldSet,
    Option,
    ObjectSelector,
    Radio,
    Rate,
    RichText,
    Row,
    Select,
    Slider,
    Switch,
    Table,
    Text,
    TextArea,
    TimePicker,
    UploadPicker
} from './ui';

function fieldset(label: string, ...children : Component[]): Cell{
    return new Cell({
        width: 24,
        children: [
            new FieldSet({label, children})
        ]
    })
}

function columnToOption(column: Column): Option {
    let option: Option = {label: column.title, value: column.field};
    if (column.columns) {
        option.children = column.columns.map(columnToOption);
    }
    return option;
}

let RowMetadata = {
    flex: new Cell({
        width: 8,
        order: 0,
        children: [
            new Switch({
                field: 'flex',
                label: 'flex布局'
            })
        ]
    }),
    justify: new Cell({
        width: 8,
        children: [
            new Radio({
                field: 'justify',
                label: '横向排列',
                options: [
                    {label: '内容靠左', value: 'start'},
                    {label: '内容靠右', value: 'end'},
                    {label: '内容居中', value: 'center'},
                    {label: '两端对齐', value: 'space-between'},
                    {label: '均匀排布', value: 'space-around'}
                ]
            }),
        ]
    }),
    align: new Cell({
        width: 8,
        children: [
            new Radio({
                field: 'align',
                label: '纵向对齐',
                options: [
                    {label: '顶部对齐', value: 'top'},
                    {label: '居中对齐', value: 'middle'},
                    {label: '底部对齐', value: 'bottom'}
                ]
            })
        ]
    }),
    horizontal: new Cell({
        width: 12,
        children: [
            new Slider({
                field: 'horizontal',
                label: '水平',
                min: 0,
                max: 24
            })
        ]
    }),
    vertical: new Cell({
        width: 12,
        children: [
            new Slider({
                field: 'vertical',
                label: '垂直',
                stride: 3,
                vertical: true,
                min: 0,
                max: 48
            })
        ]
    })
};
let FormMetadata = {
    path: new Cell({
        width: 12,
        children: [
            new DataPicker({
                field: 'path',
                label: '接口地址',
                ref: 'qualifiedPath',
                view: InterfaceListComponent,
                onReceive: function (selectedRow: any) {
                    let select = ObjectSelector.querySelector(FormMetadata.method, d => d.field === 'method') as Select;
                    let options = selectedRow.methods.map(m => ({
                        label: m.displayName + "(" + m.method.toUpperCase() + ")",
                        value: m.method
                    }));
                    select.options = options;
                    select.value = options[0].value;
                }
            })
        ]
    }),
    method: new Cell({
        width: 12,
        children: [
            new Select({
                field: 'method',
                label: '请求方法'
            })
        ]
    }),
};

let FormItemMetadata = {
    field: new Cell({
        width: 8,
        children: [
            new Text({
                label: '字段名',
                field: 'field',
                required: true,
            })
        ]
    }),
    label: new Cell({
        width: 8,
        children: [
            new Text({
                label: 'label',
                field: 'label',
                required: true,
            })
        ]
    }),
    description: new Cell({
        width: 8,
        children: [
            new Text({
                field: 'description',
                label: '字段描述'
            })
        ]
    }),
    value: new Cell({
        width: 8,
        children: [
            new Text({
                field: 'value',
                label: '默认值',
            })
        ]
    }),
    width: new Cell({
        width: 16,
        children: [
            new Slider({
                width: 20,
                field: 'width',
                label: '字段宽度',
                min: 8,
                max: 23,
                value: 16
            })
        ]
    }),
    required: new Cell({
        width: 8,
        children: [
            new Switch({
                field: 'required',
                label: '是否必填',
                options: [
                    {value: true, label: '是'},
                    {value: false, label: '否'},
                ]
            })
        ]
    })
};
let TextMetadata = {
    minLength: new Cell({
        width: 8,
        children: [
            new InputNumber({
                field: 'minLength',
                label: '最小长度',
            })
        ]
    }),
    maxLength:new Cell({
        width: 8,
        children: [
            new InputNumber({
                field: 'maxLength',
                label: '最大长度',
            })
        ]
    }),
    pattern: new Cell({
        width: 8,
        children: [
            new Text({
                field: 'pattern',
                label: '正则表达式',
            })
        ]
    }),
};
let TextAreaMetadata = {
    value: new Cell({
        width: 16,
        children: [
            new TextArea({
                width: 20,
                field: 'value',
                label: '默认值',
            })
        ]
    }),
    auto:new Cell({
        children: [
            new Switch({
                field: "auto",
                label: '自适应尺寸',
            })
        ]
    }),
    maxRows: new Cell({
        children: [
            new InputNumber({
                field: 'maxRows',
                label: '最大行数',
                min: 1,
            })
        ]
    }),
    minRows: new Cell({
        children: [
            new InputNumber({
                label: '最小行数',
                field: 'minRows',
                min: 1,
                value: 1
            })
        ]
    })
};



let ChoiceMetadata = {
    options: new Cell({
        width: 24,
        children: [
            new ArrayFieldSet({
                label: '选项列表',
                field: 'options',
                children: [
                    new Cell({
                        children: [
                            new Text({
                                field: 'value',
                                label: '选项值',
                            })
                        ]
                    }),
                    new Cell({
                        children: [
                            new Text({
                                field: 'label',
                                label: '选项文本',
                            })
                        ]
                    })
                ]
            })
        ]
    })
};

let SelectMetadata = {
    value : new Cell({
        children: [
            new Select({
                label: '默认值',
                field: 'value'
            })
        ]
    })
};

let InputNumberMetadata = {
    value: new Cell({
        children: [
            new InputNumber({
                field: 'value',
                label: '默认值',
            })
        ]
    }),
    min: new Cell({
        children: [
            new InputNumber({
                field: 'min',
                label: '最小值',
            })
        ]
    }),
    max: new Cell({
        children: [
            new InputNumber({
                field: 'max',
                label: '最大值',
            })
        ]
    }),
    stride: new Cell({
        children: [
            new InputNumber({
                field: 'stride',
                label: '步幅',
                value: 1,
            })
        ]
    })
};
let RateMetadata = {
    value: new Cell({
        children: [
            new Rate({
                field: 'value',
                label: '默认值',
                half: true,
                count: 5
            })
        ]
    }),
    half: new Cell({
        children: [
            new Switch({
                field: 'half',
                label: '允许半选',
                value: true
            })
        ]
    }),
    count: new Cell({
        children: [
            new Slider({
                field: 'count',
                label: 'star总数',
                min: 5,
                max: 10,
                value: 5,
                stride: 5
            })
        ]
    }),
};
let DatePickerMetadata = {
    value: new Cell({
        children: [
            new DatePicker({
                field: 'value',
                label: '默认值',
            })
        ]
    }),
    showTime: new Cell({
        children: [
            new Switch({
                width: 15,
                field: 'showTime',
                label: '支持时间选择'
            })
        ]
    }),
    format: new Cell({
        children: [
            new Text({
                field: 'format',
                label: '日期格式',
            })
        ]
    }),
    startDate: new Cell({
        width: 8,
        children: [
            new DatePicker({
                field: 'startDate',
                label: '开始时间',
                showTime: false,
                format: "yyyy-MM-dd"
            })
        ]
    }),
    endDate: new Cell({
        width: 8,
        children: [
            new DatePicker({
                field: 'endDate',
                label: '结束时间',
                showTime: false,
                format: "yyyy-MM-dd"
            })
        ]
    }),
};
let DateRangePickerMetadata = {
    value: new Cell({
        children: [
            new DateRangePicker({
                field: 'value',
                label: '默认值',
            })
        ]
    }),
};
let TimePickerMetadata = {
    format: new Cell({
        children: [
            new Text({
                field: 'format',
                label: '时间格式',
            })
        ]
    })
};
let DataPickerMetadata = {
    view: new Cell({
        children: [
            new DataPicker({
                field: 'view',
                label: '视图',
                view: ViewManagementComponent,
                ref: 'id',
                onReceive:(selectedRow: any) => {
                    let view = selectedRow.view;
                    let table = ObjectSelector.querySelector<Table>(view, d => d.type === 'table');
                    let cascader = ObjectSelector.querySelector<Cascader>(DataPickerMetadata.ref, d => d.field === 'ref');
                    if(table && table.columns) {
                        cascader.options = table.columns.map(columnToOption);
                    }
                }
            }),
        ]
    }),
    ref: new Cell({
        children:[
            new Cascader({
                field: 'ref',
                label: '引用字段',
                options: []
            }),
        ]
    })
};

let TableMetadata = {
    bordered: new Cell({
        children: [
            new Switch({
                width: 8,
                field: 'bordered',
                label: '是否展示外边框和列边框'
            })
        ]
    }),

    url: new Cell({
        width:16,
        children: [
            new Text({
                width: 19,
                field: 'url',
                label: '表格数据接口'
            })
        ]
    })

};


Row.metadata = new Form({
    children: [
        fieldset('栅格布局设置', RowMetadata.flex, RowMetadata.justify, RowMetadata.align),
        fieldset('栅格间距设置', RowMetadata.horizontal, RowMetadata.vertical),
    ]
});
Form.metadata = new Form({
    children: [
        fieldset('栅格布局设置', RowMetadata.flex, RowMetadata.justify, RowMetadata.align),
        fieldset('栅格间距设置', RowMetadata.horizontal, RowMetadata.vertical),
        fieldset('接口设置', FormMetadata.path, FormMetadata.method),
    ]
});
FormItem.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label, FormItemMetadata.description,FormItemMetadata.value),
        fieldset("外观设置", FormItemMetadata.width),
        fieldset("校验规则", FormItemMetadata.required)
    ]
});
FieldSet.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label),
        fieldset("校验规则", FormItemMetadata.required),
        fieldset('栅格布局设置', RowMetadata.flex, RowMetadata.justify, RowMetadata.align),
        fieldset('栅格间距设置', RowMetadata.horizontal, RowMetadata.vertical)
    ]
});
Text.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label, FormItemMetadata.description,FormItemMetadata.value),
        fieldset("外观设置", FormItemMetadata.width),
        fieldset("校验规则", FormItemMetadata.required, TextMetadata.minLength, TextMetadata.maxLength, TextMetadata.pattern)
    ]
});
TextArea.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label, FormItemMetadata.description,TextAreaMetadata.value),
        fieldset("外观设置", TextAreaMetadata.auto, TextAreaMetadata.maxRows, TextAreaMetadata.minRows, FormItemMetadata.width),
        fieldset("校验规则", FormItemMetadata.required, TextMetadata.minLength, TextMetadata.maxLength, TextMetadata.pattern)
    ]
});
Choice.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label, FormItemMetadata.description,FormItemMetadata.value),
        fieldset("外观设置", FormItemMetadata.width),
        fieldset("校验规则", FormItemMetadata.required),
        ChoiceMetadata.options,
    ]
});
Select.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label, FormItemMetadata.description,SelectMetadata.value),
        fieldset("外观设置", FormItemMetadata.width),
        fieldset("校验规则", FormItemMetadata.required),
        ChoiceMetadata.options,
    ]
});
InputNumber.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label, FormItemMetadata.description,InputNumberMetadata.value),
        fieldset("外观设置", FormItemMetadata.width, InputNumberMetadata.stride),
        fieldset("校验规则", FormItemMetadata.required, InputNumberMetadata.min, InputNumberMetadata.max),
    ]
});
Rate.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label, FormItemMetadata.description,RateMetadata.value),
        fieldset("外观设置", RateMetadata.half, RateMetadata.count, FormItemMetadata.width),
        fieldset("校验规则", FormItemMetadata.required)
    ]
});
DatePicker.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label, FormItemMetadata.description,DatePickerMetadata.value),
        fieldset("校验规则", FormItemMetadata.required, DatePickerMetadata.startDate, DatePickerMetadata.endDate),
        fieldset("外观设置", DatePickerMetadata.showTime, DatePickerMetadata.format, FormItemMetadata.width,  ),
    ]
});
DateRangePicker.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label, FormItemMetadata.description,DateRangePickerMetadata.value),
        fieldset("校验规则", FormItemMetadata.required, DatePickerMetadata.startDate, DatePickerMetadata.endDate),
        fieldset("外观设置", DatePickerMetadata.showTime, DatePickerMetadata.format, FormItemMetadata.width,  ),
    ]
});
TimePicker.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label, FormItemMetadata.description,FormItemMetadata.value),
        fieldset("外观设置", TimePickerMetadata.format, FormItemMetadata.width),
        fieldset("校验规则", FormItemMetadata.required)
    ]
});
DataPicker.metadata = new Form({
    children: [
        fieldset("基本设置", FormItemMetadata.field, FormItemMetadata.label, FormItemMetadata.description,FormItemMetadata.value),
        fieldset("外观设置", FormItemMetadata.width),
        fieldset("校验规则", FormItemMetadata.required),
        fieldset("数据引用设置", DataPickerMetadata.view, DataPickerMetadata.ref),
    ]
});


Table.metadata = new Form({
    children: [
        TableMetadata.bordered,TableMetadata.url
    ]
});
Button.metadata = new Form({
    children: [
        new Cell({
            children: [
                new Text({
                    field: 'text',
                    label: '按钮文本'
                })
            ]
        }),
        new Cell({
            children: [
                new Select({
                    field: 'classType',
                    label: '样式类型',
                    options: [
                        {label: 'primary', value: 'primary'},
                        {label: 'default', value: 'default'},
                        {label: 'danger', value: 'danger'},
                        {label: 'dashed', value: 'dashed'},
                    ]
                })
            ]
        }),
        new Cell({
            children: [
                new Select({
                    field: 'triggerType',
                    label: '动作类型',
                    options: [
                        {label: '跳转', value: 'link'},
                        {label: '模态框', value: 'modal'},
                        {label: '确认框', value: 'confirm'},
                        {label: '内建', value: 'none'},
                    ]
                })
            ]
        }),
        new Cell({
            children: [
                new DataPicker({
                    field: 'viewId',
                    ref: 'viewId',
                    label: '视图Id',
                    view: ViewManagementComponent,
                })
            ]
        }),
        new Cell({
            children: [
                new DataPicker({
                    field: 'path',
                    ref: 'path',
                    label: '资源路径',
                    view: InterfaceListComponent,
                })
            ]
        }),
        new Cell({
            children: [
                new Text({
                    field: 'method',
                    label: '方法',
                })
            ]
        })
    ]
});

export let metadata = {
    row: Row.metadata,
    form: Form.metadata,
    fieldset: FieldSet.metadata,
    array: ArrayFieldSet.metadata,
    map: MapFieldSet.metadata,
    text: Text.metadata,
    textarea: TextArea.metadata,
    'rich-text': RichText.metadata,
    date: DatePicker.metadata,
    'date-range': DateRangePicker.metadata,
    time: TimePicker.metadata,
    select: Select.metadata,
    radio: Radio.metadata,
    checkbox: Checkbox.metadata,
    number: InputNumber.metadata,
    switch: Switch.metadata,
    slider: Slider.metadata,
    rate: Rate.metadata,
    upload: UploadPicker.metadata,
    'data-picker': DataPicker.metadata,
    table: Table.metadata
};

