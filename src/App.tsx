import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  Grid2X2,
  LayoutDashboard,
  List,
  MapPin,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Ticket,
  TrendingUp,
  Users,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';

type EventItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  seats: number;
  sold: number;
  image: string;
  accent: string;
  description: string;
  status: 'Live' | 'Draft' | 'Completed';
};

type Booking = {
  id: string;
  name: string;
  initials: string;
  event: string;
  seats: string;
  amount: number;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
};

type View = 'dashboard' | 'events' | 'bookings' | 'customers' | 'reports' | 'settings';

const imageUrls = {
  audience: 'https://images.pexels.com/photos/14373426/pexels-photo-14373426.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  stage: 'https://images.pexels.com/photos/8147310/pexels-photo-8147310.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  screen: 'https://images.pexels.com/photos/29708240/pexels-photo-29708240.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  music: 'https://images.pexels.com/photos/8041158/pexels-photo-8041158.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const initialEvents: EventItem[] = [
  { id: 1, title: 'Future of Design', category: 'Design', date: '24 Nov 2024', time: '09:00 AM', location: 'The Foundry, New York', price: 149, seats: 500, sold: 427, image: imageUrls.screen, accent: '#f07d55', status: 'Live', description: 'A day of bold ideas, hands-on workshops, and fresh perspectives from the people shaping tomorrow.' },
  { id: 2, title: 'Northstar Summit', category: 'Business', date: '02 Dec 2024', time: '10:30 AM', location: 'The Glasshouse, London', price: 220, seats: 800, sold: 654, image: imageUrls.audience, accent: '#347a80', status: 'Live', description: 'An intimate leadership summit for founders, operators, and the curious minds building what is next.' },
  { id: 3, title: 'Creator Camp', category: 'Creative', date: '18 Dec 2024', time: '01:00 PM', location: 'Pier 35, San Francisco', price: 85, seats: 350, sold: 192, image: imageUrls.stage, accent: '#9e7bce', status: 'Live', description: 'A high-energy gathering for independent creators, storytellers, and digital makers.' },
  { id: 4, title: 'Sound / Vision', category: 'Culture', date: '10 Jan 2025', time: '07:00 PM', location: 'The Roundhouse, Berlin', price: 65, seats: 420, sold: 420, image: imageUrls.music, accent: '#db6f87', status: 'Completed', description: 'A night where live sound, visual art, and unexpected collaboration take over the room.' },
  { id: 5, title: 'Product Assembly', category: 'Technology', date: '23 Jan 2025', time: '09:30 AM', location: 'Factory Hall, Austin', price: 185, seats: 600, sold: 318, image: imageUrls.screen, accent: '#557eb4', status: 'Live', description: 'The practical conference for teams who care about craft, momentum, and making useful things.' },
  { id: 6, title: 'Signal Sessions', category: 'Music', date: '08 Feb 2025', time: '08:00 PM', location: 'The Echo Room, Chicago', price: 42, seats: 250, sold: 78, image: imageUrls.music, accent: '#dd9f4e', status: 'Draft', description: 'A beautifully curated evening of emerging artists and new sounds.' },
];

const initialBookings: Booking[] = [
  { id: 'BK-1048', name: 'Maya Patel', initials: 'MP', event: 'Future of Design', seats: 'A-12, A-13', amount: 298, date: 'Today, 10:42 AM', status: 'Confirmed' },
  { id: 'BK-1047', name: 'Jon Bell', initials: 'JB', event: 'Northstar Summit', seats: 'C-08', amount: 220, date: 'Today, 09:18 AM', status: 'Pending' },
  { id: 'BK-1046', name: 'Nora Kim', initials: 'NK', event: 'Creator Camp', seats: 'B-21, B-22, B-23', amount: 255, date: 'Yesterday', status: 'Confirmed' },
  { id: 'BK-1045', name: 'Evan Brooks', initials: 'EB', event: 'Sound / Vision', seats: 'D-04', amount: 65, date: 'Yesterday', status: 'Cancelled' },
  { id: 'BK-1044', name: 'Sam Rivera', initials: 'SR', event: 'Product Assembly', seats: 'A-03', amount: 185, date: '18 Nov 2024', status: 'Confirmed' },
];

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'bookings', label: 'Bookings', icon: Ticket },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

