import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, contact, email, topic, jobAndReason } = await request.json();

    // 시스템에 설정된 기존 이메일 환경변수 100% 재활용 (출근버튼과 동일)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { 
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PW 
      }
    });

    // 대표님 이메일로 다이렉트 발송 세팅
    const mailOptions = {
      from: `"The Creators AI 시스템" <${process.env.GMAIL_USER}>`,
      to: 'nova78jyg@gmail.com',
      subject: `🔥 [신규 VIP 리드] ${name} 님이 무료 컨설팅을 신청했습니다!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #1e293b; border-radius: 10px; overflow: hidden; background-color: #0f172a; color: #f8fafc;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center;">
            <h2 style="margin: 0; color: white;">🔥 1:1 무료 컨설팅 신규 신청</h2>
          </div>
          <div style="padding: 25px;">
            <p><strong>신청자명:</strong> ${name}</p>
            <p><strong>연락처:</strong> <span style="color: #60a5fa; font-weight: bold; font-size: 16px;">${contact}</span></p>
            <p><strong>이메일:</strong> ${email}</p>
            <p><strong>관심 분야:</strong> ${topic}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #1e293b; border-radius: 8px; border: 1px solid #334155;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; margin-bottom: 5px;">직무 및 고민 내용:</p>
              <p style="margin: 0; font-size: 14px;">${jobAndReason || '미입력'}</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "이메일 발송 완료" });

  } catch (error) {
    console.error("이메일 발송 에러:", error);
    return NextResponse.json({ success: false, error: "서버 에러" }, { status: 500 });
  }
}