import React, { createRef, useImperativeHandle} from 'react';

export interface IProps {
    text: string;
    onClick: () => void;
}

export interface SubmitButtonHandles {
    getRef: () => HTMLSpanElement | null,
    isLoading: () => boolean,
    setLoading: (state: boolean) => void,
}

export const ButtonSubmit = React.forwardRef<SubmitButtonHandles, IProps>((props, ref) => {
    const buttonRef = createRef<HTMLButtonElement>();
    let isLoading = false;

    useImperativeHandle(ref, () => ({
        getRef()    { return buttonRef.current },
        isLoading() { return isLoading },
        setLoading(state) {
            isLoading = state;
            if (state) buttonRef.current?.classList.add('loading')
            else       buttonRef.current?.classList.remove('loading')
        },
    }));

    return (
        <button
            ref={buttonRef}
            onClick={props.onClick}
            className='loading-button'
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