import { Component } from '../src/core/component';
import { createElement } from '../src/core/vdom';
import { reactive, watch } from '../src/core/reactive';
import { v4 as uuidv4 } from 'uuid';

interface FormState {
    username: string;
    email: string;
    isValid: boolean;
}

class FormComponent extends Component<{}, FormState> {
    constructor(props: {}) {
        super(props);
        
        // Initialize the state
        this.setState({
            username: '',
            email: '',
            isValid: false
        });

        // Watch state changes for validation
        watch(this.state, (change) => {
            if (change.key === 'username' || change.key === 'email') {
                this.validateForm();
            }
        });
    }

    private validateForm(): void {
        const isValid = 
            this.state.username.length >= 3 && 
            this.state.email.includes('@');
        
        this.setState({ isValid });
    }

    private handleInput = (field: keyof FormState) => (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        this.setState({ [field]: value } as Partial<FormState>);
    }

    render() {
        return createElement('form', undefined,
            createElement('div', undefined,
                createElement('input', {
                    type: 'text',
                    value: this.state.username,
                    onInput: this.handleInput('username'),
                    placeholder: 'Username',
                    state: this.state
                })
            ),
            createElement('div', undefined,
                createElement('input', {
                    type: 'email',
                    value: this.state.email,
                    onInput: this.handleInput('email'),
                    placeholder: 'Email',
                    state: this.state
                })
            ),
            createElement('div', undefined,
                createElement('span', undefined,
                    `Form is ${this.state.isValid ? 'valid' : 'invalid'}`
                )
            )
        );
    }
}

export default FormComponent;
