"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var app = require("application");
var queue = [];
var debounceTimeoutId = 0;
var ScrollChangeListener = (function (_super) {
    __extends(ScrollChangeListener, _super);
    function ScrollChangeListener() {
        _super.call(this);
        return __native(this);
    }
    ScrollChangeListener.prototype.onScrollChanged = function () {
        removeIdleHandler();
        clearTimeout(debounceTimeoutId);
        debounceTimeoutId = setTimeout(function () {
            addIdleHandler();
            debounceTimeoutId = 0;
        }, 150);
    };
    ScrollChangeListener = __decorate([
        Interfaces([android.view.ViewTreeObserver.OnScrollChangedListener])
    ], ScrollChangeListener);
    return ScrollChangeListener;
}(java.lang.Object));
var scrollHandler = new ScrollChangeListener();
var contentView;
var CallbackIdleHandler = (function (_super) {
    __extends(CallbackIdleHandler, _super);
    function CallbackIdleHandler() {
        _super.call(this);
        return __native(this);
    }
    CallbackIdleHandler.prototype.queueIdle = function () {
        try {
            queue.shift()();
        }
        catch (e) {
            console.log("Error executing on idle frame: " + e);
            console.log(e.stack);
        }
        removeIdleHandler();
        if (queue.length > 0) {
            debounceTimeoutId = setTimeout(function () {
                addIdleHandler();
                debounceTimeoutId = 0;
            }, 0);
        }
        else {
            console.log("idle frames drained");
            if (contentView) {
                var treeViewObserver = contentView.getViewTreeObserver();
                treeViewObserver.removeOnScrollChangedListener(scrollHandler);
                contentView = null;
            }
        }
        return false;
    };
    CallbackIdleHandler = __decorate([
        Interfaces([android.os.MessageQueue.IdleHandler])
    ], CallbackIdleHandler);
    return CallbackIdleHandler;
}(java.lang.Object));
var idleHandler = new CallbackIdleHandler();
var mainQueue = android.os.Looper.myQueue();
var addIdleHandler = function () {
    mainQueue.addIdleHandler(idleHandler);
};
var removeIdleHandler = function () {
    mainQueue.removeIdleHandler(idleHandler);
};
var addScrollingHandler = function () {
    var activity = app.android.foregroundActivity;
    if (activity) {
        contentView = activity.findViewById(android.R.id.content);
        if (contentView) {
            var treeViewObserver = contentView.getViewTreeObserver();
            treeViewObserver.addOnScrollChangedListener(scrollHandler);
        }
    }
};
function requestIdleFrame(callback) {
    queue.push(callback);
    if (queue.length === 1) {
        addIdleHandler();
        addScrollingHandler();
    }
}
exports.requestIdleFrame = requestIdleFrame;
//# sourceMappingURL=index.android.js.map