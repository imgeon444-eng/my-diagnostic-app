import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { platform, targetUrl, manualData } = await request.json();

    let brandDisplay = "분석 대상";
    let industryHint = "";

    // ==========================================
    // 🔍 STEP 1: 플랫폼별 데이터 전처리 및 이름 보정
    // ==========================================
    if (platform === 'instagram' && manualData) {
      brandDisplay = manualData.brandName;
      industryHint = `주제: ${manualData.mainContent}, 고민: ${manualData.coreProblem}`;
    } else if (targetUrl) {
      try {
        const decoded = decodeURIComponent(targetUrl);
        // '상구벙구' 무결성 보장 로직
        if (decoded.includes('상구범구') || decoded.includes('상구법구') || decoded.includes('%EC%83%81%EA%B5%AC%EB%B2%99%EA%B5%AC')) {
          brandDisplay = "상구벙구";
        } else {
          brandDisplay = decoded.split('/').filter(Boolean).pop().replace('@', '').toUpperCase();
        }
        industryHint = platform === 'youtube' ? "유튜브 크리에이터 비즈니스" : "웹 서비스 퍼널 분석";
      } catch (e) {
        brandDisplay = "알 수 없는 채널";
      }
    }

    // ==========================================
    // 🧠 STEP 2: 제미나이 2.5 전용 고도화 프롬프트 (수정됨)
    // ==========================================
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
      너는 최고 수석 AX(AI Transformation) 컨설턴트야.
      채널명: [${brandDisplay}]
      플랫폼: [${platform}]
      맥락: [${industryHint}]

      위 정보를 바탕으로 'The Creators AI'의 분석 기준에 따라 정밀 진단 리포트를 생성해.
      반드시 아래 JSON 형식을 100% 준수하고, 마크다운 기호 없이 순수 JSON만 출력해.
      단, 각 항목의 내용과 점수, 누수 비용은 대상 채널의 맥락에 맞게 네가 직접 추론하여 논리적인 수치와 텍스트로 채워 넣어.

      {
        "publicReport": {
          "brandName": "${brandDisplay}",
          "representative": "${brandDisplay} 운영 주체",
          "category": "콘텐츠 기반 비즈니스",
          "identity": "이 채널이 고객에게 제공하는 핵심 가치와 정체성을 전문적인 2문장으로 작성",
          "swot": {
            "s": "채널의 핵심 강점",
            "w": "수익화 및 시스템 관점의 약점",
            "o": "AI 자동화 도입 시 기대되는 기회",
            "t": "시스템 부재 시 발생할 위협"
          },
          "coreValue": "브랜드의 핵심 가치",
          "direction": "수익화를 위한 비즈니스 피보팅 방향 제안",
          "futureTask": "당장 실행해야 할 퍼널 구축 과제",
          "painPoint": "현재 채널이 겪고 있는 가장 치명적인 문제점 지적",
          "monthlyLeakageCost": [3000000에서 15000000 사이의 정수 값 중 하나를 논리적으로 추정하여 숫자만 입력],
          "chartData": [
            { "subject": "콘텐츠 매력", "score": [40에서 95 사이의 정수] },
            { "subject": "브랜딩 통일", "score": [40에서 95 사이의 정수] },
            { "subject": "트래픽 확보", "score": [40에서 95 사이의 정수] },
            { "subject": "퍼널/수익화", "score": [40에서 95 사이의 정수] },
            { "subject": "전환율", "score": [40에서 95 사이의 정수] }
          ]
        }
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    // ==========================================
    // 🛡️ STEP 3: 방탄 파싱 및 데이터 반환
    // ==========================================
    const responseText = result.response.text();
    let analysisData;
    
    try {
      // 혹시 모를 마크다운 기호 제거 로직
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      analysisData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("🚨 JSON 파싱 실패 원본:", responseText);
      throw new Error("AI가 데이터 규격을 지키지 않았습니다.");
    }

    // 이름 재확정 (환각 방지)
    analysisData.publicReport.brandName = brandDisplay;

    return NextResponse.json(analysisData);

  } catch (error) {
    console.error("🚨 백엔드 에러 로그:", error);
    return NextResponse.json({ error: error.message || '분석 중 내부 에러가 발생했습니다.' }, { status: 500 });
  }
}