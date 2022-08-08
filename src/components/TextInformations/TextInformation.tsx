import './TextInformation.sass'
import useInquiry from '../../hooks/useInquiry'
import DateCounter from './DateCounter'
import DataCounter from "./DataCounter"

export default function TextInformation() {
    const { counts } = useInquiry()
    const dataCounters = Object.entries( counts ).map(([ key, val ], index ) => {
        return <DataCounter key={ index } label={ key } value={ val } duration={ key === 'inquiries' ? 3500 : 2500 } />
    })

    return (
        <aside className="text-information">
            <DateCounter />
            { dataCounters }
        </aside>
    )
}