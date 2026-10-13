import { Subject, Chapter, RoutineItem, Task, UserProfile, StudySession } from '../types';

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'bangla-1', name: 'বাংলা ১ম পত্র', code: '101', color: '#b91c1c', iconName: 'BookOpen' },
  { id: 'bangla-2', name: 'বাংলা ২য় পত্র', code: '102', color: '#991b1b', iconName: 'FileText' },
  { id: 'eng-1', name: 'English 1st Paper', code: '107', color: '#1e40af', iconName: 'Globe' },
  { id: 'eng-2', name: 'English 2nd Paper', code: '108', color: '#1d4ed8', iconName: 'PenTool' },
  { id: 'ict', name: 'ICT', code: '275', color: '#0d9488', iconName: 'Cpu' },
  { id: 'phy-1', name: 'পদার্থবিজ্ঞান ১ম পত্র', code: '174', color: '#4338ca', iconName: 'Zap' },
  { id: 'phy-2', name: 'পদার্থবিজ্ঞান ২য় পত্র', code: '175', color: '#3730a3', iconName: 'Activity' },
  { id: 'chem-1', name: 'রসায়ন ১ম পত্র', code: '176', color: '#059669', iconName: 'FlaskConical' },
  { id: 'chem-2', name: 'রসায়ন ২য় পত্র', code: '177', color: '#047857', iconName: 'Atom' },
  { id: 'hmath-1', name: 'উচ্চতর গণিত ১ম পত্র', code: '265', color: '#d97706', iconName: 'Sigma' },
  { id: 'hmath-2', name: 'উচ্চতর গণিত ২য় পত্র', code: '266', color: '#b45309', iconName: 'Calculator' },
  { id: 'bio-1', name: 'জীববিজ্ঞান ১ম পত্র', code: '178', color: '#15803d', iconName: 'Leaf' },
  { id: 'bio-2', name: 'জীববিজ্ঞান ২য় পত্র', code: '179', color: '#166534', iconName: 'HeartPulse' },
];

