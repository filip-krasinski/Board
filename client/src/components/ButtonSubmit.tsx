import React, { useImperativeHandle, useState } from 'react';

export interface IProps {
    text: string;
    onClick: () => void;
}

export interface SubmitButtonHandles {
    isLoading: () => boolean,
    setLoading: (state: boolean) => void,
}

export const ButtonSubmit = React.forwardRef<SubmitButtonHandles, IProps>((props, ref) => {
    const [isLoading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        isLoading() { return isLoading },
        setLoading(state) { setLoading(state); },
    }));

    return (
        <button
            onClick={props.onClick}
            className={`loading-button ${isLoading ? 'loading' : ''}`}
        >
            <span>{props.text}</span>
            <div className="loading-button_dots">
                <div> </div>
                <div> </div>
                <div> </div>
                <div> </div>
            </div>
        </button>
    )
})