import {Component, Inject, OnInit, Optional} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {NzModalRef} from 'ng-zorro-antd';

@Component({
    templateUrl: 'icon-management.component.html',
    styleUrls: ['./icon-management.component.less']
})
export class IconManagementComponent implements OnInit {
    prefix = "anticon anticon-";
    icons: string[] = [];
    filteredIcons: string[] = [];
    searchText: string;


    ngOnInit(): void {
        let linkStyles = this.getLinkStyles();
        for (let i = 0; i < linkStyles.length; i++) {
            let linkStyle: LinkStyle = linkStyles[i];
            let sheet = <CSSStyleSheet>linkStyle.sheet;
            if(sheet) {
                for (let j = 0; j < sheet.rules.length; j++) {
                    let rule:CSSRule = sheet.rules[j];
                    if (rule instanceof CSSStyleRule) {
                        let selectorText = rule.selectorText;
                        let classPrefix = ".anticon-";
                        if (selectorText && selectorText.startsWith(classPrefix)) {
                            let iconClassName = selectorText.substring(classPrefix.length, selectorText.indexOf("::"));
                            if(this.icons.indexOf(iconClassName) === -1) {
                                this.icons.push(iconClassName);
                            }
                        }
                    }
                }
            }
        }

        this.filteredIcons = [...this.icons];
    }


    getLinkStyles(){
        let styles: NodeListOf<HTMLStyleElement> = this.document.getElementsByTagName("style");
        let links: NodeListOf<HTMLLinkElement> = this.document.getElementsByTagName("link");
        let linkStyles: LinkStyle[] = [];
        for (let i = 0; i < styles.length; i++) {
            linkStyles.push(styles[i]);
        }
        for (let i = 0; i < links.length; i++) {
            linkStyles.push(styles[i]);
        }
        return linkStyles;
    }

    filterIcon() {
        this.filteredIcons = this.icons.filter(item => item.indexOf(this.searchText) != -1);
    }

    doSelect(icon: string){
        if(this.modalRef) {
            this.modalRef.destroy(this.prefix + icon);
        }
    }

    constructor(@Optional() public modalRef: NzModalRef, @Inject(DOCUMENT) private document: Document) {
    }
}