export const DEFAULT_CHAPTERS: Chapter[] = [
  // বাংলা ১ম পত্র (18 items)
  { id: 'b1-1', subjectId: 'bangla-1', chapterNo: 1, title: 'গদ্য: অপরিচিতা', completed: true },
  { id: 'b1-2', subjectId: 'bangla-1', chapterNo: 2, title: 'গদ্য: বিলাসী', completed: true },
  { id: 'b1-3', subjectId: 'bangla-1', chapterNo: 3, title: 'গদ্য: আমার পথ', completed: false },
  { id: 'b1-4', subjectId: 'bangla-1', chapterNo: 4, title: 'গদ্য: মানব কল্যাণ', completed: false },
  { id: 'b1-5', subjectId: 'bangla-1', chapterNo: 5, title: 'গদ্য: মাসি-পিসি', completed: false },
  { id: 'b1-6', subjectId: 'bangla-1', chapterNo: 6, title: 'গদ্য: বায়ান্নর দিনগুলো', completed: false },
  { id: 'b1-7', subjectId: 'bangla-1', chapterNo: 7, title: 'গদ্য: রেইনকোট', completed: false },
  { id: 'b1-8', subjectId: 'bangla-1', chapterNo: 8, title: 'পদ্য: ঐক্যতান', completed: false },
  { id: 'b1-9', subjectId: 'bangla-1', chapterNo: 9, title: 'পদ্য: সোনার তরী', completed: false },
  { id: 'b1-10', subjectId: 'bangla-1', chapterNo: 10, title: 'পদ্য: বিদ্রোহী', completed: false },
  { id: 'b1-11', subjectId: 'bangla-1', chapterNo: 11, title: 'পদ্য: প্রতিদান', completed: false },
  { id: 'b1-12', subjectId: 'bangla-1', chapterNo: 12, title: 'পদ্য: তাহারেই পড়ে মনে', completed: false },
  { id: 'b1-13', subjectId: 'bangla-1', chapterNo: 13, title: 'পদ্য: ১৮ বছর বয়স', completed: false },
  { id: 'b1-14', subjectId: 'bangla-1', chapterNo: 14, title: 'পদ্য: ফেব্রুয়ারি ১৯৬৯', completed: false },
  { id: 'b1-15', subjectId: 'bangla-1', chapterNo: 15, title: 'পদ্য: আমি কিংবদন্তির কথা বলছি', completed: false },
  { id: 'b1-16', subjectId: 'bangla-1', chapterNo: 16, title: 'সহপাঠ: লালসালু (উপন্যাস ১ম পর্ব)', completed: false },
  { id: 'b1-17', subjectId: 'bangla-1', chapterNo: 17, title: 'সহপাঠ: লালসালু (উপন্যাস ২য় পর্ব)', completed: false },
  { id: 'b1-18', subjectId: 'bangla-1', chapterNo: 18, title: 'সহপাঠ: সিরাজউদ্দৌলা (নাটক)', completed: false },

  // বাংলা ২য় পত্র (12 items)
  { id: 'b2-1', subjectId: 'bangla-2', chapterNo: 1, title: 'বাংলা উচ্চারণের নিয়ম', completed: false },
  { id: 'b2-2', subjectId: 'bangla-2', chapterNo: 2, title: 'বাংলা বানানের নিয়ম', completed: false },
  { id: 'b2-3', subjectId: 'bangla-2', chapterNo: 3, title: 'ব্যাকরণিক শব্দশ্রেণী', completed: false },
  { id: 'b2-4', subjectId: 'bangla-2', chapterNo: 4, title: 'শব্দ গঠন (উপসর্গ ও সমাস)', completed: false },
  { id: 'b2-5', subjectId: 'bangla-2', chapterNo: 5, title: 'বাক্যতত্ত্ব ও বাক্য রূপান্তর', completed: false },
  { id: 'b2-6', subjectId: 'bangla-2', chapterNo: 6, title: 'বাংলা ভাষার অপপ্রয়োগ ও শুদ্ধ প্রয়োগ', completed: false },
  { id: 'b2-7', subjectId: 'bangla-2', chapterNo: 7, title: 'পারিভাষিক শব্দ ও অনুবাদ', completed: false },
  { id: 'b2-8', subjectId: 'bangla-2', chapterNo: 8, title: 'দিনলিপি ও প্রতিবেদন রচনা', completed: false },
  { id: 'b2-9', subjectId: 'bangla-2', chapterNo: 9, title: 'বৈদ্যুতিন চিঠি ও আবেদনপত্র', completed: false },
  { id: 'b2-10', subjectId: 'bangla-2', chapterNo: 10, title: 'সারাংশ ও সারমর্ম লিখন', completed: false },
  { id: 'b2-11', subjectId: 'bangla-2', chapterNo: 11, title: 'ভাবসম্প্রসারণ', completed: false },
  { id: 'b2-12', subjectId: 'bangla-2', chapterNo: 12, title: 'প্রবন্ধ-নিবন্ধ রচনা', completed: false },

  // English 1st Paper (7 units)
  { id: 'e1-1', subjectId: 'eng-1', chapterNo: 1, title: 'Unit 1: People Making History', completed: false },
  { id: 'e1-2', subjectId: 'eng-1', chapterNo: 2, title: 'Unit 2: Dreams & Aspirations', completed: false },
  { id: 'e1-3', subjectId: 'eng-1', chapterNo: 3, title: 'Unit 3: Lifestyle & Food', completed: false },
  { id: 'e1-4', subjectId: 'eng-1', chapterNo: 4, title: 'Unit 4: Youthful Achievers', completed: false },
  { id: 'e1-5', subjectId: 'eng-1', chapterNo: 5, title: 'Unit 5: Human Relationships', completed: false },
  { id: 'e1-6', subjectId: 'eng-1', chapterNo: 6, title: 'Unit 6: Traffic Education', completed: false },
  { id: 'e1-7', subjectId: 'eng-1', chapterNo: 7, title: 'Unit 7: Human Rights', completed: false },

  // English 2nd Paper (11 units)
  { id: 'e2-1', subjectId: 'eng-2', chapterNo: 1, title: 'Gap Filling with Clues (Prepositions)', completed: false },
  { id: 'e2-2', subjectId: 'eng-2', chapterNo: 2, title: 'Special Phrases & Words', completed: false },
  { id: 'e2-3', subjectId: 'eng-2', chapterNo: 3, title: 'Completing Sentences (Rules & Clauses)', completed: false },
  { id: 'e2-4', subjectId: 'eng-2', chapterNo: 4, title: 'Right Form of Verbs', completed: false },
  { id: 'e2-5', subjectId: 'eng-2', chapterNo: 5, title: 'Narrative Style (Speech Passage)', completed: false },
  { id: 'e2-6', subjectId: 'eng-2', chapterNo: 6, title: 'Modifiers (Pre & Post modifiers)', completed: false },
  { id: 'e2-7', subjectId: 'eng-2', chapterNo: 7, title: 'Sentence Connectors', completed: false },
  { id: 'e2-8', subjectId: 'eng-2', chapterNo: 8, title: 'Synonym and Antonym', completed: false },
  { id: 'e2-9', subjectId: 'eng-2', chapterNo: 9, title: 'Punctuation & Capitalization', completed: false },
  { id: 'e2-10', subjectId: 'eng-2', chapterNo: 10, title: 'Formal Letters & Emails', completed: false },
  { id: 'e2-11', subjectId: 'eng-2', chapterNo: 11, title: 'Paragraph Writing (Listing/Cause & Effect)', completed: false },

  // ICT (6 chapters)
  { id: 'ict-1', subjectId: 'ict', chapterNo: 1, title: '১ম: তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত', completed: false },
  { id: 'ict-2', subjectId: 'ict', chapterNo: 2, title: '২য়: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং', completed: false },
  { id: 'ict-3', subjectId: 'ict', chapterNo: 3, title: '৩য়: সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', completed: false },
  { id: 'ict-4', subjectId: 'ict', chapterNo: 4, title: '৪র্থ: ওয়েব ডিজাইন পরিচিতি ও HTML', completed: false },
  { id: 'ict-5', subjectId: 'ict', chapterNo: 5, title: '৫ম: প্রোগ্রামিং ভাষা (C Programming)', completed: false },
  { id: 'ict-6', subjectId: 'ict', chapterNo: 6, title: '৬ষ্ঠ: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)', completed: false },

  // পদার্থবিজ্ঞান ১ম পত্র (10 chapters)
  { id: 'p1-1', subjectId: 'phy-1', chapterNo: 1, title: '১ম অধ্যায়: ভৌতজগৎ ও পরিমাপ', completed: false },
  { id: 'p1-2', subjectId: 'phy-1', chapterNo: 2, title: '২য় অধ্যায়: ভেক্টর', completed: false },
  { id: 'p1-3', subjectId: 'phy-1', chapterNo: 3, title: '৩য় অধ্যায়: গতিবিদ্যা', completed: false },
  { id: 'p1-4', subjectId: 'phy-1', chapterNo: 4, title: '৪র্থ অধ্যায়: নিউটনিয়ান বলবিদ্যা', completed: false },
  { id: 'p1-5', subjectId: 'phy-1', chapterNo: 5, title: '৫ম অধ্যায়: কাজ, শক্তি ও ক্ষমতা', completed: false },
  { id: 'p1-6', subjectId: 'phy-1', chapterNo: 6, title: '৬ষ্ঠ অধ্যায়: মহাকর্ষ ও অভিকর্ষ', completed: false },
  { id: 'p1-7', subjectId: 'phy-1', chapterNo: 7, title: '৭ম অধ্যায়: পদার্থের গাঠনিক ধর্ম', completed: false },
  { id: 'p1-8', subjectId: 'phy-1', chapterNo: 8, title: '৮ম অধ্যায়: পর্যায়বৃত্ত গতি', completed: false },
  { id: 'p1-9', subjectId: 'phy-1', chapterNo: 9, title: '৯ম অধ্যায়: তরঙ্গ', completed: false },
  { id: 'p1-10', subjectId: 'phy-1', chapterNo: 10, title: '১০ম অধ্যায়: আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব', completed: false },

  // পদার্থবিজ্ঞান ২য় পত্র (11 chapters)
  { id: 'p2-1', subjectId: 'phy-2', chapterNo: 1, title: '১ম অধ্যায়: তাপগতিবিদ্যা', completed: false },
  { id: 'p2-2', subjectId: 'phy-2', chapterNo: 2, title: '২য় অধ্যায়: স্থির তড়িৎ', completed: false },
  { id: 'p2-3', subjectId: 'phy-2', chapterNo: 3, title: '৩য় অধ্যায়: চল তড়িৎ', completed: false },
  { id: 'p2-4', subjectId: 'phy-2', chapterNo: 4, title: '৪র্থ অধ্যায়: তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব', completed: false },
  { id: 'p2-5', subjectId: 'phy-2', chapterNo: 5, title: '৫ম অধ্যায়: তাড়িতচৌম্বকীয় আবেশ ও পরিবর্তী প্রবাহ', completed: false },
  { id: 'p2-6', subjectId: 'phy-2', chapterNo: 6, title: '৬ষ্ঠ অধ্যায়: জ্যামিতিক আলোকবিজ্ঞান', completed: false },
  { id: 'p2-7', subjectId: 'phy-2', chapterNo: 7, title: '৭ম অধ্যায়: ভৌত আলোকবিজ্ঞান', completed: false },
  { id: 'p2-8', subjectId: 'phy-2', chapterNo: 8, title: '৮ম অধ্যায়: আধুনিক পদার্থবিজ্ঞানের সূচনা', completed: false },
  { id: 'p2-9', subjectId: 'phy-2', chapterNo: 9, title: '৯ম অধ্যায়: পরমাণুর মডেল ও নিউক্লিয়ার পদার্থবিজ্ঞান', completed: false },
  { id: 'p2-10', subjectId: 'phy-2', chapterNo: 10, title: '১০ম অধ্যায়: সেমিকন্ডাক্টর ও ইলেকট্রনিক্স', completed: false },
  { id: 'p2-11', subjectId: 'phy-2', chapterNo: 11, title: '১১তম অধ্যায়: জ্যোতির্বিজ্ঞান', completed: false },

  // রসায়ন ১ম পত্র (5 chapters)
  { id: 'c1-1', subjectId: 'chem-1', chapterNo: 1, title: '১ম অধ্যায়: ল্যাবরেটরির নিরাপদ ব্যবহার', completed: false },
  { id: 'c1-2', subjectId: 'chem-1', chapterNo: 2, title: '২য় অধ্যায়: গুণগত রসায়ন', completed: false },
  { id: 'c1-3', subjectId: 'chem-1', chapterNo: 3, title: '৩য় অধ্যায়: মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন', completed: false },
  { id: 'c1-4', subjectId: 'chem-1', chapterNo: 4, title: '৪র্থ অধ্যায়: রাসায়নিক পরিবর্তন', completed: false },
  { id: 'c1-5', subjectId: 'chem-1', chapterNo: 5, title: '৫ম অধ্যায়: কর্মমুখী রসায়ন', completed: false },

  // রসায়ন ২য় পত্র (5 chapters)
  { id: 'c2-1', subjectId: 'chem-2', chapterNo: 1, title: '১ম অধ্যায়: পরিবেশ রসায়ন', completed: false },
  { id: 'c2-2', subjectId: 'chem-2', chapterNo: 2, title: '২য় অধ্যায়: জৈব রসায়ন', completed: false },
  { id: 'c2-3', subjectId: 'chem-2', chapterNo: 3, title: '৩য় অধ্যায়: পরিমাণগত রসায়ন', completed: false },
  { id: 'c2-4', subjectId: 'chem-2', chapterNo: 4, title: '৪র্থ অধ্যায়: তড়িৎ রসায়ন', completed: false },
  { id: 'c2-5', subjectId: 'chem-2', chapterNo: 5, title: '৫ম অধ্যায়: অর্থনৈতিক রসায়ন', completed: false },

  // উচ্চতর গণিত ১ম পত্র (10 chapters)
  { id: 'm1-1', subjectId: 'hmath-1', chapterNo: 1, title: '১ম অধ্যায়: ম্যাট্রিক্স ও নির্ণায়ক', completed: false },
  { id: 'm1-2', subjectId: 'hmath-1', chapterNo: 2, title: '২য় অধ্যায়: ভেক্টর', completed: false },
  { id: 'm1-3', subjectId: 'hmath-1', chapterNo: 3, title: '৩য় অধ্যায়: সরলরেখা', completed: false },
  { id: 'm1-4', subjectId: 'hmath-1', chapterNo: 4, title: '৪র্থ অধ্যায়: বৃত্ত', completed: false },
  { id: 'm1-5', subjectId: 'hmath-1', chapterNo: 5, title: '৫ম অধ্যায়: বিন্যাস ও সমাবেশ', completed: false },
  { id: 'm1-6', subjectId: 'hmath-1', chapterNo: 6, title: '৬ষ্ঠ অধ্যায়: ত্রিকোণমিতিক অনুপাত', completed: false },
  { id: 'm1-7', subjectId: 'hmath-1', chapterNo: 7, title: '৭ম অধ্যায়: সংযুক্ত কোণের ত্রিকোণমিতিক অনুপাত', completed: false },
  { id: 'm1-8', subjectId: 'hmath-1', chapterNo: 8, title: '৮ম অধ্যায়: ফাংশন ও ফাংশনের লেখচিত্র', completed: false },
  { id: 'm1-9', subjectId: 'hmath-1', chapterNo: 9, title: '৯ম অধ্যায়: অন্তরীকরণ', completed: false },
  { id: 'm1-10', subjectId: 'hmath-1', chapterNo: 10, title: '১০ম অধ্যায়: যোগজীকরণ', completed: false },

  // উচ্চতর গণিত ২য় পত্র (10 chapters)
  { id: 'm2-1', subjectId: 'hmath-2', chapterNo: 1, title: '১ম অধ্যায়: বাস্তব সংখ্যা ও অসমতা', completed: false },
  { id: 'm2-2', subjectId: 'hmath-2', chapterNo: 2, title: '২য় অধ্যায়: যোগাশ্রয়ী প্রোগ্রাম', completed: false },
  { id: 'm2-3', subjectId: 'hmath-2', chapterNo: 3, title: '৩য় অধ্যায়: জটিল সংখ্যা', completed: false },
  { id: 'm2-4', subjectId: 'hmath-2', chapterNo: 4, title: '৪র্থ অধ্যায়: বহুপদী ও বহুপদী সমীকরণ', completed: false },
  { id: 'm2-5', subjectId: 'hmath-2', chapterNo: 5, title: '৫ম অধ্যায়: দ্বিপদী বিস্তার', completed: false },
  { id: 'm2-6', subjectId: 'hmath-2', chapterNo: 6, title: '৬ষ্ঠ অধ্যায়: কণিক', completed: false },
  { id: 'm2-7', subjectId: 'hmath-2', chapterNo: 7, title: '৭ম অধ্যায়: বিপরীত ত্রিকোণমিতিক ফাংশন ও সমীকরণ', completed: false },
  { id: 'm2-8', subjectId: 'hmath-2', chapterNo: 8, title: '৮ম অধ্যায়: স্থিতিবিদ্যা', completed: false },
  { id: 'm2-9', subjectId: 'hmath-2', chapterNo: 9, title: '৯ম অধ্যায়: সমতলে বস্তুকণার গতি', completed: false },
  { id: 'm2-10', subjectId: 'hmath-2', chapterNo: 10, title: '১০ম অধ্যায়: বিস্তার পরিমাপ ও সম্ভাবনা', completed: false },

  // জীববিজ্ঞান ১ম পত্র (12 chapters)
  { id: 'bio1-1', subjectId: 'bio-1', chapterNo: 1, title: '১ম অধ্যায়: কোষ ও এর গঠন', completed: false },
  { id: 'bio1-2', subjectId: 'bio-1', chapterNo: 2, title: '২য় অধ্যায়: কোষ বিভাজন', completed: false },
  { id: 'bio1-3', subjectId: 'bio-1', chapterNo: 3, title: '৩য় অধ্যায়: কোষ রসায়ন', completed: false },
  { id: 'bio1-4', subjectId: 'bio-1', chapterNo: 4, title: '৪র্থ অধ্যায়: অণুজীব', completed: false },
  { id: 'bio1-5', subjectId: 'bio-1', chapterNo: 5, title: '৫ম অধ্যায়: শৈবাল ও ছত্রাক', completed: false },
  { id: 'bio1-6', subjectId: 'bio-1', chapterNo: 6, title: '৬ষ্ঠ অধ্যায়: ব্রায়োফাইটা ও টেরিডোফাইটা', completed: false },
  { id: 'bio1-7', subjectId: 'bio-1', chapterNo: 7, title: '৭ম অধ্যায়: নগ্নবীজী ও আবৃতবীজী উদ্ভিদ', completed: false },
  { id: 'bio1-8', subjectId: 'bio-1', chapterNo: 8, title: '৮ম অধ্যায়: টিস্যু ও টিস্যুতন্ত্র', completed: false },
  { id: 'bio1-9', subjectId: 'bio-1', chapterNo: 9, title: '৯ম অধ্যায়: উদ্ভিদ শারীরতত্ত্ব', completed: false },
  { id: 'bio1-10', subjectId: 'bio-1', chapterNo: 10, title: '১০ম অধ্যায়: উদ্ভিদ প্রজনন', completed: false },
  { id: 'bio1-11', subjectId: 'bio-1', chapterNo: 11, title: '১১তম অধ্যায়: জীবপ্রযুক্তি', completed: false },
  { id: 'bio1-12', subjectId: 'bio-1', chapterNo: 12, title: '১২তম অধ্যায়: জীবের পরিবেশ, বিস্তার ও সংরক্ষণ', completed: false },

  // জীববিজ্ঞান ২য় পত্র (12 chapters)
  { id: 'bio2-1', subjectId: 'bio-2', chapterNo: 1, title: '১ম অধ্যায়: প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস', completed: false },
  { id: 'bio2-2', subjectId: 'bio-2', chapterNo: 2, title: '২য় অধ্যায়: প্রাণীর পরিচিতি (হাইড্রা, ঘাসফড়িং, রুই মাছ)', completed: false },
  { id: 'bio2-3', subjectId: 'bio-2', chapterNo: 3, title: '৩য় অধ্যায়: মানব শারীরতত্ত্ব: পরিপাক ও শোষণ', completed: false },
  { id: 'bio2-4', subjectId: 'bio-2', chapterNo: 4, title: '৪র্থ অধ্যায়: মানব শারীরতত্ত্ব: রক্ত ও সংবহন', completed: false },
  { id: 'bio2-5', subjectId: 'bio-2', chapterNo: 5, title: '৫ম অধ্যায়: মানব শারীরতত্ত্ব: শ্বাসক্রিয়া ও শ্বসন', completed: false },
  { id: 'bio2-6', subjectId: 'bio-2', chapterNo: 6, title: '৬ষ্ঠ অধ্যায়: মানব শারীরতত্ত্ব: বর্জ্য ও নিষ্কাশন', completed: false },
  { id: 'bio2-7', subjectId: 'bio-2', chapterNo: 7, title: '৭ম অধ্যায়: মানব শারীরতত্ত্ব: চলন ও অঙ্গচালনা', completed: false },
  { id: 'bio2-8', subjectId: 'bio-2', chapterNo: 8, title: '৮ম অধ্যায়: মানব শারীরতত্ত্ব: সমন্বয় ও নিয়ন্ত্রণ', completed: false },
  { id: 'bio2-9', subjectId: 'bio-2', chapterNo: 9, title: '৯ম অধ্যায়: মানবজীবনের ধারাবাহিকতা', completed: false },
  { id: 'bio2-10', subjectId: 'bio-2', chapterNo: 10, title: '১০ম অধ্যায়: মানবদেহের প্রতিরক্ষা (ইমিউনিটি)', completed: false },
  { id: 'bio2-11', subjectId: 'bio-2', chapterNo: 11, title: '১১তম অধ্যায়: জিনতত্ত্ব ও বিবর্তন', completed: false },
  { id: 'bio2-12', subjectId: 'bio-2', chapterNo: 12, title: '১২তম অধ্যায়: প্রাণীর আচরণ', completed: false },
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'পদার্থবিজ্ঞান ১ম পত্র: ভেক্টর ডট ও ক্রস গুণন সমাধান',
    subjectId: 'phy-1',
    date: new Date().toISOString().split('T')[0],
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'উচ্চতর গণিত: ম্যাট্রিক্স ইনভার্স ও ক্রেমারের নিয়ম',
    subjectId: 'hmath-1',
    date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'English 1st Paper: Unit 1 Passage রিভিশন ও Vocabulary',
    subjectId: 'eng-1',
    date: new Date().toISOString().split('T')[0],
    priority: 'low',
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_ROUTINES: RoutineItem[] = [
  // শনিবার
  {
    id: 'rt-1',
    dayOfWeek: 'শনি',
    startTime: '০৬:৩০ AM - ০৮:০০ AM',
    subjectId: 'phy-1',
    chapterTitle: '২য় অধ্যায়: ভেক্টর',
    activityType: 'অধ্যায় পড়া ও নোট তৈরি',
    durationMinutes: 90,
    note: 'গাণিতিক সমস্যাগুলো দেখতে হবে',
    completed: false,
  },
  {
    id: 'rt-2',
    dayOfWeek: 'শনি',
    startTime: '০৮:৩০ AM - ১০:০০ AM',
    subjectId: 'hmath-1',
    chapterTitle: '১ম অধ্যায়: ম্যাট্রিক্স ও নির্ণায়ক',
    activityType: 'Problem Solving',
    durationMinutes: 90,
    note: 'বোর্ড প্রশ্ন সমাধান',
    completed: false,
  },
  {
    id: 'rt-3',
    dayOfWeek: 'শনি',
    startTime: '০৭:০০ PM - ০৮:৩০ PM',
    subjectId: 'chem-1',
    chapterTitle: '২য় অধ্যায়: গুণগত রসায়ন',
    activityType: 'MCQ Practice',
    durationMinutes: 90,
    note: 'কোয়ান্টাম সংখ্যা ও বর্ণালী',
    completed: false,
  },
  // রবিবার
  {
    id: 'rt-4',
    dayOfWeek: 'রবি',
    startTime: '০৭:০০ AM - ০৮:৩০ AM',
    subjectId: 'bio-1',
    chapterTitle: '১ম অধ্যায়: কোষ ও এর গঠন',
    activityType: 'অধ্যায় পড়া',
    durationMinutes: 90,
    completed: false,
  },
  {
    id: 'rt-5',
    dayOfWeek: 'রবি',
    startTime: '০৮:০০ PM - ০৯:৩০ PM',
    subjectId: 'eng-1',
    chapterTitle: 'Unit 1: People Making History',
    activityType: 'CQ Practice',
    durationMinutes: 90,
    completed: false,
  },
  // সোমবার
  {
    id: 'rt-6',
    dayOfWeek: 'সোম',
    startTime: '০৬:৩০ AM - ০৮:০০ AM',
    subjectId: 'phy-2',
    chapterTitle: '১ম অধ্যায়: তাপগতিবিদ্যা',
    activityType: 'Formula Revision',
    durationMinutes: 90,
    completed: false,
  },
  // মঙ্গলবার
  {
    id: 'rt-7',
    dayOfWeek: 'মঙ্গল',
    startTime: '০৭:০০ AM - ০৮:৩০ AM',
    subjectId: 'hmath-2',
    chapterTitle: '৩য় অধ্যায়: জটিল সংখ্যা',
    activityType: 'Problem Solving',
    durationMinutes: 90,
    completed: false,
  },
  // বুধবার
  {
    id: 'rt-8',
    dayOfWeek: 'বুধ',
    startTime: '০৭:০০ AM - ০৮:৩০ AM',
    subjectId: 'ict',
    chapterTitle: '৩য় অধ্যায়: সংখ্যা পদ্ধতি',
    activityType: 'MCQ Practice',
    durationMinutes: 90,
    completed: false,
  },
  // বৃহস্পতিবার
  {
    id: 'rt-9',
    dayOfWeek: 'বৃহঃ',
    startTime: '০৮:০০ PM - ০৯:৩০ PM',
    subjectId: 'bangla-1',
    chapterTitle: 'গদ্য: অপরিচিতা',
    activityType: 'রিভিশন',
    durationMinutes: 90,
    completed: false,
  },
  // শুক্রবার
  {
    id: 'rt-10',
    dayOfWeek: 'শুক্র',
    startTime: '০৩:০০ PM - ০৫:০০ PM',
    subjectId: 'chem-2',
    chapterTitle: '১ম অধ্যায়: পরিবেশ রসায়ন',
    activityType: 'Mock Test',
    durationMinutes: 120,
    note: 'সাপ্তাহিক মডেল টেস্ট',
    completed: false,
  },
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'সাকিব রহমান',
  examTarget: 'HSC 2026',
  group: 'বিজ্ঞান (Science)',
  dailyTargetHours: 6,
  preferredTime: 'সকাল ও রাত',
  weakSubjects: 'উচ্চতর গণিত, পদার্থবিজ্ঞান',
  notificationsEnabled: true,
};

// Past study sessions to seed an engaging 3-day initial streak
const now = new Date();
const formatDate = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_STUDY_SESSIONS: StudySession[] = [
  // 1 day ago (yesterday) - 6.5 hours
  {
    id: 'sess-init-1',
    subjectId: 'phy-1',
    startTime: `${formatDate(1)}T07:00:00Z`,
    endTime: `${formatDate(1)}T10:00:00Z`,
    durationSeconds: 3 * 3600,
    date: formatDate(1),
  },
  {
    id: 'sess-init-2',
    subjectId: 'hmath-1',
    startTime: `${formatDate(1)}T19:00:00Z`,
    endTime: `${formatDate(1)}T22:30:00Z`,
    durationSeconds: 3.5 * 3600,
    date: formatDate(1),
  },
  // 2 days ago - 6 hours
  {
    id: 'sess-init-3',
    subjectId: 'chem-1',
    startTime: `${formatDate(2)}T08:00:00Z`,
    endTime: `${formatDate(2)}T11:00:00Z`,
    durationSeconds: 3 * 3600,
    date: formatDate(2),
  },
  {
    id: 'sess-init-4',
    subjectId: 'bio-1',
    startTime: `${formatDate(2)}T18:00:00Z`,
    endTime: `${formatDate(2)}T21:00:00Z`,
    durationSeconds: 3 * 3600,
    date: formatDate(2),
  },
  // 3 days ago - 6 hours
  {
    id: 'sess-init-5',
    subjectId: 'phy-2',
    startTime: `${formatDate(3)}T07:00:00Z`,
    endTime: `${formatDate(3)}T13:00:00Z`,
    durationSeconds: 6 * 3600,
    date: formatDate(3),
  },
  // 4 days ago - 5.5 hours
  {
    id: 'sess-init-6',
    subjectId: 'hmath-2',
    startTime: `${formatDate(4)}T08:00:00Z`,
    endTime: `${formatDate(4)}T13:30:00Z`,
    durationSeconds: 5.5 * 3600,
    date: formatDate(4),
  },
  // 5 days ago - 7 hours
  {
    id: 'sess-init-7',
    subjectId: 'chem-2',
    startTime: `${formatDate(5)}T07:30:00Z`,
    endTime: `${formatDate(5)}T14:30:00Z`,
    durationSeconds: 7 * 3600,
    date: formatDate(5),
  },
  // 6 days ago - 4.5 hours
  {
    id: 'sess-init-8',
    subjectId: 'ict',
    startTime: `${formatDate(6)}T09:00:00Z`,
    endTime: `${formatDate(6)}T13:30:00Z`,
    durationSeconds: 4.5 * 3600,
    date: formatDate(6),
  },
];
