// Bengali number and date utilities

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string): string {
  const str = String(num);
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)]);
}

export function formatTimer(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  const raw = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return toBengaliNumber(raw);
}

export function formatDurationBengali(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${toBengaliNumber(totalSeconds)} সেকেন্ড`;
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${toBengaliNumber(hours)} ঘণ্টা ${toBengaliNumber(minutes)} মিনিট`;
  } else if (hours > 0) {
    return `${toBengaliNumber(hours)} ঘণ্টা`;
  } else {
    return `${toBengaliNumber(minutes)} মিনিট`;
  }
}

const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export function getTodayBengaliDate(): string {
  const now = new Date();
  const day = toBengaliNumber(now.getDate());
  const month = BENGALI_MONTHS[now.getMonth()];
  const year = toBengaliNumber(now.getFullYear());
  return `${day} ${month}, ${year}`;
}

const BENGALI_TO_ENGLISH_MAP: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

export function toEnglishNumber(str: string): string {
  return str.replace(/[০-৯]/g, (ch) => BENGALI_TO_ENGLISH_MAP[ch] || ch);
}

export function parseStartTime(timeStr: string): { hour: number; minute: number } | null {
  if (!timeStr) return null;
  const original = timeStr.trim();

  // Check for Bengali time words
  const isMorning = /সকাল|ভোর/i.test(original);
  const isNoonOrAfternoon = /দুপুর|বিকেল|সন্ধ্যা/i.test(original);
  const isNight = /রাত/i.test(original);

  const eng = toEnglishNumber(original).trim();
  const match = eng.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ampm = match[3]?.toUpperCase();

  if (ampm === 'PM') {
    if (hour < 12) hour += 12;
  } else if (ampm === 'AM') {
    if (hour === 12) hour = 0;
  } else if (isNoonOrAfternoon) {
    if (hour < 12) hour += 12;
  } else if (isNight) {
    if (hour >= 6 && hour < 12) hour += 12;
    else if (hour === 12) hour = 0;
  }

  return { hour, minute };
}

export function formatTimeToBengali12Hour(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return `${toBengaliNumber(pad(h))}:${toBengaliNumber(pad(m))} ${ampm}`;
}

