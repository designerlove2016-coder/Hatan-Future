import React from 'react';
import { MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { OrganicFloatingCard } from '../common/OrganicFloatingCard';
import { SpringTiltCard } from '../common/SpringTiltCard';
import { formatInterest, formatCity } from '../../utils/localization';
import { Sparkles, Layers, ArrowRight, ArrowLeft } from 'lucide-react';

interface MatchesListViewProps {
  matches: MatchProfile[];
  language: Language;
  onSelectMatch: (match: MatchProfile) => void;
  onCompareMatch: (match: MatchProfile) => void;
  onFindTwinCTA: () => void;
}

export const MatchesListView: React.FC<MatchesListViewProps> = ({
  matches,
  language,
  onSelectMatch,
  onCompareMatch,
  onFindTwinCTA,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#080D0A] text-[#202923] dark:text-[#F8F7F2] pb-28 transition-colors">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#202923] dark:text-white">
              {t.topMatchesTitle}
            </h1>
            <p className="text-xs text-[#778078] dark:text-slate-400 mt-1">
              {t.topMatchesSubtitle}
            </p>
          </div>

          {/* 3D Tactile Find Twin CTA Pill Button */}
          <button
            onClick={onFindTwinCTA}
            className="
              relative px-4 py-2 rounded-full
              bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26]
              text-white text-xs font-bold
              border border-[#34D399]/50
              shadow-[0_4px_0_0_#052E1C,0_8px_16px_rgba(11,93,59,0.35)]
              active:translate-y-1 active:shadow-[0_1px_0_0_#052E1C]
              flex items-center gap-1.5 shrink-0 cursor-pointer overflow-hidden
            "
          >
            <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-full bg-gradient-to-b from-white/60 via-white/15 to-transparent pointer-events-none" />
            <Sparkles size={14} className="text-[#D4AF37] relative z-10 animate-pulse" />
            <span className="relative z-10">{t.findTwinCTA}</span>
          </button>
        </div>
      </div>

      {/* Matches Stack with Organic Floating Cards & 3D Parallax Tilt */}
      <main className="px-5 space-y-4 mt-2">
        {matches.map((match, index) => {
          const isTopOne = index === 0;

          return (
            <OrganicFloatingCard
              key={match.id}
              className={`p-4 transition-all duration-200 ${
                isTopOne
                  ? 'border-2 border-[#0B5D3B] dark:border-[#10b981] ring-4 ring-[#0B5D3B]/10'
                  : 'border border-slate-200/80 dark:border-slate-800'
              }`}
              glowColor={isTopOne ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 93, 59, 0.12)'}
              floatDelay={index % 2 === 1}
            >
              {/* Card Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => onSelectMatch(match)}
                >
                  <div className="relative">
                    <AvatarRenderer avatar={match.avatar} size={58} direction="center" />
                    {isTopOne && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-white text-[10px] flex items-center justify-center font-bold shadow-xs">
                        ★
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-sm font-bold text-[#202923] dark:text-white truncate">
                        @{match.username}
                      </h2>
                      {isTopOne && (
                        <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[9px] font-black text-[#B8961D] dark:text-[#F3D768] uppercase tracking-wider">
                          {language === 'ar' ? 'شبيهك #1' : '#1 TWIN'}
                        </span>
                      )}
                    </div>
                    {/* Localized metadata */}
                    <div className="flex items-center gap-1.5 text-xs text-[#778078] dark:text-slate-400 mt-0.5">
                      <span>{formatCity(match.city, language)}</span>
                      {match.ageRange && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{match.ageRange}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Similarity Score 3D Capsule Pillar */}
                <div className="flex flex-col items-end shrink-0">
                  <div className="px-3 py-1 rounded-2xl bg-gradient-to-b from-[#DDF3E7] to-[#CCEEDC] dark:from-[#0B5D3B]/40 dark:to-[#08422A]/50 border border-white/80 dark:border-[#0B5D3B]/30 shadow-[0_3px_0_0_#A8D5C0] dark:shadow-[0_3px_0_0_#052A1A] flex flex-col items-center">
                    <span className="text-lg font-black text-[#0B5D3B] dark:text-[#10b981] font-mono tabular-nums leading-none">
                      {match.similarityScore}%
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#0B5D3B] dark:text-[#DDF3E7] mt-0.5">
                      {language === 'ar' ? 'تطابق' : 'Overlap'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shared Interests Ceramic Micro-Capsule Row with React-Spring physical response */}
              <div className="mt-3.5 flex flex-wrap gap-2">
                {match.sharedInterests.slice(0, 3).map((tag, i) => (
                  <SpringTiltCard key={i} maxTilt={10} scaleOnHover={1.05}>
                    <span
                      className="
                        inline-block px-3 py-1 rounded-full
                        bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4]
                        dark:from-[#243028] dark:to-[#19221C]
                        text-[#0B5D3B] dark:text-[#DDF3E7] text-[11px] font-bold
                        border border-white/80 dark:border-white/10
                        shadow-[0_2px_0_0_#D5CEBE] dark:shadow-[0_2px_0_0_#0F1511]
                      "
                    >
                      {formatInterest(tag, language)}
                    </span>
                  </SpringTiltCard>
                ))}
                {match.sharedInterests.length > 3 && (
                  <span className="px-2 py-1 text-[11px] text-[#778078] font-bold self-center">
                    +{match.sharedInterests.length - 3}
                  </span>
                )}
              </div>

              {/* Action Buttons: 3D Tactile Compare Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectMatch(match)}
                  className="text-xs font-bold text-[#778078] dark:text-slate-300 hover:text-[#0B5D3B] transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'عرض النبذة' : 'View Bio'}
                </button>

                <button
                  onClick={() => onCompareMatch(match)}
                  className="
                    relative min-h-[44px] px-4 py-2 rounded-2xl
                    bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26]
                    text-white text-xs font-bold
                    border border-[#34D399]/50
                    shadow-[0_4px_0_0_#052E1C,0_8px_16px_rgba(11,93,59,0.3)]
                    active:translate-y-1 active:shadow-[0_1px_0_0_#052E1C]
                    flex items-center gap-2 cursor-pointer overflow-hidden
                  "
                >
                  <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/60 via-white/15 to-transparent pointer-events-none" />
                  <Layers size={15} className="relative z-10" />
                  <span className="relative z-10">{t.comparePersonalities}</span>
                  {language === 'ar' ? (
                    <ArrowLeft size={14} className="relative z-10" />
                  ) : (
                    <ArrowRight size={14} className="relative z-10" />
                  )}
                </button>
              </div>
            </OrganicFloatingCard>
          );
        })}
      </main>
    </div>
  );
};
