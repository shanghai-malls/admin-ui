import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {Selectable} from '../../model/Selectable';

@Component({
    templateUrl: 'icon-management.component.html',
    styleUrls: ['icon-management.component.less']
})
export class IconManagementComponent implements OnInit,Selectable {
    iconResource: any;
    prefix = "anticon anticon-";
    icons: string[];
    searchText: string;
    mode: "select" | "view" = 'select';
    @Output()
    onSelect: EventEmitter<string> = new EventEmitter<string>();


    ngOnInit(): void {
        this.iconResource = {
            "prefix": "anticon anticon-",
            "list": [
                {
                    "k": "step-backward"
                },
                {
                    "k": "step-forward"
                },
                {
                    "k": "fast-backward"
                },
                {
                    "k": "fast-forward"
                },
                {
                    "k": "shrink"
                },
                {
                    "k": "arrows-alt"
                },
                {
                    "k": "down"
                },
                {
                    "k": "up"
                },
                {
                    "k": "left"
                },
                {
                    "k": "right"
                },
                {
                    "k": "caret-up"
                },
                {
                    "k": "caret-down"
                },
                {
                    "k": "caret-left"
                },
                {
                    "k": "caret-right"
                },
                {
                    "k": "up-circle"
                },
                {
                    "k": "down-circle"
                },
                {
                    "k": "left-circle"
                },
                {
                    "k": "right-circle"
                },
                {
                    "k": "up-circle-o"
                },
                {
                    "k": "down-circle-o"
                },
                {
                    "k": "right-circle-o"
                },
                {
                    "k": "left-circle-o"
                },
                {
                    "k": "double-right"
                },
                {
                    "k": "double-left"
                },
                {
                    "k": "verticle-left"
                },
                {
                    "k": "verticle-right"
                },
                {
                    "k": "forward"
                },
                {
                    "k": "backward"
                },
                {
                    "k": "rollback"
                },
                {
                    "k": "enter"
                },
                {
                    "k": "retweet"
                },
                {
                    "k": "swap"
                },
                {
                    "k": "swap-left"
                },
                {
                    "k": "swap-right"
                },
                {
                    "k": "arrow-up"
                },
                {
                    "k": "arrow-down"
                },
                {
                    "k": "arrow-left"
                },
                {
                    "k": "arrow-right"
                },
                {
                    "k": "play-circle"
                },
                {
                    "k": "play-circle-o"
                },
                {
                    "k": "up-square"
                },
                {
                    "k": "down-square"
                },
                {
                    "k": "left-square"
                },
                {
                    "k": "right-square"
                },
                {
                    "k": "up-square-o"
                },
                {
                    "k": "down-square-o"
                },
                {
                    "k": "left-square-o"
                },
                {
                    "k": "right-square-o"
                },
                {
                    "k": "login"
                },
                {
                    "k": "logout"
                },
                {
                    "k": "menu-fold"
                },
                {
                    "k": "menu-unfold"
                },

                {
                    "k": "question"
                },
                {
                    "k": "question-circle-o"
                },
                {
                    "k": "question-circle"
                },
                {
                    "k": "plus"
                },
                {
                    "k": "plus-circle-o"
                },
                {
                    "k": "plus-circle"
                },
                {
                    "k": "pause"
                },
                {
                    "k": "pause-circle-o"
                },
                {
                    "k": "pause-circle"
                },
                {
                    "k": "minus"
                },
                {
                    "k": "minus-circle-o"
                },
                {
                    "k": "minus-circle"
                },
                {
                    "k": "plus-square"
                },
                {
                    "k": "plus-square-o"
                },
                {
                    "k": "minus-square"
                },
                {
                    "k": "minus-square-o"
                },
                {
                    "k": "info"
                },
                {
                    "k": "info-circle-o"
                },
                {
                    "k": "info-circle"
                },
                {
                    "k": "exclamation"
                },
                {
                    "k": "exclamation-circle-o"
                },
                {
                    "k": "exclamation-circle"
                },
                {
                    "k": "close"
                },
                {
                    "k": "close-circle"
                },
                {
                    "k": "close-circle-o"
                },
                {
                    "k": "close-square"
                },
                {
                    "k": "close-square-o"
                },
                {
                    "k": "check"
                },
                {
                    "k": "check-circle"
                },
                {
                    "k": "check-circle-o"
                },
                {
                    "k": "check-square"
                },
                {
                    "k": "check-square-o"
                },
                {
                    "k": "clock-circle-o"
                },
                {
                    "k": "clock-circle"
                },
                {
                    "k": "lock"
                },
                {
                    "k": "unlock"
                },
                {
                    "k": "area-chart"
                },
                {
                    "k": "pie-chart"
                },
                {
                    "k": "bar-chart"
                },
                {
                    "k": "dot-chart"
                },
                {
                    "k": "bars"
                },
                {
                    "k": "book"
                },
                {
                    "k": "calendar"
                },
                {
                    "k": "cloud"
                },
                {
                    "k": "cloud-download"
                },
                {
                    "k": "code"
                },
                {
                    "k": "code-o"
                },
                {
                    "k": "copy"
                },
                {
                    "k": "credit-card"
                },
                {
                    "k": "delete"
                },
                {
                    "k": "desktop"
                },
                {
                    "k": "download"
                },
                {
                    "k": "edit"
                },
                {
                    "k": "ellipsis"
                },
                {
                    "k": "file"
                },
                {
                    "k": "file-text"
                },
                {
                    "k": "file-unknown"
                },
                {
                    "k": "file-pdf"
                },
                {
                    "k": "file-excel"
                },
                {
                    "k": "file-jpg"
                },
                {
                    "k": "file-ppt"
                },
                {
                    "k": "file-add"
                },
                {
                    "k": "folder"
                },
                {
                    "k": "folder-open"
                },
                {
                    "k": "folder-add"
                },
                {
                    "k": "hdd"
                },
                {
                    "k": "frown"
                },
                {
                    "k": "frown-o"
                },
                {
                    "k": "meh"
                },
                {
                    "k": "meh-o"
                },
                {
                    "k": "smile"
                },
                {
                    "k": "smile-o"
                },
                {
                    "k": "inbox"
                },
                {
                    "k": "laptop"
                },
                {
                    "k": "appstore-o"
                },
                {
                    "k": "appstore"
                },
                {
                    "k": "line-chart"
                },
                {
                    "k": "link"
                },
                {
                    "k": "mail"
                },
                {
                    "k": "mobile"
                },
                {
                    "k": "notification"
                },
                {
                    "k": "paper-clip"
                },
                {
                    "k": "picture"
                },
                {
                    "k": "poweroff"
                },
                {
                    "k": "reload"
                },
                {
                    "k": "search"
                },
                {
                    "k": "setting"
                },
                {
                    "k": "share-alt"
                },
                {
                    "k": "shopping-cart"
                },
                {
                    "k": "tablet"
                },
                {
                    "k": "tag"
                },
                {
                    "k": "tag-o"
                },
                {
                    "k": "tags"
                },
                {
                    "k": "tags-o"
                },
                {
                    "k": "to-top"
                },
                {
                    "k": "upload"
                },
                {
                    "k": "user"
                },
                {
                    "k": "video-camera"
                },
                {
                    "k": "home"
                },
                {
                    "k": "loading"
                },
                {
                    "k": "loading-3-quarters"
                },
                {
                    "k": "cloud-upload-o"
                },
                {
                    "k": "cloud-download-o"
                },
                {
                    "k": "cloud-upload"
                },
                {
                    "k": "cloud-o"
                },
                {
                    "k": "star-o"
                },
                {
                    "k": "star"
                },
                {
                    "k": "heart-o"
                },
                {
                    "k": "heart"
                },
                {
                    "k": "environment"
                },
                {
                    "k": "environment-o"
                },
                {
                    "k": "eye"
                },
                {
                    "k": "eye-o"
                },
                {
                    "k": "camera"
                },
                {
                    "k": "camera-o"
                },
                {
                    "k": "save"
                },
                {
                    "k": "team"
                },
                {
                    "k": "solution"
                },
                {
                    "k": "phone"
                },
                {
                    "k": "filter"
                },
                {
                    "k": "exception"
                },
                {
                    "k": "export"
                },
                {
                    "k": "customer-service"
                },
                {
                    "k": "qrcode"
                },
                {
                    "k": "scan"
                },
                {
                    "k": "like"
                },
                {
                    "k": "like-o"
                },
                {
                    "k": "dislike"
                },
                {
                    "k": "dislike-o"
                },
                {
                    "k": "message"
                },
                {
                    "k": "pay-circle"
                },
                {
                    "k": "pay-circle-o"
                },
                {
                    "k": "calculator"
                },
                {
                    "k": "pushpin"
                },
                {
                    "k": "pushpin-o"
                },
                {
                    "k": "bulb"
                },
                {
                    "k": "select"
                },
                {
                    "k": "switcher"
                },
                {
                    "k": "rocket"
                },
                {
                    "k": "bell"
                },
                {
                    "k": "disconnect"
                },
                {
                    "k": "database"
                },
                {
                    "k": "compass"
                },
                {
                    "k": "barcode"
                },
                {
                    "k": "hourglass"
                },
                {
                    "k": "key"
                },
                {
                    "k": "flag"
                },
                {
                    "k": "layout"
                },
                {
                    "k": "printer"
                },
                {
                    "k": "sound"
                },
                {
                    "k": "usb"
                },
                {
                    "k": "skin"
                },
                {
                    "k": "tool"
                },
                {
                    "k": "sync"
                },
                {
                    "k": "wifi"
                },
                {
                    "k": "car"
                },
                {
                    "k": "schedule"
                },
                {
                    "k": "user-add"
                },
                {
                    "k": "user-delete"
                },
                {
                    "k": "usergroup-add"
                },
                {
                    "k": "usergroup-delete"
                },
                {
                    "k": "man"
                },
                {
                    "k": "woman"
                },
                {
                    "k": "shop"
                },
                {
                    "k": "gift"
                },
                {
                    "k": "idcard"
                },
                {
                    "k": "medicine-box"
                },
                {
                    "k": "red-envelope"
                },
                {
                    "k": "coffee"
                },
                {
                    "k": "copyright"
                },
                {
                    "k": "trademark"
                },
                {
                    "k": "safety"
                },
                {
                    "k": "wallet"
                },
                {
                    "k": "bank"
                },
                {
                    "k": "trophy"
                },
                {
                    "k": "contacts"
                },
                {
                    "k": "global"
                },
                {
                    "k": "shake"
                },
                {
                    "k": "api"
                },
                {
                    "k": "fork"
                },
                {
                    "k": "profile"
                }
            ]
        };
        this.icons = this.iconResource.list.map(item => item.k);
    }

    filterIcon() {
        this.icons = this.iconResource.list.filter(item => item.k.indexOf(this.searchText) != -1).map(item => item.k);
    }
    doSelect(icon: string){
        this.onSelect.next(this.prefix + icon);
    }
}
