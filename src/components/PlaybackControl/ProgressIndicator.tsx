import './ProgressIndicator.sass'
import { SyntheticEvent, useState } from 'react'

const CIRCLE_SIZE: number = 16

interface ComponentTransitionEvent<T = Element> extends SyntheticEvent<T, TransitionEvent> {
    elapsedTime: number;
    propertyName: string;
    pseudoElement: string;
}

export default function ProgressIndicator() {
    const isLoading = false
    const isPlaying = false
    const progress = 50

    const [ strokeWidth, setStrokeWidth ] = useState( 2.8 )
    const radius: number = CIRCLE_SIZE - ( strokeWidth / 2 )
    const dashArray: number = radius * Math.PI * 2
    const reverseOffset: number = -dashArray
    const progressToOffset: number = dashArray - ( dashArray * progress / 100 )

    function transitionEndHandler( event: ComponentTransitionEvent<SVGCircleElement> ): void {
        console.log( event )
    }

    const classes = [
        'indicator-svg',
        ( isLoading ? 'is-loading' : '' ),
        ( isPlaying ? 'is-playing' : '' ),
    ].join( ' ' )

    return (
        <svg className={ classes } viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx={ CIRCLE_SIZE } cy={ CIRCLE_SIZE } className="track"></circle>
            <circle cx={ CIRCLE_SIZE } cy={ CIRCLE_SIZE } onTransitionEnd={ transitionEndHandler } className="thumb"></circle>
        </svg>
    )
}