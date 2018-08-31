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
import {Card, Cascader, Checkbox, DataPicker, DetailPanel, Form, InputNumber, List, Radio, Rate, Row, Table, TabSet} from '../public/model';

import {DDetailComponent} from '../builder/d-detail/d-detail.component';
import {DFormComponent} from '../builder/d-form/d-form.component';
import {DRowComponent} from '../builder/d-row/d-row.component';
import {DTableComponent} from '../builder/d-table/d-table.component';
import {DTabsetComponent} from '../builder/d-tabset/d-tabset.component';


export const builtInComponents = [
    {type: 'card',          group: 'component', modelType: Card, component: VCardComponent, designerComponent: DCardComponent},
    {type: 'detail-panel',  group: 'component', modelType: DetailPanel, component: VDetailComponent, designerComponent: DDetailComponent},
    {type: 'form',          group: 'component', modelType: Form, component: VFormComponent, designerComponent: DFormComponent},
    {type: 'list',          group: 'component', modelType: List, component: VListComponent, designerComponent: DListComponent},
    {type: 'row',           group: 'component', modelType: Row, component: VRowComponent, designerComponent: DRowComponent},
    {type: 'table',         group: 'component', modelType: Table, component: VTableComponent, designerComponent: DTableComponent},
    {type: 'tabset',        group: 'component', modelType: TabSet, component: VTabsetComponent, designerComponent: DTabsetComponent},
];


export const builtInFormControls = [
    {
        type: 'cascader',
        modelType: Cascader,
        component: VFormControlCascaderComponent,
        designerComponent: DFormControlCascaderComponent
    },
    {
        type: 'checkbox',
        modelType: Checkbox,
        component: VFormControlCheckboxComponent,
        designerComponent: DFormControlCheckboxComponent
    },
    {
        type: 'data-picker',
        modelType: DataPicker,
        component: VFormControlDataPickerComponent,
        designerComponent: DFormControlDataPickerComponent
    },
    {
        type: 'date',
        modelType: Cascader,
        component: VFormControlDateComponent,
        designerComponent: DFormControlDateComponent
    },
    {
        type: 'date-range',
        modelType: Cascader,
        component: VFormControlDateRangeComponent,
        designerComponent: DFormControlDateRangeComponent
    },
    {
        type: 'display-text',
        modelType: Cascader,
        component: VFormControlDisplayTextComponent,
        designerComponent: DFormControlDisplayTextComponent
    },
    {
        type: 'number',
        modelType: InputNumber,
        component: VFormControlNumberComponent,
        designerComponent: DFormControlNumberComponent
    },
    {
        type: 'radio',
        modelType: Radio,
        component: VFormControlRadioComponent,
        designerComponent: DFormControlRadioComponent
    },
    {
        type: 'rate',
        modelType: Rate,
        component: VFormControlRateComponent,
        designerComponent: DFormControlRateComponent
    },
    {
        type: 'select',
        modelType: Radio,
        component: VFormControlSelectComponent,
        designerComponent: DFormControlSelectComponent
    },
    {
        type: 'slider',
        modelType: Rate,
        component: VFormControlSliderComponent,
        designerComponent: DFormControlSliderComponent
    },
    {
        type: 'switch',
        modelType: Radio,
        component: VFormControlSwitchComponent,
        designerComponent: DFormControlSwitchComponent
    },
    {
        type: 'text',
        modelType: Rate,
        component: VFormControlTextComponent,
        designerComponent: DFormControlTextComponent
    },
    {
        type: 'textarea',
        modelType: Radio,
        component: VFormControlTextareaComponent,
        designerComponent: DFormControlTextareaComponent
    },
    {
        type: 'time',
        modelType: Rate,
        component: VFormControlTimeComponent,
        designerComponent: DFormControlTimeComponent
    },
    {
        type: 'upload-picker',
        modelType: Rate,
        component: VFormControlUploadComponent,
        designerComponent: DFormControlUploadComponent
    },
];


