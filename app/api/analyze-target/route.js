import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const body = await request.json();
    const targetUrl = typeof body?.targetUrl === 'string' ? body.targetUrl.trim() : '';

    if (!targetUrl) {
      return NextResponse.json({ error: '타깃 URL이 비어 있습니다.' }, { status: 400 });
    }

    const prompt = `너는 날카로운 B2B 비즈니스 분석가야.
다음 기업 URL을 기준으로 아래 항목을 반드시 JSON으로만 반환해.

타깃 URL: ${targetUrl}

요청 항목:
1) 가장 치명적인 자동화/마케팅 취약점 1가지
2) 예상되는 월간 인건비 누수 규모(숫자, 원 단위 정수)
3) 이 기업 대표에게 보낼 초개인화 인스타 DM 스크립트
   - 마지막 결론은 The Creators AI 워크숍과 데모 링크 유도로 마무리

반환 JSON 스키마:
{
  "painPoint": "문자열",
  "monthlyLeakageCost": 12345678,
  "dmScript": "문자열"
}

중요: 반드시 JSON만 반환하고, 코드블록 마크다운은 절대 포함하지 마.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("서버에 API 키가 없습니다. .env.local 파일을 확인하세요.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); 
    
    const geminiResult = await model.generateContent(prompt);
    let rawText = geminiResult.response.text().trim();
    
    // 💡 [멸균 완료] 주석 및 코드 전체에서 마크다운 기호를 완전히 삭제했습니다. 아스키코드(96)로만 내부 조립합니다.
    const markdownTicks = String.fromCharCode(96, 96, 96);
    rawText = rawText.replace(new RegExp(markdownTicks + "json", "gi"), "");
    rawText = rawText.replace(new RegExp(markdownTicks, "g"), "");
    rawText = rawText.trim();

    const parsed = JSON.parse(rawText);

    return NextResponse.json(
      {
        painPoint: parsed.painPoint || '분석 결과가 충분하지 않습니다.',
        monthlyLeakageCost: Number(parsed.monthlyLeakageCost || 0),
        dmScript: parsed.dmScript || 'DM 스크립트를 생성하지 못했습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("💡 [서버 에러 로그]:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}