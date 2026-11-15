export interface FinalSurpriseConfig {
  eyebrow: string;
  sealedPrompt: string;
  openHint: string;
  heading: string;
  paragraphs: string[];
  signature?: string;
  /** Optional hidden gift note shown inside a small keepsake card */
  hiddenGiftMessage?: string;
  /** Optional path to a final photo in /public/images/ */
  finalPhotoSrc?: string;
  finalPhotoAlt?: string;
  finalPhotoCaption?: string;
  /** Optional path to a personal voice note in /public/audio/ */
  voiceNoteSrc?: string;
  voiceNoteLabel?: string;
  /** Optional path to a birthday video in /public/video/ */
  videoSrc?: string;
  restartLabel: string;
}

export const storyContent = {
  siteTitle: 'මගේ මැණික වෙනුවෙන්...',
  siteSubtitle: 'A Little Book of Us',
  intro: {
    eyebrow: 'A Letter Waiting on the Desk',
    headline: 'මගේ මැණිකට පුංචි ලියුමක් තියෙනවා...',
    tapHint: 'ලියුම අරින්න මුද්‍රාව මත තට්ටු කරන්න',
    sealText: 'මැණික',
  },
  firstLetter: {
    eyebrow: 'Chapterless — Just Us',
    dateLabel: 'ඔයාගේ උපන්දිනය වෙනුවෙන්',
    salutation: 'මගේ ආදරණීය මැණිකට...',
    paragraphs: [
      'අද දවස ඔයාට විතරක් නෙවෙයි, මටත් ගොඩක් විශේෂයි.',
      'මොකද ඔයා ඉපදුණු මේ දවස මට ගොඩක් වටිනවා.',
      'මැණික, ඔයා එක්ක ගත කරපු පුංචි පුංචි මොහොතවල් මට තාමත් මතකයි.',
      'ඒ මතකයන් ටික එකතු කරලා මම ඔයා වෙනුවෙන් පුංචි කතාවක් හැදුවා.',
    ],
    closingQuestion: 'අපේ කතාව බලන්න යමුද?',
    underlinePhrases: ['මටත් ගොඩක් විශේෂයි', 'පුංචි කතාවක් හැදුවා'],
    continueLabel: 'අපේ මතක පෙට්ටිය අරින්න',
  },
  memoryBox: {
    eyebrow: 'Keepsake Box',
    label: 'අපේ මතකයන්...',
    hint: 'මතක පෙට්ටිය අරින්න තට්ටු කරන්න',
    openingLine: 'මේ හැම ඡායාරූපයක්ම මගේ හිතේ තියෙන ලස්සන මතකයක්...',
    enterScrapbookLabel: 'මතක පොත පෙරළන්න',
  },
  scrapbook: {
    eyebrow: 'A Continuous Book of Us',
    title: 'අපේ මතකයන්...',
    subtitle: 'එකින් එක පිටු පෙරළමින් අපේ ලස්සන මතකයන් බලමු...',
    transitionMessages: [
      'මැණික, මේ හැම මතකයක්ම මගේ හිතේ ලස්සනට තියෙනවා...',
      'කාලය ගෙවුණත් මේ පුංචි මොහොතවල් හැමදාම මට අලුත් වගේ දැනෙනවා...',
      'ඔයා ඉන්න නිසා තමයි මේ හැම පින්තූරයක්ම මෙච්චර ලස්සන...',
      'තවත් ලස්සන මතකයන් ගොඩක් ඉස්සරහට අපි එකතු කරමු මගේ මැණික...',
    ],
    continueLabel: 'තව පුංචි දේවල් ටිකක් කියන්න තියෙනවා',
  },
  loveHearts: {
    eyebrow: 'Little Notes From My Heart',
    title: 'මගේ මැණිකට කියන්න තව පුංචි දේවල් තියෙනවා...',
    hint: 'හැම හදවතක් ඇතුළෙම ඔයාට පුංචි පණිවිඩයක් තියෙනවා. එකින් එක අරින්න ♡',
    closeNoteLabel: 'සටහන වහන්න',
    continueLabel: 'ඉදිරියට යමු',
  },
  interlude: {
    eyebrow: 'Before We Celebrate',
    lines: [
      'මගේ මැණික, මේ හැම මතකයක්ම ලස්සනයි...',
      'ඒත් අද දවස ඊටත් වඩා විශේෂයි...',
    ],
    subline: 'මොකද අද මගේ හිතේ ඉන්න මැණිකගේ උපන්දිනය...',
    continueLabel: 'පුංචි පුදුමය බලන්න යමු',
  },
  birthday: {
    eyebrow: 'A little wish, just for you',
    title: 'මගේ මැණික, ප්‍රාර්ථනාවක් කරන්න...',
    instructions: 'ඉටිපන්දම් පහම එකින් එක නිවන්න. ඔබේ ප්‍රාර්ථනාව හිතේ තියාගන්න. ♡',
    greeting: 'සුබම සුබ උපන්දිනයක් මගේ මැණික! ❤️',
    replayLabel: 'නැවත ඉටිපන්දම් දල්වන්න',
    continueLabel: 'අවසාන ලියුම අරින්න',
  },
  finalLetter: {
    eyebrow: 'One Last Sealed Note',
    sealedPrompt: 'මැණික, අවසාන වශයෙන් තව එක දෙයක්...',
    openHint: 'අවසාන ලියුම අරින්න තට්ටු කරන්න',
    heading: 'සුබම සුබ උපන්දිනයක් මගේ මැණික! ❤️',
    paragraphs: [
      'ඔයාගේ හිනාව, ඔයාගේ ආදරේ, සහ ඔයා මගේ ජීවිතේට ගෙනාපු සතුට වචන වලින් කියලා ඉවර කරන්න බැහැ.',
      'අද වගේම හැමදාමත් ඔයා සතුටින්, නිරෝගීව, හිනාවෙලා ඉන්න ඕනේ කියලා මම හදවතින්ම ප්‍රාර්ථනා කරනවා.',
      'මගේ මැණිකට හැමදාමත් මම ඉන්නවා. ගොඩක් ආදරෙයි!',
    ],
    hiddenGiftMessage: 'මගේ මැණිකට දෙන පුංචි තෑග්ග: හැමදාම ඔයාගේ හිනාව රැකගන්න මම ඔයා ළඟින්ම ඉන්නවා. ♡',
    // Optional personal media (uncomment & add file in /public/ to enable):
    // finalPhotoSrc: '/images/memories/WhatsApp%20Image%202026-11-15%20at%2020.09.59.jpeg',
    // finalPhotoAlt: 'අපේ ලස්සන මතකයක්',
    // finalPhotoCaption: 'හැමදාම මගේ හිතේ',
    // voiceNoteSrc: '/audio/voice-note.mp3',
    // voiceNoteLabel: 'මගේ හඬින් පුංචි පණිවිඩයක්',
    // videoSrc: '/video/birthday-wish.mp4',
    restartLabel: 'අපේ කතාව ආයෙත් බලමු...',
  } satisfies FinalSurpriseConfig,
} as const;

