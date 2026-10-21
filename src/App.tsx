import React, { useState, useEffect, useCallback } from 'react';
import {
  ActiveScreen,
  UserProfile,
  MatchProfile,
  Language,
  ThemeMode,
  PrivacySettings,
  AvatarConfig,
} from './types';
import { TRANSLATIONS } from './i18n/translations';
import { getTopTwinMatches } from './services/matchingService';
import { saveUserProfile } from './services/profileService';
import { isSupabaseConfigured } from './lib/supabase';

// Components
import { TopBarControls } from './components/navigation/TopBar';
import { BottomTabBar } from './components/navigation/BottomTabBar';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { SignUpPreviewModal } from './components/auth/SignUpPreviewModal';
import { InteractiveOnboarding } from './components/onboarding/InteractiveOnboarding';
import { ProfileCompletionScreen } from './components/onboarding/ProfileCompletionScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { FindMyTwinExperience } from './components/matching/FindMyTwinExperience';
import { MatchesListView } from './components/matching/MatchesListView';
import { MatchDetailModal } from './components/matching/MatchDetailModal';
import { ProfileComparisonView } from './components/matching/ProfileComparisonView';
import { DiscoverScreen } from './components/discover/DiscoverScreen';
import { MyProfileScreen } from './components/profile/MyProfileScreen';
import { AvatarCustomizerModal } from './components/avatar/AvatarCustomizerModal';
import { PrivacySettingsModal } from './components/settings/PrivacySettingsModal';

const DEFAULT_AVATAR: AvatarConfig = {
  id: 'user_main',
  baseGender: 'neutral',
  skinTone: '#E0AC69',
  hairStyle: 'traditional',
  hairColor: '#1A1816',
  clothingStyle: 'thobe',
  clothingColor: '#0B5D3B',
  accessory: 'sunglasses',
  expression: 'smile',
  direction: 'center',
};

const DEFAULT_PRIVACY: PrivacySettings = {
  showCityPublicly: true,
  showGenderPublicly: false,
  showAgeRangePublicly: true,
  allowDiscoverability: true,
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_me',
  username: 'rayan_riyadh',
  city: 'Riyadh',
  gender: 'male',
  ageRange: '25-29',
  avatar: DEFAULT_AVATAR,
  answers: {
    q_vibe: 'vibe_ambitious',
    q_coffee: 'coffee_v60',
    q_food: 'food_burger',
    q_drinks: 'drink_mojito',
    q_sports: ['sport_football', 'sport_padel'],
    q_leisure: 'leisure_cafe',
    q_cars: 'car_luxury_sedan',
    q_places: 'place_cozycafe',
    q_lifestyle: 'lifestyle_nightowl',
  },
  bio: 'Specialty coffee aficionado, padel enthusiast, and urban architecture fan.',
  isCompleted: true,
  privacy: DEFAULT_PRIVACY,
};

