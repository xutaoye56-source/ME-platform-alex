
import React, { useState } from 'react';
import { Target, Activity, ActivityStatus, TargetStatus } from '../types';
import { MONTH_OPTIONS } from '../constants';
import { 
  BarChart3, Plus, Calendar, MapPin, User, Tag, LayoutDashboard, 
  CheckCircle2, Clock, FileEdit, Bell, Target as TargetIcon, X, QrCode, AlertCircle
} from 'lucide-react';
import ActivityForm from './ActivityForm';

interface Props {
  targets: Target[];
  activities: Activity[];
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
  onTargetResponse: (id: string, status: TargetStatus, reason?: string) => void;
  onCreateActivity: (a: Activity) => void;
  onCompleteActivity: (id: string, summary: string) => void;
  onUpdateStatus: (id: string, status: ActivityStatus) => void;
}

const MainView: React.FC<Props> = ({ 
  targets, activities, selectedMonth, setSelectedMonth, 
  onTargetResponse, onCreateActivity, onCompleteActivity, onUpdateStatus
}) => {
  const [showForm, setShowForm] = useState<'MEETING' | 'INTERVIEW' | null>(null);
  const [viewActivity, setViewActivity] = useState<Activity | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState<string | null>(null);
  const [summaryText, setSummaryText] = useState('');
  const [rejectionModal, setRejectionModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const currentTargets = targets.filter(t => t.month === selectedMonth && t.meName === '张三');
  const pendingTargets = targets.filter(t => t.status === 'PENDING' && t.meName === '张三');
  const filteredActivities = activities.filter(a => a.time.startsWith(selectedMonth));

  return (
    <div className="flex w-full h-full relative overflow-hidden">
      <nav className="w-[100px] h-full bg-[#1e293b] text-white flex flex-col pt-6 shrink-0 items-center">
        <div className="mb-10 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-me-primary flex items-center justify-center font-bold shadow-lg text-lg">ME</div>
        </div>
        <div className="w-full px-2 space-y-4">
          <button className="w-full flex flex-col items-center gap-1.5 py-3 rounded-xl bg-me-primary text-white shadow-lg transition-all">
            <LayoutDashboard size={22} />
            <span className="text-[10px] font-bold">活动量</span>
          </button>
          <button className="w-full flex flex-col items-center gap-1.5 py-3 rounded-xl text-gray-400 hover:bg-gray-800 transition-all cursor-not-allowed opacity-50"><Calendar size={22} /><span className="text-[10px]">计划</span></button>
          <button className="w-full flex flex-col items-center gap-1.5 py-3 rounded-xl text-gray-400 hover:bg-gray-800 transition-all cursor-not-allowed opacity-50"><TargetIcon size={22} /><span className="text-[10px]">业绩</span></button>
        </div>
      </nav>

      <main className="flex-1 h-full overflow-y-auto bg-gray-50 flex flex-col relative">
        {/* CRITICAL: STICKY TOP PENDING TARGETS BAR */}
        {pendingTargets.length > 0 && (
          <div className="sticky top-0 z-[100] w-full bg-me-primary/95 backdrop-blur-md p-4 shadow-xl border-b border-white/20 animate-in slide-in-from-top duration-500">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Bell size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-black text-sm">收到新目标指令 ({pendingTargets.length})</h4>
                  <p className="text-[10px] opacity-80">请及时确认您的本月经营目标，以开启活动核销权限。</p>
                </div>
              </div>
              <div className="flex gap-2">
                {pendingTargets.slice(0, 1).map(t => (
                  <div key={t.id} className="flex gap-2 bg-white/10 p-1.5 rounded-xl border border-white/20">
                    <div className="px-3 py-1 bg-white rounded-lg text-me-primary text-xs font-black">
                      {t.type}: {t.goal}场
                    </div>
                    <button 
                      onClick={() => onTargetResponse(t.id, 'ACCEPTED')}
                      className="px-4 py-1 bg-green-500 hover:bg-green-400 text-white rounded-lg text-xs font-black transition-all shadow-lg active:scale-95"
                    >
                      立即接受
                    </button>
                    <button 
                      onClick={() => setRejectionModal(t.id)}
                      className="px-4 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-black transition-all active:scale-95"
                    >
                      退回
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-6 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">活动量管理</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-400">月份:</span>
                <select className="text-xs font-bold bg-transparent border-none outline-none text-me-primary cursor-pointer" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                  {MONTH_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="relative group">
                <button className="bg-me-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all font-bold text-sm"><Plus size={18} />发起活动</button>
                <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 overflow-hidden">
                  <button onClick={() => setShowForm('MEETING')} className="w-full px-4 py-3 text-left hover:bg-me-accent text-xs text-gray-700 flex items-center gap-2 transition-colors"><BarChart3 size={14} className="text-me-primary" />会议培训类活动</button>
                  <button onClick={() => setShowForm('INTERVIEW')} className="w-full px-4 py-3 text-left hover:bg-me-accent text-xs text-gray-700 border-t flex items-center gap-2 transition-colors"><User size={14} className="text-me-primary" />1v1面谈类活动</button>
                </div>
              </div>
            </div>
          </div>

          {/* Target Progress */}
          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">目标完成进度</h3>
            <div className="grid grid-cols-2 gap-4">
              {currentTargets.filter(t => t.status === 'ACCEPTED').map(t => (
                <div key={t.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:border-me-primary/30 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 text-me-primary font-bold"><TargetIcon size={18} /><span className="text-sm">{t.type}</span></div>
                    <span className="text-lg font-black text-me-primary">{Math.round((t.actual/t.goal)*100)}%</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-3"><span className="text-2xl font-black text-gray-900">{t.actual}</span><span className="text-xs text-gray-400">/ {t.goal} 场</span></div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-me-primary transition-all duration-1000 ease-out" style={{ width: `${Math.min((t.actual/t.goal)*100, 100)}%` }} />
                  </div>
                </div>
              ))}
              {currentTargets.filter(t => t.status === 'ACCEPTED').length === 0 && (
                <div className="col-span-2 py-10 bg-gray-100/50 rounded-2xl border border-dashed flex flex-col items-center text-gray-400">
                  <AlertCircle size={32} className="opacity-20 mb-2" />
                  <p className="text-xs">暂无已生效的目标，请先确认上方指令</p>
                </div>
              )}
            </div>
          </section>

          {/* Activity List */}
          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">活动经营记录</h3>
            <div className="grid grid-cols-1 gap-3">
              {filteredActivities.map(a => (
                <button 
                  key={a.id} 
                  onClick={() => setViewActivity(a)}
                  className="w-full bg-white rounded-xl border border-gray-100 p-4 flex justify-between items-center hover:shadow-md transition-all text-left"
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${a.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      {a.type === 'MEETING' ? <BarChart3 size={24} /> : <User size={24} />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{a.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-1">{a.time} | {a.subType}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : a.status === 'PENDING_SUMMARY' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {a.status === 'COMPLETED' ? '已完成' : a.status === 'PENDING_SUMMARY' ? '待录入' : '进行中'}
                    </span>
                    <span className="text-[10px] text-gray-400">查看详情</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Overlays / Modals */}
        {showForm && (
          <ActivityForm type={showForm} onClose={() => setShowForm(null)} onSubmit={(data) => { onCreateActivity(data); setShowForm(null); }} />
        )}

        {viewActivity && (
          <div className="absolute inset-0 z-[160] bg-white flex flex-col animate-in slide-in-from-right duration-300">
             <header className="p-4 border-b flex items-center gap-4 bg-gray-50 shrink-0">
               <button onClick={() => setViewActivity(null)} className="p-2 hover:bg-gray-200 rounded-full transition-all"><X size={20}/></button>
               <h3 className="text-lg font-black">活动详情</h3>
             </header>
             <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
                <div className="w-full max-w-md space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-me-accent text-me-primary flex items-center justify-center">{viewActivity.type === 'MEETING' ? <BarChart3 size={32}/> : <User size={32}/>}</div>
                      <div>
                        <h4 className="text-xl font-bold">{viewActivity.title}</h4>
                        <p className="text-sm text-gray-400">{viewActivity.subType} | {viewActivity.time}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-6 rounded-2xl border">
                      <div><span className="text-gray-400 block mb-1">主题属性</span>{viewActivity.themes.join(', ')}</div>
                      {viewActivity.type === 'MEETING' ? (
                        <><div><span className="text-gray-400 block mb-1">地点</span>{viewActivity.location}</div><div><span className="text-gray-400 block mb-1">主讲人</span>{viewActivity.speaker}</div></>
                      ) : (
                        <><div><span className="text-gray-400 block mb-1">面谈营销员</span>{viewActivity.personName} ({viewActivity.idCard})</div></>
                      )}
                   </div>
                   {viewActivity.status !== 'COMPLETED' && (
                     <div className="flex flex-col items-center p-8 bg-white border border-dashed rounded-3xl space-y-4">
                        <div className="bg-gray-100 p-4 rounded-xl shadow-inner"><QrCode size={160} className="text-gray-800" /></div>
                        <p className="text-xs text-gray-400 font-medium">请参会/面谈人员扫描上方二维码签到</p>
                        <button 
                          onClick={() => {
                            if (viewActivity.type === 'INTERVIEW') {
                              onUpdateStatus(viewActivity.id, 'PENDING_SUMMARY');
                              setShowSummaryModal(viewActivity.id);
                            } else {
                              onCompleteActivity(viewActivity.id, '系统自动生成：会议圆满结束，参会人员全员到齐。');
                              setViewActivity(null);
                            }
                          }}
                          className="w-full bg-me-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-me-primary/20 hover:brightness-110"
                        >
                          模拟现场核销
                        </button>
                     </div>
                   )}
                   {viewActivity.summary && (
                     <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <span className="text-xs font-bold text-green-600 uppercase block mb-2 tracking-widest">活动总结</span>
                        <p className="text-sm text-green-800 italic leading-relaxed">“{viewActivity.summary}”</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {showSummaryModal && (
          <div className="absolute inset-0 z-[200] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2"><FileEdit size={20} className="text-me-primary" />录入面谈纪要</h3>
              <textarea className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" placeholder="在此录入纪要..." value={summaryText} onChange={e => setSummaryText(e.target.value)} />
              <button onClick={() => { if(!summaryText) return; onCompleteActivity(showSummaryModal, summaryText); setShowSummaryModal(null); setViewActivity(null); setSummaryText(''); }} className="w-full bg-me-primary text-white py-3 rounded-xl font-bold text-sm mt-4">确认提交</button>
            </div>
          </div>
        )}

        {rejectionModal && (
          <div className="absolute inset-0 z-[250] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2"><AlertCircle size={20} /> 退回目标指令</h3>
              <p className="text-xs text-gray-500 mb-4 font-bold uppercase tracking-wider">退回原因说明</p>
              <textarea className="w-full h-24 p-3 bg-red-50 border border-red-100 rounded-xl outline-none text-sm" placeholder="请填写退回原因，如：本月面谈人数不足、排班冲突等..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setRejectionModal(null)} className="flex-1 py-3 text-gray-400 font-bold text-sm">取消</button>
                <button 
                  onClick={() => { 
                    if(!rejectReason) return; 
                    onTargetResponse(rejectionModal, 'REJECTED', rejectReason); 
                    setRejectionModal(null); 
                    setRejectReason(''); 
                  }} 
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-sm"
                >
                  确认退回
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainView;
