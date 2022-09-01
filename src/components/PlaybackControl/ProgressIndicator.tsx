import './ProgressIndicator.sass'
import { SyntheticEvent, useContext, CSSProperties, useEffect } from 'react'
import { CycleContext } from '../../contexts/cycleContext'
import { ProgressContext } from '../../contexts/progressContext'
import { QueuesDispatchContext, QueuesActionType } from '../../contexts/queuesContext'
interface ComponentTransitionEvent<T = Element> extends SyntheticEvent<T, TransitionEvent> {
    elapsedTime: number;
    propertyName: string;
    pseudoElement: string;
}

export default function ProgressIndicator() {
    const CIRCLE_SIZE: number = 16
    const STORKE_WIDTH: number = 2.8
    const { isPlaying, isLoading } = useContext( CycleContext )
    const { progress } = useContext( ProgressContext )
    const dispatchQueues = useContext( QueuesDispatchContext )

    const strokeWidth: number = isPlaying ? STORKE_WIDTH : STORKE_WIDTH / 3 
    const radius: number = CIRCLE_SIZE - ( strokeWidth / 2 )
    const dashArray: number = radius * Math.PI * 2
    const reverseOffset: number = -dashArray
    const progressToOffset: number = dashArray - ( dashArray * progress / 100 )
    const strokeDashoffset = isLoading ? reverseOffset : progressToOffset
    
    const transition = isLoading ? 'stroke-dashoffset 2s, stroke-width .15s' : 'stroke-dashoffset 0s, stroke-width .15s'
    const styles: CSSProperties = {
        strokeWidth,
        strokeDashoffset,
        transition
    }

    const classes = [
        'indicator-svg',
        ( isPlaying && 'is-playing' ),
        ( isLoading && 'is-loading' ),
    ].join( ' ' )


    // !!! NEVER CAPTURED 'stroke-dashoffset' in react. not working this code
    // const transitionEndHandler = ( event: ComponentTransitionEvent<SVGCircleElement> ): void => {
    //     if ( event.propertyName === 'stroke-dashoffset' ) {
    //         dispatchQueues({ type: QueuesActionType.DONE_QUEUE, key: 'progress-indicator' });
    //     }
    // }

    // !!! MUST CHANGED 2 transitionend event
    useEffect(()=> {
        if ( isLoading ) {
            dispatchQueues({ type: QueuesActionType.ADD_QUEUE, key: 'progress-indicator' })
            setTimeout(() => dispatchQueues({ type: QueuesActionType.DONE_QUEUE, key: 'progress-indicator' }), 2000 )
        }
    }, [ isLoading ])

    return (
        <svg className={ classes } viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx={ CIRCLE_SIZE } cy={ CIRCLE_SIZE } r={ radius }
                style={ styles }
                className="track"></circle>
            <circle cx={ CIRCLE_SIZE } cy={ CIRCLE_SIZE } r={ radius }
                style={ styles }
                strokeDasharray={ dashArray }
                className="thumb"></circle>
        </svg>
    )
}