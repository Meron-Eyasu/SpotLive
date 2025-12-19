import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { EventList } from './components/EventList';
import { EventModal } from './components/EventModal';
import { CreateEventModal } from './components/CreateEventModal';
import { SignUpModal } from './components/SignUpModal';
import { SignInModal } from './components/SignInModal';
import { Event } from './lib/supabase';

function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEventSelected = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsCreateModalOpen(true);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreateSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation
        onCreateEvent={() => setIsCreateModalOpen(true)}
        onSignIn={() => setIsSignInModalOpen(true)}
        onJoinClick={() => setIsSignUpModalOpen(true)}
      />
      <Hero onJoinClick={() => setIsSignUpModalOpen(true)} />
      <EventList key={refreshTrigger} onEventSelected={handleEventSelected} />
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedEvent(null);
        }}
        onSuccess={handleCreateSuccess}
        editingEvent={selectedEvent}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSuccess={() => {
          setIsSignUpModalOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccess={() => {
          setIsSignInModalOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />

      <footer className="bg-black border-t border-purple-900/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            &copy; 2024 SpotLive. Discover live music events.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
