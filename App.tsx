
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ReceptionView from './components/ReceptionView';
import PoliceView from './components/PoliceView';
import SettingsView from './components/SettingsView';
import SetupView from './components/SetupView';
import { User, Guest, AppView, Language, WantedPerson, translations } from './types';
import { analyzeSecurityRisk } from './services/gemini';
import { Shield, ShieldCheck, Globe, AlertCircle } from 'lucide-react';

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
      { username: 'reception', password: '123', role: 'RECEPTION', hotelName: '' },
      { username: 'police', password: '123', role: 'POLICE' }
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
      setLoginError(lang === 'am' ? 'ስህተት፡ ተጠቃሚ ስም ወይም የይለፍ ቃል አልተገኘም!' : 'Invalid credentials!');
    }
  };

  const addGuest = async (newGuestData: Omit<Guest, 'id' | 'reportingTime' | 'status' | 'checkInDate'>) => {
    if (!user) return;
    const id = Math.random().toString(36).substr(2, 9);
    const now = new Date();
    
    // Automatic Wanted Matching Logic (Immediate & Invisible to Reception permission)
    const isWantedMatch = wantedList.some(w => 
      newGuestData.fullName.toLowerCase().trim() === w.name.toLowerCase().trim() ||
      newGuestData.idNumber.trim() === w.id.trim() // Assuming ID might match
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

    // Force Police Alert if Match
    if (isWantedMatch) {
       // In a real networked app, this would be a socket notification
       console.warn("WANTED PERSON AUTOMATICALLY FLAGGED IN SYSTEM");
    }

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
      postedBy: user?.username || 'POLICE_HQ'
    };
    setWantedList(prev => [newW, ...prev]);
  };

  const removeWanted = (id: string) => setWantedList(prev => prev.filter(w => w.id !== id));
  const flagGuest = (id: string) => setGuests(prev => prev.map(g => g.id === id ? { ...g, status: 'Flagged' } : g));

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-800/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[60%] h-[60%] bg-blue-800/10 rounded-full blur-[150px]"></div>

        <div className="w-full max-w-lg bg-white rounded-[5rem] shadow-[0_50px_150px_rgba(0,0,0,0.6)] p-16 space-y-12 relative overflow-hidden border-t-[12px] border-yellow-500 animate-in zoom-in duration-1000">
          <div className="text-center">
            <div className="w-36 h-36 bg-gradient-to-br from-blue-900 to-blue-950 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-3 border-4 border-yellow-500/40 relative group">
               <ShieldCheck className="w-20 h-20 text-white group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]"></div>
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic mb-3">{t.title}</h1>
            <p className="text-blue-900 font-black uppercase text-[11px] tracking-[0.5em] mb-6 drop-shadow-sm">{t.commission}</p>
            <div className="h-2 w-24 bg-yellow-500 mx-auto rounded-full shadow-lg"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">{t.username}</label>
               <input type="text" required className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2.5rem] px-10 py-6 font-bold outline-none focus:border-blue-900 transition-all text-xl shadow-inner placeholder:text-slate-300" placeholder="User ID" value={authForm.username} onChange={e => setAuthForm(p => ({...p, username: e.target.value}))} />
            </div>
            <div className="space-y-3">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">{t.password}</label>
               <input type="password" required className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2.5rem] px-10 py-6 font-bold outline-none focus:border-blue-900 transition-all text-xl shadow-inner placeholder:text-slate-300" placeholder="••••••••" value={authForm.password} onChange={e => setAuthForm(p => ({...p, password: e.target.value}))} />
            </div>
            {loginError && <div className="bg-red-50 text-red-600 p-6 rounded-3xl text-xs font-black text-center border-2 border-red-100 animate-shake flex items-center justify-center gap-2"><AlertCircle size={20}/> {loginError}</div>}
            <button type="submit" className="w-full bg-blue-950 text-white font-black py-7 rounded-[2.5rem] shadow-[0_25px_50px_rgba(0,0,0,0.3)] uppercase text-base tracking-[0.4em] hover:bg-slate-900 hover:scale-[1.02] active:scale-95 transition-all mt-6 border-b-8 border-yellow-600">
              {t.login}
            </button>
          </form>
          
          <div className="pt-10 border-t-2 border-slate-50 flex flex-col items-center gap-6">
             <button onClick={() => setLang(lang === 'am' ? 'en' : 'am')} className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-900 transition-colors flex items-center gap-2">
               <Globe size={18}/> {lang === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
             </button>
             <div className="text-center px-6">
                <p className="text-[11px] text-slate-300 font-black uppercase tracking-[0.3em] italic mb-1">"{t.motto}"</p>
                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">{lang === 'am' ? 'በሰብዓዊነት ማገልገል - በጀግንነት መጠበቅ' : 'Serve with Humanity - Protect with Bravery'}</p>
             </div>
          </div>
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
      {view === 'reception' && <ReceptionView onAddGuest={addGuest} hotelName={user?.hotelName || ''} allGuests={guests} wantedList={wantedList} lang={lang} />}
      {view === 'police' && <PoliceView guests={guests} wantedList={wantedList} onAddWanted={addWanted} onRemoveWanted={removeWanted} onFlagGuest={flagGuest} lang={lang} />}
      {view === 'settings' && <SettingsView currentUser={user} lang={lang} onUpdate={(d: any) => setUsers(prev => prev.map(u => u.username === user?.username ? {...u, ...d} : u))} setLang={setLang} onBack={() => setView(user?.role === 'POLICE' ? 'police' : 'reception')} />}
    </Layout>
  );
};

export default App;
