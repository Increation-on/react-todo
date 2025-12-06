// hooks/useSearch.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { debounce } from '../../utils/debounce.ts'

interface UseSearchProps<T> {
    items: T[]
    searchFn: (item: T, query: string) => boolean
    debounceMs?: number
}

export function useSearch<T>({ items, searchFn, debounceMs = 300 }: UseSearchProps<T>) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<T[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const searchRef = useRef(
        debounce((searchQuery: string) => {
            if (!searchQuery.trim()) {
                setResults([])
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            const filtered = items.filter(item => searchFn(item, searchQuery))
            setResults(filtered)
            setIsLoading(false)
        }, debounceMs)
    )

    useEffect(() => {
        searchRef.current(query)
    }, [query, items])

    const clearSearch = useCallback(() => {
        setQuery('')
        setResults([])
    }, [])

    return {
        query,
        setQuery,
        results,
        isLoading,
        clearSearch,
        hasResults: results.length > 0
    }
}

/**
 * Возвращает части текста для подсветки
 * @returns Объект с флагом hasMatch и частями текста [before, match, after]
 */
export const getHighlightedParts = (text: string, query: string): { 
    hasMatch: boolean; 
    parts: [string, string, string] 
} => {
    if (!query.trim()) {
        return { hasMatch: false, parts: [text, '', ''] }
    }
    
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const matchIndex = lowerText.indexOf(lowerQuery)
    
    if (matchIndex === -1) {
        return { hasMatch: false, parts: [text, '', ''] }
    }
    
    return {
        hasMatch: true,
        parts: [
            text.slice(0, matchIndex),
            text.slice(matchIndex, matchIndex + query.length),
            text.slice(matchIndex + query.length)
        ]
    }
}