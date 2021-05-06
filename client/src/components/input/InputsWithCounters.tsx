import React, { createRef, useImperativeHandle} from 'react';

interface IProps {
    max_chars: number
}

interface Handles {
    counter: () => HTMLSpanElement | null,
    getInput: () => string,
    add: (text: string) => void,
    clear: () => void,
}

export interface TextAreaHandles extends Handles {
    input: () => HTMLTextAreaElement | null
}
export interface InputHandles extends Handles {
    input: () => HTMLInputElement | null
}

export const TextAreaWithCounter = React.forwardRef<TextAreaHandles, IProps>((props, ref) => {
    const inputRef = createRef<HTMLTextAreaElement>();
    const countRef = createRef<HTMLSpanElement>();

    useImperativeHandle(ref, () => ({
        counter () { return countRef.current; },
        input   () { return inputRef.current; },
        getInput () {
            return inputRef.current ? inputRef.current.value : ''
        },
        clear() {
            if (inputRef.current && countRef.current) {
                inputRef.current.value = ''
                update(inputRef, countRef, props.max_chars)
            }
        },
        add (text) {
            if (inputRef.current && countRef.current) {
                inputRef.current.value += text
                update(inputRef, countRef, props.max_chars)
            }
        }

    }));

    return (
        <div className='textarea-with-counter'>
            <textarea
                ref={inputRef}
                onChange={() => update(inputRef, countRef, props.max_chars)}
                className="textarea-with-counter-input"
            />
            <span
                ref={countRef}
                className='textarea-with-counter-counter'>
                {props.max_chars}
            </span>
        </div>
    )
})



export const InputWithCounter = React.forwardRef<InputHandles, IProps>((props, ref) => {
    const inputRef = createRef<HTMLInputElement>();
    const countRef = createRef<HTMLSpanElement>();

    useImperativeHandle(ref, () => ({
        counter () { return countRef.current; },
        input   () { return inputRef.current; },
        getInput () {
            return inputRef.current ? inputRef.current.value : ''
        },
        clear() {
            if (inputRef.current && countRef.current) {
                inputRef.current.value = ''
                update(inputRef, countRef, props.max_chars)
            }
        },
        add (text) {
            if (inputRef.current && countRef.current) {
                inputRef.current.value += text
                update(inputRef, countRef, props.max_chars)
            }
        }
    }));

    return (
        <div className='input-with-counter'>
            <input
                ref={inputRef}
                onChange={() => update(inputRef, countRef, props.max_chars)}
                className="input-with-counter-input"
            />
            <span
                ref={countRef}
                className='input-with-counter-counter'>
                {props.max_chars}
            </span>
        </div>
    )
})

const update = (
    inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>,
    countRef: React.RefObject<HTMLSpanElement>,
    max_chars: number
) => {
    if (countRef && countRef.current && inputRef.current && inputRef.current) {
        const length = inputRef.current.value.length;
        countRef.current.innerText = (max_chars - length) + '';

        if (length === 0) {
            countRef.current.style.color = 'red'
            inputRef.current.style.boxShadow = '0px 0px 0px 1px red';
        }
        else if (length < max_chars * 0.10) {
            countRef.current.style.color = 'green'
            inputRef.current.style.boxShadow = '0px 0px 0px 1px green';
        }
        else if (length < max_chars * 0.50) {
            countRef.current.style.color = 'orange'
            inputRef.current.style.boxShadow = '0px 0px 0px 1px orange';
        }
        else if (length <= max_chars) {
            countRef.current.style.color = '#c5c519'
            inputRef.current.style.boxShadow = '0px 0px 0px 1px #c5c519';
        }
        else {
            countRef.current.style.color = 'red'
            inputRef.current.style.boxShadow = '0px 0px 0px 1px red';
        }
    }
}