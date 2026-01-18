
import React from 'react';
import { Target, Activity } from './types';

export const INITIAL_TARGETS: Target[] = [
  {
    id: 't1',
    month: '2026-01',
    type: '培训会议',
    goal: 10,
    actual: 8,
    status: 'ACCEPTED',
    meName: '张三'
  },
  {
    id: 't2',
    month: '2026-01',
    type: '1v1面谈',
    goal: 20,
    actual: 15,
    status: 'ACCEPTED',
    meName: '张三'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    type: 'MEETING',
    subType: '早会',
    title: '2026开年首战宣导',
    time: '2026-01-05',
    location: '第一会议室',
    speaker: '李总',
    themes: ['方案政策'],
    status: 'COMPLETED',
    summary: '会议顺利进行，明确了1月业务节奏。',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'a2',
    type: 'INTERVIEW',
    subType: '面谈',
    title: '王五绩优月度沟通',
    time: '2026-01-08',
    personName: '王五',
    idCard: '600123',
    themes: ['意愿沟通'],
    status: 'COMPLETED',
    summary: '王五表示对1月目标非常有信心。',
    createdAt: Date.now() - 86400000 * 2
  }
];

export const MONTH_OPTIONS = ['2025-12', '2026-01', '2026-02'];
export const ME_LIST = ['张三', '李四', '王五'];
export const DEPT_TREE = [
  { name: '第一营业部', staff: [{name: '王五', id: '600123'}, {name: '赵六', id: '600124'}] },
  { name: '第二营业部', staff: [{name: '小明', id: '600201'}, {name: '小红', id: '600202'}] }
];
