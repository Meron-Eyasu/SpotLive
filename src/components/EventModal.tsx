import { X, Calendar, Clock, MapPin, Music, Sparkles, Trash2, Edit2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Event, supabase } from '../lib/supabase';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export function EventModal({ event, isOpen, onClose, onEdit, onDelete }: EventModalProps) {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);
    };
    getUser();
  }, [isOpen]);

  const handleDelete = async () => {
    if (!event?.id || !onDelete) return;
    if (!confirm('Are you sure you want to delete this event?')) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);

      if (error) throw error;
      onDelete(event.id);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = currentUser && currentUser === event?.user_id;

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-gradient-to-br from-gray-950 to-black border border-purple-500/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent rounded-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl">
            <img
              src={event.image_url}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-all duration-300 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400"
            >
              <X size={24} className="text-purple-400" />
            </button>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles size={20} className="text-purple-400" />
                <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full">
                  {event.category}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {event.name}
              </h2>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-purple-300 flex items-center space-x-2">
                <Sparkles size={20} />
                <span>About</span>
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                {event.description}
              </p>
            </div>

            {event.detailed_about && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-purple-300">Event Details</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {event.detailed_about}
                </p>
              </div>
            )}

            {event.organizer && (
              <div className="p-4 bg-purple-950/20 rounded-lg border border-purple-500/20">
                <p className="text-sm text-gray-500 font-medium mb-1">Organized by</p>
                <p className="text-white font-semibold">{event.organizer}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-purple-950/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                  <Calendar className="text-purple-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date</p>
                    <p className="text-white text-lg font-semibold">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-purple-950/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                  <Clock className="text-purple-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Time</p>
                    <p className="text-white text-lg font-semibold">{event.time}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-purple-950/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                  <MapPin className="text-purple-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Location</p>
                    <p className="text-white text-lg font-semibold">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-purple-950/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                  <Music className="text-purple-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Venue</p>
                    <p className="text-white text-lg font-semibold">{event.venue}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-purple-500/20">
              
              {isOwner && (
                <>
                  <button
                    onClick={() => onEdit?.(event)}
                    className="flex-1 px-6 py-3 bg-blue-600/20 text-blue-300 font-semibold rounded-lg border border-blue-500/30 hover:bg-blue-600/40 hover:border-blue-400 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Edit2 size={18} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-red-600/20 text-red-300 font-semibold rounded-lg border border-red-500/30 hover:bg-red-600/40 hover:border-red-400 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                    <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </>
              )}
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
