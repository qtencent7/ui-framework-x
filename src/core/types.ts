// Common types used across the framework

export type Props = Record<string, any>;

export type EventHandler = (event: Event) => void;

export interface ComponentLifecycle {
    componentDidMount?(): void;
    componentWillUnmount?(): void;
}

// Component Events
export const COMPONENT_EVENTS = {
    STATE_CHANGE: 'component:stateChange'
} as const;

// Reactive Events
export const REACTIVE_EVENTS = {
    PROPERTY_CHANGE: 'reactive:propertyChange'
} as const;

export type StateChangeEvent<T> = {
    oldState: T;
    newState: T;
};

export type PropertyChangeEvent<T> = {
    key: string | symbol;
    value: T;
    oldValue: T;
};