const formatMoney = (value: number) => `$${value.toLocaleString('en-US')}`;

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('orbit-events');
    return saved ? JSON.parse(saved) as EventItem[] : initialEvents;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('orbit-bookings');
    return saved ? JSON.parse(saved) as Booking[] : initialBookings;
  });
  const [dark, setDark] = useState(() => localStorage.getItem('orbit-theme') === 'dark');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => { localStorage.setItem('orbit-events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('orbit-bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('orbit-theme', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.getElementById('global-search')?.focus(); }
      if (event.key === 'Escape') { setShowCreate(false); setSelectedEvent(null); setSearch(''); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'd') { event.preventDefault(); setDark((current) => !current); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  useEffect(() => { if (toast) { const timeout = window.setTimeout(() => setToast(''), 3000); return () => window.clearTimeout(timeout); } }, [toast]);

  const filteredEvents = useMemo(() => events.filter((event) => `${event.title} ${event.category} ${event.location}`.toLowerCase().includes(query.toLowerCase())), [events, query]);
  const stats = useMemo(() => ({
    events: events.length,
    bookings: bookings.length + 1240,
    customers: new Set(bookings.map((booking) => booking.name)).size + 418,
    revenue: bookings.reduce((total, booking) => total + booking.amount, 0) + 218460,
    tickets: events.reduce((total, event) => total + event.sold, 0) + 3210,
  }), [events, bookings]);

  function createEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get('title')).trim();
    const category = String(data.get('category'));
    const date = String(data.get('date'));
    if (!title || !date) return;
    const newEvent: EventItem = { id: Date.now(), title, category, date, time: '10:00 AM', location: String(data.get('location') || 'TBA'), price: Number(data.get('price')) || 0, seats: Number(data.get('seats')) || 100, sold: 0, image: imageUrls.audience, accent: '#347a80', status: 'Draft', description: 'A new experience is taking shape. Add the details your audience needs and publish when ready.' };
    setEvents((current) => [newEvent, ...current]);
    setShowCreate(false);
    setToast('Event created and saved to your workspace');
  }

  function changeBookingStatus(id: string, status: Booking['status']) {
    setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status } : booking));
    setToast(`Booking marked ${status.toLowerCase()}`);
  }

  function renderContent() {
    if (view === 'dashboard') return <Dashboard stats={stats} events={events} bookings={bookings} onView={setView} onSelect={setSelectedEvent} onCreate={() => setShowCreate(true)} />;
    if (view === 'events') return <EventsPage events={filteredEvents} query={query} setQuery={setQuery} onCreate={() => setShowCreate(true)} onSelect={setSelectedEvent} onDelete={(id) => { setEvents((current) => current.filter((event) => event.id !== id)); setToast('Event removed from your workspace'); }} />;
    if (view === 'bookings') return <BookingsPage bookings={bookings} sortDirection={sortDirection} setSortDirection={setSortDirection} onChangeStatus={changeBookingStatus} />;
    if (view === 'customers') return <CustomersPage bookings={bookings} />;
    if (view === 'reports') return <ReportsPage stats={stats} events={events} bookings={bookings} />;
    return <SettingsPage dark={dark} setDark={setDark} setToast={setToast} />;
  }

  return (
    <div className={`app-shell ${dark ? 'dark' : ''}`}>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Zap size={16} fill="currentColor" /></div><span>orbit<span className="brand-dot">.</span></span></div>
        <div className="workspace-switcher"><div className="workspace-avatar">A</div><div><strong>Acme Events</strong><span>Workspace</span></div><ChevronDown size={15} /></div>
        <div className="side-label">Workspace</div>
        <nav>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => { setView(id); setSidebarOpen(false); }}><Icon size={18} /><span>{label}</span>{id === 'bookings' && <em>12</em>}</button>)}</nav>
        <div className="side-label manage-label">Manage</div>
        <nav><button className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}><Settings size={18} /><span>Settings</span></button><button onClick={() => setToast('Help center is opening soon')}><CircleHelp size={18} /><span>Help center</span></button></nav>
        <div className="sidebar-bottom"><div className="storage"><div className="storage-row"><span>Storage</span><span>68%</span></div><div className="storage-bar"><i /></div><small>6.8 GB of 10 GB used</small></div><div className="profile"><div className="profile-avatar">SD</div><div><strong>Sara Davies</strong><span>Administrator</span></div><MoreHorizontal size={17} /></div></div>
      </aside>
      {sidebarOpen && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{navItems.find((item) => item.id === view)?.label || 'Settings'}</strong></div><div className="topbar-actions"><button className="search-trigger" onClick={() => document.getElementById('global-search')?.focus()}><Search size={17} /><span>Search anything</span><kbd>⌘ K</kbd></button><button className="icon-button" onClick={() => setToast('You are all caught up')}><Bell size={18} /><i className="notification-dot" /></button><button className="icon-button" onClick={() => setDark((current) => !current)} aria-label="Toggle theme"><div className={`theme-toggle ${dark ? 'on' : ''}`}><span /></div></button><div className="top-avatar">SD</div></div></header>
        <div className="content-wrap">
          <div className="page-intro"><div><p className="eyebrow">MONDAY, NOVEMBER 18, 2024</p><h1>{view === 'dashboard' ? 'Good morning, Sara.' : navItems.find((item) => item.id === view)?.label || 'Settings'}</h1><p className="intro-sub">{view === 'dashboard' ? 'Here’s what’s happening across your events today.' : view === 'events' ? 'Create, curate, and keep your experiences moving.' : view === 'bookings' ? 'Stay close to every guest and every seat.' : view === 'customers' ? 'The people who make your events matter.' : view === 'reports' ? 'A clear view of your workspace performance.' : 'Make Orbit feel exactly like your workspace.'}</p></div>{(view === 'dashboard' || view === 'events') && <button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={17} /> Create event</button>}</div>
          <div className="global-search-wrap"><Search size={17} /><input id="global-search" placeholder="Search events, customers, bookings..." value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { setQuery(search); setView('events'); } }} /><span>Press enter to search</span></div>
          {renderContent()}
        </div>
      </main>
      {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} onSubmit={createEvent} />}
      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onBook={(event) => { setSelectedEvent(null); setView('bookings'); setToast(`Booking flow started for ${event.title}`); }} />}
      {toast && <div className="toast"><div className="toast-check"><Check size={15} /></div>{toast}<button onClick={() => setToast('')}><X size={15} /></button></div>}
    </div>
  );
}

