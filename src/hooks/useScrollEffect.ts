import { useEffect, type RefObject } from "react"

interface ScrollEffectProps<T> {

    parentRef : RefObject<T | null>,
    setScrollTop:  React.Dispatch<React.SetStateAction<number>>

}

export const useScrollEffect = <T>({parentRef, setScrollTop}:ScrollEffectProps<T>) => {
    

    useEffect(() => {

        const parentElement = parentRef.current as HTMLElement // thats the parent element 

        if(!parentElement) {
            return
        }

        const handleScroll = () => {
            setScrollTop(parentElement.scrollTop)
        }

        parentElement.addEventListener('scroll', handleScroll)

        return(() => {
            parentElement.removeEventListener('scroll', handleScroll)
        })

    }, [parentRef, setScrollTop])


}