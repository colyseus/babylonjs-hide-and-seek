declare module TVJS {
    interface KeyCodeMap {
        left: number[];
        right: number[];
        up: number[];
        down: number[];
        accept: number[];
    }
    class DirectionalNavigation {
        static enabled: boolean;
        static focusRoot: Element;
        static keyCodeMap: TVJS.KeyCodeMap;
        static focusableSelectors: string[];
        static moveFocus(direction: string | number | Element, options: any): Element;
        static findNextFocusElement(direction: string | number | Element, options: any): Element;
        static addEventListener(type: any, listener: any, useCapture?: boolean): any;
        static removeEventListener(type: any, listener: any, useCapture?: boolean): any;
    }
}
