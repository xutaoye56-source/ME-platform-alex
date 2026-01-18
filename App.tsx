
import React, { useState } from 'react';
import { INITIAL_TARGETS, INITIAL_ACTIVITIES } from './constants';
import { Target, Activity, TargetStatus, ActivityStatus } from './types';
import HeadView from './components/HeadView';
import MainView from './components/MainView';
import MobileSimulator from './components/MobileSimulator';
import { Bell } from 'lucide-react';

const App: React.FC = () => {
  const [targets, setTargets] = useState<Target[]>(INITIAL_TARGETS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);

  const addToast = (msg: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleAddTarget = (newTarget: Target) => {
    const isAlreadyAccepted = targets.some(
      t => t.month === newTarget.month && 
           t.type === newTarget.type && 
           t.meName === newTarget.meName && 
           t.status === 'ACCEPTED'
    );

    if (isAlreadyAccepted) {
      alert(`${newTarget.meName} 在 ${newTarget.month} 已接受该类型目标，无法重新下达。`);
      return;
    }

    setTargets(prev => {
      const existingIdx = prev.findIndex(t => t.month === newTarget.month && t.type === newTarget.type && t.meName === newTarget.meName);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...newTarget, id: prev[existingIdx].id };
        return updated;
      }
      return [...prev, newTarget];
    });
    addToast(`新目标下达: ${newTarget.type}`);
  };

  const handleTargetResponse = (id: string, status: TargetStatus, reason?: string) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, status, rejectionReason: reason } : t));
    addToast(status === 'ACCEPTED' ? '您已接受目标' : '您已退回目标');
  };

  const handleCreateActivity = (activity: Activity) => {
    setActivities(prev => [activity, ...prev]);
    addToast('活动创建成功');
  };

  const handleCompleteActivity = (id: string, summary: string) => {
    let targetType: string = '';
    setActivities(prev => prev.map(a => {
      if (a.id === id) {
        targetType = a.type === 'MEETING' ? '培训会议' : '1v1面谈';
        return { ...a, status: 'COMPLETED' as ActivityStatus, summary };
      }
      return a;
    }));

    setTargets(prev => prev.map(t => {
      if (t.type === targetType && t.status === 'ACCEPTED' && t.month === selectedMonth) {
        return { ...t, actual: t.actual + 1 };
      }
      return t;
    }));
    addToast('活动核销成功');
  };

  const handleUpdateStatus = (id: string, status: ActivityStatus) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-200 p-2 gap-3 font-sans">
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999] pointer-events-none flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className="bg-me-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce pointer-events-auto">
            <Bell size={18} />
            <span className="text-sm font-bold">{t.msg}</span>
          </div>
        ))}
      </div>

      <div className="w-[30%] h-full overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100 relative">
        <HeadView targets={targets} activities={activities} onAddTarget={handleAddTarget} />
      </div>

      <div className="w-[50%] h-full flex overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100 relative">
        <MainView 
          targets={targets} 
          activities={activities} 
          selectedMonth={selectedMonth} 
          setSelectedMonth={setSelectedMonth}
          onTargetResponse={handleTargetResponse}
          onCreateActivity={handleCreateActivity}
          onCompleteActivity={handleCompleteActivity}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      <div className="flex-none w-[350px] h-full flex items-center justify-center rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden relative p-4">
        {/* Added scaling to ensure phone frame fits height without being cut off */}
        <div className="scale-[0.85] origin-center">
          <MobileSimulator 
            targets={targets} 
            activities={activities} 
            onTargetResponse={handleTargetResponse}
            onCompleteActivity={handleCompleteActivity}
            onUpdateStatus={handleUpdateStatus}
            onCreateActivity={handleCreateActivity}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
