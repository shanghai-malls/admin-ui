import {VFormControlUploadComponent} from '../runner/v-form/v-form-control-upload.component';
import {DFormControlTextareaComponent} from '../builder/d-form/d-form-control-textarea.component';
import {VFormControlDisplayTextComponent} from '../runner/v-form/v-form-control-display-text.component';
import {VFormControlSwitchComponent} from '../runner/v-form/v-form-control-switch.component';
import {VFormControlCascaderComponent} from '../runner/v-form/v-form-control-cascader.component';
import {DFormControlDisplayTextComponent} from '../builder/d-form/d-form-control-display-text.component';
import {DFormControlSelectComponent} from '../builder/d-form/d-form-control-select.component';
import {DFormControlCheckboxComponent} from '../builder/d-form/d-form-control-checkbox.component';
import {VFormControlTimeComponent} from '../runner/v-form/v-form-control-time.component';
import {DFormControlDataPickerComponent} from '../builder/d-form/d-form-control-data-picker.component';
import {VTabsetComponent} from '../runner/v-tabset/v-tabset.component';
import {VRowComponent} from '../runner/v-row/v-row.component';
import {VTableComponent} from '../runner/v-table/v-table.component';
import {VCardComponent} from '../runner/v-card/v-card.component';
import {VDetailComponent} from '../runner/v-detail/v-detail.component';
import {VFormComponent} from '../runner/v-form/v-form.component';
import {DFormControlTimeComponent} from '../builder/d-form/d-form-control-time.component';
import {DCardComponent} from '../builder/d-card/d-card.component';

import {DFormControlDateComponent} from '../builder/d-form/d-form-control-date.component';
import {VFormControlDateComponent} from '../runner/v-form/v-form-control-date.component';
import {VFormControlSliderComponent} from '../runner/v-form/v-form-control-slider.component';
import {VListComponent} from '../runner/v-list/v-list.component';
import {DFormControlCascaderComponent} from '../builder/d-form/d-form-control-cascader.component';
import {DFormControlSliderComponent} from '../builder/d-form/d-form-control-slider.component';
import {VFormControlRateComponent} from '../runner/v-form/v-form-control-rate.component';
import {VFormControlCheckboxComponent} from '../runner/v-form/v-form-control-checkbox.component';
import {VFormControlSelectComponent} from '../runner/v-form/v-form-control-select.component';
import {DFormControlTextComponent} from '../builder/d-form/d-form-control-text.component';
import {VFormControlTextComponent} from '../runner/v-form/v-form-control-text.component';
import {VFormControlRadioComponent} from '../runner/v-form/v-form-control-radio.component';
import {VFormControlTextareaComponent} from '../runner/v-form/v-form-control-textarea.component';
import {DListComponent} from '../builder/d-list/d-list.component';
import {VFormControlDataPickerComponent} from '../runner/v-form/v-form-control-data-picker.component';
import {DFormControlRadioComponent} from '../builder/d-form/d-form-control-radio.component';
import {VFormControlDateRangeComponent} from '../runner/v-form/v-form-control-date-range.component';
import {DFormControlDateRangeComponent} from '../builder/d-form/d-form-control-date-range.component';
import {DFormControlRateComponent} from '../builder/d-form/d-form-control-rate.component';
import {DFormControlSwitchComponent} from '../builder/d-form/d-form-control-switch.component';
import {DFormControlUploadComponent} from '../builder/d-form/d-form-control-upload.component';
import {DFormControlNumberComponent} from '../builder/d-form/d-form-control-number.component';
import {VFormControlNumberComponent} from '../runner/v-form/v-form-control-number.component';
import {
    Card,
    Cascader,
    Checkbox,
    DataPicker, DatePicker, DateRangePicker,
    DetailPanel, DisplayText,
    Form,
    InputNumber,
    List,
    Radio,
    Rate,
    Row,
    Select, Slider, Switch,
    Table,
    TabSet, Text, TextArea
} from '../public/model';

import {DDetailComponent} from '../builder/d-detail/d-detail.component';
import {DFormComponent} from '../builder/d-form/d-form.component';
import {DRowComponent} from '../builder/d-row/d-row.component';
import {DTableComponent} from '../builder/d-table/d-table.component';
import {DTabsetComponent} from '../builder/d-tabset/d-tabset.component';


