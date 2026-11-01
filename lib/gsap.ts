import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// Register plugins once so the bundler keeps them and they stay in sync across
// the app. Safe to import from both server and client code.
gsap.registerPlugin(useGSAP);

export { gsap, ScrollTrigger, useGSAP };
