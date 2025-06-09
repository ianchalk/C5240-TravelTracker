"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var app_module_1 = require("./app/app.module");
(0, platform_browser_1.platformBrowser)().bootstrapModule(app_module_1.AppModule, {
    ngZoneEventCoalescing: true,
})
    .catch(function (err) { return console.error(err); });
//# sourceMappingURL=main.js.map