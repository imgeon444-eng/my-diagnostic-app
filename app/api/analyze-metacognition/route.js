import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';

export const maxDuration = 30;

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

function buildMetacognitionFallback(fieldLabel, score = 0) {
  if (score >= 9) {
    return {
      capabilities: [
        `${fieldLabel} 실무에 생성형 AI와 프롬프트 체이닝을 적극 결합하여 단일 업무 속도를 크게 단축하고 있습니다.`,
        '반복 업무를 시스템화하려는 높은 에이전틱 감각과 구조적 사고력을 보유하고 있습니다.',
      ],
      limits: [
        '단일 챗봇 호출 단계에 머물러 있어 외부 DB·웹 브라우저·결제 퍼널을 스스로 제어하는 MCP 및 하네스 루프(Harness Loop) 결합이 부족합니다.',
        '대표님이 직접 명령을 내려야만 AI가 움직이는 수동 트리거 구조여서 24시간 무인 자율 오피스로의 확장이 제한됩니다.',
      ],
      solution:
        '실전 부트캠프 VIP 과정을 통해 3계층 하네스 엔지니어링과 멀티 에이전트 자율 오피스를 이식하면 인건비 누수를 원천 차단하고 24시간 무인 수익 파이프라인을 즉시 가동할 수 있습니다.',
    };
  }
  return {
    capabilities: [
      `${fieldLabel} 영역에서 AI 도입의 필요성을 명확히 인지하고 있으며 핵심 병목을 해결하려는 실행 의지가 높습니다.`,
      '기존 수동 업무 프로세스의 비효율을 파악하고 자동화 전환점을 모색하고 있습니다.',
    ],
    limits: [
      '단순 질문·답변식 프롬프트에 의존하여 결과물의 일관성이 떨어지고, 매번 사람이 검수·복사·붙여넣기를 반복해야 하는 노동 집약적 병목이 발생합니다.',
      '고객 유입부터 DB 수집, 리타겟팅, 세일즈 전환까지 이어지는 자동화 파이프라인과 MCP 도구 연결이 단절되어 매월 막대한 기회비용이 증발하고 있습니다.',
    ],
    solution:
      '프롬프트 암기가 아닌 바이브코딩 기반 기업 AX 에이전트 자동화(하네스 루프 시스템)를 구축해야 할 시점입니다. 40시간 밀착 부트캠프에서 대표님만의 24시간 무인 AI 팀원 오피스를 직접 완성하십시오.',
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { clientName, clientContact, field, score, answers } = body;

    const fieldLabel = field === 'business' ? '대표/사업자' : field === 'marketing' ? '마케터' : '크리에이터';
    let aiData = buildMetacognitionFallback(fieldLabel, Number(score || 0));

    // 🧠 1. 제미나이 2.5 플래시 실시간 추론 (5초 타임아웃 및 결정론적 폴백 보장)
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
      당신은 The Creators AI의 수석 시스템 아키텍트입니다.
      고객의 '에이전틱 AI 및 MCP 활용 능력' 진단 데이터를 분석하여 날카로운 분석 결과(JSON)를 작성하세요.

      [고객 데이터]
      - 이름: ${clientName || '고객'}
      - 직무: ${fieldLabel}
      - 진단 점수: ${score || 0} / 12점 만점
      - 답변 맥락: ${Array.isArray(answers) ? answers.join(' | ') : String(answers || '응답 없음')}

      [출력 규격 - 순수 JSON만 반환]
      {
        "capabilities": ["현재 긍정적 가용 역량 1", "가용 역량 2"],
        "limits": ["이 방식 지속 시 겪을 치명적 시스템 결함 1", "MCP 부재로 인한 한계 2"],
        "solution": "부트캠프를 통해 하네스 엔지니어링과 MCP 무인 자동화를 완성해야 하는 당위성 2문장"
      }
    `;

        const aiPromise = model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini metacognition timeout (5000ms)')), 5000)
        );

        const result = await Promise.race([aiPromise, timeoutPromise]);
        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);
        if (parsed && Array.isArray(parsed.capabilities) && Array.isArray(parsed.limits)) {
          aiData = parsed;
        }
      } catch (aiErr) {
        console.warn("메타인지 AI 폴백 전환:", aiErr.message);
      }
    }

    // 📧 2. 대표님 스마트폰(Gmail) VIP 리드 즉시 전송 (서버리스 동결 방지를 위해 await 보장)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PW) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PW }
        });

        const mailOptions = {
          from: `"AI 팀장" <${process.env.GMAIL_USER}>`,
          to: process.env.GMAIL_USER,
          subject: `🚨 [신규 VIP 리드] ${clientName}님 에이전틱 진단 완료! (점수: ${score}점)`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #1e293b; border-radius: 10px; overflow: hidden; background-color: #0f172a; color: #f8fafc;">
              <div style="background-color: #0284c7; padding: 20px; text-align: center;">
                <h2 style="margin: 0; color: white;">🔥 신규 그랜드마스터 리드</h2>
                <p style="margin: 5px 0 0; font-size: 14px; color: #e0f2fe;">The Creators AI 에이전틱 진단기</p>
              </div>
              <div style="padding: 25px;">
                <h3 style="border-bottom: 1px solid #334155; padding-bottom: 10px; color: #38bdf8;">👤 고객 정보</h3>
                <p><strong>이름:</strong> ${clientName}</p>
                <p><strong>연락처:</strong> <span style="color: #38bdf8; font-weight: bold; font-size: 18px;">${clientContact}</span></p>
                <p><strong>직무:</strong> ${fieldLabel}</p>
                <h3 style="border-bottom: 1px solid #334155; padding-bottom: 10px; color: #38bdf8; margin-top: 25px;">📊 진단 결과 요약</h3>
                <p><strong>총점:</strong> <span style="color: #fb7185; font-size: 20px; font-weight: bold;">${score || 0}점</span> / 12점</p>
                <p><strong>AI가 짚어낸 한계:</strong><br/><br/>${Array.isArray(aiData?.limits) ? aiData.limits.join('<br/>') : (aiData?.limits || '분석 완료')}</p>
              </div>
            </div>
          `
        };
        await transporter.sendMail(mailOptions);
      } catch (e) {
        console.error("메일 발송 실패:", e);
      }
    }

    // 3. 프론트엔드로 결과 반환
    return NextResponse.json({ success: true, aiData });

  } catch (error) {
    console.error("API 라우트 에러:", error);
    return NextResponse.json({ success: false, error: "진단 서버 에러" }, { status: 500 });
  }
}