function Dashboard({ stats, events, bookings, onView, onSelect, onCreate }: { stats: { events: number; bookings: number; customers: number; revenue: number; tickets: number }; events: EventItem[]; bookings: Booking[]; onView: (view: View) => void; onSelect: (event: EventItem) => void; onCreate: () => void }) {
  return <>
    <div className="stats-grid"><StatCard icon={<CalendarDays size={18} />} label="Total events" value={String(stats.events)} change="12.5%" tone="coral" /><StatCard icon={<Ticket size={18} />} label="Total bookings" value={stats.bookings.toLocaleString()} change="8.2%" tone="teal" /><StatCard icon={<Users size={18} />} label="Customers" value={stats.customers.toLocaleString()} change="5.7%" tone="lavender" /><StatCard icon={<WalletCards size={18} />} label="Total revenue" value={formatMoney(stats.revenue)} change="14.8%" tone="gold" /></div>
    <div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-heading"><div><h2>Revenue overview</h2><p>Track your revenue performance over time.</p></div><button className="select-button">Last 30 days <ChevronDown size={14} /></button></div><div className="chart-legend"><span><i className="legend-revenue" /> Revenue</span><span><i className="legend-tickets" /> Tickets sold</span></div><RevenueChart /></section><section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Keep up with what’s happening.</p></div><button className="plain-link" onClick={() => onView('bookings')}>View all <ArrowRight size={14} /></button></div><div className="activity-list">{bookings.slice(0, 4).map((booking, index) => <div className="activity-item" key={booking.id}><div className={`activity-icon activity-${index}`}><Ticket size={16} /></div><div><strong>{booking.name} booked tickets</strong><span>{booking.event} · {booking.date}</span></div><b>{formatMoney(booking.amount)}</b></div>)}</div></section></div>
    <section className="panel upcoming-panel"><div className="panel-heading"><div><h2>Upcoming events</h2><p>Your next moments worth showing up for.</p></div><button className="plain-link" onClick={() => onView('events')}>View all events <ArrowRight size={14} /></button></div><div className="event-grid">{events.filter((event) => event.status !== 'Completed').slice(0, 3).map((event) => <EventCard key={event.id} event={event} onSelect={onSelect} />)}<button className="create-card" onClick={onCreate}><span><Plus size={20} /></span><strong>Create a new event</strong><small>Bring your next idea to life</small></button></div></section>
  </>;
}

