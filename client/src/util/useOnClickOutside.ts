import React, { useEffect } from 'react';

export const useOnClickOutside = (ref:  React.RefObject<HTMLDivElement>, handler: (event: MouseEvent) => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node))
                handler(event);
        };

        document.addEventListener('mousedown', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [ref, handler]);
}

export default useOnClickOutside;