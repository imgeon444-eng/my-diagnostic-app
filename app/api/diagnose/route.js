import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';

export const maxDuration = 30;

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function POST(request) {
  try {
    const body = await request.json();
    
    // 💡 1층 진단기에서 넘어온 고객 정보들
    const { clientName, clientTitle, clientContact, clientEmail, totalScore = 0, budget, shortPainPoint, goals, skipEmail = false } = body;

    const fallbackAnalysis = {
      weightClass: totalScore >= 38 ? "플래티넘" : totalScore >= 25 ? "골드" : totalScore >= 15 ? "실버" : "브론즈",
      stage: totalScore >= 38 ? 4 : totalScore >= 25 ? 3 : totalScore >= 15 ? 2 : 1,
      analysisText: `${clientName || '대표'}님의 현재 마케팅 체급 점수는 ${totalScore}점(45점 만점)으로, ${shortPainPoint ? `"${shortPainPoint}" 병목을 해결할` : '유입부터 전환까지 이어지는'} 자동화 세일즈 퍼널 구축이 시급합니다.`,
      direction: "수동 운영에서 벗어나 24시간 무인 리드 캡처와 데이터 기반 세일즈 파이프라인을 도입해야 합니다.",
      reason: "진단 문항별 마케팅 인프라 성숙도와 최우선 비즈니스 목표를 종합 분석하여 가장 ROI가 높은 솔루션을 배정하였습니다."
    };

    let analysisData = fallbackAnalysis;

    // 🧠 1. 제미나이 2.5 플래시 AI 분석 (5초 타임아웃 및 폴백 보장)
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
      당신은 'The Creators AI'의 수석 비즈니스 설계자입니다.
      고객의 마케팅 진단 데이터를 바탕으로 현재 '마케팅 체급'을 판정하고 최적의 솔루션 단계를 배정하세요.

      [고객 데이터]
      - 이름: ${clientName}
      - 진단 점수: ${totalScore} / 45점
      - 선택한 목표: ${Array.isArray(goals) ? goals.join(', ') : (goals || '미지정')}
      - 예산 규모: ${budget || '미지정'}
      - 현재 고민: ${shortPainPoint || '전환율 및 자동화 부재'}

      [솔루션 배정 기준]
      - 1단계 (무료 컨설팅): 점수가 매우 낮거나(15점 미만) 방향성 자체가 아예 없는 경우
      - 2단계 (기초 강좌): 기본기는 있으나 실행 도구가 부족한 경우 (15~25점 사이)
      - 3단계 (실전 부트캠프): 시스템만 갖추면 즉시 매출 폭발이 가능한 경우 (25~38점 사이)
      - 4단계 (브랜드 파트너십): 이미 고수이며 시스템을 갖추고 있어 협업 시너지가 큰 경우 (38점 이상)

      [결과 출력 규격 - 순수 JSON만 출력]
      {
        "weightClass": "브론즈/실버/골드/플래티넘",
        "stage": 1,
        "analysisText": "고객의 고민을 정확히 짚어주는 2문장의 촌철살인 분석",
        "direction": "앞으로 나아가야 할 마케팅 방향성 1문장",
        "reason": "왜 이 단계를 추천했는지에 대한 정중하고 논리적인 근거"
      }
    `;

        const aiPromise = model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini diagnose timeout (5000ms)')), 5000)
        );

        const result = await Promise.race([aiPromise, timeoutPromise]);
        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);
        if (parsed && parsed.weightClass && parsed.stage) {
          analysisData = parsed;
        }
      } catch (aiErr) {
        console.warn("AI 진단 폴백 전환:", aiErr.message);
      }
    }

    // 📧 2. 대표님 스마트폰(Gmail)으로 즉시 보고 메일 전송 (중복 발송 방지 가드 포함)
    if (!skipEmail && process.env.GMAIL_USER && process.env.GMAIL_APP_PW) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PW
          }
        });

        const mailOptions = {
          from: `"AI 팀장" <${process.env.GMAIL_USER}>`,
          to: process.env.GMAIL_USER,
          subject: `🚨 [신규 리드] ${clientName}님 진단 완료! (총점: ${totalScore}점)`,
          html: `
            <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
              <div style="background-color: #0f172a; color: #fff; padding: 20px; text-align: center;">
                <h2 style="margin: 0; color: #3b82f6;">🔥 신규 VIP 리드 발생</h2>
                <p style="margin: 5px 0 0; font-size: 14px; color: #94a3b8;">The Creators AI 진단기 (1층)</p>
              </div>
              
              <div style="padding: 20px; background-color: #f8fafc;">
                <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">👤 고객 정보</h3>
                <p><strong>이름/직함:</strong> ${clientName} / ${clientTitle || '미입력'}</p>
                <p><strong>연락처:</strong> <span style="color: #2563eb; font-weight: bold;">${clientContact}</span></p>
                <p><strong>이메일:</strong> ${clientEmail || '미입력'}</p>
                
                <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px;">📊 진단 데이터</h3>
                <p><strong>진단 점수:</strong> <span style="color: #e11d48; font-weight: bold; font-size: 18px;">${totalScore}점</span> / 45점</p>
                <p><strong>희망 예산:</strong> ${budget || '미입력'}</p>
                <p><strong>핵심 목표:</strong> ${Array.isArray(goals) ? goals.join(', ') : '미입력'}</p>
                <p><strong>현재 고민:</strong><br/> <span style="background-color: #fff; padding: 10px; display: block; border-radius: 5px; margin-top: 5px; border: 1px solid #e2e8f0;">${shortPainPoint || '미입력'}</span></p>
                
                <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px;">🤖 AI 팀장 판정 요약</h3>
                <p><strong>권장 단계:</strong> <span style="background-color: #3b82f6; color: white; padding: 3px 8px; border-radius: 5px; font-weight: bold;">${analysisData.stage}단계</span> 솔루션 제안</p>
                <p><strong>AI 분석 요약:</strong> ${analysisData.analysisText}</p>
              </div>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ AI 팀장 보고 메일 발송 완료");
      } catch (mailError) {
        console.error("🚨 메일 발송 실패:", mailError);
      }
    }

    // 3. 화면(프론트엔드)으로 결과 반환
    return NextResponse.json(analysisData);

  } catch (error) {
    console.error("AI 진단 에러:", error);
    return NextResponse.json({ error: "진단 중 오류 발생" }, { status: 500 });
  }
}