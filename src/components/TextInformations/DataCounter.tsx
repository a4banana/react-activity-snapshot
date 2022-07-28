import './DataCounter.sass'

interface Prop {
    value: number
    label: string
    duration: number
}

export default function DataCounter({ value, label, duration }: Prop) {

    return (
        <div className="data-info">
            <div className="numeric-data">{ value }</div>
            <div className="data-info--label">{ label }</div>
        </div>
    )
}