import React, { useImperativeHandle, useState } from 'react';

interface IProps {
    max_chars: number
}

interface Handles {
    getCount: () => number,
    getInput: () => string,
    clear:    () => void,
    add: (text: string) => void,
}

export const TextAreaWithCounter = React.forwardRef<Handles, IProps>((props, ref) => {
    const [style, setStyle] = useState<string>('');
    const [input, setInput] = useState<string>('');
    const [count, setCount] = useState<number>(0);

    useImperativeHandle(ref, () => ({
        getCount () { return count; },
        getInput () { return input  },
        clear    () { setInput('')  },
        add  (text) { setInput(input + text) }
    }));

    return (
        <div className={`textarea-with-counter ${style}`}>
            <textarea className="textarea-with-counter-input"
                      value={input}
                      onChange={(e) => {
                          const value  = e.target.value;
                          const length = value.length;
                          setInput(value);
                          setCount(length);
                          setStyle(getClass(length, props.max_chars));
                      }}
            />
            <span className='textarea-with-counter-counter'>
                {props.max_chars - count}
            </span>
        </div>
    )
})



export const InputWithCounter = React.forwardRef<Handles, IProps>((props, ref) => {
    const [style, setStyle] = useState<string>('');
    const [input, setInput] = useState<string>('');
    const [count, setCount] = useState<number>(0);

    useImperativeHandle(ref, () => ({
        getCount () { return count; },
        getInput () { return input  },
        clear    () { setInput('')  },
        add  (text) { setInput(input + text) }
    }));

    return (
        <div className={`input-with-counter ${style}`}>
            <input className="input-with-counter-input"
                   value={input}
                   onChange={(e) => {
                       const value  = e.target.value;
                       const length = value.length;
                       setInput(value);
                       setCount(length);
                       setStyle(getClass(length, props.max_chars));
                   }}
            />
            <span className='input-with-counter-counter'>
                {props.max_chars - count}
            </span>
        </div>
    )
})

const getClass = (length: number, max_chars: number): string => {
    if      (length === 0             )  return 'red'
    else if (length < max_chars * 0.30)  return 'green'
    else if (length < max_chars * 0.60)  return 'orange'
    else if (length < max_chars * 0.90)  return 'yellow'
    else                                 return 'red'
}