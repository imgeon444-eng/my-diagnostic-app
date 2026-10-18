import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { runRealMarketingTelemetry } from '../../../lib/marketing-inspector/realTelemetryEngine';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Gemini API 장애/타임아웃 시에도 실측 데이터를 100% 반영하여 리포트를 완성하는 결정론적 폴백 합성기
 */
function buildDeterministicReportFallback({
  platform,
  brandName,
  manualData,
  telemetry,
  deterministic,
}) {
  const net = telemetry?.network || {};
  const px = telemetry?.pixelsAndCrm || {};
  const sg = telemetry?.seoAndGeo || {};
  const cro = telemetry?.croAndFunnel || {};
  const yt = telemetry?.youtubeMetrics || {};

  if (platform === 'youtube') {
    const avgViews = yt.avgViewsRecent15 || 0;
    const linkRatio = yt.funnelLinkInDescRatioPercent || 0;
    return {
      category: '유튜브 크리에이터 & 미디어 커머스',
      identity: `${brandName} 채널은 ${yt.subscriberText || '구독자 팬덤'}을 보유한 미디어 자산이나, 최근 영상 설명란의 외부 퍼널 전환 링크 삽입률이 ${linkRatio}%에 머물러 조회수가 실매출로 직결되지 않는 구조입니다.`,
      painPoint:
        linkRatio < 50
          ? `최근 ${yt.recentVideoCount || 15}개 영상(평균 조회수 ${avgViews.toLocaleString()}회) 중 설명란 세일즈 브릿지가 ${linkRatio}%에 불과하여 유입 시청자의 대다수가 시청 직후 이탈하고 있습니다.`
          : `외부 링크는 존재하나 잠재고객 연락처(DB)를 즉시 수집하는 무료 진단기·리드 마그넷과 24시간 무인 CRM 락인 장치가 부재합니다.`,
      geoInsight: `유튜브 채널 메타데이터(${sg.title || brandName})는 감지되나, 생성형 AI(ChatGPT·Perplexity·Gemini)가 권위 출처로 인용할 독립 웹 도메인 및 JSON-LD 구조화 스키마가 연결되어 있지 않습니다.`,
      swot: {
        s: `${yt.subscriberText || '채널 구독자'} 기반의 콘텐츠 도달력 및 최근 영상 평균 ${avgViews.toLocaleString()}회의 오가닉 시청 트래픽 보유`,
        w: `영상 설명란 및 고정 댓글 내 자동화 리드 캡처 퍼널(${linkRatio}%) 미비로 인한 트래픽 증발`,
        o: `시청자를 AI 진단기 및 고가치 리드 마그넷으로 유도할 경우 광고비 0원으로 고관여 DB 대량 확보 가능`,
        t: `알고리즘 변동 시 단순 조회수 수익만으로는 안정적인 월간 현금흐름 방어 불가`,
      },
      coreValue: '오가닉 시청 트래픽의 자사 VIP 고객 DB 자산화',
      direction: '단순 조회수 의존 모델에서 [유튜브 시청 -> 무료 AI 진단/리드마그넷 -> 24시간 무인 세일즈 퍼널]로 비즈니스 피보팅',
      futureTask: '전 영상 설명란 및 프로필 상단에 1초 만에 참여 가능한 인터랙티브 리드 수집 랜딩 URL 일괄 배치',
      actionPlan7Days: [
        {
          period: 'Day 1-2',
          title: '채널 프로필 & 인기 영상 상위 10개 설명란 브릿지 정비',
          desc: `현재 ${linkRatio}% 수준인 외부 퍼널 링크 삽입률을 100%로 끌어올리고 단일 리드 수집 랜딩으로 동선 통일`,
        },
        {
          period: 'Day 3-4',
          title: '시청자 맞춤형 AI 자가진단 리드 마그넷 오픈',
          desc: '단순 구경꾼이 자신의 이름과 연락처를 남기게 만드는 무료 진단 리포트 자동 발송 시스템 연결',
        },
        {
          period: 'Day 5-7',
          title: '리타겟팅 픽셀 & 24시간 무인 알림톡/이메일 너처링 가동',
          desc: '유입된 시청자 모수를 Meta·Google 픽셀로 락인하고 자동 후속 제안 시퀀스로 고단가 상품 결제 전환',
        },
      ],
    };
  }

  if (platform === 'instagram') {
    const mainTopic = manualData?.mainContent || '전문 지식·브랜드 콘텐츠';
    const userPain = manualData?.coreProblem || '조회수 대비 문의 및 실제 결제 전환 저조';
    return {
      category: `인스타그램 ${mainTopic} 비즈니스`,
      identity: `${brandName} 계정은 ${manualData?.followerCount || '활성'} 팔로워를 기반으로 ${mainTopic} 영역에서 도달력을 확보하고 있으나, 프로필 유입 트래픽을 자동 수거하는 CRM 퍼널이 단절된 상태입니다.`,
      painPoint: `핵심 고민("${userPain}")의 근본 원인은 릴스·피드 노출 이후 프로필 방문자를 즉시 DB로 전환하는 리드 마그넷과 리타겟팅 픽셀이 없기 때문입니다.`,
      geoInsight: `인스타그램 폐쇄형 피드 특성상 외부 생성형 AI 검색엔진(Perplexity·ChatGPT) 인덱싱이 차단되어 있어, GEO 최적화된 외부 브랜드 허브 랜딩 구축이 시급합니다.`,
      swot: {
        s: `${manualData?.followerCount || '보유'} 팔로워 및 ${mainTopic} 특화 콘텐츠를 통한 초기 시각적 주목도 확보`,
        w: `프로필 방문 후 수동 DM 문의에만 의존하여 야간·주말 이탈률이 85% 이상 발생하는 수동 구조`,
        o: `인스타 매니챗(자동 DM)과 외부 AI 진단 랜딩페이지를 결합할 경우 24시간 무인 리드 수집 가능`,
        t: `릴스 도달률 하락 시 광고 픽셀 모수가 축적되지 않아 재타겟팅 캠페인 집행 불가`,
      },
      coreValue: '팔로워 팬덤의 고단가 자동화 수익 파이프라인 전환',
      direction: '수동 DM 응대 방식에서 [댓글 트리거 자동 DM -> 외부 AI 진단 퍼널 -> 무인 결제/상담 예약] 체계로 전환',
      futureTask: '프로필 단일 링크에 픽셀이 심어진 자체 진단형 랜딩페이지 탑재 및 리드 DB 자동 수집 연동',
      actionPlan7Days: [
        {
          period: 'Day 1-2',
          title: '프로필 바이오 한 줄 가치제안(USP) 및 단일 퍼널 링크 개편',
          desc: '단순 나열형 링크트리를 제거하고 고객의 결핍을 즉시 진단해주는 원포인트 랜딩으로 직결',
        },
        {
          period: 'Day 3-4',
          title: '키워드 댓글 자동 DM(매니챗) + 무료 진단 리드 마그넷 연동',
          desc: '게시물 댓글 작성 시 1초 만에 진단 링크가 발송되어 연락처 DB가 자동 축적되는 파이프라인 가동',
        },
        {
          period: 'Day 5-7',
          title: 'Meta Pixel 모수 축적 및 무인 세일즈 전환 시퀀스 완성',
          desc: '랜딩 방문자 전원을 픽셀로 추적하고 미결제 이탈자에게 맞춤형 후속 오퍼를 자동 노출',
        },
      ],
    };
  }

  // Web / Shopping Mall / Landing Page 결정론적 폴백
  const detectedPixelsText =
    px.totalDetected > 0 ? px.detectedPixelNames.join(', ') : '트래킹 픽셀 전무(0개)';
  const stackText =
    (net.detectedStack || []).length > 0 ? net.detectedStack.join(' · ') : '표준 웹 아키텍처';

  return {
    category: sg.geo?.jsonLdTypes?.[0] || '웹 비즈니스 & 디지털 세일즈 퍼널',
    identity: `${brandName}(${stackText}) 사이트는 실측 결과 ${
      sg.title ? `"${sg.title.slice(0, 36)}"` : '온라인 서비스'
    } 정체성을 표방하고 있으나, 트래킹 픽셀(${detectedPixelsText}) 및 DB 캡처 폼(${cro.formCount}개) 구조상 유입 고객의 이탈 방어 장치가 취약합니다.`,
    painPoint:
      px.totalDetected === 0
        ? `가장 치명적인 누수 원인은 Meta Pixel·GA4·Naver WCS 등 애드테크 픽셀이 단 1개도 감지되지 않고(0개), 리드 수집 폼(${cro.formCount}개)이 부재하여 유입 트래픽이 흔적 없이 증발하는 것입니다.`
        : `기본 트래킹(${detectedPixelsText})은 탑재되어 있으나, 방문자의 즉각적인 행동을 유도하는 인터랙티브 리드 마그넷(폼 ${cro.formCount}개, CTA ${cro.ctaButtonCount}개)과 실시간 CRM 락인 위젯(${
            (px.crmWidgets || []).join(', ') || '미설치'
          })이 부족합니다.`,
    geoInsight: `실측 결과 JSON-LD 스키마(${sg.geo?.hasJsonLd ? sg.geo.jsonLdTypes.join(', ') : '미탑재'}), Sitemap(${
      sg.geo?.hasSitemapXml ? '정상' : '누락'
    }), llms.txt(${
      sg.geo?.hasLlmsTxt ? '탑재' : '미탑재'
    }) 상태로, 생성형 AI(ChatGPT·Perplexity) 검색 인용 점수는 ${deterministic.geoScore}점(${deterministic.geoReadiness}) 수준입니다.`,
    swot: {
      s: net.reachable
        ? `HTTP ${net.httpStatus} 정상 응답(TTFB ${net.ttfbMs}ms) 및 ${stackText} 기반의 웹 도메인 인프라 보유`
        : `${brandName} 고유 도메인 자산 및 온라인 접점 보유`,
      w: `트래킹 픽셀 ${px.totalDetected}개 감지 · 리드 폼 ${cro.formCount}개 · 이미지 Alt 준수율 ${sg.images?.altCoveragePercent ?? 0}%로 인한 검색 및 전환 손실`,
      o: `자가진단형 리드 마그넷과 5대 핵심 광고 픽셀·GEO 스키마(JSON-LD/llms.txt) 탑재 시 전환율 및 AI 검색 노출 즉시 배증`,
      t: `현재 구조 방치 시 월간 약 ${deterministic.monthlyLeakageCost.toLocaleString()}원의 잠재 매출이 경쟁사 퍼널로 지속 유출`,
    },
    coreValue: '데이터 실측 기반 무인 리드 획득 및 세일즈 자동화',
    direction: `단순 브로셔형 웹페이지에서 [픽셀 100% 추적 + 인터랙티브 진단 폼 + 24시간 CRM 자동화]가 결합된 고전환 퍼널로 전면 개편`,
    futureTask: `누락된 핵심 트래킹 픽셀 즉시 설치 및 첫 화면(Above the Fold)에 고객 DB 캡처용 리드 마그넷 폼(${cro.formCount === 0 ? '신규' : '고도화'}) 배치`,
    actionPlan7Days: [
      {
        period: 'Day 1-2',
        title: '애드테크 트래킹 픽셀 & SEO/GEO 스키마 긴급 이식',
        desc: `현재 ${px.totalDetected}개인 픽셀에 Meta Pixel·GA4·GTM·Naver WCS를 완비하고 JSON-LD 및 Sitemap/llms.txt를 배포`,
      },
      {
        period: 'Day 3-4',
        title: '이탈 방지 인터랙티브 리드 캡처 폼 & CTA 재설계',
        desc: `현재 <form> ${cro.formCount}개·CTA ${cro.ctaButtonCount}개 구조를 개편하여 방문자 연락처를 즉시 확보하는 고가치 진단 미끼 탑재`,
      },
      {
        period: 'Day 5-7',
        title: '채널톡/알림톡 CRM 연동 및 24시간 리타겟팅 퍼널 가동',
        desc: '수집된 DB에 즉각 자동 리포트를 발송하고 미전환 방문자에게 맞춤형 리타겟팅 캠페인 자동 집행',
      },
    ],
  };
}

