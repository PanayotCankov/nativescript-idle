"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils = require("utils/utils");
var queue = [];
var TNSIdleHandler = (function (_super) {
    __extends(TNSIdleHandler, _super);
    function TNSIdleHandler() {
        _super.apply(this, arguments);
    }
    TNSIdleHandler.prototype.receiveIdleNotification = function () {
        idleNotificationPosted = false;
        try {
            queue.shift()();
        }
        catch (e) {
            console.log("Error executing on idle frame: " + e);
            console.log(e.stack);
        }
        if (queue.length > 0) {
            postIdleNotification();
        }
        else {
            console.log("idle frames drained");
        }
    };
    TNSIdleHandler.ObjCExposedMethods = {
        "receiveIdleNotification": { returns: interop.types.void, params: [] }
    };
    return TNSIdleHandler;
}(NSObject));
var target = TNSIdleHandler.alloc().init();
utils.ios.getter(NSNotificationCenter, NSNotificationCenter.defaultCenter).addObserverSelectorNameObject(target, "receiveIdleNotification", "org.nativescript.idle-notification", null);
var idleNotification = NSNotification.notificationWithNameObject("org.nativescript.idle-notification", target);
var idleNotificationPosted = false;
var postIdleNotification = function () {
    utils.ios.getter(NSNotificationQueue, NSNotificationQueue.defaultQueue).enqueueNotificationPostingStyle(idleNotification, NSPostWhenIdle);
    idleNotificationPosted = true;
};
function requestIdleFrame(callback) {
    queue.push(callback);
    if (!idleNotificationPosted) {
        postIdleNotification();
    }
}
exports.requestIdleFrame = requestIdleFrame;
//# sourceMappingURL=index.ios.js.map