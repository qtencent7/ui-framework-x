import { Component } from '../src/core/component';
import { createElement } from '../src/core/vdom';
import { Props } from '../src/core/types';
import FormComponent from './form-demo';
interface CounterState {
    count: number;
}

class Counter extends Component<Props, CounterState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    private increment = (): void => {
        this.setState({
            count: this.state.count + 1
        });
    }

    render() {
        return createElement('div', undefined,
            createElement('h1', undefined, `Count: ${this.state.count}`),
            createElement('button', {
                onClick: this.increment
            }, 'Increment')
        );
    }
}

// Mount the application
// const app = new Counter({});
const app = new FormComponent({});
const container = document.getElementById('app');
if (container) {
    app.mount(container);
}
