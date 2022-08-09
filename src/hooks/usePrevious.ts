import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react'

const usePrevious = <T>( value: T ): T | undefined => {
    const ref = useRef<T>()
    useEffect(() => { ref.current = value })
    return ref.current
}

export default usePrevious