function StatCard({ icon, label, value, change, tone }: { icon: React.ReactNode; label: string; value: string; change: string; tone: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><strong className="stat-value">{value}</strong><div className="stat-change"><TrendingUp size={13} /> {change} <span>vs last month</span></div></div>; }

function RevenueChart() { const points = '0,122 24,105 48,111 72,84 96,91 120,70 144,78 168,58 192,61 216,37 240,45 264,30 288,41 312,18 336,31 360,10'; return <div className="chart-wrap"><svg viewBox="0 0 360 150" preserveAspectRatio="none" role="img" aria-label="Revenue trend"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ea7455" stopOpacity=".18" /><stop offset="1" stopColor="#ea7455" stopOpacity="0" /></linearGradient></defs><path d={`M ${points} L 360 150 L 0 150 Z`} fill="url(#chart-fill)" /><polyline points={points} fill="none" stroke="#e67857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><div className="chart-y"><span>$30k</span><span>$20k</span><span>$10k</span><span>$0</span></div><div className="chart-x"><span>Oct 20</span><span>Oct 27</span><span>Nov 03</span><span>Nov 10</span><span>Nov 17</span></div></div>; }

function EventCard({ event, onSelect }: { event: EventItem; onSelect: (event: EventItem) => void }) { const percent = Math.round((event.sold / event.seats) * 100); return <button className="event-card" onClick={() => onSelect(event)}><div className="event-image"><img src={event.image} alt={event.title} /><span className="event-tag" style={{ background: event.accent }}>{event.category}</span><span className={`status-pill ${event.status.toLowerCase()}`}>{event.status}</span></div><div className="event-card-body"><h3>{event.title}</h3><p><CalendarDays size={14} /> {event.date} <span>·</span> <Clock3 size={14} /> {event.time}</p><p><MapPin size={14} /> {event.location}</p><div className="event-card-foot"><strong>{formatMoney(event.price)} <small>/ ticket</small></strong><span>{event.seats - event.sold} seats left</span></div><div className="mini-progress"><i style={{ width: `${percent}%` }} /></div></div></button>; }

function EventsPage({ events, query, setQuery, onCreate, onSelect, onDelete }: { events: EventItem[]; query: string; setQuery: (value: string) => void; onCreate: () => void; onSelect: (event: EventItem) => void; onDelete: (id: number) => void }) { return <section className="page-section"><div className="toolbar"><div className="local-search"><Search size={16} /><input placeholder="Search events" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="toolbar-right"><button className="filter-button">All categories <ChevronDown size={14} /></button><button className="view-button active"><Grid2X2 size={16} /></button><button className="view-button"><List size={16} /></button></div></div>{events.length === 0 ? <EmptyState title="No events found" text="Try a different search or create your first event." onAction={onCreate} /> : <div className="events-page-grid">{events.map((event) => <div className="event-admin-card" key={event.id}><EventCard event={event} onSelect={onSelect} /><button className="event-delete" aria-label={`Remove ${event.title}`} onClick={(click) => { click.stopPropagation(); onDelete(event.id); }}><MoreHorizontal size={17} /></button></div>)}</div>}</section>; }

function BookingsPage({ bookings, sortDirection, setSortDirection, onChangeStatus }: { bookings: Booking[]; sortDirection: 'asc' | 'desc'; setSortDirection: (direction: 'asc' | 'desc') => void; onChangeStatus: (id: string, status: Booking['status']) => void }) { const sorted = [...bookings].sort((a, b) => sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount); return <section className="page-section"><div className="table-toolbar"><div><strong>{bookings.length + 1240} total bookings</strong><span>Updated a few seconds ago</span></div><button className="secondary-button"><Download size={15} /> Export CSV</button></div><div className="table-wrap"><table><thead><tr><th>Booking ID</th><th>Customer</th><th>Event</th><th>Seats</th><th><button className="sort-button" onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>Amount <ChevronDown size={13} /></button></th><th>Booking date</th><th>Status</th><th /></tr></thead><tbody>{sorted.map((booking) => <tr key={booking.id}><td><strong>{booking.id}</strong></td><td><div className="customer-cell"><span className="table-avatar">{booking.initials}</span>{booking.name}</div></td><td>{booking.event}</td><td>{booking.seats}</td><td><strong>{formatMoney(booking.amount)}</strong></td><td>{booking.date}</td><td><select className={`status-select ${booking.status.toLowerCase()}`} value={booking.status} onChange={(event) => onChangeStatus(booking.id, event.target.value as Booking['status'])}><option>Confirmed</option><option>Pending</option><option>Cancelled</option></select></td><td><button className="dots-button"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div><Pagination page={1} setPage={() => undefined} total={3} /></section>; }

function CustomersPage({ bookings }: { bookings: Booking[] }) { const customers = [...bookings, { id: 'x', name: 'Ava Morgan', initials: 'AM', event: 'Northstar Summit', seats: 'E-12', amount: 220, date: '12 Nov 2024', status: 'Confirmed' as const }]; return <section className="page-section"><div className="customer-summary"><div className="summary-blurb"><div className="summary-icon"><Users size={20} /></div><div><strong>418 active customers</strong><span>People with at least one booking</span></div></div><div className="customer-metric"><span>Average spend</span><strong>$184.20</strong></div><div className="customer-metric"><span>Repeat customers</span><strong>68%</strong></div></div><div className="table-wrap"><table><thead><tr><th>Customer</th><th>Latest event</th><th>Total bookings</th><th>Total spending</th><th>Last booking</th><th /></tr></thead><tbody>{customers.map((customer, index) => <tr key={`${customer.name}-${index}`}><td><div className="customer-cell"><span className="table-avatar">{customer.initials}</span><strong>{customer.name}</strong></div></td><td>{customer.event}</td><td>{index + 1}</td><td><strong>{formatMoney(customer.amount * (index + 1))}</strong></td><td>{customer.date}</td><td><button className="dots-button"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div></section>; }

function ReportsPage({ stats, events, bookings }: { stats: { revenue: number; tickets: number }; events: EventItem[]; bookings: Booking[] }) { const max = Math.max(...events.map((event) => event.sold), 1); return <section className="page-section"><div className="report-actions"><p>Reporting period: <strong>Oct 20 – Nov 18, 2024</strong></p><button className="secondary-button" onClick={() => window.print()}><ArrowDownToLine size={15} /> Print report</button></div><div className="report-grid"><div className="report-highlight coral"><span>Total revenue</span><strong>{formatMoney(stats.revenue)}</strong><small>+14.8% from last period</small></div><div className="report-highlight teal"><span>Tickets sold</span><strong>{stats.tickets.toLocaleString()}</strong><small>+8.2% from last period</small></div><div className="panel report-bars"><div className="panel-heading"><div><h2>Event performance</h2><p>Tickets sold by event</p></div></div><div className="bars">{events.slice(0, 6).map((event) => <div className="bar-row" key={event.id}><span>{event.title}</span><div><i style={{ width: `${(event.sold / max) * 100}%`, background: event.accent }} /></div><strong>{event.sold}</strong></div>)}</div></div><div className="panel report-breakdown"><div className="panel-heading"><div><h2>Booking health</h2><p>Current status breakdown</p></div></div><div className="donut"><div><strong>{bookings.length + 1240}</strong><span>bookings</span></div></div><div className="breakdown-legend"><span><i className="confirmed" /> Confirmed <b>78%</b></span><span><i className="pending" /> Pending <b>14%</b></span><span><i className="cancelled" /> Cancelled <b>8%</b></span></div></div></div></section>; }

function SettingsPage({ dark, setDark, setToast }: { dark: boolean; setDark: (value: boolean) => void; setToast: (value: string) => void }) { return <section className="page-section settings-page"><div className="settings-card"><div className="settings-icon"><Zap size={18} /></div><div><h2>Workspace appearance</h2><p>Choose how Orbit looks for you. Your preference stays with this browser.</p></div><label className="switch"><input type="checkbox" checked={dark} onChange={(event) => setDark(event.target.checked)} /><span /></label></div><div className="settings-card"><div className="settings-icon neutral"><Bell size={18} /></div><div><h2>Notifications</h2><p>Booking alerts and daily summaries are enabled.</p></div><button className="secondary-button" onClick={() => setToast('Notification preferences saved')}>Manage</button></div><div className="settings-card"><div className="settings-icon blue"><Users size={18} /></div><div><h2>Workspace members</h2><p>3 administrators and 8 event managers have access.</p></div><button className="secondary-button" onClick={() => setToast('Invite link copied')}>Invite member</button></div></section>; }

function Pagination({ page, setPage, total }: { page: number; setPage: (page: number) => void; total: number }) { return <div className="pagination"><span>Showing 1–5 of 1,245</span><div><button disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={15} /></button>{Array.from({ length: total }, (_, index) => <button key={index} className={page === index + 1 ? 'current' : ''} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button disabled={page === total} onClick={() => setPage(page + 1)}><ChevronRight size={15} /></button></div></div>; }

function EmptyState({ title, text, onAction }: { title: string; text: string; onAction: () => void }) { return <div className="empty-state"><div><CalendarDays size={24} /></div><h2>{title}</h2><p>{text}</p><button className="primary-button" onClick={onAction}><Plus size={16} /> Create event</button></div>; }

function CreateEventModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) { return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form className="modal-card" onSubmit={onSubmit}><div className="modal-heading"><div><p className="eyebrow">NEW EXPERIENCE</p><h2>Create an event</h2><p>Start with the essentials. You can add more detail later.</p></div><button type="button" className="close-button" onClick={onClose}><X size={18} /></button></div><div className="form-grid"><label>Event name<input name="title" required placeholder="e.g. Future of Design" /></label><label>Category<select name="category"><option>Design</option><option>Business</option><option>Creative</option><option>Technology</option><option>Culture</option></select></label><label>Date<input name="date" required type="date" /></label><label>Location<input name="location" placeholder="Venue or city" /></label><label>Ticket price<input name="price" type="number" min="0" placeholder="149" /></label><label>Capacity<input name="seats" type="number" min="1" placeholder="500" /></label></div><div className="modal-footer"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Plus size={16} /> Create event</button></div></form></div>; }

function EventModal({ event, onClose, onBook }: { event: EventItem; onClose: () => void; onBook: (event: EventItem) => void }) { return <div className="modal-backdrop" onMouseDown={(click) => { if (click.target === click.currentTarget) onClose(); }}><div className="detail-modal"><button className="close-button floating" onClick={onClose}><X size={18} /></button><div className="detail-image"><img src={event.image} alt="" /><span className="event-tag" style={{ background: event.accent }}>{event.category}</span></div><div className="detail-body"><div className="detail-title"><div><p className="eyebrow">EVENT DETAILS</p><h2>{event.title}</h2></div><span className={`status-pill ${event.status.toLowerCase()}`}>{event.status}</span></div><p className="detail-description">{event.description}</p><div className="detail-facts"><span><CalendarDays size={16} /> {event.date}</span><span><Clock3 size={16} /> {event.time}</span><span><MapPin size={16} /> {event.location}</span></div><div className="detail-bottom"><div><strong>{formatMoney(event.price)}</strong><span>per ticket · {event.seats - event.sold} seats left</span></div><button className="primary-button" onClick={() => onBook(event)} disabled={event.status === 'Completed'}>{event.status === 'Completed' ? 'Event completed' : 'Book tickets'} <ArrowRight size={16} /></button></div></div></div></div>; }

export default App;
