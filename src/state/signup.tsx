import { createContext, useContext, useMemo, useState } from 'react';

export type Gender = 'male' | 'female';

export type SignupDraft = {
  inviteCode: string;
  firstName: string;
  gender: Gender | null;
  ageGroup: string | null;
  needHelp: string[];
  canHelp: string[];
};

const initial: SignupDraft = {
  inviteCode: '',
  firstName: '',
  gender: null,
  ageGroup: null,
  needHelp: [],
  canHelp: [],
};

type Ctx = {
  draft: SignupDraft;
  update: (patch: Partial<SignupDraft>) => void;
  reset: () => void;
};

const SignupContext = createContext<Ctx | null>(null);

// 회원가입 단계 사이에서 입력값을 들고 다니는 임시 저장소 (서버 연동 전)
export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState(initial);
  const value = useMemo<Ctx>(
    () => ({
      draft,
      update: (patch) => setDraft((d) => ({ ...d, ...patch })),
      reset: () => setDraft(initial),
    }),
    [draft],
  );
  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error('useSignup must be used inside SignupProvider');
  return ctx;
}
