import React, { useState } from 'react';
import { MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { RealisticIcon } from '../common/RealisticIcon';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { OrganicFloatingCard } from '../common/OrganicFloatingCard';
import { formatCity, formatInterest } from '../../utils/localization';
import { Sparkles, MapPin, Layers, ArrowLeft, ArrowRight } from 'lucide-react';

interface DiscoverScreenProps {
  matches: MatchProfile[];
  language: Language;
  onSelectMatch: (match: MatchProfile) => void;
  onCompareMatch: (match: MatchProfile) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  matches,
  language,
  onSelectMatch,
  onCompareMatch,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedTribe, setSelectedTribe] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const tribes = [
    { id: 'all', labelEn: 'All Tribes', labelAr: 'كل الفئات', icon: 'place_cozycafe' },
    { id: 'v60', labelEn: 'V60 Aficionados', labelAr: 'عشاق V60', icon: 'coffee_v60' },
    { id: 'padel', labelEn: 'Padel Warriors', labelAr: 'أبطال البادل', icon: 'sport_padel' },
    { id: 'tech', labelEn: 'Gamers & Tech', labelAr: 'التقنية والألعاب', icon: 'sport_gaming' },
    { id: 'kashta', labelEn: 'Desert Explorers', labelAr: 'أهل البر والكشتات', icon: 'leisure_kashta' },
  ];

  const cities = ['all', 'Riyadh', 'Jeddah', 'Dubai', 'Khobar', 'Doha'];

  // Filter matches based on selected tribe and city
  const filteredMatches = matches.filter((m) => {
    if (selectedCity !== 'all' && m.city !== selectedCity) return false;
    if (selectedTribe === 'v60') return m.sharedInterests.some((s) => s.toLowerCase().includes('v60'));
    if (selectedTribe === 'padel') return m.sharedInterests.some((s) => s.toLowerCase().includes('padel'));
    if (selectedTribe === 'tech') return m.sharedInterests.some((s) => s.toLowerCase().includes('gaming'));
    if (selectedTribe === 'kashta') return m.sharedInterests.some((s) => s.toLowerCase().includes('kashta') || s.toLowerCase().includes('desert'));
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] pb-28 transition-colors">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-bold tracking-tight text-[#202923] dark:text-white">
          {language === 'ar' ? 'استكشف مجتمعات الاهتمامات' : 'Explore Personality Tribes'}
        </h1>
        <p className="text-xs text-[#778078] dark:text-slate-400 mt-1">
          {language === 'ar'
            ? 'تصفح الأعضاء حسب الاهتمام المشترك والمدينة والتقارب'
            : 'Browse community members by specific passions and regional hubs'}
        </p>
      </div>

      {/* Horizontal Tribe Filter with 3D Tactile Capsule Pills */}
      <div className="px-5 py-2">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
          {tribes.map((tribe) => {
            const active = selectedTribe === tribe.id;
            return (
              <button
                key={tribe.id}
                onClick={() => setSelectedTribe(tribe.id)}
                className={`
                  relative min-h-[46px] px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold whitespace-nowrap
                  transition-all duration-150 transform-gpu active:translate-y-1 cursor-pointer overflow-hidden
                  ${
                    active
                      ? 'bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26] text-white border border-[#34D399]/60 shadow-[0_5px_0_0_#052E1C,0_10px_16px_rgba(11,93,59,0.3)] active:shadow-[0_1px_0_0_#052E1C]'
                      : 'bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4] dark:from-[#222C24] dark:to-[#171E19] text-[#202923] dark:text-[#F8F7F2] border border-white/90 dark:border-white/10 shadow-[0_4px_0_0_#D3CBB9,0_8px_14px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_0_0_#0D130F] active:shadow-[0_1px_0_0_#D3CBB9]'
                  }
                `}
              >
                {/* Top specular highlight sheen */}
                <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-full bg-gradient-to-b from-white/70 via-white/15 to-transparent pointer-events-none" />
                <div className="w-5 h-5 flex items-center justify-center relative z-10 shrink-0">
                  <RealisticIcon name={tribe.icon} size={20} />
                </div>
                <span className="relative z-10">{language === 'ar' ? tribe.labelAr : tribe.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* City Chips Filter with 3D Micro-Capsules */}
      <div className="px-5 py-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-bold text-[#778078] uppercase shrink-0">
            {language === 'ar' ? 'المدينة:' : 'City:'}
          </span>
          {cities.map((city) => {
            const active = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 transform-gpu active:translate-y-0.5 cursor-pointer
                  ${
                    active
                      ? 'bg-gradient-to-b from-[#DDF3E7] to-[#CCEEDC] dark:from-[#0B5D3B]/40 dark:to-[#08422A]/50 text-[#0B5D3B] dark:text-[#DDF3E7] border border-white/80 dark:border-[#0B5D3B]/30 shadow-[0_2px_0_0_#A8D5C0]'
                      : 'bg-white/80 dark:bg-white/5 text-[#778078] dark:text-slate-400 hover:text-[#202923] border border-slate-200/60 dark:border-slate-800'
                  }
                `}
              >
                {city === 'all' ? (language === 'ar' ? 'الكل' : 'All') : formatCity(city, language)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Matches Stream with Organic Floating Cards */}
      <main className="px-5 space-y-4 mt-2">
        {filteredMatches.map((match, idx) => (
          <OrganicFloatingCard
            key={match.id}
            className="p-4 border border-slate-200/80 dark:border-slate-800"
            floatDelay={idx % 2 === 1}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                onClick={() => onSelectMatch(match)}
              >
                <AvatarRenderer avatar={match.avatar} size={54} direction="center" />
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-[#202923] dark:text-white truncate">
                    @{match.username}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-[#778078] dark:text-slate-400 mt-0.5">
                    <MapPin size={12} className="text-[#0B5D3B]" />
                    <span>{formatCity(match.city, language)}</span>
                    <span>·</span>
                    <span>{match.ageRange}</span>
                  </div>
                </div>
              </div>

              {/* Match Score Capsule */}
              <div className="px-3 py-1 rounded-2xl bg-gradient-to-b from-[#DDF3E7] to-[#CCEEDC] dark:from-[#0B5D3B]/40 dark:to-[#08422A]/50 text-[#0B5D3B] dark:text-[#DDF3E7] text-xs font-black font-mono shadow-[0_3px_0_0_#A8D5C0] dark:shadow-[0_3px_0_0_#052A1A]">
                {match.similarityScore}%
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7] truncate max-w-[180px]">
                {match.sharedInterests.slice(0, 2).map((i) => formatInterest(i, language)).join(' · ')}
              </span>

              <button
                onClick={() => onCompareMatch(match)}
                className="
                  relative px-3.5 py-1.5 rounded-xl
                  bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26]
                  text-white text-xs font-bold
                  border border-[#34D399]/50
                  shadow-[0_3px_0_0_#052E1C,0_6px_12px_rgba(11,93,59,0.25)]
                  active:translate-y-0.5 active:shadow-[0_1px_0_0_#052E1C]
                  flex items-center gap-1.5 cursor-pointer overflow-hidden
                "
              >
                <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/60 via-white/15 to-transparent pointer-events-none" />
                <Layers size={13} className="relative z-10" />
                <span className="relative z-10">{t.comparePersonalities}</span>
              </button>
            </div>
          </OrganicFloatingCard>
        ))}
      </main>
    </div>
  );
};
