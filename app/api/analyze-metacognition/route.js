import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { clientName, clientContact, field, score, answers } = body;

    const fieldLabel = field === 'business' ? '대표/사업자' : field === 'marketing' ? '마케터' : '크리에이터';

    // 🧠 1. 제미나이 2.5 플래시 실시간 추론
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      당신은 The Creators AI의 수석 시스템 아키텍트입니다.
      고객의 '에이전틱 AI 및 MCP 활용 능력' 진단 데이터를 분석하여 날카로운 분석 결과(JSON)를 작성하세요.

      [고객 데이터]
      - 이름: ${clientName}
      - 직무: ${fieldLabel}
      - 진단 점수: ${score} / 12점 만점
      - 답변 맥락: ${answers.join(' | ')}

      [출력 규격 - 순수 JSON만 반환]
      {
        "capabilities": ["현재 긍정적 가용 역량 1", "가용 역량 2"],
        "limits": ["이 방식 지속 시 겪을 치명적 시스템 결함 1", "MCP 부재로 인한 한계 2"],
        "solution": "부트캠프를 통해 하네스 엔지니어링과 MCP 무인 자동화를 완성해야 하는 당위성 2문장"
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const aiData = JSON.parse(result.response.text());

    // 📧 2. 대표님 스마트폰(Gmail) VIP 리드 즉시 전송
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
              <p><strong>총점:</strong> <span style="color: #fb7185; font-size: 20px; font-weight: bold;">${score}점</span> / 12점</p>
              <p><strong>AI가 짚어낸 한계:</strong><br/><br/>${aiData.limits.join('<br/>')}</p>
            </div>
          </div>
        `
      };
      transporter.sendMail(mailOptions).catch(e => console.error("메일 발송 실패:", e));
    } catch (e) {
      console.error("메일 세팅 실패:", e);
    }

    // 3. 프론트엔드로 결과 반환
    return NextResponse.json({ success: true, aiData });

  } catch (error) {
    console.error("API 라우트 에러:", error);
    return NextResponse.json({ success: false, error: "진단 서버 에러" }, { status: 500 });
  }
}