export async function POST(request) {
  try {
    const { platform = 'web', targetUrl = '', manualData = null } = await request.json();

    // ==========================================
    // STEP 1: REA 5계층 실측 텔레메트리 엔진 가동 (Zero-Hallucination)
    // ==========================================
    const {
      resolvedBrandName,
      evidenceLedger,
      telemetry,
      deterministic,
    } = await runRealMarketingTelemetry({
      platform,
      targetUrl,
      manualData,
    });

    const fallbackNarrative = buildDeterministicReportFallback({
      platform,
      brandName: resolvedBrandName,
      manualData,
      telemetry,
      deterministic,
    });

    // ==========================================
    // STEP 2: 실측 증거 원장(Evidence Ledger) 기반 Gemini 2.5 정밀 합성
    // ==========================================
    let aiNarrative = null;

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const telemetryBrief = JSON.stringify(
          {
            brandName: resolvedBrandName,
            platform,
            targetUrl,
            manualData,
            evidenceId: evidenceLedger.evidenceId,
            network: telemetry.network,
            pixelsAndCrm: telemetry.pixelsAndCrm,
            seoAndGeo: {
              title: telemetry.seoAndGeo?.title,
              metaDescription: telemetry.seoAndGeo?.metaDescription,
              h1Count: telemetry.seoAndGeo?.headings?.h1Count,
              h1Texts: telemetry.seoAndGeo?.headings?.h1Texts,
              altCoveragePercent: telemetry.seoAndGeo?.images?.altCoveragePercent,
              geo: telemetry.seoAndGeo?.geo,
            },
            croAndFunnel: telemetry.croAndFunnel,
            youtubeMetrics: telemetry.youtubeMetrics,
            deterministicScores: {
              overallScore: deterministic.overallScore,
              geoScore: deterministic.geoScore,
              monthlyLeakageCost: deterministic.monthlyLeakageCost,
              chartData: deterministic.chartData,
            },
          },
          null,
          2
        );

        const prompt = `
너는 'The Creators AI'의 최고 수석 AX(AI Transformation) 및 리버스 엔지니어링 퍼널 감사관이다.
아래 [실측 텔레메트리 증거 데이터(REA Telemetry Evidence)]는 대상 URL/채널을 실제로 크롤링·역공학 스캔하여 계측한 100% 팩트 데이터다.

[실측 텔레메트리 증거 데이터]
${telemetryBrief}

위 실측 데이터를 반드시 구체적으로 인용(예: 실제 감지된 타이틀, 픽셀 설치 개수 및 명칭, <form>/CTA 개수, TTFB 응답속도, JSON-LD/sitemap/llms.txt 유무, 유튜브 구독자·평균 조회수·설명란 링크 비율 등)하여 정밀 진단 내러티브 JSON을 작성하라.
추상적인 일반론을 금지하며, 실측된 수치와 결함 증거를 문장 안에 직접 명시해야 한다.
마크다운 기호 없이 아래 순수 JSON 구조만 출력하라:

{
  "category": "실측 타이틀·메타·콘텐츠를 기반으로 판별한 구체적 업종/카테고리 (예: AI 에듀테크 & 기업 AX 컨설팅)",
  "identity": "실측된 페이지 타이틀/H1/채널 설명과 현재 트래픽·퍼널 구조를 결합한 전문적인 2문장 정체성 진단",
  "painPoint": "실측 데이터(픽셀 감지 수, 폼/CTA 개수, 유튜브 설명란 링크 비율 등)에서 드러난 가장 치명적인 세일즈 누수 원인 1~2문장",
  "geoInsight": "실측된 JSON-LD, robots.txt, sitemap.xml, llms.txt 상태를 근거로 ChatGPT·Perplexity·Gemini 검색 노출 및 인용 준비도를 진단한 1~2문장",
  "swot": {
    "s": "실측 데이터에서 확인된 기술/콘텐츠/트래픽 강점",
    "w": "실측 데이터에서 드러난 픽셀·폼·SEO·전환 장치 약점",
    "o": "AI 에이전트 자동화 및 리드 마그넷·픽셀 도입 시 즉시 확보 가능한 기회",
    "t": "현재의 퍼널 결손 방치 시 발생할 구체적 매출/경쟁력 위협"
  },
  "coreValue": "브랜드가 집중해야 할 핵심 가치 1문장",
  "direction": "수익화 극대화를 위한 구체적인 퍼널 피보팅 방향 1~2문장",
  "futureTask": "오늘 당장 코드/채널에 시공해야 할 최우선 퍼널 과제 1~2문장",
  "actionPlan7Days": [
    { "period": "Day 1-2", "title": "실측 결함 기반 1단계 긴급 정비 제목", "desc": "구체적인 실행 지침" },
    { "period": "Day 3-4", "title": "2단계 리드 마그넷 & DB 캡처 구축 제목", "desc": "구체적인 실행 지침" },
    { "period": "Day 5-7", "title": "3단계 무인 CRM & 픽셀 리타겟팅 가동 제목", "desc": "구체적인 실행 지침" }
  ]
}
`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        });

        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        aiNarrative = JSON.parse(cleanedJson);
      } catch (aiErr) {
        console.warn('Gemini synthesis fallback to deterministic narrative:', aiErr.message);
      }
    }

    const narrative = aiNarrative || fallbackNarrative;

    // ==========================================
    // STEP 3: 결정론적 수치 + 실측 텔레메트리 + 내러티브 무결성 병합
    // ==========================================
    const publicReport = {
      brandName: resolvedBrandName,
      representative: `${resolvedBrandName} 운영 주체`,
      category: narrative.category || fallbackNarrative.category,
      identity: narrative.identity || fallbackNarrative.identity,
      severity: deterministic.severity,
      bottleneckPhase: deterministic.bottleneckPhase,
      overallScore: deterministic.overallScore,
      monthlyLeakageCost: deterministic.monthlyLeakageCost,
      annualLeakageCost: deterministic.annualLeakageCost,
      leakageFormula: deterministic.leakageFormula,
      geoScore: deterministic.geoScore,
      geoReadiness: deterministic.geoReadiness,
      geoInsight: narrative.geoInsight || fallbackNarrative.geoInsight,
      chartData: deterministic.chartData,
      evidenceSummary: deterministic.evidenceSummary,
      swot: {
        s: narrative.swot?.s || fallbackNarrative.swot.s,
        w: narrative.swot?.w || fallbackNarrative.swot.w,
        o: narrative.swot?.o || fallbackNarrative.swot.o,
        t: narrative.swot?.t || fallbackNarrative.swot.t,
      },
      coreValue: narrative.coreValue || fallbackNarrative.coreValue,
      direction: narrative.direction || fallbackNarrative.direction,
      futureTask: narrative.futureTask || fallbackNarrative.futureTask,
      painPoint: narrative.painPoint || fallbackNarrative.painPoint,
      actionPlan7Days:
        Array.isArray(narrative.actionPlan7Days) && narrative.actionPlan7Days.length >= 3
          ? narrative.actionPlan7Days
          : fallbackNarrative.actionPlan7Days,
    };

    return NextResponse.json({
      schemaVersion: '2.0.0-rea-telemetry',
      platform,
      targetUrl: telemetry.network?.finalUrl || targetUrl,
      evidenceLedger,
      telemetry,
      publicReport,
    });
  } catch (error) {
    console.error('백엔드 에러 로그:', error);
    return NextResponse.json(
      { error: error.message || '분석 중 내부 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
}