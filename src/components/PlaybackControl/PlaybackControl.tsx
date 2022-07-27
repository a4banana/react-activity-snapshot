import './PlaybackControl.sass'
import PlayAndPause from './PlayAndPause'

export interface PlaybackControlProps {
    isLoaded: boolean
}

export default function PlaybackControl({ isLoaded }: PlaybackControlProps) {
    
    return (
        <div className="playback-control">
            <PlayAndPause isLoaded={ isLoaded } />
        </div>
    )
}