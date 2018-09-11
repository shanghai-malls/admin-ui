import {Injectable} from '@angular/core';
import {ComponentManager} from './component-manager';
import {VFormControlUploadComponent} from '../../runner/v-form/v-form-control-upload.component';
import {DFormControlTextareaComponent} from '../../builder/d-form/d-form-control-textarea.component';
import {VFormControlDisplayTextComponent} from '../../runner/v-form/v-form-control-display-text.component';
import {VFormControlSwitchComponent} from '../../runner/v-form/v-form-control-switch.component';
import {VFormControlCascaderComponent} from '../../runner/v-form/v-form-control-cascader.component';
import {DFormControlDisplayTextComponent} from '../../builder/d-form/d-form-control-display-text.component';
import {DFormControlSelectComponent} from '../../builder/d-form/d-form-control-select.component';
import {DFormControlCheckboxComponent} from '../../builder/d-form/d-form-control-checkbox.component';
import {VFormControlTimeComponent} from '../../runner/v-form/v-form-control-time.component';
import {DFormControlDataPickerComponent} from '../../builder/d-form/d-form-control-data-picker.component';
import {VTabsetComponent} from '../../runner/v-tabset/v-tabset.component';
import {VRowComponent} from '../../runner/v-row/v-row.component';
import {VTableComponent} from '../../runner/v-table/v-table.component';
import {VCardComponent} from '../../runner/v-card/v-card.component';
import {VDetailComponent} from '../../runner/v-detail/v-detail.component';
import {VFormComponent} from '../../runner/v-form/v-form.component';
import {DFormControlTimeComponent} from '../../builder/d-form/d-form-control-time.component';
import {DCardComponent} from '../../builder/d-card/d-card.component';
import {DFormControlDateComponent} from '../../builder/d-form/d-form-control-date.component';
import {VFormControlDateComponent} from '../../runner/v-form/v-form-control-date.component';
import {VFormControlSliderComponent} from '../../runner/v-form/v-form-control-slider.component';
import {VListComponent} from '../../runner/v-list/v-list.component';
import {DFormControlCascaderComponent} from '../../builder/d-form/d-form-control-cascader.component';
import {DFormControlSliderComponent} from '../../builder/d-form/d-form-control-slider.component';
import {VFormControlRateComponent} from '../../runner/v-form/v-form-control-rate.component';
import {VFormControlCheckboxComponent} from '../../runner/v-form/v-form-control-checkbox.component';
import {VFormControlSelectComponent} from '../../runner/v-form/v-form-control-select.component';
import {DFormControlTextComponent} from '../../builder/d-form/d-form-control-text.component';
import {VFormControlTextComponent} from '../../runner/v-form/v-form-control-text.component';
import {VFormControlRadioComponent} from '../../runner/v-form/v-form-control-radio.component';
import {VFormControlTextareaComponent} from '../../runner/v-form/v-form-control-textarea.component';
import {DListComponent} from '../../builder/d-list/d-list.component';
import {VFormControlDataPickerComponent} from '../../runner/v-form/v-form-control-data-picker.component';
import {DFormControlRadioComponent} from '../../builder/d-form/d-form-control-radio.component';
import {VFormControlDateRangeComponent} from '../../runner/v-form/v-form-control-date-range.component';
import {DFormControlDateRangeComponent} from '../../builder/d-form/d-form-control-date-range.component';
import {DFormControlRateComponent} from '../../builder/d-form/d-form-control-rate.component';
import {DFormControlSwitchComponent} from '../../builder/d-form/d-form-control-switch.component';
import {DFormControlUploadComponent} from '../../builder/d-form/d-form-control-upload.component';
import {DFormControlNumberComponent} from '../../builder/d-form/d-form-control-number.component';
import {VFormControlNumberComponent} from '../../runner/v-form/v-form-control-number.component';
import {DDetailComponent} from '../../builder/d-detail/d-detail.component';
import {DFormComponent} from '../../builder/d-form/d-form.component';
import {DRowComponent} from '../../builder/d-row/d-row.component';
import {DTableComponent} from '../../builder/d-table/d-table.component';
import {DTabsetComponent} from '../../builder/d-tabset/d-tabset.component';

import {
    Card,
    Cascader,
    Checkbox,
    DataPicker,
    DatePicker,
    DateRangePicker,
    DetailPanel,
    DisplayText,
    Form,
    InputNumber,
    List,
    Radio,
    Rate,
    Row,
    Select,
    Slider,
    Switch,
    Table,
    TabSet,
    Text,
    TextArea
} from '../model';


@Injectable({providedIn: 'root'})
export class ComponentRegistrar {
    constructor(private componentManager: ComponentManager) {}

