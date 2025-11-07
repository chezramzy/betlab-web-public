/**
 * Onboarding Page
 * State machine 4 steps avec swipe gestures et animations
 */

"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { ArrowLeft } from 'lucide-react';
import { useOnboardingStore } from '@/lib/stores/onboarding-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Button } from '@/lib/components/ui/button';
import { ProgressBar } from '@/lib/components/onboarding/progress-bar';
import { ProfileStep } from '@/lib/components/onboarding/profile-step';
import { LeaguesStep } from '@/lib/components/onboarding/leagues-step';
import { PreferencesStep } from '@/lib/components/onboarding/preferences-step';
import { SuccessStep } from '@/lib/components/onboarding/success-step';
import { toast } from 'sonner';

// Animation variants pour les transitions
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    currentStep,
    nextStep,
    prevStep,
    canGoToNextStep,
    isCompleted,
    complete,
  } = useOnboardingStore();

  const [direction, setDirection] = React.useState(0);

  // Redirect si pas authentifié
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  // Redirect si onboarding déjà complété
  useEffect(() => {
    if (isCompleted) {
      router.push('/');
    }
  }, [isCompleted, router]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentStep < 3 && canGoToNextStep()) {
        setDirection(1);
        handleNext();
      }
    },
    onSwipedRight: () => {
      if (currentStep > 0 && currentStep < 3) {
        setDirection(-1);
        prevStep();
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50,
  });

  const handleNext = () => {
    if (!canGoToNextStep()) {
      // Show validation error
      if (currentStep === 0) {
        toast.error('Veuillez renseigner votre prénom et nom (min 2 caractères)');
      } else if (currentStep === 1) {
        toast.error('Veuillez sélectionner au moins une ligue');
      } else if (currentStep === 2) {
        toast.error('Veuillez sélectionner au moins un type de prédiction et un profil de risque');
      }
      return;
    }

    setDirection(1);
    nextStep();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevStep();
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 0:
        return <ProfileStep />;
      case 1:
        return <LeaguesStep />;
      case 2:
        return <PreferencesStep />;
      case 3:
        return <SuccessStep />;
      default:
        return <ProfileStep />;
    }
  };

  const getButtonText = () => {
    if (currentStep === 2) return 'Terminer';
    if (currentStep === 3) return null; // Pas de bouton dans SuccessStep
    return 'Suivant';
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      {...swipeHandlers}
    >
      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} totalSteps={4} />

      {/* Steps Container */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex flex-col"
          >
            {getStepComponent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {currentStep < 3 && (
        <div className="p-4 border-t bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] safe-area-bottom">
          <div className="flex gap-3 max-w-2xl mx-auto">
            {/* Bouton Précédent */}
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                className="px-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </Button>
            )}

            {/* Bouton Suivant/Terminer */}
            <Button
              variant="lime"
              size="lg"
              onClick={handleNext}
              className="flex-1"
              disabled={!canGoToNextStep()}
            >
              {getButtonText()}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
