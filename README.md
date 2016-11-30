A NativeScript plugin that lets you to post a callback to be executed when the application is in relatively idle state.
This can be used to schedule short-lived tasks that have to be executed on the main thread but are not critical and can be postponed for times when the user is not interacting with the applicatin.

For example:

``` TypeScript
import { requestIdleFrame } from "nativescript-idle";

requestIdleFrame(() => {
    var msg = "preloading " + route.path;
    console.log(msg);
    var start = Date.now();
    // Task taking ~40ms.
    load();
    this.loadedPaths.push(route.path);
    var end = Date.now();
    console.log(msg + " in " + (end - start));
});
```