import './PlayAndPause.sass'
import ProgressIndicator from './ProgressIndicator'

export interface PlayAndPauseProps {
    isLoaded: boolean
}

export default function PlayAndPause({ isLoaded }: PlayAndPauseProps) {
    const isPlaying: boolean = false
    
    const classes = () => {
        const _default = [ 'play-and-pause' ]
        return [
            ..._default,
            ( isLoaded ? 'is-loaded' : '' ),
            ( isPlaying ? 'is-playing' : '' ),
        ].join( ' ' )
    }

    function clickHandler() {
        console.log( 'clicked' )
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