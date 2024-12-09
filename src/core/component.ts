import { VNode, render } from './vdom';
import { reactive, watch } from './reactive';
import { Props, ComponentLifecycle, StateChangeEvent, COMPONENT_EVENTS } from './types';

export abstract class Component<P extends Props = Props, S = any> implements ComponentLifecycle {
    protected props: P;
    protected state: S;
    private element: HTMLElement | null = null;
    private _mounted: boolean = false;

    constructor(props: P) {
        this.props = props;
        // 创建响应式状态
        this.state = reactive({} as S);

        // 监听状态变化，自动触发重新渲染
        watch(this.state, () => {
            this.update();
        });
    }

    protected setState(newState: Partial<S>): void {
        // 直接修改响应式状态
        Object.assign(this.state, newState);
    }

    private update(): void {
        if (this._mounted && this.element) {
            const newNode = this.render();
            const newElement = render(newNode) as HTMLElement;
            this.element.parentNode?.replaceChild(newElement, this.element);
            this.element = newElement;
        }
    }

    public mount(container: HTMLElement): void {
        const vnode = this.render();
        this.element = render(vnode) as HTMLElement;
        container.appendChild(this.element);
        this._mounted = true;
        this.componentDidMount?.();
    }

    public unmount(): void {
        this.componentWillUnmount?.();
        this.element?.remove();
        this._mounted = false;
    }

    abstract render(): VNode;

    componentDidMount?(): void;
    componentWillUnmount?(): void;
}
