import { useEffect, type RefObject } from "react"

interface ScrollEffectProps<T> {

    parentRef: RefObject<T | null>,
    setScrollTop: React.Dispatch<React.SetStateAction<number>>

}

export const useScrollEffect = <T>({ parentRef, setScrollTop }: ScrollEffectProps<T>) => {


    useEffect(() => {

        let reqAnimationFrame: number | null;
        const parentElement = parentRef.current as HTMLElement // thats the parent element 
        let pendingScrollTop = parentElement.scrollTop;

        if (!parentElement) {
            return
        }



        const handleScroll = () => {
            if (reqAnimationFrame) {
                cancelAnimationFrame(reqAnimationFrame)
            }


            pendingScrollTop = parentElement.scrollTop;

            reqAnimationFrame = requestAnimationFrame(() => {
                setScrollTop(pendingScrollTop)
                reqAnimationFrame = null
            })

        }

        parentElement.addEventListener('scroll', handleScroll, { passive: true })

        return (() => {
            parentElement.removeEventListener('scroll', handleScroll)
            if (reqAnimationFrame) {
                cancelAnimationFrame(reqAnimationFrame)
            }
        })

    }, [parentRef, setScrollTop])
}