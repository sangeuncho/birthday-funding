'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/supabase';

// 방명록 타입 정의
interface GuestbookMessage {
  id: number;
  nickname: string;
  content: string;
  created_at: string;
}

export default function Home() {
  // 1. 계좌번호 복사 기능 state
  const [copied, setCopied] = useState(false);
  const accountNumber = "토스뱅크 1000-4497-5056 (조상은)"; // 내 계좌번호로 변경!
  const targetAmount = 600000; // 🎯 목표 금액 60만원 고정

  // 2. 생일 디데이 계산 state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 3. 방명록 및 펀딩 데이터 관련 state
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [currentAmount, setCurrentAmount] = useState<number>(0); // 💰 실시간 금액 저장할 곳
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  // 4. 데이터베이스에서 데이터 통째로 가져오는 함수 (방명록 + 펀딩금액)
  const fetchAllData = async () => {
    // 방명록 목록 가져오기
    const { data: msgData, error: msgError } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (msgError) {
      console.error('방명록을 불러오는데 실패했어요:', msgError);
    } else if (msgData) {
      setMessages(msgData);
    }

    // 펀딩 금액 가져오기
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
    fetchAllData();
  }, []);

  // 달성 퍼센트 계산 (최대 100%까지만 채워지도록 설정)
  const percent = Math.min(Math.floor((currentAmount / targetAmount) * 100), 100);

  // 5. 방명록 등록하기 함수 (Create)
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) {
      alert('닉네임과 내용을 모두 입력해주세요!');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('guestbook')
      .insert([{ nickname, content }]);

    setIsLoading(false);

    if (error) {
      alert('방명록 등록에 실패했습니다. 다시 시도해주세요.');
      console.error(error);
    } else {
      setNickname('');
      setContent('');
      fetchAllData(); // 등록 성공 후 목록과 퍼센트 갱신
    }
  };

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
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
          안녕하세요... 조상은입니다 <br /> 
          올해 생일은 자잘한 선물 대신 <strong>오래 쓸 스키</strong>를 장만하고 싶읍니다.<br />
          여러분이 채워주시는 만원, 이만원이 모여 스키의 바인딩이 되고, 플레이트가 됩니다...<br />
          보내주시는 마음이 이 스키의 지분이 되어 앞으로의 겨울을 영원히 함께 할 것 입니다😳
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
          <p className="text-sm text-slate-500 mt-1">스키 탈 때마다 당신을 떠올릴게요. 고마워요 ... 사랑해요 </p>
          
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
          href="https://open.kakao.com/o/sQrYSdEi" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-[#FEE500] hover:bg-[#FDD100] text-[#191919] font-bold rounded-2xl transition-all shadow-sm text-center block"
        >
          💛 카카오톡으로 송금하기
        </a>
      </section>

      {/* 방명록 입력 및 목록 영역 */}
      <section className="w-full max-w-md bg-white rounded-3xl p-6 shadow-md border border-pink-50 mb-12">
        <h2 className="text-lg font-bold text-slate-700 mb-4">✍️ 방명록 남기기</h2>
        
        {/* 방명록 작성 폼 */}
        <form onSubmit={handleSubmitMessage} className="flex flex-col gap-3 mb-6">
          <input 
            type="text" 
            placeholder="닉네임" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-400"
          />
          <textarea 
            placeholder="축하 메시지를 적어주세요!" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-400 resize-none"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl text-sm transition-all disabled:bg-slate-300"
          >
            {isLoading ? '등록 중...' : '등록하기 🫰'}
          </button>
        </form>

        {/* 방명록 리스트 */}
        <div className="border-t border-slate-100 pt-4 max-h-60 overflow-y-auto flex flex-col gap-3">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-4">첫 번째 축하 메시지를 남겨보세요! 🎉</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-700">{msg.nickname}</span>
                  <span className="text-xs text-slate-400">
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))
          )}
        </div>
      </section>

    </main>
  );
}