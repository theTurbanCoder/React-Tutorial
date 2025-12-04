import React from 'react'
interface SearchProps {
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement> 
}
export const SearchInput = ({ value, onChange }: SearchProps) => {
    return (
        <div>
            <input 
                id='data-search'
                value={value}
                onChange={onChange}
                placeholder="Search by Widget name or description..."></input>
        </div>
    )
}
