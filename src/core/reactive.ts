import { REACTIVE_EVENTS, PropertyChangeEvent } from './types';

type EventCallback = (data: any) => void;

export class EventEmitter {
    private events: Map<string, EventCallback[]>;

    constructor() {
        this.events = new Map();
    }

    on(event: string, callback: EventCallback): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)?.push(callback);
    }

    emit(event: string, data: any): void {
        if (this.events.has(event)) {
            this.events.get(event)?.forEach(callback => callback(data));
        }
    }
}

// 用于存储响应式对象和其对应的 EventEmitter 的 WeakMap
const reactiveMap = new WeakMap<object, EventEmitter>();

export function reactive<T extends object>(obj: T): T {
    const emitter = new EventEmitter();
    
    const proxy = new Proxy(obj, {
        get(target: T, key: string | symbol): any {
            return target[key as keyof T];
        },
        
        set(target: T, key: string | symbol, value: any): boolean {
            const oldValue = target[key as keyof T];
            (target as any)[key] = value;
            
            if (oldValue !== value) {
                emitter.emit(REACTIVE_EVENTS.PROPERTY_CHANGE, {
                    key,
                    value,
                    oldValue
                } as PropertyChangeEvent<any>);
            }
            return true;
        }
    });

    // 将创建的 emitter 与代理对象关联起来
    reactiveMap.set(proxy, emitter);
    
    return proxy;
}

export function watch<T extends object>(
    obj: T,
    callback: (data: PropertyChangeEvent<any>) => void
): void {
    const emitter = reactiveMap.get(obj);
    if (emitter) {
        emitter.on(REACTIVE_EVENTS.PROPERTY_CHANGE, callback);
    }
}
