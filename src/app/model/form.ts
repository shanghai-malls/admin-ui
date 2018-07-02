import {Form, ObjectSelector, FormItem, FieldSet, Cell} from './ui';

export class FormHelper {

    /**
     * 为了使默认值表单类型和字段表单类型一致，否则默认值的表单类型都将是input
     * @param {Form} form
     * @param value
     */
    private static updateDefaultValue(form: Form, value?: any) {
        let defaultValue = ObjectSelector.querySelector<FormItem>(form, d => d.field === 'value');
        if (value && defaultValue) {
            Object.assign(defaultValue, value, {
                field: 'value',
                label: '默认值',
                description: defaultValue.description,
                width: defaultValue.width,
                value: defaultValue.value,
                required: defaultValue.required
            });
        }
    }


    private static valueBindFieldSet(field: FieldSet, value: any) {
        for (let child of field.children) {
            if (child instanceof Cell) {
                for (let x of child.children) {
                    if (x instanceof FormItem) {
                        x.parentValue = value;
                    } else if (x instanceof FieldSet) {
                        x.parentValue = value;
                        if (x.field) {
                            FormHelper.valueBindFieldSet(x, value[x.field])
                        } else {
                            FormHelper.valueBindFieldSet(x, value)
                        }
                    }
                }
            }
        }
    }

    static valueBindForm(form: Form, value: any): Form {
        if (value instanceof FormItem) {
            FormHelper.updateDefaultValue(form, value);
        }

        let newForm = new Form(form);
        for (let child of newForm.children) {
            if (child instanceof Cell) {
                for (let x of child.children) {
                    if (x instanceof FormItem) {
                        x.parentValue = value;
                    } else if (x instanceof FieldSet) {
                        x.parentValue = value;
                        if (x.field) {
                            FormHelper.valueBindFieldSet(x, value[x.field])
                        } else {
                            FormHelper.valueBindFieldSet(x, value)
                        }
                    }
                }
            }
        }
        return newForm;
    }
}
