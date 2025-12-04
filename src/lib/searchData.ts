interface SearchDataProps {

    query: string,
    values: {
        id: number;
        name: string;
        category: string;
        description: string;
        price: string;
    }[]
}

const searchQuery = new Map<string, {data: SearchDataProps['values'], ttl: number}>()



export const searchData = ({query, values}:SearchDataProps) => {

    const trimmedQuery = query.trim().toLowerCase()

    if(searchQuery.has(trimmedQuery)){
        return searchQuery.get(trimmedQuery)?.data || []
    }


    const results = values.filter((value) => {
        return value.description.includes(trimmedQuery) || value.name.includes(trimmedQuery)
    })

    searchQuery.set(trimmedQuery, { data : results, ttl: Date.now() + 6*1000})
    
    return results

    // useEffect(() => {}, [trimmedQuery])
}