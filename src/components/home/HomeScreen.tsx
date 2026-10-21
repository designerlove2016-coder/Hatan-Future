import React, { useState } from 'react';
import { UserProfile, MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { BrandLogo } from '../common/BrandLogo';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { TactilePillButton } from '../common/TactilePillButton';
import { OrganicFloatingCard } from '../common/OrganicFloatingCard';
import { FloatingDimensionCard } from '../common/FloatingDimensionCard';
import { FloatingMatchCard } from '../common/FloatingMatchCard';
import { formatCity } from '../../utils/localization';
import {
  Bell,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Heart,
  Zap,
} from 'lucide-react';

interface HomeScreenProps {
  userProfile: UserProfile;
  topMatches: MatchProfile[];
  language: Language;
  onFindTwin: () => void;
  onViewMatches: () => void;
  onEditProfile: () => void;
  onSelectMatch: (match: MatchProfile) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  topMatches,
  language,
  onFindTwin,
  onViewMatches,
  onEditProfile,
  onSelectMatch,
}) => {
  const t = TRANSLATIONS[language];
  const [dailyChoice, setDailyChoice] = useState<'opt1' | 'opt2' | null>(null);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<number | null>(null);

  const hour = new Date().getHours();
  const greeting = hour > 16 || hour < 4 ? t.greetingEvening : t.greetingDay;

  // Personality Fingerprint dimension tags
  const fingerprintKeys = [
    { key: 'coffee_v60', labelEn: 'V60 Coffee', labelAr: 'قهوة مختصة' },
    { key: 'food_burger', labelEn: 'Gourmet Burger', labelAr: 'برجر ذواقة' },
    { key: 'sport_padel', labelEn: 'Padel Sport', labelAr: 'رياضة البادل' },
    { key: 'car_luxury_sedan', labelEn: 'Fast Sedan', labelAr: 'سيارة فاخرة' },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] pb-24 transition-colors">
      
      {/* 1. TOP MOBILE APP HEADER */}
      <header className="sticky top-0 z-30 bg-[#F8F7F2]/90 dark:bg-[#111813]/90 backdrop-blur-md px-5 pt-4 pb-3 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <BrandLogo size="sm" showTagline={false} />

        {/* User Quick Glance & Notification Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
            className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-gradient-to-b from-white to-[#F2EFE8] dark:from-[#243028] dark:to-[#18221C] border border-white/80 dark:border-white/10 shadow-[0_4px_0_0_#D3CBB9,0_8px_14px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_0_0_#0F1511] active:translate-y-1 active:shadow-[0_1px_0_0_#D3CBB9] text-slate-700 dark:text-slate-300 hover:text-[#0B5D3B] transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E73A2A] ring-2 ring-white animate-pulse" />
          </button>

          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 rounded-full p-0.5 hover:ring-3 hover:ring-[#0B5D3B]/40 active:scale-95 transition-all cursor-pointer shadow-sm"
            aria-label="My Profile"
          >
            <AvatarRenderer avatar={userProfile.avatar} size={42} direction="center" />
          </button>
        </div>
      </header>

      {/* Notification Toast Panel */}
      {showNotificationDrawer && (
        <div className="mx-5 mt-2 p-3.5 bg-gradient-to-b from-white to-[#FAF9F5] dark:from-[#1E2721] dark:to-[#151D18] border border-[#0B5D3B]/30 rounded-2xl shadow-xl text-xs space-y-1.5 animate-fade-in z-20">
          <div className="flex items-center justify-between font-bold text-[#0B5D3B] dark:text-[#DDF3E7]">
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-[#D4AF37]" />
              {language === 'ar' ? 'تنبيهات توأم الذكية' : 'Twin Smart Alerts'}
            </span>
            <span className="text-[10px] text-[#778078]">{language === 'ar' ? 'الآن' : 'Just now'}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'ar'
              ? 'انضم 3 أشخاص جدد في مدينتك يشاركونك حب القهوة المقطرة V60 ولعب البادل بنسبة تطابق 95%!'
              : '3 new members in your city share your passion for V60 drip coffee and Padel at 95% match!'}
          </p>
        </div>
      )}

      {/* Main Content Feed */}
      <main className="px-5 pt-3 space-y-4">
        
        {/* User Greeting & City */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs font-semibold text-[#778078] block">
              {greeting}
            </span>
            <h1 className="text-xl font-black tracking-tight text-[#202923] dark:text-white">
              @{userProfile.username}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#0B5D3B] dark:text-[#DDF3E7] font-bold bg-gradient-to-b from-[#DDF3E7] to-[#CCEEDC] dark:from-[#0B5D3B]/30 dark:to-[#08422A]/40 px-3.5 py-1.5 rounded-full border border-white/60 dark:border-[#0B5D3B]/30 shadow-[0_3px_0_0_#B6E0C9,0_6px_10px_rgba(11,93,59,0.12)]">
            <MapPin size={13} />
            <span>{formatCity(userProfile.city, language)}</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* HERO FEATURE: Personality Fingerprint & Signature CTA Card */}
        {/* ============================================================== */}
        <OrganicFloatingCard
          className="p-5 border border-[#0B5D3B]/25"
          glowColor="rgba(212, 175, 55, 0.18)"
        >
          {/* Top Row: Fingerprint & Status */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#D4AF37]" />
                <h2 className="text-sm font-bold text-[#202923] dark:text-white">
                  {t.myFingerprint}
                </h2>
              </div>
              <p className="text-xs text-[#778078] dark:text-slate-400 mt-0.5">
                {t.fingerprintSubtitle}
              </p>
            </div>

            {/* Profile ready badge */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7] bg-gradient-to-b from-[#DDF3E7] to-[#C9EBD7] dark:bg-[#0B5D3B]/30 px-3 py-1 rounded-full shadow-2xs">
              <CheckCircle2 size={12} strokeWidth={2.5} />
              <span>{t.profileComplete}</span>
            </div>
          </div>

          {/* 
            DIMENSIONS 3D TACTILE FLOATING CARDS (as shown in image_53eff0d2.png)
            Interactive 3D capsule tiles with organic float & living floor shadow
          */}
          <div className="my-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#778078] dark:text-slate-400 block mb-1">
              {language === 'ar' ? 'أبعاد الهوية والتفضيلات' : 'Identity Dimensions'}
            </span>
            <div className="grid grid-cols-4 gap-2">
              {fingerprintKeys.map((item, i) => (
                <FloatingDimensionCard
                  key={item.key}
                  iconKey={item.key}
                  label={language === 'ar' ? item.labelAr : item.labelEn}
                  index={i}
                  isSelected={selectedDimension === i}
                  onClick={() => setSelectedDimension(selectedDimension === i ? null : i)}
                />
              ))}
            </div>
          </div>

          {/* 
            GRAND 3D TACTILE SKEUOMORPHIC "FIND MY TWIN" ACTION BUTTON
            Heavy mechanical extrusion, specular highlight sheen, and tactile haptic feedback
          */}
          <div className="relative group w-full pt-2">
            {/* Decoupled ambient floor glow shadow */}
            <div className="absolute inset-x-6 bottom-1 h-5 rounded-full bg-[#0B5D3B]/40 blur-lg pointer-events-none transition-all group-hover:scale-105 group-hover:opacity-100" />

            <button
              onClick={onFindTwin}
              className="
                relative w-full h-15 rounded-2xl
                bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26]
                text-white font-black text-base tracking-wide
                flex items-center justify-center gap-3
                border border-[#229D68]/60
                shadow-[0_8px_0_0_#052E1C,0_18px_26px_rgba(11,93,59,0.35)]
                active:translate-y-1.5 active:shadow-[0_2px_0_0_#052E1C,0_8px_14px_rgba(11,93,59,0.25)]
                transition-all duration-150 cursor-pointer overflow-hidden
              "
            >
              {/* Top specular glossy highlight sheen */}
              <div className="absolute inset-x-3 top-1 h-[40%] rounded-xl bg-gradient-to-b from-white/45 via-white/10 to-transparent pointer-events-none" />

              <Sparkles size={20} className="text-[#D4AF37] animate-pulse" />
              <span>{t.findTwinCTA}</span>
              {language === 'ar' ? (
                <ArrowLeft size={18} className="text-white" />
              ) : (
                <ArrowRight size={18} className="text-white" />
              )}
            </button>
          </div>

          <span className="block text-center text-[11px] text-[#778078] dark:text-slate-400 mt-2.5">
            {t.findTwinSub}
          </span>
        </OrganicFloatingCard>

        {/* SHARED-INTEREST HIGHLIGHT STRIP */}
        <OrganicFloatingCard
          className="p-4 bg-gradient-to-r from-[#DDF3E7] via-white to-[#DDF3E7] dark:from-[#0B5D3B]/25 dark:via-[#18221C] dark:to-[#0B5D3B]/20 border border-[#0B5D3B]/20"
          enableParallax={false}
          floatDelay={true}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#18221C] shadow-sm flex items-center justify-center shrink-0 text-[#0B5D3B]">
              <Heart size={20} className="fill-[#0B5D3B]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7] uppercase tracking-wide">
                {t.sharedHighlights}
              </h3>
              <p className="text-xs text-[#202923] dark:text-slate-300 mt-0.5 leading-relaxed">
                {t.sharedHighlightText}
              </p>
            </div>
          </div>
        </OrganicFloatingCard>

        {/* ============================================================== */}
        {/* TOP MATCHES CAROUSEL WITH ORGANIC FLOATING CARDS */}
        {/* (as shown in image_e3c7465b.png) */}
        {/* ============================================================== */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#202923] dark:text-white">
              {t.topMatchesTitle}
            </h3>
            <button
              onClick={onViewMatches}
              className="text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t.viewAllMatches}</span>
              {language === 'ar' ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
            </button>
          </div>

          <div className="flex gap-3.5 overflow-x-auto no-scrollbar py-2 px-1">
            {topMatches.map((m, idx) => (
              <FloatingMatchCard
                key={m.id}
                match={m}
                language={language}
                index={idx}
                onClick={() => onSelectMatch(m)}
              />
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* DAILY TWIN QUESTION WITH 3D TACTILE SKEUOMORPHIC PILL BUTTONS */}
        {/* (as shown in image_bbd7a6fe.png) */}
        {/* ============================================================== */}
        <OrganicFloatingCard
          className="p-5 border border-slate-200/80 dark:border-slate-800"
          glowColor="rgba(231, 58, 42, 0.12)"
        >
          {/* Title Header */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wide">
            <TrendingUp size={15} />
            <span>{t.dailyPromptTitle}</span>
          </div>

          {/* Question Text */}
          <p className="mt-2 text-sm font-bold text-[#202923] dark:text-white leading-snug">
            {t.dailyPromptQuestion}
          </p>

          {/* 3D Tactile Capsule Pill Buttons for Question Options */}
          <div className="mt-4 space-y-3">
            <TactilePillButton
              isActive={dailyChoice === 'opt1'}
              onClick={() => setDailyChoice('opt1')}
              rightBadge={dailyChoice ? '64%' : undefined}
            >
              {t.dailyOption1}
            </TactilePillButton>

            <TactilePillButton
              isActive={dailyChoice === 'opt2'}
              onClick={() => setDailyChoice('opt2')}
              rightBadge={dailyChoice ? '36%' : undefined}
            >
              {t.dailyOption2}
            </TactilePillButton>
          </div>

          {dailyChoice && (
            <p className="mt-3 text-[11px] text-[#0B5D3B] dark:text-[#DDF3E7] text-center font-bold animate-fade-in flex items-center justify-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#0B5D3B]" />
              <span>
                {language === 'ar'
                  ? 'تم تسجيل اختيارك! يشاركك في هذا الخيار 820 عضواً في مجتمع توأم.'
                  : 'Choice recorded! 820 community members shared your preference.'}
              </span>
            </p>
          )}
        </OrganicFloatingCard>

      </main>
    </div>
  );
};
