import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../src/services/api';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'academic' | 'extracurricular' | 'meeting' | 'holiday' | 'other';
  location?: string;
}

interface UpcomingEventsWidgetProps {
  className?: string;
  limit?: number;
  showTitle?: boolean;
}

const UpcomingEventsWidget: React.FC<UpcomingEventsWidgetProps> = ({ 
  className = '',
  limit = 5,
  showTitle = true 
}) => {
  const { t, locale } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const eventTypeInfo = {
    academic: { color: 'bg-blue-100 text-blue-800', icon: '📚' },
    extracurricular: { color: 'bg-green-100 text-green-800', icon: '🎯' },
    meeting: { color: 'bg-purple-100 text-purple-800', icon: '👥' },
    holiday: { color: 'bg-red-100 text-red-800', icon: '🎉' },
    other: { color: 'bg-gray-100 text-gray-800', icon: '📅' }
  };

  useEffect(() => {
    loadUpcomingEvents();
  }, [locale, limit]);

  const loadUpcomingEvents = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUpcomingEvents(locale, limit);
      setEvents(response.events || []);
    } catch (error) {
      console.error('Failed to load upcoming events:', error);
      // If backend is unavailable, silently handle error without redirecting
      // This is a widget, so we just show empty state instead of redirecting
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Remove seconds from HH:MM:SS
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        {showTitle && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📅</span>
            <span>Upcoming Events</span>
          </h3>
        )}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        {showTitle && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📅</span>
            <span>Upcoming Events</span>
          </h3>
        )}
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">📅</span>
          <p className="text-gray-500">No upcoming events</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📅</span>
          <span>Upcoming Events</span>
        </h3>
      )}
      
      <div className="space-y-4">
        {events.map((event) => {
          const typeInfo = eventTypeInfo[event.type] || eventTypeInfo.other;
          
          return (
            <div key={event.id} className="border-l-4 border-blue-200 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                      {typeInfo.icon}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                    {event.title}
                  </h4>
                  
                  {event.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      🕐 {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        📍 {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {events.length >= limit && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={() => window.location.href = '/calendar'}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all events →
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsWidget;