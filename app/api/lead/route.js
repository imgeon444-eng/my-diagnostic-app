import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const FIREBASE_PROJECT_ID = "thecreators-94563";
const FIREBASE_API_KEY = "AIzaSyA_q5uu_BfKviHZtMYSXA12zCeCYjctiFQ";

async function saveToFirestoreRest(collectionName, fields) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collectionName}?key=${FIREBASE_API_KEY}`;
  
  const formattedFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'number') {
      formattedFields[key] = { integerValue: String(value) };
    } else if (typeof value === 'boolean') {
      formattedFields[key] = { booleanValue: value };
    } else {
      formattedFields[key] = { stringValue: String(value || '') };
    }
  }

  // 현재 ISO 시간 추가
  formattedFields.createdAt = { timestampValue: new Date().toISOString() };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: formattedFields }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Firestore REST error (${response.status}): ${errText}`);
  }

  return response.json();
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request) {
  try {
    let body = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    } else {
      const text = await request.text();
      try {
        body = JSON.parse(text);
      } catch (e) {
        body = {};
      }
    }

    const name = body.name || body.o_name || '익명 문의자';
    const contact = body.contact || body.tel || body.o_tel || body.o_hp || '연락처 없음';
    const email = body.email || body.o_email || '';
    const subject = body.subject || body.o_subject || '본사 온라인 상담 접수';
    const content = body.content || body.memo || body.o_content || '';
    const item1 = body.item1 || body.o_item1 || '상담문의';
    const item2 = body.item2 || body.o_item2 || '';
    const category = item2 ? `${item1} / ${item2}` : item1;

    const leadFields = {
      clientName: `[본사] ${category}`,
      clientTitle: name,
      clientContact: contact,
      clientEmail: email,
      inquiryTopic: category,
      businessGoal: subject,
      shortPainPoint: `[${subject}] ${content}`,
      source: '본사 홈페이지 (thecreator-mcn.com)',
      funnelSource: 'homepage-mcn-subpage-6-1',
      status: '상담 대기',
      totalScore: 100,
    };

    // 1. homepage_leads 컬렉션에 실시간 등록
    const firestoreResult = await saveToFirestoreRest('homepage_leads', leadFields);

    // 2. 통합 관리를 위해 bootcamp_leads에도 등록
    try {
      await saveToFirestoreRest('bootcamp_leads', {
        ...leadFields,
        status: '심사 대기',
      });
    } catch (e) {
      console.error('bootcamp_leads backup error:', e);
    }

    // 3. 대표님 이메일 알림 (환경변수 있을 시)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PW) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PW,
          },
        });

        const mailOptions = {
          from: `"The Creators AI 본사 알림" <${process.env.GMAIL_USER}>`,
          to: 'nova78jyg@gmail.com',
          subject: `📩 [본사 상담접수] ${name} 님이 새로운 상담 문의를 남겼습니다!`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; background-color: #090e17; color: #f8fafc;">
              <div style="background-color: #0891b2; padding: 20px; text-align: center;">
                <h2 style="margin: 0; color: white; font-size: 20px;">📩 본사 홈페이지 실시간 상담 접수</h2>
                <p style="margin: 5px 0 0 0; color: #e0f2fe; font-size: 13px;">CRM 칸반보드에 자동 등록되었습니다</p>
              </div>
              <div style="padding: 25px;">
                <p style="margin: 8px 0;"><strong>신청자명:</strong> ${name}</p>
                <p style="margin: 8px 0;"><strong>연락처:</strong> <span style="color: #38bdf8; font-weight: bold; font-size: 16px;">${contact}</span></p>
                <p style="margin: 8px 0;"><strong>이메일:</strong> ${email || '미입력'}</p>
                <p style="margin: 8px 0;"><strong>상담분야:</strong> ${category}</p>
                <p style="margin: 8px 0;"><strong>제목:</strong> ${subject}</p>
                <div style="margin-top: 20px; padding: 16px; background-color: #1e293b; border-radius: 8px; border: 1px solid #334155;">
                  <p style="margin: 0; font-size: 12px; color: #94a3b8; margin-bottom: 6px;">문의 상세 내용:</p>
                  <p style="margin: 0; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${content || '내용 없음'}</p>
                </div>
                <div style="margin-top: 25px; text-align: center;">
                  <a href="https://my-diagnostic-app.vercel.app/admin" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                    CRM 칸반보드 바로가기 &rarr;
                  </a>
                </div>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.error('Email notification failed (continuing):', mailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Lead registered successfully to Live CRM',
        documentId: firestoreResult.name?.split('/').pop(),
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Lead registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
