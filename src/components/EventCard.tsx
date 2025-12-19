import { Calendar, Clock, MapPin, Music, ArrowRight } from 'lucide-react';
import { Event } from '../lib/supabase';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
  return (
    <div className="group h-full bg-gradient-to-br from-gray-900/50 to-black border border-purple-500/20 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:scale-[1.02] flex flex-col">
      <div className="relative overflow-hidden h-48">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent z-10"></div>
        <img
          src={event.image_url}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full shadow-lg">
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
            {event.name}
          </h3>
          <p className="text-gray-400 mb-4 line-clamp-2 text-sm">
            {event.description}
          </p>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-start space-x-3 text-gray-300">
            <Calendar className="text-purple-400 flex-shrink-0 mt-1" size={18} />
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium">{event.date}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-gray-300">
            <Clock className="text-purple-400 flex-shrink-0 mt-1" size={18} />
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="text-sm font-medium">{event.time}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-gray-300">
            <MapPin className="text-purple-400 flex-shrink-0 mt-1" size={18} />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium line-clamp-1">{event.location}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-gray-300">
            <Music className="text-purple-400 flex-shrink-0 mt-1" size={18} />
            <div>
              <p className="text-xs text-gray-500">Venue</p>
              <p className="text-sm font-medium line-clamp-1">{event.venue}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(event)}
          className="group/btn w-full px-4 py-2.5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600 hover:to-pink-600 text-purple-300 hover:text-white font-semibold rounded-lg border border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center space-x-2 text-sm"
        >
          <span>View Details</span>
          <ArrowRight size={16} className="opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
}
