import { Picker } from 'emoji-mart';
import { Emoji } from 'emoji-mart/dist-es/utils/data';
import React, { createRef } from 'react';
import useOnClickOutside from '../util/useOnClickOutside';

interface IProps {
    onSelect: (emoji: Emoji) => void
}

const emojis: string[] = ['😊', '😂', '😇', '🥰', '🥶', '🥵', '👹', '💙']

export const EmojiPicker: React.FC<IProps> = ({onSelect}) => {
    const picker        = createRef<HTMLDivElement>();
    const pickerWrapper = createRef<HTMLDivElement>();

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    useOnClickOutside(pickerWrapper, () => {
        if (picker.current)
            picker.current.style.display = 'none'
    });

    const toggleEmojiMenu = () => {
        if (picker.current)
            if (picker.current.style.display === 'none')
                picker.current.style.display = 'block'
            else
                picker.current.style.display = 'none'
    }

    return (
        <div ref={pickerWrapper} style={{position: 'relative'}}>
            <div ref={picker} style={{display:'none'}}>
                <Picker
                    exclude={['flags']}
                    title=''
                    showSkinTones={false}
                    showPreview={false}
                    onClick={(emoji) => onSelect(emoji)}
                    style={{ position: 'absolute', bottom: '120px', right: '0', }} />
            </div>

            <span onClick={(e) => {
                e.preventDefault()
                toggleEmojiMenu()
            }} className='emoji'>{randomEmoji}</span>
        </div>
    )
}