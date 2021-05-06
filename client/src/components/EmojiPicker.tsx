import { Picker } from 'emoji-mart';
import { Emoji } from 'emoji-mart/dist-es/utils/data';
import React, { createRef, useState } from 'react';
import useOnClickOutside from '../util/useOnClickOutside';

interface IProps {
    onSelect: (emoji: Emoji) => void
}

const emojis: string[] = ['😊', '😂', '😇', '🥰', '🥶', '🥵', '👹', '💙']
const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

export const EmojiPicker: React.FC<IProps> = ({onSelect}) => {
    const [isActive, setActive] = useState(false);
    const pickerWrapper = createRef<HTMLDivElement>();

    useOnClickOutside(pickerWrapper, () => setActive(false));

    return (
        <div ref={pickerWrapper} style={{position: 'relative'}}>
            {isActive ?
                <Picker
                    exclude={['flags']}
                    title=''
                    showSkinTones={false}
                    showPreview={false}
                    onClick={(emoji) => onSelect(emoji)}
                    style={{ position: 'absolute', bottom: '120px', right: '0' }}
                />
                : null
            }

            <span onClick={(e) => {
                e.preventDefault()
                setActive(!isActive)
            }} className='emoji'>{randomEmoji}</span>
        </div>
    )
}