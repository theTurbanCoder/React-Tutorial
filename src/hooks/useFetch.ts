import { useEffect, useMemo, useRef, useState } from "react";

interface CacheEntry<T> { data: T, expiry: number }

interface FetchState<T> { data: T | null, isLoading: boolean, error: string | null }


const cache = new Map<string, CacheEntry<any>>();

const CACHE_TTL = 60 * 1000

let instanceIdCounter = 0 // number of components calling this hook


export const useFetch = <T>({ url }: { url: string }): FetchState<T> => {

    const instanceId = useMemo(() => {
        // Capture the current count for this instance
        const id = instanceIdCounter;
        // Increment the global counter for the next instance
        instanceIdCounter++;
        return id;
    }, []); // Empty dependency array ensures it runs ONLY on mount.

    const [myData, setmyData] = useState<FetchState<T>>({
        data: null,
        isLoading: true,
        error: null
    })

    const mountRef = useRef(true) // component is mounted 


    useEffect(() => {

        let timerId: ReturnType<typeof setTimeout> | undefined;

        mountRef.current = true; // every time use Effetc runs the component is mounted

        const controller = new AbortController();
        const signal = controller.signal

        const cleanup = () => {

            controller.abort()
            mountRef.current = false
            clearTimeout(timerId)
        }

        if (cache.has(url)) {
            const time = Date.now()
            const cacheTime = cache.get(url)!;
            if (time > cacheTime.expiry) {
                console.log(`[Cache] expired for ${url}`);
                cache.delete(url)
            }
            else {
                console.log(`[Cache] Found data for ${url}`);
                setmyData((prevState) => { return { ...prevState, data: cacheTime.data, isLoading: false, error: null } })
                return cleanup;
            }
        }

        const getFetchData = async () => {

            try {
                const response = await fetch(url, { signal: signal })

                if (!response.ok) {
                    throw new Error("Request Failed " + response.statusText)

                }

                const data: T = await response.json()

                if (mountRef.current) {
                    const newExpiry = Date.now() + CACHE_TTL;
                    cache.set(url, { data: data, expiry: newExpiry })
                    setmyData((prevState) => { return { ...prevState, data: data, error: null, isLoading: false } })
                }

                timerId = setTimeout(() => {
                    console.log(`[Timer] ${timerId} Auto-invalidating cache for ${url}`);
                    cache.delete(url);
                }, CACHE_TTL)


            }

            catch (error: any) {
                if (error.name === "AbortError") {
                    console.log('Fetch aborted.');
                }
                else if (mountRef.current) {

                    setmyData((prevState) => { return { ...prevState, data: null, error: error, isLoading: false } })
                }
            }
        }

        getFetchData()

        return cleanup;

    }, [url])

    return myData

}