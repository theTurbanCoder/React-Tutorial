import { useEffect, useMemo, useRef, useState } from "react";


const cache = new Map<string, any>();

const CACHE_TTL = 60 * 1000

let instanceIdCounter = 0 // number of components calling this hook

interface FetchState<T> { data: T | null, isLoading: boolean, error: string | null }

export const useFetch = <T>({ url }: { url: string }): FetchState<T> => {

    const instanceId = useMemo(() => {
        // Capture the current count for this instance
        const id = instanceIdCounter;
        // Increment the global counter for the next instance
        instanceIdCounter++;
        return id;
    }, []); // Empty dependency array ensures it runs ONLY on mount.

    const [fetchData, setFetchData] = useState<FetchState<T>>({
        data: null,
        isLoading: true,
        error: null
    })

    console.log(instanceId, cache)
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
            if (time >= cache.get(url).expriry) {
                console.log(`[Cache] expired for ${url}`);
                cache.delete(url)
            }
            else {
                console.log(`[Cache] Found data for ${url}`);
                setFetchData((prevState) => { return { ...prevState, data: cache.get(url).data, isLoading: false, error: null } })
                return cleanup;
            }
        }

        if (url) {
            setFetchData((prevState) => { return { ...prevState, isLoading: true, error: null } })
        }

        const fetchData = async () => {

            try {
                const response = await fetch(url, { signal: signal })

                if (!response.ok) {
                    throw new Error("Request Failed " + response.statusText)

                }

                const data: T = await response.json()

                if (mountRef.current) {
                    cache.set(url, { data: data, expriy: Date.now() + CACHE_TTL })
                    setFetchData((prevState) => { return { ...prevState, data: data, error: null, isLoading: false } })
                }


                timerId = setTimeout(() => {
                    console.log(`[Timer] Auto-invalidating cache for ${url}`);
                    cache.delete(url);
                }, CACHE_TTL)


            }

            catch (error: any) {
                if (error.name === "AbortError") {
                    console.log('Fetch aborted.');
                }
                else if (mountRef.current) {

                    setFetchData((prevState) => { return { ...prevState, data: null, error: error, isLoading: false } })
                }
            }
        }

        fetchData()

        return cleanup;

    }, [url])

    return fetchData

}