export const builtInComponents = [
    {
        type: 'card',
        name: '卡片',
        group: 'display',
        modelType: Card,
        component: VCardComponent,
        designerComponent: DCardComponent
    },
    {
        type: 'detail-panel',
        name: '详情页',
        group: 'display',
        modelType: DetailPanel,
        component: VDetailComponent,
        designerComponent: DDetailComponent
    },
    {
        type: 'form',
        name: '表单容器',
        group: 'display',
        modelType: Form,
        component: VFormComponent,
        designerComponent: DFormComponent
    },
    {
        type: 'list',
        name: '列表',
        group: 'display',
        modelType: List,
        component: VListComponent,
        designerComponent: DListComponent
    },
    {
        type: 'row',
        name: '栅格系统',
        group: 'layout',
        modelType: Row,
        component: VRowComponent,
        designerComponent: DRowComponent
    },
    {
        type: 'table',
        name: '表格',
        group: 'display',
        modelType: Table,
        component: VTableComponent,
        designerComponent: DTableComponent
    },
    {
        type: 'tabset',
        name: '标签页',
        group: 'display',
        modelType: TabSet,
        component: VTabsetComponent,
        designerComponent: DTabsetComponent
    },
];


export const builtInFormControls = [
    {
        type: 'cascader',
        name: '级联选择',
        modelType: Cascader,
        component: VFormControlCascaderComponent,
        designerComponent: DFormControlCascaderComponent
    },
    {
        type: 'checkbox',
        name: '多选框',
        modelType: Checkbox,
        component: VFormControlCheckboxComponent,
        designerComponent: DFormControlCheckboxComponent
    },
    {
        type: 'data-picker',
        name: '数据引用',
        modelType: DataPicker,
        component: VFormControlDataPickerComponent,
        designerComponent: DFormControlDataPickerComponent
    },
    {
        type: 'date',
        name: '日期',
        modelType: DatePicker,
        component: VFormControlDateComponent,
        designerComponent: DFormControlDateComponent
    },
    {
        type: 'date-range',
        name: '日期区间',
        modelType: DateRangePicker,
        component: VFormControlDateRangeComponent,
        designerComponent: DFormControlDateRangeComponent
    },
    {
        type: 'display-text',
        name: '文本展示',
        modelType: DisplayText,
        component: VFormControlDisplayTextComponent,
        designerComponent: DFormControlDisplayTextComponent
    },
    {
        type: 'number',
        name: '数字',
        modelType: InputNumber,
        component: VFormControlNumberComponent,
        designerComponent: DFormControlNumberComponent
    },
    {
        type: 'radio',
        name: '单选框',
        modelType: Radio,
        component: VFormControlRadioComponent,
        designerComponent: DFormControlRadioComponent
    },
    {
        type: 'rate',
        name: '评分',
        modelType: Rate,
        component: VFormControlRateComponent,
        designerComponent: DFormControlRateComponent
    },
    {
        type: 'select',
        name: '评分',
        modelType: Select,
        component: VFormControlSelectComponent,
        designerComponent: DFormControlSelectComponent
    },
    {
        type: 'slider',
        name: '滑动条',
        modelType: Slider,
        component: VFormControlSliderComponent,
        designerComponent: DFormControlSliderComponent
    },
    {
        type: 'switch',
        name: '开关',
        modelType: Switch,
        component: VFormControlSwitchComponent,
        designerComponent: DFormControlSwitchComponent
    },
    {
        type: 'text',
        name: '单行文本',
        modelType: Text,
        component: VFormControlTextComponent,
        designerComponent: DFormControlTextComponent
    },
    {
        type: 'textarea',
        name: '多行文本',
        modelType: TextArea,
        component: VFormControlTextareaComponent,
        designerComponent: DFormControlTextareaComponent
    },
    {
        type: 'time',
        name: '时间',
        modelType: Rate,
        component: VFormControlTimeComponent,
        designerComponent: DFormControlTimeComponent
    },
    {
        type: 'upload-picker',
        name: '上传',
        modelType: Rate,
        component: VFormControlUploadComponent,
        designerComponent: DFormControlUploadComponent
    },
];