export default function App() {
  // App Core States
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [simulateNoMatch, setSimulateNoMatch] = useState(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('twin_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Dynamic Matches State calculated by real matching engine
  const [calculatedMatches, setCalculatedMatches] = useState<MatchProfile[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // Modals & Navigation Sub-states
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isAvatarCustomizerOpen, setIsAvatarCustomizerOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<MatchProfile | null>(null);
  const [activeComparisonMatch, setActiveComparisonMatch] = useState<MatchProfile | null>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Refresh matches deterministically based on current user answers and preferences
  const refreshMatches = useCallback(async (profile: UserProfile) => {
    setIsLoadingMatches(true);
    try {
      const matches = await getTopTwinMatches(profile, 5);
      setCalculatedMatches(matches);
    } catch (e) {
      console.error('Error calculating top matches:', e);
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  // Compute matches on mount and whenever user answers change
  useEffect(() => {
    refreshMatches(userProfile);
  }, [userProfile.answers, refreshMatches]);

  // Save profile updates to localStorage & Supabase
  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  // Handle HTML dir & font syncing for True RTL / LTR
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('lang', language);
  }, [language]);

  // Handle Dark Mode Class
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      document.body.classList.remove('bg-[#F8F7F2]', 'text-[#202923]');
      document.body.classList.add('bg-[#111813]', 'text-[#F8F7F2]');
    } else {
      html.classList.remove('dark');
      document.body.classList.remove('bg-[#111813]', 'text-[#F8F7F2]');
      document.body.classList.add('bg-[#F8F7F2]', 'text-[#202923]');
    }
  }, [theme]);

  // Current active twin match for the high-five reveal
  const currentTwinMatch = simulateNoMatch || calculatedMatches.length === 0
    ? null
    : calculatedMatches[currentMatchIndex % calculatedMatches.length];

  // Handlers
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleOnboardingComplete = (answers: Record<string, string | string[]>) => {
    const updated = {
      ...userProfile,
      answers,
      isCompleted: true,
    };
    setUserProfile(updated);
    refreshMatches(updated);
    setActiveScreen('profile_completion');
  };

  const handleStartSignUpFlow = () => {
    setIsSignUpModalOpen(true);
  };

  const handleSignUpComplete = (username: string, city: string) => {
    const updated = {
      ...userProfile,
      username,
      city,
    };
    setUserProfile(updated);
    setIsSignUpModalOpen(false);
    setActiveScreen('onboarding');
  };

  const handleOpenComparison = (match: MatchProfile) => {
    setActiveComparisonMatch(match);
    setActiveScreen('comparison');
  };

  const handleNextTwinMatch = () => {
    if (calculatedMatches.length > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % calculatedMatches.length);
    }
  };

  // Determine if bottom navigation should be visible
  const showBottomNav =
    activeScreen === 'home' ||
    activeScreen === 'discover' ||
    activeScreen === 'matches' ||
    activeScreen === 'profile';

  return (
    <div className="min-h-screen bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] transition-colors flex flex-col justify-between">
      {/* Top Bar Quick Switcher (Language, Theme, and Match Simulation) */}
      <TopBarControls
        language={language}
        onToggleLanguage={handleToggleLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        simulateNoMatch={simulateNoMatch}
        onToggleSimulateNoMatch={() => setSimulateNoMatch(!simulateNoMatch)}
      />

      {/* Main Screen Switcher */}
      <div className="flex-1 w-full max-w-md mx-auto">
        {/* 1. Welcome Screen */}
        {activeScreen === 'welcome' && (
          <WelcomeScreen
            language={language}
            onStart={handleStartSignUpFlow}
            onExplore={() => setActiveScreen('discover')}
          />
        )}

        {/* 2. Interactive Personality Onboarding */}
        {activeScreen === 'onboarding' && (
          <InteractiveOnboarding
            initialAnswers={userProfile.answers}
            language={language}
            onComplete={handleOnboardingComplete}
            onExit={() => setActiveScreen('home')}
          />
        )}

        {/* 3. Profile Completion Celebration Milestone */}
        {activeScreen === 'profile_completion' && (
          <ProfileCompletionScreen
            userProfile={userProfile}
            language={language}
            onFindTwin={() => setActiveScreen('find_twin')}
            onGoHome={() => setActiveScreen('home')}
          />
        )}

        {/* 4. Home Screen */}
        {activeScreen === 'home' && (
          <HomeScreen
            userProfile={userProfile}
            topMatches={calculatedMatches}
            language={language}
            onFindTwin={() => setActiveScreen('find_twin')}
            onViewMatches={() => setActiveScreen('matches')}
            onEditProfile={() => setActiveScreen('profile')}
            onSelectMatch={(m) => setSelectedMatchForDetail(m)}
          />
        )}

        {/* 5. The Signature Experience: FIND MY TWIN */}
        {activeScreen === 'find_twin' && (
          <FindMyTwinExperience
            userProfile={userProfile}
            match={currentTwinMatch}
            language={language}
            reducedMotion={reducedMotion}
            onOpenComparison={handleOpenComparison}
            onClose={() => setActiveScreen('home')}
            onNextMatch={handleNextTwinMatch}
          />
        )}

        {/* 6. Top 5 Matches Screen */}
        {activeScreen === 'matches' && (
          <MatchesListView
            matches={calculatedMatches}
            language={language}
            onSelectMatch={(m) => setSelectedMatchForDetail(m)}
            onCompareMatch={handleOpenComparison}
            onFindTwinCTA={() => setActiveScreen('find_twin')}
          />
        )}

        {/* 7. Dedicated Profile Comparison Screen */}
        {activeScreen === 'comparison' && activeComparisonMatch && (
          <ProfileComparisonView
            userProfile={userProfile}
            match={activeComparisonMatch}
            language={language}
            onBack={() => setActiveScreen('matches')}
          />
        )}

        {/* 8. Discover Screen */}
        {activeScreen === 'discover' && (
          <DiscoverScreen
            matches={calculatedMatches}
            language={language}
            onSelectMatch={(m) => setSelectedMatchForDetail(m)}
            onCompareMatch={handleOpenComparison}
          />
        )}

        {/* 9. My Profile Screen */}
        {activeScreen === 'profile' && (
          <MyProfileScreen
            userProfile={userProfile}
            language={language}
            onOpenAvatarCustomizer={() => setIsAvatarCustomizerOpen(true)}
            onOpenPrivacySettings={() => setIsPrivacyModalOpen(true)}
            onRetakeOnboarding={() => setActiveScreen('onboarding')}
          />
        )}
      </div>

      {/* Persistent Bottom Tab Bar */}
      {showBottomNav && (
        <BottomTabBar
          activeScreen={activeScreen}
          onNavigate={(screen) => {
            if (screen === 'find_twin') {
              setActiveScreen('find_twin');
            } else {
              setActiveScreen(screen);
            }
          }}
          language={language}
        />
      )}

      {/* Global Modals */}
      {/* Sign-Up & Phone Preview Modal */}
      <SignUpPreviewModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onComplete={handleSignUpComplete}
        language={language}
      />

      {/* Avatar Customizer Modal */}
      <AvatarCustomizerModal
        avatar={userProfile.avatar}
        isOpen={isAvatarCustomizerOpen}
        onClose={() => setIsAvatarCustomizerOpen(false)}
        onSave={(newAvatar) => setUserProfile((prev) => ({ ...prev, avatar: newAvatar }))}
        language={language}
      />

      {/* Privacy Settings Modal */}
      <PrivacySettingsModal
        privacy={userProfile.privacy}
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onSave={(newPrivacy) => setUserProfile((prev) => ({ ...prev, privacy: newPrivacy }))}
        language={language}
      />

      {/* Match Detail Quick Modal */}
      <MatchDetailModal
        match={selectedMatchForDetail}
        isOpen={Boolean(selectedMatchForDetail)}
        onClose={() => setSelectedMatchForDetail(null)}
        onCompare={handleOpenComparison}
        language={language}
      />
    </div>
  );
}
