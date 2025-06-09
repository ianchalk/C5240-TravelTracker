"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app/app.component");
var router_1 = require("@angular/router");
var app_routing_module_1 = require("./app/app-routing.module");
var http_1 = require("@angular/common/http");
var auth_service_1 = require("./app/services/auth.service");
(0, platform_browser_1.bootstrapApplication)(app_component_1.AppComponent, {
    providers: [
        (0, router_1.provideRouter)(app_routing_module_1.routes),
        (0, http_1.provideHttpClient)(),
        auth_service_1.AuthService
    ]
})
    .catch(function (err) { return console.error(err); });
//# sourceMappingURL=main.js.map