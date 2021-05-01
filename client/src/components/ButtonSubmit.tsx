import React from 'react';


export interface IProps {
    text: string;
    onClick: () => void;
}

export const ButtonSubmit = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
     return (
         <button ref={ref} onClick={props.onClick} className='loading-button'>
             <span>{props.text}</span>
             <div className="loading-button_dots">
                 <div> </div>
                 <div> </div>
                 <div> </div>
                 <div> </div>
             </div>
         </button>
     )
});