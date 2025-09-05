import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
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

const CalendarPage: React.FC = () => {
  const { t, locale } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'month' | 'list'>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const eventTypes = {
    academic: { color: 'bg-blue-100 text-blue-800', icon: '📚', label: 'Academic' },
    extracurricular: { color: 'bg-green-100 text-green-800', icon: '🎯', label: 'Extracurricular' },
    meeting: { color: 'bg-purple-100 text-purple-800', icon: '👥', label: 'Meeting' },
    holiday: { color: 'bg-red-100 text-red-800', icon: '🎉', label: 'Holiday' },
    other: { color: 'bg-gray-100 text-gray-800', icon: '📅', label: 'Other' }
  };

  useEffect(() => {
    loadEvents();
  }, [locale]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getUpcomingEvents(locale, 100); // Get more events for calendar view
      setEvents(response.events || []);
    } catch (error) {
      console.error('Failed to load events:', error);
      // Show error message to user instead of redirecting
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to load events');
      }
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        events: []
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateString);
      
      days.push({
        date,
        isCurrentMonth: true,
        events: dayEvents
      });
    }
    
    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        events: []
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const getEventTypeInfo = (type: Event['type']) => {
    return eventTypes[type] || eventTypes.other;
  };

  const filteredEvents = selectedDate 
    ? events.filter(event => event.date === selectedDate)
    : events.filter(event => new Date(event.date) >= new Date());

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 5);

  return (
    <PageWrapper title="School Events">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">School Events</h1>
            <p className="text-gray-600">Stay updated with school events and important dates</p>
          </div>
          <button
            onClick={() => setCurrentView(currentView === 'month' ? 'list' : 'month')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {currentView === 'month' ? '📋 List View' : '📅 Calendar View'}
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading events...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Events</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={loadEvents}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Calendar/List View */}
            <div className="lg:col-span-2">
              {currentView === 'month' ? (
                /* Calendar View */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      ← Previous
                    </button>
                    <h3 className="text-lg font-semibold">
                      {currentMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Next →
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="p-4">
                    {/* Days of week header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonth(currentMonth).map((day, index) => (
                        <div
                          key={index}
                          className={`min-h-[80px] p-1 border border-gray-100 rounded cursor-pointer hover:bg-gray-50 transition-colors ${
                            !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                          } ${
                            day.date.toDateString() === new Date().toDateString() ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => {
                            const dateString = day.date.toISOString().split('T')[0];
                            setSelectedDate(dateString === selectedDate ? null : dateString);
                          }}
                        >
                          <div className="text-sm font-medium mb-1">
                            {day.date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {day.events.slice(0, 2).map(event => {
                              const typeInfo = getEventTypeInfo(event.type);
                              return (
                                <div
                                  key={event.id}
                                  className={`text-xs px-1 py-0.5 rounded truncate ${typeInfo.color}`}
                                  title={`${event.title} (${formatTime(event.startTime)}-${formatTime(event.endTime)})`}
                                >
                                  {typeInfo.icon} {event.title}
                                </div>
                              );
                            })}
                            {day.events.length > 2 && (
                              <div className="text-xs text-gray-500 px-1">
                                +{day.events.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">
                      {selectedDate ? `Events on ${formatDate(selectedDate)}` : 'Upcoming Events'}
                    </h3>
                    {selectedDate && (
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                      >
                        ← View all events
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                    {filteredEvents.map(event => {
                      const typeInfo = getEventTypeInfo(event.type);
                      return (
                        <div key={event.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                                  {typeInfo.icon} {typeInfo.label}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatDate(event.date)}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                              {event.description && (
                                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>🕐 {formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                                {event.location && <span>📍 {event.location}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {filteredEvents.length === 0 && (
                      <div className="p-8 text-center text-gray-500">
                        <span className="text-4xl mb-4 block">📅</span>
                        <p>No events found.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Events:</span>
                    <span className="font-medium">{events.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">This Month:</span>
                    <span className="font-medium">
                      {events.filter(event => {
                        const eventDate = new Date(event.date);
                        const currentDate = new Date();
                        return eventDate.getMonth() === currentDate.getMonth() && 
                               eventDate.getFullYear() === currentDate.getFullYear();
                      }).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Types Legend */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Event Types</h4>
                <div className="space-y-2">
                  {Object.entries(eventTypes).map(([type, info]) => (
                    <div key={type} className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${info.color}`}>
                        {info.icon}
                      </span>
                      <span className="text-gray-700">{info.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Upcoming Events */}
              {!selectedDate && upcomingEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Next Events</h4>
                  <div className="space-y-3">
                    {upcomingEvents.map(event => {
                      const typeInfo = getEventTypeInfo(event.type);
                      return (
                        <div key={event.id} className="border-l-4 border-blue-200 pl-3">
                          <div className="flex items-center gap-1 mb-1">
                            <span className={`text-xs px-1 py-0.5 rounded ${typeInfo.color}`}>
                              {typeInfo.icon}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(event.date).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <h5 className="font-medium text-sm text-gray-900 mb-1">{event.title}</h5>
                          <p className="text-xs text-gray-500">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default CalendarPage;