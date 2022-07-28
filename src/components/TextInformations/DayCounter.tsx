import './DayCounter.sass'

interface Prop {
    day: number
}

export default function DayCounter({ day }: Prop) {
    return (
        <div className="day-count">
            <div>{ day }</div>
        </div>
    )
}