// app/api/diagnose/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { clientName, totalScore, budget, shortPainPoint, goals } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      당신은 'The Creators AI'의 수석 비즈니스 설계자입니다.
      고객의 마케팅 진단 데이터를 바탕으로 현재 '마케팅 체급'을 판정하고 최적의 솔루션 단계를 배정하세요.

      [고객 데이터]
      - 이름: ${clientName}
      - 진단 점수: ${totalScore} / 45점
      - 선택한 목표: ${goals.join(', ')}
      - 예산 규모: ${budget}
      - 현재 고민: ${shortPainPoint}

      [솔루션 배정 기준]
      - 1단계 (무료 컨설팅): 점수가 매우 낮거나(15점 미만) 방향성 자체가 아예 없는 경우
      - 2단계 (기초 강좌): 기본기는 있으나 실행 도구가 부족한 경우 (15~25점 사이)
      - 3단계 (실전 부트캠프): 시스템만 갖추면 즉시 매출 폭발이 가능한 경우 (25~38점 사이)
      - 4단계 (브랜드 파트너십): 이미 고수이며 시스템을 갖추고 있어 협업 시너지가 큰 경우 (38점 이상)

      * 주의: 점수가 높더라도 '고민' 내용에 따라 단계를 조정할 수 있는 카리스마를 보여주세요.

      [결과 출력 규격 - JSON]
      {
        "weightClass": "브론즈/실버/골드/플래티넘 중 택1",
        "stage": 1, 2, 3, 4 중 숫자만,
        "analysisText": "고객의 고민을 정확히 짚어주는 2문장의 촌철살인 분석",
        "direction": "앞으로 나아가야 할 마케팅 방향성 1문장",
        "reason": "왜 이 단계를 추천했는지에 대한 정중하고 논리적인 근거"
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    return NextResponse.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("AI 진단 에러:", error);
    return NextResponse.json({ error: "진단 중 오류 발생" }, { status: 500 });
  }
}