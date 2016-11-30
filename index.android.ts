import * as app from "application";

const queue = [];

let debounceTimeoutId = 0;

@Interfaces([android.view.ViewTreeObserver.OnScrollChangedListener])
class ScrollChangeListener extends java.lang.Object implements android.view.ViewTreeObserver.OnScrollChangedListener {
    constructor() {
        super();
        return __native(this);
    }

    public onScrollChanged() {
        removeIdleHandler();
        clearTimeout(debounceTimeoutId);
        debounceTimeoutId = setTimeout(() => {
            addIdleHandler();
            debounceTimeoutId = 0;
        }, 150);
    }
}
const scrollHandler = new ScrollChangeListener();
let contentView;

@Interfaces([android.os.MessageQueue.IdleHandler])
class CallbackIdleHandler extends java.lang.Object implements android.os.MessageQueue.IdleHandler {
    constructor() {
        super();
        return __native(this);
    }

    public queueIdle(): boolean {
        try {
            queue.shift()();
        } catch(e) {
            console.log("Error executing on idle frame: " + e);
            console.log(e.stack);
        }

        removeIdleHandler();
        if (queue.length > 0) {
            debounceTimeoutId = setTimeout(() => {
                addIdleHandler();
                debounceTimeoutId = 0;
            }, 0);
        } else {
            console.log("idle frames drained");
            if (contentView) {
                const treeViewObserver = contentView.getViewTreeObserver();
                treeViewObserver.removeOnScrollChangedListener(scrollHandler);
                contentView = null;
            }
        }
        return false;
    }
}
const idleHandler = new CallbackIdleHandler();
const mainQueue = android.os.Looper.myQueue();

const addIdleHandler = () => {
    mainQueue.addIdleHandler(idleHandler);
}

const removeIdleHandler = () => {
    mainQueue.removeIdleHandler(idleHandler);
}

const addScrollingHandler = () => {
    let activity = app.android.foregroundActivity;
    if (activity) {
        contentView = activity.findViewById(android.R.id.content);
        if (contentView) {
            const treeViewObserver = contentView.getViewTreeObserver();
            treeViewObserver.addOnScrollChangedListener(scrollHandler);
        }
    }
}

export function requestIdleFrame(callback: () => void): void {
    queue.push(callback);
    if (queue.length === 1) {
        addIdleHandler();
        addScrollingHandler();
    }
}