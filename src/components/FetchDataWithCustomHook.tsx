import { useState, type JSX } from "react";
import { useFetch } from '../hooks/useFetch'

export const FetchDataWithCustomHooks = (): JSX.Element => {

    const [postID, setPostID] = useState(1)

    const { data, isLoading, error } = useFetch<{id:string, title:string, body:string}>({ url: `https://jsonplaceholder.typicode.com/posts/${postID}` })
    return <>
        {isLoading && <p>Loading...</p>}
        {!!error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!isLoading && !error && data &&
            <div key={data.id}>
                <h3>{data.title}</h3>
                <p>{data.body}</p>
            </div>
        }

        <button onClick={() => {
            setPostID(() => postID + 1)
        }}> Get Post {postID + 1} </button>

        {postID > 1 && <button onClick={() => {
            setPostID(() => postID - 1)
        }}> Get Post {postID - 1} </button>}
    </>
}