import { useEffect, useState } from "react"

interface DebounceProps {
    value: string,
    delay: number
}


export const useDebounce = ({ value, delay }: DebounceProps) => {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {

        let timerId: ReturnType<typeof setTimeout> | undefined;

        timerId = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        const cleanup = () => {

            clearTimeout(timerId)
        }

        return cleanup
    }, [value,delay])


    return debouncedValue

}