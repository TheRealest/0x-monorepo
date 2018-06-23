import { colors } from '@0xproject/react-shared';
import * as _ from 'lodash';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { RequiredLabel } from 'ts/components/ui/required_label';

interface MessageInputProps {
    disabled?: boolean;
    initialMessage: string;
    isRequired?: boolean;
    hintText?: string;
    shouldHideLabel?: boolean;
    label?: string;
    shouldShowIncompleteErrs?: boolean;
    updateOrderMessage: (message?: string) => void;
}

interface MessageInputState {
    message: string;
    errMsg: string;
}

export class MessageInput extends React.Component<MessageInputProps, MessageInputState> {
    constructor(props: MessageInputProps) {
        super(props);
        this.state = {
            message: this.props.initialMessage,
            errMsg: '',
        };
    }
    public componentWillReceiveProps(nextProps: MessageInputProps): void {
        if (nextProps.shouldShowIncompleteErrs && this.props.isRequired && this.state.message === '') {
            this.setState({
                errMsg: 'Message is required',
            });
        }
    }
    public render(): React.ReactNode {
        const label = this.props.isRequired ? <RequiredLabel label={this.props.label} /> : this.props.label;
        const labelDisplay = this.props.shouldHideLabel ? 'hidden' : 'block';
        const hintText = this.props.hintText ? this.props.hintText : '';
        return (
            <div className="overflow-hidden" style={{ width: '100%' }}>
                <TextField
                    id={`message-field-${this.props.label}`}
                    disabled={_.isUndefined(this.props.disabled) ? false : this.props.disabled}
                    fullWidth={true}
                    multiLine={true}
                    hintText={hintText}
                    floatingLabelFixed={true}
                    floatingLabelStyle={{ color: colors.grey, display: labelDisplay }}
                    floatingLabelText={label}
                    errorText={this.state.errMsg}
                    value={this.state.message}
                    onChange={this._onOrderMessageUpdated.bind(this)}
                />
            </div>
        );
    }
    private _onOrderMessageUpdated(e: any): void {
        const message = e.target.value;
        const errMsg = '';
        this.setState({
            message,
            errMsg,
        });
        this.props.updateOrderMessage(message);
    }
}
