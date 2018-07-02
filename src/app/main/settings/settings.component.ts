import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../model/settings.service';
import {I18nService} from '../../model/i18n.service';
import {FormControl, FormGroup, FormArray, Validators} from '@angular/forms';
import {ViewService} from '../../model/view.service';
import {RamlService} from '../../model/raml.service';
import {Invisible} from '../../model/raml';

@Component({
    selector: 'r-settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.less']
})
export class SettingsComponent implements OnInit {

    inEditing = false;
    formGroup: FormGroup;

    constructor(private settingsService: SettingsService,
                private i18n: I18nService,
                private ramlService: RamlService,
                private viewService: ViewService) {

    }

    ngOnInit(): void {
        this.settingsService.getSettings().then(settings => {
            settings = settings || {
                logo: 'https://cipchk.github.io/ng-alain/assets/logo-full.svg',
                appName: '通用管理系统',
                company: '上海通路快建营销咨询有限公司',
                website: 'http://www.tonglukuaijian.com',
                invisibleQueryParameters: [...Invisible.queryParameters],
                invisibleColumns: [...Invisible.columns],
                invisibleFormProperties: [...Invisible.formProperties],
                invisibleDetailPageProperties: [...Invisible.detailPageProperties],
                aliyunOss: {
                    endpoint: '',
                    bucket: '',
                    folder: '',
                    accessKeyId: '',
                    accessKeySecret: ''
                },
                styleUrl: ''
            };

            this.inEditing = settings.id == null;

            this.formGroup = new FormGroup({
                appName: new FormControl(settings.appName, [Validators.required, Validators.maxLength(200)]),
                logo: new FormControl(settings.logo, [Validators.required, Validators.maxLength(200)]),
                company: new FormControl(settings.company, [Validators.required, Validators.maxLength(200)]),
                website: new FormControl(settings.website, [Validators.required, Validators.maxLength(200)]),
                invisibleQueryParameters: this.createFormArray(settings.invisibleQueryParameters),
                invisibleColumns: this.createFormArray(settings.invisibleColumns),
                invisibleFormProperties: this.createFormArray(settings.invisibleFormProperties),
                invisibleDetailPageProperties: this.createFormArray(settings.invisibleDetailPageProperties),
                aliyunOss: new FormGroup({
                    endpoint: new FormControl(settings.aliyunOss.endpoint, [Validators.required, Validators.maxLength(200)]),
                    bucket: new FormControl(settings.aliyunOss.bucket, [Validators.required, Validators.maxLength(50)]),
                    folder: new FormControl(settings.aliyunOss.folder, [Validators.required, Validators.maxLength(50)]),
                    accessKeyId: new FormControl(settings.aliyunOss.accessKeyId, [Validators.required, Validators.maxLength(100)]),
                    accessKeySecret: new FormControl(settings.aliyunOss.accessKeySecret, [Validators.required, Validators.maxLength(100)])
                })
            });
            console.log(this.formGroup);
        });
    }

    createFormArray(array: string[]){
        return new FormArray(array.map(e => new FormControl(e, [Validators.required, Validators.maxLength(50)])));
    }


    onLogoChange(event: any) {
        if (event.type === 'success') {
            this.formGroup.value.logo = event.file.response.url;
        }
    }


    addControl(array: FormArray){
        array.push(new FormControl(null ,[Validators.required, Validators.maxLength(50)]))
    }


    submitOrEdit() {
        if (this.inEditing) {
            this.settingsService.setSettings(this.formGroup.value).then(theme => {
                this.formGroup.patchValue(theme);
                this.inEditing = false;
                this.ngOnInit();
            });
        } else {
            this.inEditing = true;
        }
    }


    buildViewsFromRaml() {
        this.ramlService.getViews().then(this.viewService.executeBatchSaveViews);
    }
}
