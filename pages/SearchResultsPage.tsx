
import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useLanguage } from '../context/LanguageContext';
import { searchData } from '../search/searchData';

const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const { locale, t, getTranslation } = useLanguage();

    const results = useMemo(() => {
        if (!query) return [];
        const lowerCaseQuery = query.toLowerCase();
        return searchData.filter(page => 
            page.title[locale].toLowerCase().includes(lowerCaseQuery) ||
            page.content[locale].toLowerCase().includes(lowerCaseQuery)
        );
    }, [query, locale]);

    return (
        <PageWrapper title={`${getTranslation('search.results.title', 'Резултати')}: "${query}"`}>
            {results.length > 0 ? (
                <div>
                    <p className="mb-8">{getTranslation('search.results.found', 'Намерени {count} резултата').replace('{count}', results.length.toString())}</p>
                    <div className="space-y-6">
                        {results.map(page => (
                            <div key={page.path} className="pb-4 border-b border-gray-200">
                                <Link to={page.path} className="text-xl font-bold text-brand-blue hover:text-brand-gold transition-colors">
                                    {page.title[locale]}
                                </Link>
                                <p className="mt-2 text-gray-600">
                                    {page.content[locale].substring(0, 200)}...
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>{getTranslation('search.results.notFound', 'Няма резултати за "{query}"').replace('{query}', query || '')}</p>
            )}
        </PageWrapper>
    );
};

export default SearchResultsPage;
