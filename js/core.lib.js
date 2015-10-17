function isEventSupported(eventName) {
    var el = document.createElement('div');
    eventName = 'on' + eventName;
    var isSupported = (eventName in el);
    if (!isSupported) {
        el.setAttribute(eventName, 'return;');
        isSupported = typeof el[eventName] == 'function';
    }
    el = null;
    return isSupported;
}

/*
Object.prototype.makeChildOf = function () {
    parent = arguments[0];
    this.prototype = Object.create(parent.prototype);
    this.prototype.constructor = this;
}
*/

function makeChildOf(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
}
