import React, { useEffect, useState } from 'react'


import {generateMockData} from '../data/mockedData'
import { SearchInput } from './SearchInput'
import { useDebounce } from '../hooks/useDebounce'
import { searchData } from '../lib/searchData'
import { VirtualizedList } from './VirtualizedList'

const mockedData = generateMockData(100000)

export const DataExplorer = () => {

const [searchQuery,setSearchQuery] = useState("")

const [filteredData, setFilteredData] = useState(mockedData)

const debouncedValue = useDebounce({value: searchQuery, delay:300})


useEffect(() => {

    const results = searchData({query: searchQuery, values: filteredData})

    setFilteredData(results)


}, [debouncedValue])

  return (
    <div><div className="data-explorer">
            <h2>Virtualized Data Explorer</h2>
            
            <SearchInput value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}}/>

            <p>Showing {filteredData.length} results.</p>
            
            {/* Phase 1 & 3: Virtualized List component goes here */}
            <VirtualizedList items={filteredData} />
        </div></div>
  )
}

