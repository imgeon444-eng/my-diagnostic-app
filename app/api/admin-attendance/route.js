import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email, name, time } = await request.json();

    // 💡 허가된 관리자 이메일 목록 (필요시 추가 가능)
    const authorizedUsers = [
      "limgeon@thecreators.ai", 
      "임건팀장", // 테스트를 위해 텍스트 입력도 허용
      process.env.GMAIL_USER // 대표님 본인 이메일도 허용
    ];

    // 권한 검증
    const isAuthorized = authorizedUsers.some(user => email.includes(user));

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: "인가되지 않은 관리자입니다." }, { status: 403 });
    }

    // 📧 대표님 메일로 출석 보고 전송
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PW }
    });

    const mailOptions = {
      from: `"어드민 시스템" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `✅ [출석 보고] ${email} 관리자 시스템 접속`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #1e293b; border-radius: 10px; overflow: hidden; background-color: #0f172a; color: #f8fafc;">
          <div style="background-color: #059669; padding: 20px; text-align: center;">
            <h2 style="margin: 0; color: white;">🛡️ 관리자 출석 체크 완료</h2>
            <p style="margin: 5px 0 0; font-size: 14px; color: #d1fae5;">The Creators AI 어드민 시스템</p>
          </div>
          <div style="padding: 25px;">
            <p><strong>접속자:</strong> ${email}</p>
            <p><strong>출석 시간:</strong> <span style="color: #34d399; font-weight: bold;">${time}</span></p>
            <p style="margin-top: 20px; font-size: 13px; color: #94a3b8;">* 본 메일은 시스템에 의해 자동 발송되었습니다.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "출석 보고 완료" });

  } catch (error) {
    console.error("출석 API 에러:", error);
    return NextResponse.json({ success: false, error: "서버 에러 발생" }, { status: 500 });
  }
}