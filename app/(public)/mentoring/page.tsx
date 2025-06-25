'use client'
import { useState } from 'react';

const mentoringData = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: '/avatar1.png',
    topic: 'ReactJS',
    year: '2018',
    major: 'Computer Science',
    description: 'Mentor ReactJS, 5 năm kinh nghiệm',
    isConnected: false,
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: '/avatar2.png',
    topic: 'NodeJS',
    year: '2019',
    major: 'Software Engineering',
    description: 'Mentor NodeJS, 4 năm kinh nghiệm',
    isConnected: true,
  },
  {
    id: 3,
    name: 'Lê Văn C',
    avatar: '/avatar3.png',
    topic: 'UI/UX',
    year: '2020',
    major: 'Design',
    description: 'Mentor UI/UX, 3 năm kinh nghiệm',
    isConnected: false,
  },
];

const years = ['All Years', '2018', '2019', '2020'];
const majors = ['All Majors', 'Computer Science', 'Software Engineering', 'Design'];
const topics = ['All Topics', 'ReactJS', 'NodeJS', 'UI/UX'];

export default function MentoringPage() {
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('All Years');
  const [major, setMajor] = useState('All Majors');
  const [topic, setTopic] = useState('All Topics');
  const [data, setData] = useState(mentoringData);

  const handleConnect = (id: number) => {
    setData(data.map(item => item.id === id ? { ...item, isConnected: !item.isConnected } : item));
  };

  const filtered = data.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchYear = year === 'All Years' || item.year === year;
    const matchMajor = major === 'All Majors' || item.major === major;
    const matchTopic = topic === 'All Topics' || item.topic === topic;
    return matchSearch && matchYear && matchMajor && matchTopic;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mentoring Directory</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/4">
          <input
            type="text"
            placeholder="Search by mentor name..."
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
        <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full md:w-1/4 border rounded-lg px-3 py-2">
          {topics.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center gap-4 mb-4">
              <img src={item.avatar} alt={item.name} className="w-16 h-16 rounded-full object-cover border" />
              <div>
                <div className="font-bold text-lg">{item.name}</div>
                <div className="text-gray-500 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/></svg>
                  Class of {item.year}
                </div>
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-1 font-semibold">{item.major}</span>
                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mt-1 font-semibold ml-2">{item.topic}</span>
              </div>
            </div>
            <div className="text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M7 11l5-5 5 5"/></svg>
              {item.description}
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