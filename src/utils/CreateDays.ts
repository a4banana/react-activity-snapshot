const toTwoDigitsString = ( num: number ): string => num < 10 ? `0${num}` : num.toString()
const lastDayOfMonth = ( year: number, month: number ): number => new Date( year, month, 0 ).getDate()

const subtractDate = ( past: Date, current: Date ): number => {
    return Math.ceil( Math.abs( past.valueOf() - current.valueOf() ) / ( 1000 * 60 * 60 * 24 ))
}

const getDays = ( subtract: number, past: Date ): Array<string> => {
    const day = past.getDate()
    const year = past.getFullYear()
    const month = past.getMonth() + 1
    
    let date = day;
    let offset = 0
    let mon: number = 0
    let val = day;

    return Array.from( new Array( subtract ), ( _: any, i: number ) => {
        if ( val > 1 ) {
            val = date - Math.abs( offset - i )
        } else {
            offset = i
            mon++
            date = lastDayOfMonth( year, month - mon )
            val = date - Math.abs( offset - i )
        }
        return toTwoDigitsString( val )
    })
}

export default function createDays( past: Date, current: Date ) {
    const subtract = subtractDate( past, current )
    const days = getDays( subtract, past )
    
    return days
}

