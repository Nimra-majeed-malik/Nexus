import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle, X, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

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

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [runTour, setRunTour] = useState(false);
  const [events, setEvents] = useState<MeetingEvent[]>([
    { id: '1', title: 'Call with Sarah - TechWave', date: '2026-07-05', color: '#3B82F6', status: 'confirmed' },
    { id: '2', title: 'Deal Review Meeting', date: '2026-07-08', color: '#10B981', status: 'confirmed' },
    { id: '3', title: 'Portfolio Check-in', date: '2026-07-10', color: '#F59E0B', status: 'pending' },
  ]);
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([
    { id: 'r1', from: 'Sarah Johnson (TechWave)', date: '2026-07-15', status: 'pending' },
    { id: 'r2', from: 'David Chen (GreenLife)', date: '2026-07-18', status: 'pending' },
  ]);
  const [selectedEvent, setSelectedEvent] = useState<MeetingEvent | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  if (!user) return null;

  const sentRequests = getRequestsFromInvestor(user.id);
  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = searchQuery === '' ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustries.length === 0 ||
      selectedIndustries.includes(entrepreneur.industry);
    return matchesSearch && matchesIndustry;
  });

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const handleDateClick = (arg: any) => {
    const title = prompt('Enter meeting title:');
    if (title) {
      const newEvent: MeetingEvent = {
        id: Date.now().toString(),
        title,
        date: arg.dateStr,
        color: '#3B82F6',
        status: 'confirmed'
      };
      setEvents([...events, newEvent]);
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

  const confirmedMeetings = events.filter(e => e.status === 'confirmed');

  // Guided walkthrough steps — covers all Milestone 1-6 modules
  const tourSteps: Step[] = [
    {
      target: 'body',
      content: '👋 Welcome to Nexus! Let’s take a quick tour of your investor dashboard.',
      placement: 'center',
    },
    {
      target: '.meeting-requests-section',
      content: '📨 Manage meeting requests sent by entrepreneurs here.',
      placement: 'top',
    },
    {
      target: '.calendar-section',
      content: '📅 Schedule and track your confirmed meetings on this calendar.',
      placement: 'top',
    },
    {
      target: '.entrepreneur-cards-section',
      content: '🚀 Browse featured startups looking for investment, and filter by industry.',
      placement: 'top',
    },
    {
      target: 'a[href="/videocall"]',
      content: '📹 Start a video call with an entrepreneur directly from the sidebar.',
      placement: 'right',
    },
    {
      target: 'a[href="/documents"]',
      content: '📄 Review, upload, and e-sign deal documents in the Document Chamber.',
      placement: 'right',
    },
    {
      target: 'a[href="/payments"]',
      content: '💳 Fund deals, check your wallet balance, and view transaction history here.',
      placement: 'right',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        scrollToFirstStep
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#4F46E5',
            zIndex: 10000,
          },
        }}
      />

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-600">Find and connect with promising entrepreneurs</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setRunTour(true)}>
            🧭 Take a Tour
          </Button>
          <Link to="/entrepreneurs">
            <Button leftIcon={<PlusCircle size={18} />}>View All Startups</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} />}
          />
        </div>
        <div className="w-full md:w-1/3 flex items-center space-x-2">
          <Filter size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <div className="flex flex-wrap gap-2">
            {industries.map(industry => (
              <div
                key={industry}
                onClick={() => toggleIndustry(industry)}
                className="cursor-pointer"
              >
                <Badge
                  variant={selectedIndustries.includes(industry) ? 'primary' : 'gray'}
                >
                  {industry}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Users size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Total Startups</p>
                <h3 className="text-xl font-semibold text-primary-900">{entrepreneurs.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <PieChart size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Industries</p>
                <h3 className="text-xl font-semibold text-secondary-900">{industries.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Users size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Your Connections</p>
                <h3 className="text-xl font-semibold text-accent-900">
                  {sentRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Meeting Requests */}
      <Card className="meeting-requests-section">
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
                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(req.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                      >
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
      <Card className="calendar-section">
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
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Delete Meeting
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entrepreneurs Grid */}
      <Card className="entrepreneur-cards-section">
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Featured Startups</h2>
        </CardHeader>
        <CardBody>
          {filteredEntrepreneurs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntrepreneurs.map(entrepreneur => (
                <EntrepreneurCard key={entrepreneur.id} entrepreneur={entrepreneur} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No startups match your filters</p>
              <Button variant="outline" className="mt-2"
                onClick={() => { setSearchQuery(''); setSelectedIndustries([]); }}>
                Clear filters
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};