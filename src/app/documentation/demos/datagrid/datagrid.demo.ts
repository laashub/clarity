/*
 * Copyright (c) 2016 - 2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Component, OnDestroy, OnInit} from "@angular/core";
import {ClarityDocComponent} from "../clarity-doc";
import {ActivatedRoute, NavigationEnd, Route, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: "clr-datagrid-demo",
    templateUrl: "./datagrid.demo.html",
    styleUrls: ["./datagrid.demo.main.scss"],
    host: {
        "[class.content-area]": "true",
        "[class.dox-content-panel]": "true"
    }
})
export class DatagridDemo extends ClarityDocComponent implements OnInit, OnDestroy {
    constructor(private route: ActivatedRoute, private router: Router) {
        super("datagrid");
    }

    private _subscriptions: Subscription[] = [];

    childRoutes: Route[];

    previous: boolean = false;
    next: boolean = false;

    previousRoute: Route;
    nextRoute: Route;

    parentRoute: string = "";

    ngOnInit() {
        let tempArr: any[] = this.route.routeConfig.children;
        if (tempArr.length > 1) {
            this.childRoutes = tempArr.slice(1);
            console.log(this.childRoutes);
        }
        this._subscriptions.push(this.router.events.subscribe((change: any) => {
            if (change instanceof NavigationEnd) {
                if (change.url.includes("datagrid")) {
                    console.log("Current Route", change.url);
                    this.initializePagination(change.url);
                }
            }
        }));
    }

    initializePagination(url: string): void {
        let tempArr: string[] = url.split("/");
        this.parentRoute = url.substr(0, url.indexOf("datagrid")) + "datagrid/";
        if (tempArr.length > 1) {
            let subRoute: string = tempArr[tempArr.length - 1];
            if (subRoute === "datagrid") {
                this.nextRoute = this.childRoutes[1];
                this.next = true;
            } else {
                for (let i = 0; i < this.childRoutes.length; i++) {
                    if (this.childRoutes[i].path === subRoute) {
                        if (i === 0) {
                            this.previous = false;
                        } else {
                            this.previousRoute = this.childRoutes[i - 1];
                            this.previous = true;
                            if (i < this.childRoutes.length - 1) {
                                this.nextRoute = this.childRoutes[i + 1];
                                this.next = true;
                            } else {
                                this.next = false;
                            }
                        }
                        break;
                    }
                }
            }
        }
    }

    moveNext() {
        if (this.nextRoute) {
            let tempPath = this.parentRoute + this.nextRoute.path;
            this.router.navigate([tempPath]);
        }
    }

    movePrevious() {
        if (this.previousRoute) {
            let tempPath = this.parentRoute + this.previousRoute.path;
            this.router.navigate([tempPath]);
        }
    }

    ngOnDestroy() {
        this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    }
}