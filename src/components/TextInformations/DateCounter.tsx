import './DateCounter.sass'
import DayCounter from './DayCounter'

export default function DateCounter() {
    const currentDate: Date = new Date()
    const year: number = currentDate.getFullYear()
    const month: string = currentDate.toLocaleString( 'en-US', { month: 'short' })
    const day: number = currentDate.getDate()

    return (
        <div className="date-info">
            <h3 className="year">{ year }</h3>
            <h2 className="date">
                <div className="month">{ month }</div>
                <DayCounter day={ day } />
            </h2>
        </div>
    )
}