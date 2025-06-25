'use client'
import { useState } from 'react';

const jobsData = [
  {
    id: 1,
    name: 'John Doe',
    avatar: '/avatar1.png',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'New York',
    year: '2018',
    major: 'Computer Science',
    description: 'Senior Software Engineer at Google',
    isConnected: false,
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: '/avatar2.png',
    title: 'Product Manager',
    company: 'Amazon',
    location: 'Seattle',
    year: '2019',
    major: 'Business Administration',
    description: 'Product Manager at Amazon',
    isConnected: false,
  },
  {
    id: 3,
    name: 'David Lee',
    avatar: '/avatar3.png',
    title: 'Tech Lead',
    company: 'Microsoft',
    location: 'Redmond',
    year: '2017',
    major: 'Information Technology',
    description: 'Tech Lead at Microsoft',
    isConnected: true,
  },
  {
    id: 4,
    name: 'Emily Wilson',
    avatar: '/avatar4.png',
    title: 'Marketing Director',
    company: 'Facebook',
    location: 'Menlo Park',
    year: '2020',
    major: 'Digital Marketing',
    description: 'Marketing Director at Facebook',
    isConnected: false,
  },
  {
    id: 5,
    name: 'Michael Brown',
    avatar: '/avatar5.png',
    title: 'CTO',
    company: 'Startup',
    location: 'San Francisco',
    year: '2016',
    major: 'Software Engineering',
    description: 'CTO at Startup',
    isConnected: false,
  },
  {
    id: 6,
    name: 'Linda Davis',
    avatar: '/avatar6.png',
    title: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Angeles',
    year: '2021',
    major: 'Data Science',
    description: 'Data Scientist at Netflix',
    isConnected: false,
  },
];

const years = ['All Years', '2016', '2017', '2018', '2019', '2020', '2021'];
const majors = ['All Majors', 'Computer Science', 'Business Administration', 'Information Technology', 'Digital Marketing', 'Software Engineering', 'Data Science'];
const locations = ['All Locations', 'New York', 'Seattle', 'Redmond', 'Menlo Park', 'San Francisco', 'Los Angeles'];

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('All Years');
  const [major, setMajor] = useState('All Majors');
  const [location, setLocation] = useState('All Locations');
  const [data, setData] = useState(jobsData);

  const handleConnect = (id: number) => {
    setData(data.map(item => item.id === id ? { ...item, isConnected: !item.isConnected } : item));
  };

  const filtered = data.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchYear = year === 'All Years' || item.year === year;
    const matchMajor = major === 'All Majors' || item.major === major;
    const matchLocation = location === 'All Locations' || item.location === location;
    return matchSearch && matchYear && matchMajor && matchLocation;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Alumni Directory</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </span>
        </div>
        <select value={year} onChange={e => setYear(e.target.value)} className="w-full md:w-1/6 border rounded-lg px-3 py-2">
          {years.map(y => <option key={y}>{y}</option>)}
        </select>
        <select value={major} onChange={e => setMajor(e.target.value)} className="w-full md:w-1/4 border rounded-lg px-3 py-2">
          {majors.map(m => <option key={m}>{m}</option>)}
        </select>
        <select value={location} onChange={e => setLocation(e.target.value)} className="w-full md:w-1/4 border rounded-lg px-3 py-2">
          {locations.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[270px]">
            <div className="flex items-center gap-4 mb-4">
              <img src={item.avatar} alt={item.name} className="w-16 h-16 rounded-full object-cover border" />
              <div>
                <div className="font-bold text-lg">{item.name}</div>
                <div className="text-gray-500 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/></svg>
                  Class of {item.year}
                </div>
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-1 font-semibold">{item.major}</span>
              </div>
            </div>
            <div className="text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M7 11l5-5 5 5"/></svg>
              {item.description}
            </div>
            <div className="text-gray-500 flex items-center gap-2 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657A8 8 0 1 0 3.343 2.343a8 8 0 0 0 14.314 14.314z"/><path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>
              {item.location}
            </div>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleConnect(item.id)}
                className={`px-4 py-2 rounded font-semibold ${item.isConnected ? 'bg-white border border-black text-black' : 'bg-black text-white'} transition`}
              >
                {item.isConnected ? 'Message' : 'Connect'}
              </button>
              <button className="px-4 py-2 rounded border font-semibold border-black text-black bg-white">Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 