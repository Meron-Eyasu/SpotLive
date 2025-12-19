import { useEffect, useState } from 'react';
import { supabase, Event } from '../lib/supabase';
import { EventCard } from './EventCard';
import { Loader2 } from 'lucide-react';

interface EventListProps {
  onEventSelected: (event: Event) => void;
}

export function EventList({ onEventSelected }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const genres = Array.from(new Set(events.map(e => e.category)));
  const filteredEvents = selectedGenre
    ? events.filter(e => e.category === selectedGenre)
    : events;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="text-gray-400 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <section id="events" className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upcoming Events
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Discover the hottest live music events happening near you
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedGenre === null
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-purple-500/20'
              }`}
            >
              All Genres
            </button>
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-purple-500/20'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <EventCard event={event} onViewDetails={onEventSelected} />
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            No events found in this genre. Try another category!
          </div>
        )}
      </div>
    </section>
  );
}
