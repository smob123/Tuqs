/**
 * autocomplete text box,
 */

import React, { Component } from 'react';

export default class Autocomplete extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // current text in the input box
            inputValue: ''
        };
    }

    /**
     * handles changes to the input's text
     */
    handleInputChange(newValue) {
        this.setState({ inputValue: newValue });
        this.props.onChange(newValue);
    }

    /**
     * handles clicking on one of the dropdown menu's suggestions
     */
    onSuggestionSelected(value) {
        this.setState({ inputValue: value });
        this.props.onSuggestionSelected(value);
    }

    /**
     * handles enter key presses
     */
    handleSubmit(key) {
        if (key.toUpperCase() === 'ENTER') {
            this.props.onSubmit();
        }
    }

    render() {
        return (
            <div className='autocomplete'>
                <input placeholder='Search' onChange={(e) => this.handleInputChange(e.target.value)} value={this.state.inputValue} onKeyPress={(e) => this.handleSubmit(e.key)} />

                {/* displays a dropdown menu of suggestions based on what the parent component has passed */}
                <div className='suggestions-container'>
                    {
                        this.props.suggestions.map((value) => (
                            <p className='suggestion' key={`${Date.now()}_${value}_suggestion`} onClick={() => this.onSuggestionSelected(value)}>
                                {value}
                            </p>
                        ))
                    }
                </div>
            </div>
        )
    }
}