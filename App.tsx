
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import ReceptionView from './components/ReceptionView.tsx';
import PoliceView from './components/PoliceView.tsx';
import SettingsView from './components/SettingsView.tsx';
import SetupView from './components/SetupView.tsx';
import { User, Guest, AppView, Language, WantedPerson, translations } from './types.ts';
import { analyzeSecurityRisk } from './services/gemini.ts';
import { Shield, ShieldCheck, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('begu_lang') as Language) || 'am');
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('login');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [wantedList, setWantedList] = useState<WantedPerson[]>(() => {
    const saved = localStorage.getItem('begu_wanted');
    return saved ? JSON.parse(saved) : [];
  });
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('begu_users');
    return saved ? JSON.parse(saved) : [
      { username: 'reception', password: '1234', role: 'RECEPTION', hotelName: '' },
      { username: 'police', password: 'police@1234', role: 'POLICE' }
    ];
  });

  const t = translations[lang];

  useEffect(() => {
    document.body.classList.add('loaded');
    const savedGuests = localStorage.getItem('begu_guests');
    if (savedGuests) setGuests(JSON.parse(savedGuests));
  }, []);

  useEffect(() => {
    localStorage.setItem('begu_lang', lang);
    localStorage.setItem('begu_users', JSON.stringify(users));
    localStorage.setItem('begu_guests', JSON.stringify(guests));
    localStorage.setItem('begu_wanted', JSON.stringify(wantedList));
  }, [lang, users, guests, wantedList]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === authForm.username && u.password === authForm.password);
    if (foundUser) {
      setUser(foundUser);
      if (foundUser.role === 'RECEPTION' && !foundUser.hotelName) {
        setView('setup');
      } else {
        setView(foundUser.role === 'POLICE' ? 'police' : 'reception');
      }
      setLoginError('');
    } else {
      setLoginError(lang === 'am' ? 'ስህተት ተፈጥሯል!' : 'Invalid credentials!');
    }
  };

  const addGuest = async (newGuestData: Omit<Guest, 'id' | 'reportingTime' | 'status' | 'checkInDate'>) => {
    if (!user) return;
    const id = Math.random().toString(36).substr(2, 9);
    const now = new Date();
    
    // Automatic matching logic
    const isWantedMatch = wantedList.some(w => 
      newGuestData.fullName.toLowerCase().includes(w.name.toLowerCase()) || 
      w.name.toLowerCase().includes(newGuestData.fullName.toLowerCase())
    );

    const newGuest: Guest = {
      ...newGuestData,
      id,
      reportingTime: now.toLocaleTimeString(),
      checkInDate: now.toLocaleDateString(),
      status: isWantedMatch ? 'WANTED_MATCH' : 'Clear',
      hotelName: user.hotelName || 'Begu Hotel'
    };

    setGuests(prev => [newGuest, ...prev]);

    // AI Analysis
    try {
      const analysis = await analyzeSecurityRisk(newGuest);
      setGuests(prev => prev.map(g => g.id === id ? { ...g, aiAnalysis: analysis } : g));
    } catch (e) { console.error(e); }
  };

  const addWanted = (person: Omit<WantedPerson, 'id' | 'postedDate' | 'postedBy'>) => {
    const newW: WantedPerson = {
      ...person,
      id: Math.random().toString(36).substr(2, 9),
      postedDate: new Date().toLocaleDateString(),
      postedBy: user?.username || 'POLICE'
    };
    setWantedList(prev => [newW, ...prev]);
  };

  const removeWanted = (id: string) => setWantedList(prev => prev.filter(w => w.id !== id));
  const flagGuest = (id: string) => setGuests(prev => prev.map(g => g.id === id ? { ...g, status: 'Flagged' } : g));

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[4rem] shadow-2xl p-12 space-y-8 relative overflow-hidden border-t-8 border-yellow-500">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
               <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">{t.title}</h1>
            <p className="text-blue-900 font-black uppercase text-[10px] tracking-[0.3em] mt-2">B.G. Police Commission</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input type="text" required placeholder={t.username} className="w-full bg-slate-50 border-2 rounded-3xl px-6 py-5 font-bold outline-none focus:border-blue-900" value={authForm.username} onChange={e => setAuthForm(p => ({...p, username: e.target.value}))} />
            <input type="password" required placeholder={t.password} className="w-full bg-slate-50 border-2 rounded-3xl px-6 py-5 font-bold outline-none focus:border-blue-900" value={authForm.password} onChange={e => setAuthForm(p => ({...p, password: e.target.value}))} />
            {loginError && <p className="text-red-600 text-xs font-black text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-blue-900 text-white font-black py-5 rounded-3xl shadow-xl uppercase text-sm tracking-widest hover:bg-slate-900 transition-all">{t.login}</button>
          </form>
          <button onClick={() => setLang(lang === 'am' ? 'en' : 'am')} className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Change Language: {lang === 'am' ? 'English' : 'አማርኛ'}</button>
        </div>
      </div>
    );
  }

  if (view === 'setup') {
    return <SetupView currentUser={user} lang={lang} setLang={setLang} onComplete={(data) => {
      const updatedUsers = users.map(u => u.username === user?.username ? { ...u, ...data } : u);
      setUsers(updatedUsers);
      setUser({ ...user!, ...data });
      setView('reception');
    }} />;
  }

  return (
    <Layout user={user} lang={lang} onLogout={() => setView('login')} onSettings={() => setView('settings')}>
      {view === 'reception' && <ReceptionView onAddGuest={addGuest} hotelName={user?.hotelName || ''} allGuests={guests} lang={lang} />}
      {view === 'police' && <PoliceView guests={guests} wantedList={wantedList} onAddWanted={addWanted} onRemoveWanted={removeWanted} onFlagGuest={flagGuest} lang={lang} />}
      {view === 'settings' && <SettingsView currentUser={user} lang={lang} onUpdate={(d: any) => setUsers(prev => prev.map(u => u.username === user?.username ? {...u, ...d} : u))} setLang={setLang} onBack={() => setView(user?.role === 'POLICE' ? 'police' : 'reception')} />}
    </Layout>
  );
};

export default App;
