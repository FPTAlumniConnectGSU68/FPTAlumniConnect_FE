'use client'
import { useState } from 'react';

const eventsData = [
  {
    id: 1,
    name: 'Tech Talk',
    avatar: '/avatar1.png',
    date: '2024-07-01',
    location: 'Hà Nội',
    type: 'Seminar',
    description: 'Chia sẻ về công nghệ mới',
  },
  {
    id: 2,
    name: 'Career Fair',
    avatar: '/avatar2.png',
    date: '2024-07-10',
    location: 'Hồ Chí Minh',
    type: 'Job Fair',
    description: 'Ngày hội việc làm cho sinh viên',
  },
  {
    id: 3,
    name: 'Workshop',
    avatar: '/avatar3.png',
    date: '2024-07-15',
    location: 'Đà Nẵng',
    type: 'Workshop',
    description: 'Workshop UI/UX thực chiến',
  },
];

const types = ['All Types', 'Seminar', 'Job Fair', 'Workshop'];
const locations = ['All Locations', 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng'];

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All Types');
  const [location, setLocation] = useState('All Locations');

  const filtered = eventsData.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'All Types' || item.type === type;
    const matchLocation = location === 'All Locations' || item.location === location;
    return matchSearch && matchType && matchLocation;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Events Directory</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by event name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </span>
        </div>
        <select value={type} onChange={e => setType(e.target.value)} className="w-full md:w-1/4 border rounded-lg px-3 py-2">
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={location} onChange={e => setLocation(e.target.value)} className="w-full md:w-1/4 border rounded-lg px-3 py-2">
          {locations.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center gap-4 mb-4">
              <img src={item.avatar} alt={item.name} className="w-16 h-16 rounded-full object-cover border" />
              <div>
                <div className="font-bold text-lg">{item.name}</div>
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-1 font-semibold">{item.type}</span>
              </div>
            </div>
            <div className="text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/></svg>
              {item.date}
            </div>
            <div className="text-gray-500 flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657A8 8 0 1 0 3.343 2.343a8 8 0 0 0 14.314 14.314z"/><path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>
              {item.location}
            </div>
            <div className="text-gray-700 text-sm mb-2">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 