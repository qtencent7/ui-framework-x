import { watch } from './reactive';
import { Props} from './types';

export class VNode {
    type: string;
    props: Props;
    children: (VNode | string | number)[];

    constructor(type: string, props?: Props, children?: (VNode | string | number)[]) {
        this.type = type;
        this.props = props || {};
        this.children = children || [];
    }
}

export function createElement(
    type: string,
    props?: Props,
    ...children: (VNode | string | number)[]
): VNode {
    return new VNode(type, props, children);
}

export function render(vnode: VNode | string | number): Node {
    // Handle primitive types
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return document.createTextNode(String(vnode));
    }

    // Create the DOM element
    const element = document.createElement(vnode.type);

    // Set properties
    Object.entries(vnode.props || {}).forEach(([key, value]) => {
        if (key.startsWith('on') && typeof value === 'function') {
            // Handle events
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value as EventListener);
        } else if (key !== 'state' && key !== 'R') {
            // Handle regular attributes
            element.setAttribute(key, String(value));
        }
    });

    // Render children
    vnode.children.forEach(child => {
        element.appendChild(render(child));
    });

    return element;
}
