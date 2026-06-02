import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email, name, time } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { 
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PW 
      }
    });

    const mailOptions = {
      from: `"The Creators AI 시스템" <${process.env.GMAIL_USER}>`,
      // 💡 대표님 이메일로 알림 수신처 영구 고정 완료
      to: 'nova78jyg@gmail.com', 
      subject: `⏱️ [출근 보고] ${name} 직원이 시스템에 접속했습니다.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #1e293b; border-radius: 10px; overflow: hidden; background-color: #0f172a; color: #f8fafc;">
          <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
            <h2 style="margin: 0; color: white;">⏱️ 실시간 출근 보고</h2>
          </div>
          <div style="padding: 25px;">
            <p><strong>직원명:</strong> ${name}</p>
            <p><strong>계정:</strong> ${email}</p>
            <p><strong>출근 시간:</strong> <span style="color: #34d399; font-weight: bold; font-size: 16px;">${time}</span></p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "보고 완료" });

  } catch (error) {
    console.error("출근 메일 에러:", error);
    return NextResponse.json({ success: false, error: "서버 에러" }, { status: 500 });
  }
}