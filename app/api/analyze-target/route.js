import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { targetUrl } = await request.json();

    if (!targetUrl) {
      return NextResponse.json({ error: 'URL이 필요합니다.' }, { status: 400 });
    }

    // 💡 URL에서 브랜드 아이덴티티를 더 정밀하게 추출하는 로직
    let brandDisplay = "알 수 없는 브랜드";
    try {
      const urlObj = new URL(targetUrl);
      const pathParts = urlObj.pathname.split('/').filter(p => p !== '');
      
      if (urlObj.hostname.includes('instagram.com') && pathParts.length > 0) {
        // 인스타그램 ID 추출 (예: studioteddy_sparta)
        brandDisplay = pathParts[0].toUpperCase().replace(/_/g, ' ');
      } else {
        // 일반 도메인 추출
        brandDisplay = urlObj.hostname.replace('www.', '').split('.')[0].toUpperCase();
      }
    } catch (e) {
      brandDisplay = "분석 대상 채널";
    }

    const analysisResult = {
      // 🟢 고객용 리포트 데이터
      publicReport: {
        brandName: brandDisplay,
        representative: `${brandDisplay} 운영 대표자`,
        category: "온라인 비즈니스 및 콘텐츠 채널",
        identity: `${brandDisplay} 브랜드는 현재 특정 타겟에 집중된 전문 콘텐츠를 생산하며 시장 내 독자적인 영역을 구축하고 있습니다.`,
        swot: {
          s: "브랜드 아이덴티티가 명확하며 콘텐츠의 시각적 완성도가 매우 높음 (Strength)",
          w: "유입된 트래픽을 가두고 실제 매출로 연결하는 세일즈 퍼널의 기술적 이탈 (Weakness)",
          o: "동종 업계 대비 AI 자동화 및 CRM 시스템 선점 시 압도적 우위 점유 가능 (Opportunity)",
          t: "시장 진입 장벽이 낮아짐에 따라 시스템화되지 않은 브랜드의 이탈 가속화 (Threat)"
        },
        coreValue: "타겟 고객에게 실질적 솔루션을 제안하는 차별화된 전문성",
        direction: "노출 위주의 운영에서 '자동화된 리드 수집 및 결제 시스템'으로의 체질 개선",
        futureTask: "방문자를 가망 고객 DB로 즉시 전환하는 인터랙티브 퍼널 구축",
        painPoint: `현재 ${brandDisplay} 채널은 콘텐츠 매력도는 높으나, 다음 단계로 유도하는 장치가 부족하여 잠재적 수익이 매달 증발하고 있습니다.`,
        monthlyLeakageCost: 3850000,
        chartData: [
          { subject: "콘텐츠 매력", score: 92 },
          { subject: "브랜딩 통일", score: 75 },
          { subject: "트래픽 확보", score: 60 },
          { subject: "퍼널 설계", score: 25 },
          { subject: "전환율", score: 20 }
        ]
      },

      // 🔴 내부 어드민용 데이터 (영업용)
      adminReport: {
        targetBrand: brandDisplay,
        estimatedScale: "중소규모 비즈니스 혹은 고단가 퍼스널 브랜딩 채널",
        employeeNeeds: "대표 1인에게 업무가 과중된 상태. 자동화 도입 시 운영 리소스 70% 이상 절감 가능",
        salesAction: `[필살기] "${brandDisplay} 대표님, 분석 결과 월 385만 원의 누수가 확인되었습니다. 이 비용은 4주간의 바이브 코딩으로 영구적으로 막을 수 있습니다"라고 제안.`
      }
    };

    // 실제 AI가 분석하는 느낌을 주기 위한 2초 대기
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: '서버 에러' }, { status: 500 });
  }
}