    registerBuiltIn(){
        [
            {
                type: 'card',
                name: '卡片',
                group: 'display',
                metamodelType: Card,
                componentType: VCardComponent,
                designerComponentType: DCardComponent
            },
            {
                type: 'detail-panel',
                name: '详情页',
                group: 'display',
                metamodelType: DetailPanel,
                componentType: VDetailComponent,
                designerComponentType: DDetailComponent
            },
            {
                type: 'form',
                name: '表单容器',
                group: 'display',
                metamodelType: Form,
                componentType: VFormComponent,
                designerComponentType: DFormComponent
            },
            {
                type: 'list',
                name: '列表',
                group: 'display',
                metamodelType: List,
                componentType: VListComponent,
                designerComponentType: DListComponent
            },
            {
                type: 'row',
                name: '栅格系统',
                group: 'layout',
                metamodelType: Row,
                componentType: VRowComponent,
                designerComponentType: DRowComponent
            },
            {
                type: 'table',
                name: '表格',
                group: 'display',
                metamodelType: Table,
                componentType: VTableComponent,
                designerComponentType: DTableComponent
            },
            {
                type: 'tabset',
                name: '标签页',
                group: 'display',
                metamodelType: TabSet,
                componentType: VTabsetComponent,
                designerComponentType: DTabsetComponent
            },
        ].forEach(item=>this.componentManager.registerComponentDefinition(item));
        [
            {
                type: 'cascader',
                name: '级联选择',
                metamodelType: Cascader,
                componentType: VFormControlCascaderComponent,
                designerComponentType: DFormControlCascaderComponent
            },
            {
                type: 'checkbox',
                name: '多选框',
                metamodelType: Checkbox,
                componentType: VFormControlCheckboxComponent,
                designerComponentType: DFormControlCheckboxComponent
            },
            {
                type: 'data-picker',
                name: '数据引用',
                metamodelType: DataPicker,
                componentType: VFormControlDataPickerComponent,
                designerComponentType: DFormControlDataPickerComponent
            },
            {
                type: 'date',
                name: '日期',
                metamodelType: DatePicker,
                componentType: VFormControlDateComponent,
                designerComponentType: DFormControlDateComponent
            },
            {
                type: 'date-range',
                name: '日期区间',
                metamodelType: DateRangePicker,
                componentType: VFormControlDateRangeComponent,
                designerComponentType: DFormControlDateRangeComponent
            },
            {
                type: 'display-text',
                name: '文本展示',
                metamodelType: DisplayText,
                componentType: VFormControlDisplayTextComponent,
                designerComponentType: DFormControlDisplayTextComponent
            },
            {
                type: 'number',
                name: '数字',
                metamodelType: InputNumber,
                componentType: VFormControlNumberComponent,
                designerComponentType: DFormControlNumberComponent
            },
            {
                type: 'radio',
                name: '单选框',
                metamodelType: Radio,
                componentType: VFormControlRadioComponent,
                designerComponentType: DFormControlRadioComponent
            },
            {
                type: 'rate',
                name: '评分',
                metamodelType: Rate,
                componentType: VFormControlRateComponent,
                designerComponentType: DFormControlRateComponent
            },
            {
                type: 'select',
                name: '评分',
                metamodelType: Select,
                componentType: VFormControlSelectComponent,
                designerComponentType: DFormControlSelectComponent
            },
            {
                type: 'slider',
                name: '滑动条',
                metamodelType: Slider,
                componentType: VFormControlSliderComponent,
                designerComponentType: DFormControlSliderComponent
            },
            {
                type: 'switch',
                name: '开关',
                metamodelType: Switch,
                componentType: VFormControlSwitchComponent,
                designerComponentType: DFormControlSwitchComponent
            },
            {
                type: 'text',
                name: '单行文本',
                metamodelType: Text,
                componentType: VFormControlTextComponent,
                designerComponentType: DFormControlTextComponent
            },
            {
                type: 'textarea',
                name: '多行文本',
                metamodelType: TextArea,
                componentType: VFormControlTextareaComponent,
                designerComponentType: DFormControlTextareaComponent
            },
            {
                type: 'time',
                name: '时间',
                metamodelType: Rate,
                componentType: VFormControlTimeComponent,
                designerComponentType: DFormControlTimeComponent
            },
            {
                type: 'upload-picker',
                name: '上传',
                metamodelType: Rate,
                componentType: VFormControlUploadComponent,
                designerComponentType: DFormControlUploadComponent
            },
        ].forEach(item=>this.componentManager.registerControlDefinition(item));
    }
}
