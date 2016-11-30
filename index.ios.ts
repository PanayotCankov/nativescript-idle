import * as utils from "utils/utils";

const queue = [];

class TNSIdleHandler extends NSObject {
    public static ObjCExposedMethods = {
        "receiveIdleNotification": { returns: interop.types.void, params: [] }
    };
    receiveIdleNotification() {
        idleNotificationPosted = false;
        try {
            queue.shift()();
        } catch(e) {
            console.log("Error executing on idle frame: " + e);
            console.log(e.stack);
        }
        if (queue.length > 0) {
            postIdleNotification();
        } else {
            console.log("idle frames drained");
        }
    }
}

const target = TNSIdleHandler.alloc().init();
utils.ios.getter(NSNotificationCenter, NSNotificationCenter.defaultCenter).addObserverSelectorNameObject(target, "receiveIdleNotification", "org.nativescript.idle-notification", null);
const idleNotification = NSNotification.notificationWithNameObject("org.nativescript.idle-notification", target);
let idleNotificationPosted: boolean = false;

let postIdleNotification = () => {
    utils.ios.getter(NSNotificationQueue, NSNotificationQueue.defaultQueue).enqueueNotificationPostingStyle(idleNotification, NSPostWhenIdle);
    idleNotificationPosted = true;
}

export function requestIdleFrame(callback: () => void): void {
    queue.push(callback);
    if (!idleNotificationPosted) {
        postIdleNotification();
    }
}
