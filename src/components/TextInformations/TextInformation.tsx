import './TextInformation.sass'
import DateCounter from './DateCounter'
import DataCounter from "./DataCounter"

const _dumm = {
    inquiries: { value: 300, duration: 3500 },
    suppliers: { value: 200, duration: 2500 },
    buyers: { value: 250, duration: 2500 },
    products: { value: 120, duration: 2500 }
}

export default function TextInformation() {
    
    const dataCounters = Object.entries( _dumm ).map(([ key, { value, duration }], index ) => <DataCounter key={ index } label={ key } value={ value } duration={ duration } /> )

    return (
        <aside className="text-information">
            <DateCounter />
            { dataCounters }
        </aside>
    )
}