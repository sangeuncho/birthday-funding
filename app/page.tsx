'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/supabase';

export default function Home() {
  // 1. 계좌번호 복사 기능 state
  const [copied, setCopied] = useState(false);
  const accountNumber = "토스뱅크 1000-4497-5056 (조상은)"; // 내 계좌번호로 변경!
  const targetAmount = 600000; // 🎯 목표 금액 60만원 고정

  // 2. 생일 디데이 계산 state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 3. 펀딩 데이터 관련 state
  const [currentAmount, setCurrentAmount] = useState<number>(0); // 💰 실시간 금액 저장할 곳

  // 생일 디데이 타이머 효과
  useEffect(() => {
    const targetDate = new Date('2026-09-20T23:59:59').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 4. 데이터베이스에서 펀딩 금액 가져오는 함수
  const fetchFundingData = async () => {
    const { data: fundData, error: fundError } = await supabase
      .from('funding')
      .select('current_amount')
      .eq('id', 1)
      .single();

    if (fundError) {
      console.error('펀딩 금액을 불러오는데 실패했어요:', fundError);
    } else if (fundData) {
      setCurrentAmount(fundData.current_amount);
    }
  };

  // 컴포넌트가 처음 켜질 때 실행
  useEffect(() => {
    fetchFundingData();
  }, []);

  // 달성 퍼센트 계산 (최대 100%까지만 채워지도록 설정)
  const percent = Math.min(Math.floor((currentAmount / targetAmount) * 100), 100);

  // 계좌 복사 함수
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('계좌번호 복사에 실패했습니다. 직접 복사해주세요!');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50 text-slate-800 flex flex-col items-center justify-between p-6">
      
      {/* 상단 헤더 / 디데이 */}
      <section className="w-full max-w-md text-center my-8">
        <span className="text-4xl">🎂</span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-2 text-pink-600">
          Sangeun's Birthday Funding
        </h1>
        
       {/* 🏆 작년 우승 사진 영역 (아담한 크기로 축소) */}
<div className="mt-6 mb-4 bg-white p-3 rounded-3xl shadow-sm border border-amber-100 max-w-[260px] mx-auto">
  <div className="w-full aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-100">
    <img 
      src="/winner1.jpg" // 👈 파일명 확인
      alt="작년 우승 사진"
      className="w-full h-full object-cover"
    />
    <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
      🏆🥇🥈🥈🥈
    </span>
  </div>
</div>
       
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
          안녕하세요... 조상은입니다 <br /> 
          이번 생일을 맞아 <strong>'조상은 26/27 스키 장비 펀드'</strong>를 개장했습니다. <br />
          대학 생활의 마지막 스키 합숙을 앞두고, 올겨울 제대로 불살라보려고 <br />
          큰맘 먹고 장비들을 장만하는 중입니다!<br />
          여러분께서 보태주시는 든든한 후원이 이 스키의 가장 빛나는 지분이 됩니다...😳<br />
          주신 마음 잊지 않고 열심히 훈련해서 멋지고 건강한 모습 보여드리겠습니다!!!<br />
          많은 성원과 후원 부탁드립니다 🎂❤️
        </p>
        
        {/* 디데이 타이머 */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex justify-around">
          <div className="text-center">
            <span className="block text-2xl font-bold text-pink-500">{timeLeft.days}</span>
            <span className="text-xs text-slate-400">Days</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-pink-500">{timeLeft.hours}</span>
            <span className="text-xs text-slate-400">Hours</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-pink-500">{timeLeft.minutes}</span>
            <span className="text-xs text-slate-400">Mins</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-pink-500">{timeLeft.seconds}</span>
            <span className="text-xs text-slate-400">Secs</span>
          </div>
        </div>
      </section>

      {/* 목표 선물 카드 영역 */}
      <section className="w-full max-w-md bg-white rounded-3xl p-6 shadow-md border border-pink-50 mb-8">
        <h2 className="text-lg font-bold text-slate-700 mb-4">🎁 Wishlist </h2>
        <div className="flex flex-col items-center">
          <div className="w-full h-48 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center mb-4">
            <img 
              src="https://www.piste.co.kr/attach_files/nive_erp_zaxpoz/thumb/600_/2025-08/ATHLETE%20FIS%20SL%20FACTORY%20.jpg" 
              alt="Rossignol Hero Skis"
              className="w-full h-full object-contain bg-white"
            />
          </div>
          <h3 className="text-xl font-bold">23 24 Rossignol Hero</h3>
          <p className="text-sm text-slate-500 mt-1"><em>감사합니다... 사랑합니다... </em> </p>
          
          {/* 🛠️ 자동으로 너비가 조절되는 실시간 게이지 바 */}
          <div className="w-full mt-6 bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-400 to-amber-400 h-full transition-all duration-500" 
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="w-full flex justify-between mt-2 text-sm font-semibold">
            <span className="text-pink-500">{percent}% 달성 ({currentAmount.toLocaleString()}원)</span>
            <span className="text-slate-400">목표액: 60만원</span>
          </div>
        </div>
      </section>

      {/* 송금하기 버튼 세트 */}
      <section className="w-full max-w-md flex flex-col gap-3 mb-12">
        <button
          onClick={handleCopy}
          className={`w-full py-4 rounded-2xl font-bold transition-all text-center border shadow-sm ${
            copied 
              ? 'bg-emerald-500 text-white border-emerald-500' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {copied ? '✅ 계좌번호가 복사되었습니다!' : '💳 토스뱅크 1000-4497-5056 복사하기'}
        </button>

        <a
          href="kakaolink://" 
          className="w-full py-4 bg-[#FEE500] hover:bg-[#FDD100] text-[#191919] font-bold rounded-2xl transition-all shadow-sm text-center block"
        >
          💛 카카오톡 앱 열기
        </a>
      </section>

    </main>
  );
}
