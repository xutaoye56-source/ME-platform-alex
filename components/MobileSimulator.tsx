
import React, { useState } from 'react';
import { Target, Activity, TargetStatus, ActivityStatus } from '../types';
import { 
  Wifi, Battery, Signal, Home, Calendar, User, Target as TargetIcon, Bell, Plus, BarChart3, X, QrCode, FileEdit, ChevronRight
} from 'lucide-react';
import ActivityForm from './ActivityForm';

interface Props {
  targets: Target[];
  activities: Activity[];
  onTargetResponse: (id: string, status: TargetStatus, reason?: string) => void;
  onCompleteActivity: (id: string, summary: string) => void;
  onUpdateStatus: (id: string, status: ActivityStatus) => void;
  onCreateActivity?: (a: Activity) => void;
}

const MobileSimulator: React.FC<Props> = ({ 
  targets, activities, onTargetResponse, onCompleteActivity, onUpdateStatus, onCreateActivity 
}) => {
  const [activeTab, setActiveTab] = useState('home');
  const [showForm, setShowForm] = useState<'MEETING' | 'INTERVIEW' | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [viewActivity, setViewActivity] = useState<Activity | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState<string | null>(null);
  const [summaryInput, setSummaryInput] = useState('');

  const currentMonth = '2026-01';
  const myTargets = targets.filter(t => t.month === currentMonth && t.meName === '张三');
  const myActivities = activities.filter(a => a.time.startsWith(currentMonth));

  return (
    <div className="relative w-[350px] aspect-[9/19] bg-black rounded-[50px] border-[10px] border-[#1a1a1a] shadow-2xl flex flex-col overflow-hidden ring-4 ring-gray-200">
      <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden m-0 rounded-[38px] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[28px] bg-black rounded-b-[20px] z-[110] flex items-center justify-center"><div className="w-12 h-1 bg-[#222] rounded-full mr-2" /><div className="w-2 h-2 bg-[#222] rounded-full" /></div>
        <div className="h-10 bg-white flex justify-between items-end px-6 pb-1 pt-4 relative z-[100]"><span className="text-[11px] font-black">9:41</span><div className="flex gap-1.5 items-center"><Signal size={10} /><Wifi size={10} /><Battery size={12} /></div></div>

        <div className="flex-1 overflow-y-auto pb-24 pt-2">
          <header className="px-5 py-4 bg-white border-b sticky top-0 z-10"><h1 className="text-xl font-black text-gray-900 tracking-tight">你好, 张三</h1></header>
          <main className="p-4 space-y-4">
            <section className="bg-me-primary p-5 rounded-[28px] text-white shadow-lg">
              <span className="text-[10px] font-black uppercase opacity-80 mb-4 block tracking-widest">1月经营度</span>
              {myTargets.filter(t => t.status === 'ACCEPTED').map(t => (
                <div key={t.id} className="mb-3">
                  <div className="flex justify-between text-[11px] mb-1 font-bold"><span>{t.type}</span><span>{t.actual}/{t.goal}</span></div>
                  <div className="h-1 bg-white/30 rounded-full overflow-hidden"><div className="h-full bg-white transition-all duration-1000" style={{ width: `${(t.actual/t.goal)*100}%` }} /></div>
                </div>
              ))}
            </section>

            <section className="space-y-2.5">
              <h3 className="font-black text-gray-900 text-sm">活动列表</h3>
              {myActivities.map(a => (
                <button key={a.id} onClick={() => setViewActivity(a)} className="w-full bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center text-left">
                  <div className="flex gap-3 items-center shrink-0 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.status === 'COMPLETED' ? 'bg-green-50 text-green-500' : 'bg-me-accent text-me-primary'}`}>
                      {a.type === 'MEETING' ? <Calendar size={20} /> : <User size={20} />}
                    </div>
                    <div className="min-w-0"><h4 className="text-[13px] font-bold text-gray-800 truncate">{a.title}</h4><p className="text-[9px] text-gray-400 font-bold uppercase">{a.subType}</p></div>
                  </div>
                  {/* Fixed: ChevronRight is now imported correctly */}
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              ))}
            </section>
          </main>
        </div>

        {/* FAB */}
        {!viewActivity && !showForm && (
          <div className="absolute right-6 bottom-24 z-[130]">
            <button onClick={() => setShowAddMenu(!showAddMenu)} className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${showAddMenu ? 'bg-gray-900 rotate-45 scale-90' : 'bg-me-primary'}`}>
              {showAddMenu ? <X className="text-white" /> : <Plus size={28} strokeWidth={3} className="text-white" />}
            </button>
            {showAddMenu && (
              <div className="absolute bottom-16 right-0 flex flex-col items-end gap-3 animate-in slide-in-from-bottom duration-200">
                <button onClick={() => { setShowForm('MEETING'); setShowAddMenu(false); }} className="bg-white text-gray-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-xs">会议培训</button>
                <button onClick={() => { setShowForm('INTERVIEW'); setShowAddMenu(false); }} className="bg-white text-gray-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-xs">1v1 面谈</button>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="absolute inset-0 z-[200] bg-white animate-in slide-in-from-bottom duration-300">
            <ActivityForm type={showForm} onClose={() => setShowForm(null)} onSubmit={(data) => { onCreateActivity?.(data); setShowForm(null); }} isMobile />
          </div>
        )}

        {/* Details */}
        {viewActivity && (
          <div className="absolute inset-0 z-[150] bg-white flex flex-col animate-in slide-in-from-right duration-300">
             <header className="pt-10 px-4 pb-4 border-b flex items-center gap-4 bg-gray-50"><button onClick={() => setViewActivity(null)}><X size={20}/></button><h3 className="font-black text-sm">活动详情</h3></header>
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-me-accent text-me-primary flex items-center justify-center shrink-0">{viewActivity.type === 'MEETING' ? <Calendar size={24}/> : <User size={24}/>}</div>
                  <div><h4 className="font-bold text-base">{viewActivity.title}</h4><p className="text-xs text-gray-400">{viewActivity.subType}</p></div>
                </div>
                <div className="text-xs space-y-2 bg-gray-50 p-4 rounded-xl">
                  <p><span className="text-gray-400">时间：</span>{viewActivity.time}</p>
                  <p><span className="text-gray-400">主题：</span>{viewActivity.themes.join(', ')}</p>
                </div>
                {viewActivity.status !== 'COMPLETED' && (
                  <div className="flex flex-col items-center p-6 bg-white border rounded-2xl space-y-4">
                    <QrCode size={120} className="text-gray-800" /><p className="text-[10px] text-gray-400">扫码核销活动</p>
                    <button onClick={() => { if(viewActivity.type === 'INTERVIEW'){ onUpdateStatus(viewActivity.id, 'PENDING_SUMMARY'); setShowSummaryModal(viewActivity.id); } else { onCompleteActivity(viewActivity.id, '移动端自动总结：会议圆满成功。'); setViewActivity(null); } }} className="w-full bg-me-primary text-white py-4 rounded-2xl font-black text-xs">模拟现场核销</button>
                  </div>
                )}
                {viewActivity.summary && <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700 italic">“{viewActivity.summary}”</div>}
             </div>
          </div>
        )}

        {showSummaryModal && (
          <div className="absolute inset-0 z-[210] bg-black/60 flex items-end">
            <div className="bg-white w-full rounded-t-[32px] p-6 pb-12 animate-in slide-in-from-bottom duration-300">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><FileEdit size={20} className="text-me-primary"/>面谈纪要</h3>
              <textarea className="w-full h-32 bg-gray-50 border rounded-2xl p-4 text-xs" placeholder="在此录入详情..." value={summaryInput} onChange={e => setSummaryInput(e.target.value)} />
              <button onClick={() => { if(!summaryInput) return; onCompleteActivity(showSummaryModal, summaryInput); setShowSummaryModal(null); setViewActivity(null); setSummaryInput(''); }} className="w-full bg-me-primary text-white py-4 rounded-2xl mt-4 font-black text-sm">提交确认</button>
            </div>
          </div>
        )}

        {/* TabBar */}
        <nav className="h-20 bg-white border-t flex justify-around items-center px-4 absolute bottom-0 left-0 w-full rounded-b-[38px] z-[110]">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-me-primary' : 'text-gray-300'}`}><Home size={22}/><span className="text-[9px] font-black uppercase">首页</span></button>
          <button onClick={() => setActiveTab('act')} className={`flex flex-col items-center gap-1 ${activeTab === 'act' ? 'text-me-primary' : 'text-gray-300'}`}><Calendar size={22}/><span className="text-[9px] font-black uppercase">活动</span></button>
          <button onClick={() => setActiveTab('me')} className={`flex flex-col items-center gap-1 ${activeTab === 'me' ? 'text-me-primary' : 'text-gray-300'}`}><User size={22}/><span className="text-[9px] font-black uppercase">我的</span></button>
        </nav>
      </div>
    </div>
  );
};

export default MobileSimulator;
