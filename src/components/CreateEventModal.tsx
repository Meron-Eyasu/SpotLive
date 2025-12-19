import { X, Upload, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, Event } from '../lib/supabase';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingEvent?: Event | null;
}

export function CreateEventModal({
  isOpen,
  onClose,
  onSuccess,
  editingEvent,
}: CreateEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailed_about: '',
    location: '',
    venue: '',
    date: '',
    time: '',
    category: '',
    organizer: '',
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        name: editingEvent.name || '',
        description: editingEvent.description || '',
        detailed_about: editingEvent.detailed_about || '',
        location: editingEvent.location || '',
        venue: editingEvent.venue || '',
        date: editingEvent.date || '',
        time: editingEvent.time || '',
        category: editingEvent.category || '',
        organizer: editingEvent.organizer || '',
      });
      setImagePreview(editingEvent.image_url || '');
    } else {
      setFormData({
        name: '',
        description: '',
        detailed_about: '',
        location: '',
        venue: '',
        date: '',
        time: '',
        category: '',
        organizer: '',
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [editingEvent, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `event-${timestamp}-${file.name}`;

    const { error, data } = await supabase.storage
      .from('event-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('Please sign in to create events');
        return;
      }

      let imageUrl = imagePreview;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const eventData = {
        name: formData.name,
        description: formData.description,
        detailed_about: formData.detailed_about,
        location: formData.location,
        venue: formData.venue,
        date: formData.date,
        time: formData.time,
        category: formData.category,
        organizer: formData.organizer,
        image_url: imageUrl,
        user_id: user.id,
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-gradient-to-br from-gray-950 to-black border border-purple-500/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent rounded-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
            <h2 className="text-2xl font-bold text-white">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-black/60 hover:bg-black/80 rounded-full transition-all duration-300 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400"
            >
              <X size={24} className="text-purple-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Image
              </label>
              <div className="relative">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-purple-500/50 rounded-lg hover:border-purple-400 cursor-pointer transition-colors bg-purple-950/10">
                  <div className="flex items-center space-x-2 text-purple-300">
                    <Upload size={20} />
                    <span>
                      {imageFile ? 'Change image' : 'Upload image'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Enter event name"
              />
            </div>

            {/* Organizer */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Organizer Name
              </label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Your organization name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={2}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                placeholder="Brief description of the event"
              />
            </div>

            {/* Detailed About */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Detailed Description
              </label>
              <textarea
                name="detailed_about"
                value={formData.detailed_about}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                placeholder="More details about the event"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="">Select a category</option>
                <option value="Rock">Rock</option>
                <option value="Jazz">Jazz</option>
                <option value="Electronic">Electronic</option>
                <option value="Pop">Pop</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Classical">Classical</option>
                <option value="Folk">Folk</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="City, State/Country"
              />
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Venue *
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Venue name"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="e.g., August 25"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time *
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="e.g., 8:00 PM"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-purple-500/20">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                <span>{loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-800/50 text-white font-semibold rounded-lg border border-gray-700 hover:border-purple-500 hover:bg-purple-950/30 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
