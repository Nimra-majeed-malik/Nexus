import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, AlertCircle, PlusCircle, X, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GuidedTour } from '../../components/ui/GuidedTour';

interface MeetingEvent {
  id: string;
  title: string;
  date: string;
  color: string;
  status: 'confirmed' | 'pending' | 'declined';
}

interface MeetingRequest {
  id: string;
  from: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
}

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors] = useState(investors.slice(0, 3));
  const [runTour, setRunTour] = useState(false);
  const [events, setEvents] = useState<MeetingEvent[]>([
    { id: '1', title: 'Pitch to Michael - VC Fund', date: '2026-07-05', color: '#3B82F6', status: 'confirmed' },
    { id: '2', title: 'Investor Meeting', date: '2026-07-08', color: '#10B981', status: 'confirmed' },
    { id: '3', title: 'Deal Signing', date: '2026-07-12', color: '#F59E0B', status: 'pending' },
  ]);
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([
    { id: 'r1', from: 'Michael Rodriguez (VC Fund)', date: '2026-07-15', status: 'pending' },
    { id: 'r2', from: 'James Wilson (Angel Investor)', date: '2026-07-20', status: 'pending' },
  ]);
  const [selectedEvent, setSelectedEvent] = useState<MeetingEvent | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    if (user) {
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
    }
  }, [user]);

  const handleRequestStatusUpdate = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status } : req
      )
    );
  };

  const handleDateClick = (arg: any) => {
    const title = prompt('Enter meeting title:');
    if (title) {
      setEvents([...events, {
        id: Date.now().toString(),
        title,
        date: arg.dateStr,
        color: '#3B82F6',
        status: 'confirmed'
      }]);
    }
  };

  const handleEventClick = (arg: any) => {
    const clicked = events.find(e => e.id === arg.event.id);
    if (clicked) {
      setSelectedEvent(clicked);
      setEditTitle(clicked.title);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    setEvents(events.map(e =>
      e.id === selectedEvent?.id ? { ...e, title: editTitle } : e
    ));
    setShowEditModal(false);
  };

  const handleDelete = () => {
    setEvents(events.filter(e => e.id !== selectedEvent?.id));
    setShowEditModal(false);
  };

  const handleAcceptRequest = (id: string) => {
    const req = meetingRequests.find(r => r.id === id);
    if (req) {
      setEvents([...events, {
        id: Date.now().toString(),
        title: `Meeting with ${req.from}`,
        date: req.date,
        color: '#10B981',
        status: 'confirmed'
      }]);
    }
    setMeetingRequests(meetingRequests.map(r =>
      r.id === id ? { ...r, status: 'accepted' } : r
    ));
  };

  const handleDeclineRequest = (id: string) => {
    setMeetingRequests(meetingRequests.map(r =>
      r.id === id ? { ...r, status: 'declined' } : r
    ));
  };

  const tourSteps = [
    {
      target: 'body',
      content: '👋 Welcome to Nexus! Let me show you around the platform.',
      placement: 'center' as const,
    },
    {
      target: '.investor-cards-section',
      content: '🤝 Here are recommended investors who might be interested in your startup.',
      placement: 'bottom' as const,
    },
    {
      target: '.collaboration-requests-section',
      content: '📬 Accept or reject collaboration requests from investors.',
      placement: 'bottom' as const,
    },
    {
      target: '.calendar-section',
      content: '📅 Schedule and manage your meetings with investors.',
      placement: 'top' as const,
    },
    {
      target: '.videocall-section',
      content: '📹 Conduct video calls with investors from here.',
      placement: 'top' as const,
    },
    {
      target: '.document-section',
      content: '📄 Upload, sign and manage your pitch decks and contracts.',
      placement: 'top' as const,
    },
    {
      target: '.quick-links-section',
      content: '🚀 Quick access to Payments, Messages, and other important features!',
      placement: 'top' as const,
    },
  ];

  if (!user) return null;

  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');
  const confirmedMeetings = events.filter(e => e.status === 'confirmed');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's what's happening with your startup today</p>
        </div>
        <Link to="/investors">
          <Button leftIcon={<PlusCircle size={18} />}>Find Investors</Button>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Pending Requests</p>
                <h3 className="text-xl font-semibold text-primary-900">{pendingRequests.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Users size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Total Connections</p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {collaborationRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Calendar size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">{confirmedMeetings.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-success-50 border border-success-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-success-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-700">Profile Views</p>
                <h3 className="text-xl font-semibold text-success-900">24</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Meeting Requests */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">📨 Meeting Requests</h2>
        </CardHeader>
        <CardBody>
          {meetingRequests.length === 0 ? (
            <p className="text-gray-500 text-sm">No meeting requests</p>
          ) : (
            <div className="space-y-3">
              {meetingRequests.map(req => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{req.from}</p>
                    <p className="text-sm text-gray-500">Requested: {req.date}</p>
                  </div>
                  {req.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleAcceptRequest(req.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                        <Check size={14} /> Accept
                      </button>
                      <button onClick={() => handleDeclineRequest(req.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
                        <X size={14} /> Decline
                      </button>
                    </div>
                  ) : (
                    <Badge variant={req.status === 'accepted' ? 'success' : 'error'}>
                      {req.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">📅 Meeting Calendar</h2>
          <p className="text-sm text-gray-500">Click a date to add • Click an event to edit/delete</p>
        </CardHeader>
        <CardBody>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events.map(e => ({ ...e, backgroundColor: e.color, borderColor: e.color }))}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            height="auto"
          />
        </CardBody>
      </Card>

      {/* Confirmed Meetings */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">✅ Confirmed Meetings</h2>
        </CardHeader>
        <CardBody>
          {confirmedMeetings.length === 0 ? (
            <p className="text-gray-500 text-sm">No confirmed meetings yet</p>
          ) : (
            <div className="space-y-2">
              {confirmedMeetings.map(meeting => (
                <div key={meeting.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-gray-800">{meeting.title}</p>
                  <span className="text-sm text-gray-500">{meeting.date}</span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Edit Meeting</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button onClick={handleSaveEdit}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Save Changes
              </button>
              <button onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                Delete Meeting
              </button>
              <button onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaboration requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Collaboration Requests</h2>
              <Badge variant="primary">{pendingRequests.length} pending</Badge>
            </CardHeader>
            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map(request => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertCircle size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No collaboration requests yet</p>
                  <p className="text-sm text-gray-500 mt-1">When investors are interested in your startup, their requests will appear here</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Recommended investors */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recommended Investors</h2>
              <Link to="/investors" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </CardHeader>
            <CardBody className="space-y-4">
              {recommendedInvestors.map(investor => (
                <InvestorCard key={investor.id} investor={investor} showActions={false} />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};