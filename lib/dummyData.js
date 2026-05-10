import { calculateLeadScore } from './scoringEngine';

export const initialLeads = [
  {
    id: '1', name: '지혜정 대표', company: '주식회사 온티드', contact: '010-2202-0824', status: '신규 유입', date: '2026-05-15',
    answers: { budget: '5000이상', authority: 'CEO', urgency: '1개월', outsource: '전면위탁' },
    get score() { return calculateLeadScore(this.answers); }
  },
  {
    id: '2', name: '김철수 본부장', company: '거성 하나벌', contact: '010-1234-5678', status: '컨택 중', date: '2026-05-16',
    answers: { budget: '3000', authority: '팀장', urgency: '3개월', outsource: '일부위탁' },
    get score() { return calculateLeadScore(this.answers); }
  },
  {
    id: '3', name: '박민수 대리', company: '스타트업', contact: '010-1111-2222', status: '보류', date: '2026-05-17',
    answers: { budget: '1000미만', authority: '실무자', urgency: '미정', outsource: '내부병행' },
    get score() { return calculateLeadScore(this.answers); }
  }
];