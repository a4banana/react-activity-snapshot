import './PlayAndPause.sass'
import ProgressIndicator from './ProgressIndicator'
import { useContext } from 'react'
import { CycleContext, CycleDispatchContext, CycleActionTypes } from '../../contexts/cycleContext'

export interface PlayAndPauseProps {
    isLoaded: boolean
}

export default function PlayAndPause({ isLoaded }: PlayAndPauseProps) {
    const { isPlaying } = useContext( CycleContext )
    const dispatch = useContext( CycleDispatchContext )
    
    const classes = () => {
        const _default = [ 'play-and-pause' ]
        return [
            ..._default,
            ( isLoaded ? 'is-loaded' : '' ),
            ( isPlaying ? 'is-playing' : '' ),
        ].join( ' ' )
    }

    function clickHandler(): void {
        dispatch({ type: CycleActionTypes.TOGGLE_PLAY })
    }

    return (
        <div className={ classes() } onClick={ clickHandler }>
            <div className="progress-indicator">
                <ProgressIndicator />
            </div>
            <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className="play-and-pause-icon">
                <path></path>
            </svg>
        </div>
    )
}