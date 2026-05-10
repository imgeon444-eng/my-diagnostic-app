export const calculateLeadScore = (answers) => {
    let totalScore = 0;
    const weights = {
      budget: { '5000이상': 30, '3000': 20, '1000미만': 5 },
      authority: { 'CEO': 30, '팀장': 15, '실무자': 5 },
      urgency: { '1개월': 20, '3개월': 10, '미정': 0 },
      outsource: { '전면위탁': 20, '일부위탁': 10, '내부병행': 5 }
    };
    
    if (answers) {
      totalScore += weights.budget[answers.budget] || 0;
      totalScore += weights.authority[answers.authority] || 0;
      totalScore += weights.urgency[answers.urgency] || 0;
      totalScore += weights.outsource[answers.outsource] || 0;
    }
    return totalScore;
  };