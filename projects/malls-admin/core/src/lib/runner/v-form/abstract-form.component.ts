import {AutoLoader, Form, formatPath, FormBody,} from '../../public/model';
import {FormArray, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {HttpService} from '../../public/service/http.service';
import {TransformService} from '../../public/service/transform.service';
import {FormBodyProcessor} from '../../public/service/form-body-processor';

export interface FormGroups {
    headers?: FormGroup;
    queryParameters?: FormGroup;
    body?: FormGroup[];
}

function uniqueKeyValidator(input: FormControl): ValidationErrors | null {
    if (input.parent) {
        let currentValue = input.value;
        let formArray = input.parent.parent as FormArray;
        for (let i = 0; i < formArray.length; i++) {
            let control = (<FormGroup>formArray.at(i)).controls.key;
            if (input === control) {
                continue;
            }
            if (currentValue === control.value) {
                return {uniqueKey: `key不能重复，当前值与第${i + 1}行的key重复了`};
            }
        }
    }
    return null;
}

export abstract class AbstractFormComponent {

    protected constructor(protected http: HttpService, protected transformer: TransformService, protected formBodyProcessor: FormBodyProcessor) {

    }

    abstract get uriParameters(): { [p: string]: string };

    protected processForm(inputForm: Form): Form {
        let returnForm = new Form(inputForm);
        this.processFormBody(returnForm.headers, returnForm);
        this.processFormBody(returnForm.queryParameters, returnForm);
        if (returnForm.body && returnForm.body.length > 0) {
            returnForm.body.forEach(item => this.processFormBody(item, returnForm));
        }

        return returnForm;
    }

    private processFormBody(formBody: FormBody, {vertical, horizontal}: Form) {
        if (formBody) {
            formBody.vertical = vertical;
            formBody.horizontal = horizontal;
            this.formBodyProcessor.process(formBody);
        }
    }

    protected createFormGroups(inputForm: Form): FormGroups {
        let formGroup: FormGroups = {};
        if (inputForm.headers) {
            formGroup.headers = this.createFormGroup(inputForm.headers);
        }

        if (inputForm.queryParameters) {
            formGroup.queryParameters = this.createFormGroup(inputForm.queryParameters);
        }

        if (inputForm.body && inputForm.body.length > 0) {
            formGroup.body = inputForm.body.map<FormGroup>(this.createFormGroup);
        }
        return formGroup;
    }

    private createFormGroup = (formBody: FormBody) => {
        let formGroup = new FormGroup({});
        for (let cell of formBody.children) {
            this.addToFormGroup(cell, formGroup);
        }

        this.processAutoLoader(formGroup, formBody.autoLoader);

        return formGroup;
    };

    private processAutoLoader(formGroup: FormGroup, autoLoader: AutoLoader){
        if (autoLoader && autoLoader.url) {
            let method = 'get';
            let url = formatPath(autoLoader.url, this.uriParameters);
            let options = {headers: {}};
            if (autoLoader.accept) {
                options.headers = {Accept: autoLoader.accept};
            }
            this.http.get(url, options)
                .then(result => this.transformer.transform(result, url, method))
                .then(value => formGroup.patchValue(value));
        }
    }

    private addToFormGroup(node: any, formGroup: FormGroup) {
        if (node.field) {
            formGroup.addControl(node.field, this.formItemToControl(node));
            return;
        }

        if (node.children) {
            for (let child of node.children) {
                this.addToFormGroup(child, formGroup);
            }
        }

        if (node.content) {
            this.addToFormGroup(node.content, formGroup);
        }
    }

    private formItemToControl(node: any) {
        let validators = [];
        if (node.required) {
            validators.push(Validators.required);
        }

        if (node.type === 'fieldset') {
            let formGroup = new FormGroup({}, validators);
            for (let child of node.children) {
                this.addToFormGroup(child, formGroup);
            }
            return formGroup;
        }

        if (node.minLength) {
            validators.push(Validators.minLength(node.minLength));
        }
        if (node.maxLength) {
            validators.push(Validators.maxLength(node.maxLength));
        }

        if (node.type === 'array') {
            return new FormArray([this.formItemToControl(node.items)], validators);
        }

        if (node.type === 'map') {
            return new FormArray([
                new FormGroup({
                    key: this.formItemToControl(node.key),
                    val: this.formItemToControl(node.val),
                })
            ], [...validators, uniqueKeyValidator]);
        }

        if (node.pattern) {
            validators.push(Validators.pattern(node.pattern));
        }
        if (node.min) {
            validators.push(Validators.min(node.min));
        }
        if (node.max) {
            validators.push(Validators.max(node.max));
        }

        return new FormControl(node.value, validators);
    }

}
