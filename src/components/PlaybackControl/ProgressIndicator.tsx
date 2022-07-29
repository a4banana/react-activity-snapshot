import './ProgressIndicator.sass'
import { SyntheticEvent, useContext, useEffect, useState, useRef } from 'react'
import { CycleContext } from '../../contexts/cycleContext'

interface ComponentTransitionEvent<T = Element> extends SyntheticEvent<T, TransitionEvent> {
    elapsedTime: number;
    propertyName: string;
    pseudoElement: string;
}

export default function ProgressIndicator() {
    const CIRCLE_SIZE: number = 16
    const STORKE_WIDTH: number = 2.8

    const isLoading = true
    
    const { progress, isPlaying } = useContext( CycleContext )

    const strokeWidth = isPlaying ? STORKE_WIDTH : STORKE_WIDTH / 3 
    const radius: number = CIRCLE_SIZE - ( strokeWidth / 2 )
    const dashArray: number = radius * Math.PI * 2
    const reverseOffset: number = -dashArray
    const progressToOffset = dashArray - ( dashArray * progress / 100 )

    function transitionEndHandler( event: ComponentTransitionEvent<SVGCircleElement> ): void {
        console.log( event )
    }

    const classes = [
        'indicator-svg',
        ( isPlaying ? 'is-playing' : '' ),
        ( isLoading ? 'is-loading' : '' ),
    ].join( ' ' )

    return (
        <svg className={ classes } viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx={ CIRCLE_SIZE } cy={ CIRCLE_SIZE } r={ radius }
                strokeWidth={ strokeWidth }
                className="track"></circle>
            <circle cx={ CIRCLE_SIZE } cy={ CIRCLE_SIZE } r={ radius }
                strokeDasharray={ dashArray }
                strokeWidth={ strokeWidth }
                onTransitionEnd={ transitionEndHandler }
                strokeDashoffset={ progressToOffset }
                className="thumb"></circle>
        </svg>
    )
}