import { useEffect, useRef, useState } from "react";

const cache = new Map<string, any>();

interface FetchState<T> {data: T | null, isLoading: boolean, error: string | null}

const useFetch = <T> ({url}: {url:string}) : FetchState<T> => {

    const [fetchData, setFetchData] = useState<FetchState< T >>({
        data: null,
        isLoading: true,
        error:null
    })
    const mountRef = useRef(true)



    useEffect(() => {

        const controller = new AbortController(); 
        const signal  = controller.signal

        const cleanup = () => {

            controller.abort()
            mountRef.current = false
    
        }
    

        if(cache.has(url)){
            setFetchData((prevState)=> { return {...prevState, data: cache.get(url), isLoading: false, error: null}} )
            return cleanup;
        }

        if(url) {
            setFetchData((prevState)=> { return {...prevState, data: null, isLoading: true, error: null}} )
        }



        const fetchData = async () =>  {

            try{
            const response = await fetch(url, {signal: signal})

            if(!response.ok) {
                throw new Error("Request Failed "+ response.statusText)
              
            }

            const data : T = await response.json()

            if(mountRef.current) {
                cache.set(url, data)
            }

            setFetchData((prevState) => {return {...prevState,data:data,  error: null, isLoading: false}})
        }

        catch(error:any) {
            if(error.name === "AbortError") {
            console.log('Fetch aborted.');
            }
            else if(mountRef.current) {
            
                setFetchData((prevState) => {return {...prevState,data:null,  error: error, isLoading: false}})
            }
        }
    }


 






        fetchData()

        return cleanup;

    }, [url])

    return fetchData

}