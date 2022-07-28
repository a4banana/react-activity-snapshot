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
    const isLoading = false
    const isPlaying = true
    const circle = useRef<SVGCircleElement>( null )
    
    const { progress } = useContext( CycleContext )


    const [ strokeWidth, setStrokeWidth ] = useState( 2.8 )
    const radius: number = CIRCLE_SIZE - ( strokeWidth / 2 )
    const dashArray: number = radius * Math.PI * 2
    const reverseOffset: number = -dashArray
    
    const styleText = {
        strokeDashoffset: dashArray - ( dashArray * progress / 100 )
    }

    // useEffect(() => {
    //     const progressToOffset: number = dashArray - ( dashArray * progress / 100 )
        
    //     // circle.current?.setAttribute( 'storke-dashoffset', progressToOffset.toString() )
    // }, [ progress ])
    // console.log( progress )


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
            <circle cx={ CIRCLE_SIZE } cy={ CIRCLE_SIZE } r={ radius } className="track"></circle>
            <circle cx={ CIRCLE_SIZE } cy={ CIRCLE_SIZE } r={ radius }
                ref={ circle }
                style={ styleText }
                onTransitionEnd={ transitionEndHandler }
                // strokeDashoffset={ progressToOffset }
                className="thumb"></circle>
        </svg>
    )
}