// APK & Web hybrid API Client with offline intelligence support

export function getApiUrl(endpoint: string): string {
  if (typeof window !== 'undefined') {
    const isLocalFileOrApp =
      window.location.protocol === 'file:' ||
      window.location.hostname === 'localhost' && window.location.port === '' ||
      window.location.origin.includes('capacitor://') ||
      window.location.origin.includes('ionic://');

    if (isLocalFileOrApp) {
      // Remote Cloud Run host for APK deployment
      return `https://ais-dev-nvfialwb3mtxy3un4e3w4z-310930086419.asia-east1.run.app${endpoint}`;
    }
  }
  return endpoint;
}

// Built-in Offline HSC Knowledge Base for 100% APK functionality without internet
export function getOfflineAiResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('অন্তরীকরণ') || q.includes('differentiation') || q.includes('calculus') || q.includes('ক্যালকুলাস')) {
    return `### উচ্চতর গণিত: অন্তরীকরণ (Differentiation) সূত্র ও সমাধান গাইড 📐

**গুরুত্বপূর্ণ সূত্রসমূহ:**
1. $d/dx (x^n) = n x^{n-1}$
2. $d/dx (\\sin x) = \\cos x$
3. $d/dx (\\cos x) = -\\sin x$
4. $d/dx (e^x) = e^x$
5. $d/dx (\\ln x) = 1/x$
6. **ইউ-ভি নিয়ম (Product Rule):** $d/dx (u v) = u \\frac{dv}{dx} + v \\frac{du}{dx}$
7. **ইউ/ভি নিয়ম (Quotient Rule):** $d/dx (u/v) = \\frac{v \\frac{du}{dx} - u \\frac{dv}{dx}}{v^2}$

💡 **পরীক্ষার টিপস:** স্পর্শক ও অভিলম্বের ঢাল নির্ণয় ($dy/dx$) এবং গুরুমান-লঘুমান ($d^2y/dx^2$) সংক্রান্ত অংকগুলো বোর্ড পরীক্ষার সিকিউতে সবচেয়ে বেশি আসে!`;
  }

  if (q.includes('ভেক্টর') || q.includes('vector') || q.includes('ডট') || q.includes('ক্রস')) {
    return `### পদার্থবিজ্ঞান ১ম পত্র: ভেক্টর সূত্র ও বিশ্লেষণ 🧭

**মূল সূত্রাবলী:**
- **লব্ধির মান:** $R = \\sqrt{P^2 + Q^2 + 2PQ \\cos \\alpha}$
- **লব্ধির দিক:** $\\tan \\theta = \\frac{Q \\sin \\alpha}{P + Q \\cos \\alpha}$
- **ডট গুণন:** $\\vec{A} \\cdot \\vec{B} = AB \\cos \\theta$ (পরস্পর লম্ব হলে $\\vec{A} \\cdot \\vec{B} = 0$)
- **ক্রস গুণন:** $|\\vec{A} \\times \\vec{B}| = AB \\sin \\theta$ (পরস্পর সমান্তরাল হলে $\\vec{A} \\times \\vec{B} = 0$)

 नदी-নৌকার ক্ষেত্রে সর্বনিম্ন দূরত্বে পারাপারের শর্ত: $\\cos \\alpha = -v/u$।`;
  }

  if (q.includes('গুণগত রসায়ন') || q.includes('রসায়ন') || q.includes('কোয়ান্টাম') || q.includes('chemistry')) {
    return `### রসায়ন ১ম পত্র: গুণগত রসায়ন রিভিশন 🧪

**১. কোয়ান্টাম সংখ্যা:**
- প্রধান ($n$): শক্তিস্তর
- সহকারী ($l$): উপস্তর ($0$ থেকে $n-1$)
- চৌম্বকীয় ($m$): দিকবিন্যাস ($-l$ থেকে $+l$)
- স্পিন ($s$): ঘূর্ণন ($+1/2, -1/2$)

**২. গুরুত্বপূর্ণ নীতিসমূহ:**
- **আউফবাউ নীতি:** কম শক্তিস্তরে আগে ইলেকট্রন প্রবেশ করে ($n+l$ নিয়ম)।
- **হুন্ডের নীতি:** সমশক্তিসম্পন্ন অরবিটালে ইলেকট্রনগুলো সর্বাধিক বিজোড় অবস্থায় থাকে।
- **পাউলির বর্জন নীতি:** দুটি ইলেকট্রনের ৪টি কোয়ান্টাম সংখ্যার মান কখনোই এক হতে পারে না।
- **দ্রাব্যতা গুণফল ($K_{sp}$):** $K_{ip} > K_{sp}$ হলে অধঃক্ষেপ পড়বে।`;
  }

  if (q.includes('রুটিন') || q.includes('পড়ার পরামর্শ') || q.includes('পরামর্শ') || q.includes('টিপস')) {
    return `### HSC পরীক্ষার সেরা পড়ার রুটিন ও রিভিশন কৌশল 🎯

১. **টপিক-ভিত্তিক পড়া:** দৈনিক ঘণ্টার চেয়ে কয়টি টপিক বা ম্যাথ শেষ হলো তাতে জোর দাও।
২. **দুর্বল বিষয়ে বেশি সময়:** উচ্চতর গণিত বা ফিজিক্সের কঠিন চ্যাপ্টারে সকালের ফ্রেশ সময়টা বরাদ্দ করো।
৩. **টেস্ট পেপার অনুশীলন:** প্রতিটি অধ্যায় শেষ করার পরপরই শীর্ষ ৫টি কলেজের বিগত বছরের CQ ও MCQ প্র্যাকটিস করো।
৪. **টাইমার ও স্ট্রিক:** আমাদের অ্যাপের স্টাডি টাইমার অন রেখে টানা ৫০ মিনিট পড়ে ১০ মিনিট বিরতি (Pomodoro) নাও।`;
  }

  return `### HSC Study Buddy (অফলাইন মোড) 📚

তোমার প্রশ্নটি সংরক্ষিত হয়েছে। অফলাইন মোডেও আমাদের সিলেবাস ট্র্যাকার, রুটিন অ্যালার্ম ও স্টাডি টাইমার সম্পূর্ণ কার্যকর।

গাণিতিক সূত্র, বিজ্ঞান বিষয়ের ব্যখ্যা বা রিভিশন কৌশলের জন্য নির্দিষ্ট বিষয়ের নাম লিখে প্রশ্ন করো (যেমন: 'ভেক্টর', 'অন্তরীকরণ', 'গুণগত রসায়ন', 'আইসিটি')। ইন্টারনেট চালু থাকলে যে কোনো ছবির প্রশ্নও সরাসরি স্ক্যান করে সমাধান পাওয়া যাবে!`;
}
