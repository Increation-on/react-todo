// components/Search.tsx
import { getHighlightedParts } from '../hooks/useSearch.tsx'
import './styles/Search.css'

interface SearchProps {
    value: string
    onChange: (value: string) => void
    results: Array<{ id: string | number; text: string }>
    onSelect: (item: any) => void
    onClear: () => void
    isLoading?: boolean
    placeholder?: string
    showAutocomplete?: boolean
    onFocus?: () => void
    onKeyDown?: (e: React.KeyboardEvent) => void
    highlightMatches?: boolean
}

// Компонент для подсветки текста
const HighlightedText = ({ text, query }: { text: string; query: string }) => {
    const { hasMatch, parts } = getHighlightedParts(text, query)
    
    if (!hasMatch) {
        return <span className="item-text">{text}</span>
    }
    
    return (
        <span className="item-text">
            {parts[0]}
            <span className="highlight-match">{parts[1]}</span>
            {parts[2]}
        </span>
    )
}

export default function Search({
    value,
    onChange,
    results,
    onSelect,
    onClear,
    isLoading = false,
    placeholder = "🔍 Search...",
    showAutocomplete = true,
    onFocus,
    onKeyDown,
    highlightMatches = true
}: SearchProps) {
    return (
        <div className="search-section">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    className="search-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    placeholder={placeholder}
                    disabled={isLoading}
                    aria-label="Search tasks"
                />
                
                {value && (
                    <button
                        className="search-clear-button"
                        onClick={onClear}
                        disabled={isLoading}
                        aria-label="Clear search"
                        type="button"
                    >
                        {isLoading ? '⌛' : '×'}
                    </button>
                )}
            </div>
            
            {showAutocomplete && results.length > 0 && (
                <div className="autocomplete-list">
                    {results.map(item => (
                        <button
                            key={item.id}
                            type="button"
                            className="autocomplete-item"
                            onClick={() => onSelect(item)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    onSelect(item)
                                }
                            }}
                            aria-label={`Select task: ${item.text}`}
                        >
                            {highlightMatches ? (
                                <HighlightedText text={item.text} query={value} />
                            ) : (
                                <span className="item-text">{item.text}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}