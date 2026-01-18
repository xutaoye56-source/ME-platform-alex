
import React, { useState } from 'react';
import { Target, Activity } from '../types';
import { ME_LIST, MONTH_OPTIONS } from '../constants';
import { Users, Target as TargetIcon, TrendingUp, AlertCircle } from 'lucide-react';

interface Props {
  targets: Target[];
  activities: Activity[];
  onAddTarget: (t: Target) => void;
}

const HeadView: React.FC<Props> = ({ targets, activities, onAddTarget }) => {
  const [formData, setFormData] = useState({
    me: ME_LIST[0],
    month: MONTH_OPTIONS[1],
    type: '培训会议' as '培训会议' | '1v1面谈',
    goal: 10
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Check if a target of this type already exists for this ME in this month
    // We check for PENDING or ACCEPTED status to prevent duplicates
    const exists = targets.some(t => 
      t.meName === formData.me && 
      t.month === formData.month && 
      t.type === formData.type &&
      (t.status === 'ACCEPTED' || t.status === 'PENDING')
    );

    if (exists) {
      alert(`当月「${formData.type}」目标已下达！`);
      return;
    }

    onAddTarget({
      id: Math.random().toString(36).substr(2, 9),
      month: formData.month,
      type: formData.type,
      goal: Number(formData.goal),
      actual: 0,
      status: 'PENDING',
      meName: formData.me
    });
  };

  return (
    <div className="h-full flex flex-col">
      <header className="p-6 shrink-0 flex items-center gap-2 border-b bg-white z-10">
        <div className="p-2 bg-me-primary text-white rounded-lg">
          <Users size={24} />
        </div>
        <h1 className="text-xl font-bold text-gray-800">ME 主管工作台</h1>
      </header>

      {/* Independently Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Target Setting Form */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-me-primary font-bold">
            <TargetIcon size={20} />
            <h2>目标指令下达</h2>
          </div>
          <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl space-y-4 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">选择 ME</label>
                <select 
                  className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-me-primary outline-none transition-all text-sm bg-white"
                  value={formData.me}
                  onChange={e => setFormData({...formData, me: e.target.value})}
                >
                  {ME_LIST.map(me => <option key={me} value={me}>{me}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">月份</label>
                <select 
                  className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-me-primary outline-none text-sm bg-white"
                  value={formData.month}
                  onChange={e => setFormData({...formData, month: e.target.value})}
                >
                  {MONTH_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">目标类型</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: '培训会议'})}
                  className={`flex-1 py-2 rounded text-xs transition-all font-bold ${formData.type === '培训会议' ? 'bg-me-primary text-white shadow-md' : 'bg-white text-gray-600 border'}`}
                >
                  培训会议
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: '1v1面谈'})}
                  className={`flex-1 py-2 rounded text-xs transition-all font-bold ${formData.type === '1v1面谈' ? 'bg-me-primary text-white shadow-md' : 'bg-white text-gray-600 border'}`}
                >
                  1v1面谈
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">目标值 (场次)</label>
              <input 
                type="number"
                min="1"
                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-me-primary outline-none text-sm bg-white"
                value={formData.goal}
                onChange={e => setFormData({...formData, goal: Number(e.target.value)})}
              />
            </div>
            <button type="submit" className="w-full bg-me-primary text-white font-bold py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all">
              确认下达
            </button>
          </form>
        </section>

        {/* Summary Statistics */}
        <section className="pb-6">
          <div className="flex items-center gap-2 mb-4 text-me-primary font-bold">
            <TrendingUp size={20} />
            <h2>实时执行看板</h2>
          </div>
          <div className="space-y-3">
            {targets.length === 0 ? (
              <div className="text-center py-10 text-gray-300 border border-dashed rounded-xl">
                暂无目标记录
              </div>
            ) : targets.slice().reverse().map(t => (
              <div key={t.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm transition-all hover:border-me-primary">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm font-bold block">{t.meName} - {t.month}</span>
                    <span className="text-xs text-gray-500">{t.type}</span>
                  </div>
                  <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    t.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' : 
                    t.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {t.status === 'ACCEPTED' ? '已接受' : t.status === 'REJECTED' ? '被退回' : '待确认'}
                  </div>
                </div>
                <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-me-primary transition-all duration-1000"
                    style={{ width: `${Math.min((t.actual / t.goal) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-gray-400">完成率: {Math.round((t.actual / t.goal) * 100)}%</span>
                  <span className="text-xs font-bold text-me-primary">{t.actual} / {t.goal}</span>
                </div>
                {t.status === 'REJECTED' && (
                  <div className="mt-2 bg-red-50 p-2 rounded border border-red-100 flex gap-2 items-center">
                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                    <span className="text-[10px] text-red-600 italic leading-tight">拒绝理由: {t.rejectionReason}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeadView;
