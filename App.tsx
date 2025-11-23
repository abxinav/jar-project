import React, { useState, useEffect } from 'react';
import { AppView, HabitCategory, UserProfile } from './types';
import { HABITS, MOCK_USERS, WEEKDAYS } from './constants';
import { polishPitch, generateCompatibility } from './services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Activity, 
  BookOpen, 
  Mountain, 
  PenTool, 
  Dumbbell, 
  Smile, 
  ArrowRight,
  X,
  Zap,
  Shield,
  Calendar,
  Clock,
  MapPin,
  Flame,
  Ghost,
  ChevronRight
} from 'lucide-react';

// --- Icons Map ---
const ICON_MAP: Record<string, any> = {
  [HabitCategory.RUNNING]: Activity,
  [HabitCategory.READING]: BookOpen,
  [HabitCategory.HIKING]: Mountain,
  [HabitCategory.WRITING]: PenTool,
  [HabitCategory.LIFTING]: Dumbbell,
  [HabitCategory.MEDITATION]: Smile,
  'Yoga': Smile, // Fallback
  'Coding': Zap, // Fallback
};

const INTEGRATION_OPTIONS = [
  { id: 'strava', name: 'Strava', subtitle: 'Sync last 7 rides, weekly mileage', icon: '🏃', color: 'bg-[#FC4C02]' },
  { id: 'goodreads', name: 'Goodreads', subtitle: 'Current reads & yearly challenge', icon: '📚', color: 'bg-[#553b08]' },
  { id: 'alltrails', name: 'AllTrails', subtitle: 'Recent hikes & elevation gain', icon: '🌲', color: 'bg-[#428a13]' },
  { id: 'duolingo', name: 'Duolingo', subtitle: 'Daily streak & XP progress', icon: '🦉', color: 'bg-[#58cc02]' },
  { id: 'chess', name: 'Chess.com', subtitle: 'Rapid rating & puzzle score', icon: '♟️', color: 'bg-[#312e2b]' },
  { id: 'ravelry', name: 'Ravelry', subtitle: 'Current WIPs & stash status', icon: '🧶', color: 'bg-[#ee6e73]' },
  { id: 'letterboxd', name: 'Letterboxd', subtitle: 'Recent watches & reviews', icon: '🎬', color: 'bg-[#00e054]' },
];

// --- Shared Components ---

