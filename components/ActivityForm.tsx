
import React, { useState } from 'react';
import { X, Calendar, MapPin, User, FileText, Check, ChevronRight, ChevronDown, Users } from 'lucide-react';
import { Activity } from '../types';
import { DEPT_TREE } from '../constants';

interface Props {
  type: 'MEETING' | 'INTERVIEW';
  onClose: () => void;
  onSubmit: (data: Activity) => void;
  isMobile?: boolean;
}

const ActivityForm: React.FC<Props> = ({ type, onClose, onSubmit, isMobile }) => {
  const [formData, setFormData] = useState({
    title: '',
    subType: type === 'MEETING' ? '早会' : '面谈',
    time: '2026-01-01',
    location: '',
    speaker: '',
    personName: '',
    personId: '',
    themes: [] as string[],
    otherTheme: '',
    participants: [] as string[]
  });

  const [showStaffPicker, setShowStaffPicker] = useState(false);
  const [showMeetingAttendees, setShowMeetingAttendees] = useState(false);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const themeOptions = type === 'MEETING' 
    ? ['方案政策', '氛围营造', '专业知识', '其他']
    : ['业绩跟进', '增员意愿', '日常沟通', '其他'];

  const handleToggleTheme = (t: string) => {
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.includes(t) ? prev.themes.filter(x => x !== t) : [...prev.themes, t]
    }));
  };

  const handleToggleAttendee = (name: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(name) 
        ? prev.participants.filter(p => p !== name) 
        : [...prev.participants, name]
    }));
  };

  const handleSelectDept = (deptName: string) => {
    const dept = DEPT_TREE.find(d => d.name === deptName);
    if (!dept) return;
    const staffNames = dept.staff.map(s => s.name);
    
    setFormData(prev => {
      const allIncluded = staffNames.every(name => prev.participants.includes(name));
      if (allIncluded) {
        return { ...prev, participants: prev.participants.filter(p => !staffNames.includes(p)) };
      } else {
        const uniqueParticipants = Array.from(new Set([...prev.participants, ...staffNames]));
        return { ...prev, participants: uniqueParticipants };
      }
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalThemes = formData.themes.map(t => t === '其他' ? `其他: ${formData.otherTheme}` : t);
    onSubmit({
      id: Math.random().toString(36).substr(2, 9),
      type,
      subType: formData.subType,
      title: formData.title || (type === 'MEETING' ? '未命名会议' : '未命名面谈'),
      time: formData.time,
      location: formData.location,
      speaker: formData.speaker,
      personName: formData.personName,
      idCard: formData.personId,
      themes: finalThemes,
      participants: formData.participants,
      status: 'ONGOING',
      createdAt: Date.now()
    });
  };

  return (
    <div className={`absolute inset-0 z-[200] bg-white flex flex-col ${isMobile ? 'rounded-[38px]' : 'rounded-xl'} overflow-hidden shadow-inner`}>
      <header className={`p-4 border-b flex justify-between items-center shrink-0 bg-gray-50`}>
        <div>
          <h3 className="text-lg font-black text-gray-900">{type === 'MEETING' ? '发起会议培训' : '发起 1v1 面谈'}</h3>
          <p className="text-[10px] text-gray-400">请如实填写活动经营信息</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-all">
          <X size={20} className="text-gray-400" />
        </button>
      </header>

      <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">活动主题</label>
          <input 
            required
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-me-primary outline-none text-sm"
            placeholder="请输入标题"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">活动类型</label>
            <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" value={formData.subType} onChange={e => setFormData({...formData, subType: e.target.value})}>
              {type === 'MEETING' ? ['早会', '新人班', '培训会议'].map(o => <option key={o}>{o}</option>) : ['面谈', '陪访'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">执行日期</label>
            <input type="date" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
          </div>
        </div>

        {type === 'MEETING' ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">地点</label>
                <input className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="地点" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">主讲人</label>
                <input className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="主讲人" value={formData.speaker} onChange={e => setFormData({...formData, speaker: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">选择参会人</label>
              <button 
                type="button" 
                onClick={() => setShowMeetingAttendees(true)} 
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-left flex justify-between items-center"
              >
                <span className={formData.participants.length > 0 ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.participants.length > 0 ? `已选 ${formData.participants.length} 人` : '请点击选择参会人员'}
                </span>
                <Users size={14} className="text-gray-400" />
              </button>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">选择营销员</label>
            <button 
              type="button" 
              onClick={() => setShowStaffPicker(true)} 
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-left flex justify-between items-center"
            >
              <span className={formData.personName ? 'text-gray-900' : 'text-gray-400'}>{formData.personName ? `${formData.personName} (${formData.personId})` : '请点击选择'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">活动主题属性</label>
          <div className="flex flex-wrap gap-2">
            {themeOptions.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => handleToggleTheme(t)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${formData.themes.includes(t) ? 'bg-me-primary text-white border-me-primary' : 'bg-white text-gray-400 border-gray-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
          {formData.themes.includes('其他') && (
            <input className="w-full mt-2 p-2 bg-gray-50 border rounded-lg text-xs" placeholder="其他说明" value={formData.otherTheme} onChange={e => setFormData({...formData, otherTheme: e.target.value})} />
          )}
        </div>

        <div className="pt-4 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-400 font-bold text-sm">取消</button>
          <button type="submit" className="flex-1 bg-me-primary text-white py-3 rounded-xl font-black text-sm shadow-lg shadow-me-primary/20">发起活动</button>
        </div>
      </form>

      {/* Meeting Attendee Picker Overlay */}
      {showMeetingAttendees && (
        <div className="absolute inset-0 bg-white z-[210] flex flex-col p-4 animate-in slide-in-from-right duration-200">
           <header className="flex justify-between items-center mb-4 shrink-0">
             <h4 className="font-bold text-sm">选择参会人员</h4>
             <button onClick={() => setShowMeetingAttendees(false)} className="p-1"><X size={20}/></button>
           </header>
           <div className="flex-1 overflow-y-auto space-y-2">
             {DEPT_TREE.map(dept => {
               const deptStaffNames = dept.staff.map(s => s.name);
               const isAllSelected = deptStaffNames.every(name => formData.participants.includes(name));
               return (
                <div key={dept.name} className="border border-gray-100 rounded-lg overflow-hidden">
                  <div className="flex items-center bg-gray-50 p-2">
                    <button 
                      type="button"
                      onClick={() => handleSelectDept(dept.name)}
                      className={`w-5 h-5 rounded border flex items-center justify-center mr-2 transition-colors ${isAllSelected ? 'bg-me-primary border-me-primary' : 'bg-white border-gray-300'}`}
                    >
                      {isAllSelected && <Check size={12} className="text-white" />}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setExpandedDept(expandedDept === dept.name ? null : dept.name)}
                      className="flex-1 flex items-center justify-between"
                    >
                      <span className="text-sm font-bold">{dept.name}</span>
                      {expandedDept === dept.name ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    </button>
                  </div>
                  {expandedDept === dept.name && (
                    <div className="pl-9 pr-2 py-1 bg-white space-y-1">
                      {dept.staff.map(s => (
                        <button 
                          key={s.id} 
                          type="button"
                          onClick={() => handleToggleAttendee(s.name)}
                          className="w-full flex items-center py-2 text-xs"
                        >
                          <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center transition-colors ${formData.participants.includes(s.name) ? 'bg-me-primary border-me-primary' : 'bg-white border-gray-300'}`}>
                            {formData.participants.includes(s.name) && <Check size={10} className="text-white" />}
                          </div>
                          <span>{s.name} ({s.id})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
               );
             })}
           </div>
           <button 
            type="button"
            onClick={() => setShowMeetingAttendees(false)}
            className="mt-4 bg-me-primary text-white w-full py-3 rounded-xl font-bold text-sm"
           >
            确定 ({formData.participants.length} 人)
           </button>
        </div>
      )}

      {/* Staff Picker Overlay (Interview) */}
      {showStaffPicker && (
        <div className="absolute inset-0 bg-white z-[210] flex flex-col p-4 animate-in slide-in-from-right duration-200">
           <header className="flex justify-between items-center mb-4">
             <h4 className="font-bold">选择人员</h4>
             <button onClick={() => setShowStaffPicker(false)}><X size={20}/></button>
           </header>
           <div className="flex-1 overflow-y-auto space-y-2">
             {DEPT_TREE.map(dept => (
               <div key={dept.name}>
                 <button 
                   type="button" 
                   onClick={() => setExpandedDept(expandedDept === dept.name ? null : dept.name)}
                   className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                 >
                   <span className="text-sm font-bold">{dept.name}</span>
                   {expandedDept === dept.name ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                 </button>
                 {expandedDept === dept.name && (
                   <div className="pl-4 mt-1 space-y-1">
                     {dept.staff.map(s => (
                       <button 
                         key={s.id} 
                         type="button"
                         onClick={() => {
                           setFormData({...formData, personName: s.name, personId: s.id});
                           setShowStaffPicker(false);
                         }}
                         className="w-full text-left p-2 text-xs hover:text-me-primary"
                       >
                         {s.name} - {s.id}
                       </button>
                     ))}
                   </div>
                 )}
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default ActivityForm;
