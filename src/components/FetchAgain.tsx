import React from "react";
import { type JSX } from "react";
import { useFetch } from '../hooks/useFetch'


export const FetchAgain = (): JSX.Element => {

    const { data, isLoading, error } = useFetch<Array<any>>({ url: "https://jsonplaceholder.typicode.com/posts" })
    return <>
        {isLoading && <p>Loading...</p>}
        {!!error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!isLoading && !error && data && data.length > 0 && data.map((post) => {
            return <div key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
            </div>
        })}

    </>
}