const Button = ({ onClick, children, variant = 'primary', className = '' }: { onClick?: () => void, children?: React.ReactNode, variant?: 'primary' | 'outline' | 'ghost', className?: string }) => {
  const baseStyle = "h-14 rounded-full font-medium text-[17px] transition-all duration-200 active:scale-95 flex items-center justify-center px-8";
  const variants = {
    primary: "bg-[#0066FF] text-white shadow-lg shadow-blue-500/20 hover:bg-[#0052cc]",
    outline: "border border-[#0066FF] text-[#0066FF] bg-transparent hover:bg-blue-50",
    ghost: "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- Onboarding Steps ---

const Step1_Habit = ({ onNext }: { onNext: (habit: HabitCategory) => void }) => {
  const [selected, setSelected] = useState<HabitCategory | null>(null);

  return (
    <div className="flex flex-col h-full px-6 pt-12 pb-8 max-w-md mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[40px] font-medium leading-[1.1] tracking-tight mb-3 text-gray-900 dark:text-white">
          What habit are you building?
        </h1>
        <p className="text-[17px] text-gray-500 dark:text-gray-400 mb-10">
          We’ll find someone to keep you consistent.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto no-scrollbar pb-8">
        {HABITS.map((habit, idx) => {
          const Icon = ICON_MAP[habit.id] || Activity;
          const isSelected = selected === habit.id;
          return (
            <motion.button
              key={habit.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelected(habit.id)}
              className={`
                relative h-32 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300
                ${isSelected 
                  ? 'bg-white dark:bg-[#171717] ring-2 ring-[#00C853] shadow-glow' 
                  : 'bg-white dark:bg-[#171717] hover:bg-gray-50 dark:hover:bg-[#1F1F1F] shadow-sm'}
              `}
            >
              <Icon size={32} className={isSelected ? 'text-[#00C853]' : 'text-gray-900 dark:text-white'} strokeWidth={1.5} />
              <span className={`text-[17px] font-medium ${isSelected ? 'text-[#00C853]' : 'text-gray-900 dark:text-white'}`}>
                {habit.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <Button 
        onClick={() => selected && onNext(selected)} 
        className={`w-full transition-opacity duration-300 ${selected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        Continue
      </Button>
    </div>
  );
};

const Step2_Schedule = ({ onNext }: { onNext: () => void }) => {
  const [days, setDays] = useState<boolean[]>(Array(7).fill(false));

  const toggleDay = (index: number) => {
    const newDays = [...days];
    newDays[index] = !newDays[index];
    setDays(newDays);
  };

  return (
    <div className="flex flex-col h-full px-6 pt-12 pb-8 max-w-md mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[40px] font-medium leading-[1.1] tracking-tight mb-3 text-gray-900 dark:text-white">
          When are you available?
        </h1>
        <p className="text-[17px] text-gray-500 dark:text-gray-400 mb-12">
          Sync schedules to find your perfect slot.
        </p>
      </motion.div>

      <div className="flex justify-between mb-12">
        {WEEKDAYS.map((day, i) => (
          <button
            key={i}
            onClick={() => toggleDay(i)}
            className={`
              w-10 h-14 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-300
              ${days[i] 
                ? 'bg-[#00C853] text-white shadow-glow' 
                : 'bg-white dark:bg-[#171717] text-gray-400 dark:text-gray-500'}
            `}
          >
            <span className="text-[13px] font-medium">{day}</span>
            {days[i] && <div className="w-1 h-1 bg-white rounded-full" />}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#171717] p-6 rounded-2xl mb-auto shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-900 dark:text-white font-medium">Time Window</span>
          <span className="text-[#00C853]">6:00 AM – 9:00 AM</span>
        </div>
        <div className="h-1 bg-gray-100 dark:bg-[#2A2A2A] rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-[#00C853] w-1/3 ml-12 rounded-full" />
        </div>
        <div className="flex justify-between mt-2 text-[13px] text-gray-400">
          <span>4 AM</span>
          <span>12 PM</span>
        </div>
      </div>

      <Button onClick={onNext} className="w-full">
        Confirm Schedule
      </Button>
    </div>
  );
};

const IntegrationCard: React.FC<{ option: any, isConnected: boolean, onToggle: () => void }> = ({ option, isConnected, onToggle }) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    className={`
      flex items-center p-4 rounded-[16px] mb-3 transition-all duration-300
      bg-white dark:bg-[#171717] shadow-sm border border-transparent
      ${isConnected ? 'border-[#00C853]/20 shadow-glow' : ''}
    `}
  >
    <div className={`
      w-12 h-12 rounded-xl flex items-center justify-center text-xl mr-4 shrink-0
      ${isConnected ? 'bg-[#00C853]/10' : 'bg-gray-100 dark:bg-[#2A2A2A]'}
    `}>
      {option.icon}
    </div>
    
    <div className="flex-1 mr-4 min-w-0">
      <h3 className="text-[17px] font-medium text-gray-900 dark:text-white truncate">
        {option.name}
      </h3>
      <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate">
        {option.subtitle}
      </p>
    </div>

    <button
      onClick={onToggle}
      className={`
        h-8 px-4 rounded-full text-[13px] font-medium transition-all duration-300 flex items-center gap-1.5
        ${isConnected 
          ? 'bg-[#00C853]/10 text-[#00C853]' 
          : 'border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white'}
      `}
    >
      {isConnected && <Check size={12} strokeWidth={3} />}
      {isConnected ? 'Connected' : 'Connect'}
    </button>
  </motion.div>
);

const Step3_Manifesto = ({ onComplete }: { onComplete: () => void }) => {
  const [bio, setBio] = useState('');
  const [connections, setConnections] = useState<string[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);

  const toggleConnection = (id: string) => {
    setConnections(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handlePolish = async () => {
    if (!bio) return;
    setIsPolishing(true);
    const polished = await polishPitch(bio, "Running");
    setBio(polished);
    setIsPolishing(false);
  };

  return (
    <div className="flex flex-col h-full px-0 pt-12 w-full max-w-md mx-auto relative">
      <div className="px-6 mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-[40px] font-medium leading-[1.1] tracking-tight mb-8 text-gray-900 dark:text-white"
        >
          Your Pitch
        </motion.h1>

        {/* Photo Placeholder */}
        <div className="flex gap-4 mb-8 items-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-[#222] flex items-center justify-center text-gray-400">
             <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600" />
          </div>
          <div className="flex-1">
             <div className="text-[15px] font-medium text-[#0066FF]">Upload Photo</div>
             <div className="text-[13px] text-gray-500 mt-1">Show your face, not your avatar.</div>
          </div>
        </div>

        <div className="relative mb-10">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="I’m looking for someone who..."
            className="w-full bg-transparent text-[24px] leading-tight text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 outline-none resize-none h-32"
          />
          <div className="absolute bottom-0 right-0">
             <button 
               onClick={handlePolish}
               disabled={isPolishing || !bio}
               className="flex items-center gap-1.5 text-[#0066FF] text-[13px] font-medium disabled:opacity-50"
             >
               {isPolishing ? <div className="animate-spin">✨</div> : '✨'} Polish with AI
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 dark:bg-[#0D0D0D] rounded-t-[32px] pt-8 px-6 pb-24 overflow-y-auto border-t border-gray-100 dark:border-none shadow-premium">
        <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-6 ml-1">
          Connect Integrations
        </h2>
        
        <div className="flex flex-col gap-1">
          {INTEGRATION_OPTIONS.map((option, idx) => (
             <IntegrationCard 
               key={option.id}
               option={option}
               isConnected={connections.includes(option.id)}
               onToggle={() => toggleConnection(option.id)}
             />
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-6 right-6">
        <Button onClick={onComplete} className="w-full shadow-2xl">
          Start Looking
        </Button>
      </div>
    </div>
  );
};

// --- Main Views ---

const ProfileSheet = ({ user, onClose }: { user: UserProfile, onClose: () => void }) => {
  if (!user) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#1C1C1E] mt-12 rounded-t-[32px] overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
    >
      {/* Handle */}
      <div className="w-full h-8 flex items-center justify-center shrink-0" onClick={onClose}>
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 mt-2">
          <div>
            <h2 className="text-[32px] font-medium text-gray-900 dark:text-white leading-tight">
              {user.name}, {user.age}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
               <MapPin size={14} />
               <span className="text-[15px]">{user.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#2C2C2E] px-3 py-1.5 rounded-full">
              <Ghost size={14} className="text-gray-400" />
              <span className="text-[13px] font-medium text-gray-900 dark:text-white">{user.ghostScore}%</span>
            </div>
            <span className="text-[11px] text-gray-400 mt-1">Reliability</span>
          </div>
        </div>

        {/* Shared Schedule Visualization */}
        <div className="mb-8">
           <div className="flex items-center justify-between mb-3">
             <h3 className="text-[17px] font-medium text-gray-900 dark:text-white">Schedule Overlap</h3>
             <span className="text-[13px] text-[#00C853]">94% Match</span>
           </div>
           <div className="flex justify-between p-4 bg-gray-50 dark:bg-[#2C2C2E] rounded-2xl">
              {WEEKDAYS.map((day, i) => {
                 const isShared = user.schedule[i]; // assuming mock matches user for now
                 return (
                   <div key={i} className="flex flex-col items-center gap-2">
                     <span className="text-[11px] text-gray-400">{day}</span>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                       isShared 
                        ? 'bg-[#00C853] shadow-glow text-white' 
                        : 'bg-gray-200 dark:bg-[#3A3A3C] text-transparent'
                     }`}>
                       {isShared && <Check size={14} strokeWidth={3} />}
                     </div>
                   </div>
                 )
              })}
           </div>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <h3 className="text-[17px] font-medium text-gray-900 dark:text-white mb-3">Manifesto</h3>
          <p className="text-[17px] leading-relaxed text-gray-600 dark:text-gray-300">
            "{user.bio}"
          </p>
        </div>

        {/* Integrations */}
        <div className="space-y-3">
           <h3 className="text-[17px] font-medium text-gray-900 dark:text-white mb-1">Synced Data</h3>
           {user.integrations.map((integ, i) => (
             <div key={i} className="flex items-center p-4 bg-gray-50 dark:bg-[#2C2C2E] rounded-2xl">
                <span className="text-2xl mr-4">{integ.icon}</span>
                <div>
                   <div className="text-[15px] font-medium text-gray-900 dark:text-white">{integ.name}</div>
                   <div className="text-[13px] text-gray-500 dark:text-gray-400">{integ.dataPreview}</div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-[#1C1C1E] border-t border-gray-100 dark:border-[#2C2C2E]">
        <div className="flex gap-4 h-14">
          <button 
             onClick={onClose}
             className="flex-1 rounded-full font-medium text-[17px] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2C2C2E] transition-colors"
          >
            Keep Looking
          </button>
          <button className="flex-1 bg-[#0066FF] text-white rounded-full font-medium text-[17px] shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
            Send Request
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FocusFeed = ({ users }: { users: UserProfile[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const user = users[currentIndex];

  const nextUser = () => {
    setCurrentIndex((prev) => (prev + 1) % users.length);
  };

  return (
    <div className="relative h-[100dvh] w-full bg-[#F9F9F9] dark:bg-[#0D0D0D] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={user.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-full w-full flex flex-col"
        >
          {/* Full Bleed Image with Premium Vignette */}
          <div className="absolute inset-0 z-0">
            <img 
              src={user.photoUrl} 
              alt={user.name} 
              className="w-full h-full object-cover grayscale-[20%]" 
            />
            {/* Gradient Overlay - Light Mode: White to Transparent, Dark Mode: Black to Transparent */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#F9F9F9] dark:to-[#0D0D0D] opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F9F9F9] via-[#F9F9F9]/60 to-transparent dark:from-[#0D0D0D] dark:via-[#0D0D0D]/80 dark:to-transparent h-[60%] mt-auto" />
          </div>

          {/* Active Status Indicator */}
          <div className="absolute top-14 right-6 z-10 flex items-center gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <div className="w-2 h-2 bg-[#00C853] rounded-full animate-pulse shadow-[0_0_8px_#00C853]" />
            <span className="text-[11px] font-medium text-white tracking-wide uppercase">Active Now</span>
          </div>

          {/* Main Content Content */}
          <div className="relative z-10 mt-auto px-6 pb-12 flex flex-col items-start w-full">
            
            {/* Habit Pill */}
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#171717] rounded-full shadow-premium border border-gray-100 dark:border-[#2A2A2A]">
               {React.createElement(ICON_MAP[user.habit], { size: 16, className: "text-[#00C853]" })}
               <span className="text-[13px] font-semibold tracking-wide text-gray-900 dark:text-white uppercase">
                 {user.habit} Partner
               </span>
            </div>

            {/* Name & Vibe Line */}
            <div className="mb-4">
              <h1 className="text-[48px] font-medium leading-none text-gray-900 dark:text-white tracking-tight mb-2">
                {user.name}
              </h1>
              <p className="text-[17px] text-gray-600 dark:text-gray-400 flex items-center gap-2">
                 <span className="font-medium">{user.location}</span>
                 <span className="w-1 h-1 rounded-full bg-gray-400" />
                 <span>Runs 6:30–8:00 AM</span>
              </p>
            </div>

            {/* The Quote */}
            <blockquote className="text-[26px] leading-[1.2] font-normal text-gray-800 dark:text-gray-200 mb-8 max-w-[90%]">
              “{user.bio}”
            </blockquote>

            {/* Integration Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {user.integrations.map((int) => (
                <div key={int.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-[#171717]/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-[#333]">
                   <span className="text-[12px]">{int.icon}</span>
                   <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                     {int.name}
                     {int.dataPreview && <span className="text-gray-400 dark:text-gray-500 mx-1">·</span>}
                     <span className="text-gray-500 dark:text-gray-400 font-normal truncate max-w-[120px] inline-block align-bottom">{int.dataPreview?.split('·')[0]}</span>
                   </span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-[#171717]/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-[#333]">
                 <Flame size={12} className="text-[#00C853]" fill="#00C853" />
                 <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                    {user.streak} day streak
                 </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="w-full flex justify-end items-end">
               <motion.button 
                 whileTap={{ scale: 0.9 }}
                 onClick={() => setShowProfile(true)}
                 className="w-16 h-16 rounded-full bg-white dark:bg-[#171717] shadow-premium flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222] transition-colors"
               >
                  <ArrowRight size={28} strokeWidth={1.5} />
               </motion.button>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setShowProfile(false)}
               className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <ProfileSheet user={user} onClose={() => setShowProfile(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [view, setView] = useState<AppView>(AppView.ONBOARDING);
  const [onboardingStep, setOnboardingStep] = useState(1);

  const handleOnboardingComplete = () => {
    setView(AppView.FEED);
  };

  return (
    <div className="w-full h-[100dvh] bg-[#F9F9F9] dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-white font-sans overflow-hidden selection:bg-[#00C853] selection:text-white">
      {view === AppView.ONBOARDING && (
        <div className="h-full w-full flex flex-col">
           {/* Simple Progress Header */}
           <div className="px-6 pt-6 flex justify-center">
              <div className="flex gap-2">
                 {[1,2,3].map(step => (
                    <div 
                      key={step} 
                      className={`h-1 rounded-full transition-all duration-500 ${step <= onboardingStep ? 'w-8 bg-[#00C853]' : 'w-2 bg-gray-200 dark:bg-[#333]'}`} 
                    />
                 ))}
              </div>
           </div>

           <div className="flex-1 overflow-hidden">
             <AnimatePresence mode="wait">
               {onboardingStep === 1 && (
                 <motion.div key="step1" className="h-full" exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                   <Step1_Habit onNext={() => setOnboardingStep(2)} />
                 </motion.div>
               )}
               {onboardingStep === 2 && (
                 <motion.div key="step2" className="h-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                   <Step2_Schedule onNext={() => setOnboardingStep(3)} />
                 </motion.div>
               )}
               {onboardingStep === 3 && (
                 <motion.div key="step3" className="h-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                   <Step3_Manifesto onComplete={handleOnboardingComplete} />
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      )}

      {view === AppView.FEED && (
        <FocusFeed users={MOCK_USERS} />
      )}
    </div>
  );
}