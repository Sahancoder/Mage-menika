declare module 'gsap' {
  const gsap: {
    registerPlugin: (...plugins: unknown[]) => void;
    matchMedia: () => {
      add: (query: string, cb: () => void) => void;
      revert: () => void;
    };
    context: (cb: () => void, scope?: unknown) => { revert: () => void };
    timeline: (vars?: Record<string, unknown>) => {
      from: (target: string, vars: Record<string, unknown>, position?: number) => ReturnType<typeof gsap.timeline>;
    };
    to: (target: string, vars: Record<string, unknown>) => void;
  };
  export default gsap;
}

declare module 'gsap/ScrollTrigger' {
  export const ScrollTrigger: unknown;
}
