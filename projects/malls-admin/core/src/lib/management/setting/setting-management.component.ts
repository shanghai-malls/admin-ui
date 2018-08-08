import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {I18nService, Invisible, MenuService, RamlService, SettingService, ViewService} from '../../public';

@Component({
    selector: 'r-setting',
    templateUrl: 'setting-management.component.html',
    styleUrls: ['./setting-management.component.less']
})
export class SettingManagementComponent implements OnInit {

    inEditing = false;
    inBuilding: 'view' | 'menu';
    formGroup: FormGroup;


    constructor(private settingsService: SettingService,
                private i18n: I18nService,
                private ramlService: RamlService,
                private viewService: ViewService,
                private menuService: MenuService) {
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


    addControl(ac: AbstractControl){
        let array = ac as FormArray;
        array.push(new FormControl(null ,[Validators.required, Validators.maxLength(50)]))
    }

    getFormArrayControls(path: string){
        let formArray = this.formGroup.get(path) as FormArray;
        return formArray.controls;
    }

    removeAt(path: string, i: number) {
        let formArray = this.formGroup.get(path) as FormArray;
        formArray.removeAt(i);
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
        this.inBuilding = 'view';
        this.ramlService.getViews()
            .then(this.viewService.batchSave) //save views
            .then(()=>this.inBuilding = null);
    }

    buildMenusFromModules() {
        this.inBuilding = 'menu';

        this.menuService.convertModulesToMenus()
            .then(this.menuService.batchSave) //save menus
            .then(()=>this.inBuilding = null);
    }

}
