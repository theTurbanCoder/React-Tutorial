import {useEffect, useMemo, useRef, useState } from "react";

const cache = new Map<string, any>();

let instanceIdCounter = 0 // number of components calling this hook

interface FetchState<T> { data: T | null, isLoading: boolean, error: string | null }

export const useFetch = <T>({ url }: { url: string }): FetchState<T> => {

    const instanceId = useMemo(() => instanceIdCounter++, []);

    const [fetchData, setFetchData] = useState<FetchState<T>>({
        data: null,
        isLoading: true,
        error: null
    })

    const mountRef = useRef(true) // component is mounted 

    useEffect(() => {

        mountRef.current = true; // every time use Effetc runs the component is mounted
        
        const controller = new AbortController();
        const signal = controller.signal

        const cleanup = () => {

            controller.abort()
            mountRef.current = false

        }

        if (cache.has(url)) {
            console.log(`[Cache] Found data for ${url}`);
            setFetchData((prevState) => { return { ...prevState, data: cache.get(url), isLoading: false, error: null } })
            return cleanup;
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
                    cache.set(url, data)
                    setFetchData((prevState) => { return { ...prevState, data: data, error: null, isLoading: false } })
                }

                
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
        console.log(instanceId, cache)
        fetchData()

        return cleanup;

    }, [url])

    return fetchData

}