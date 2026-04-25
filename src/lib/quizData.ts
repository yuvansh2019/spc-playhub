export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface QuizSubject {
  id: string;
  name: string;
  emoji: string;
  questions: QuizQuestion[];
}

export const quizSubjects: QuizSubject[] = [
  {
    id: "math",
    name: "Math",
    emoji: "🔢",
    questions: [
      { question: "What is 7 + 5?", options: ["10", "11", "12", "13"], answer: 2 },
      { question: "What is 9 × 3?", options: ["27", "21", "24", "18"], answer: 0 },
      { question: "What is 20 − 8?", options: ["10", "12", "14", "8"], answer: 1 },
      { question: "What is 100 ÷ 4?", options: ["20", "25", "30", "40"], answer: 1 },
      { question: "What is 6 × 6?", options: ["12", "30", "36", "42"], answer: 2 },
      { question: "What is half of 50?", options: ["20", "25", "30", "10"], answer: 1 },
      { question: "What comes after 99?", options: ["100", "98", "101", "90"], answer: 0 },
      { question: "How many sides does a triangle have?", options: ["2", "3", "4", "5"], answer: 1 },
      { question: "What is 10 + 10 + 10?", options: ["20", "30", "40", "10"], answer: 1 },
      { question: "What is 5 × 0?", options: ["5", "0", "1", "10"], answer: 1 },
    ],
  },
  {
    id: "english",
    name: "English",
    emoji: "📖",
    questions: [
      { question: "Which is a noun?", options: ["Run", "Apple", "Quickly", "Happy"], answer: 1 },
      { question: "What is the plural of 'cat'?", options: ["Cats", "Cates", "Cat", "Caties"], answer: 0 },
      { question: "Which word is a verb?", options: ["Table", "Jump", "Blue", "Soft"], answer: 1 },
      { question: "Opposite of 'hot'?", options: ["Warm", "Cold", "Cool", "Burn"], answer: 1 },
      { question: "Which is a vowel?", options: ["B", "C", "A", "D"], answer: 2 },
      { question: "What punctuation ends a question?", options: [".", "!", "?", ","], answer: 2 },
      { question: "Which is correct?", options: ["I are happy", "I am happy", "I is happy", "I be happy"], answer: 1 },
      { question: "Synonym of 'big'?", options: ["Small", "Large", "Tiny", "Short"], answer: 1 },
      { question: "Which is an adjective?", options: ["Run", "Quickly", "Pretty", "Dog"], answer: 2 },
      { question: "What letter comes after M?", options: ["L", "N", "O", "K"], answer: 1 },
    ],
  },
  {
    id: "hindi",
    name: "Hindi",
    emoji: "🇮🇳",
    questions: [
      { question: "'पानी' का अर्थ क्या है?", options: ["Water", "Fire", "Air", "Earth"], answer: 0 },
      { question: "'सूरज' किसे कहते हैं?", options: ["Moon", "Sun", "Star", "Sky"], answer: 1 },
      { question: "हिंदी में कितने स्वर हैं?", options: ["10", "11", "12", "13"], answer: 1 },
      { question: "'किताब' का अंग्रेज़ी अर्थ?", options: ["Pen", "Book", "Bag", "Desk"], answer: 1 },
      { question: "'मैं' किस प्रकार का शब्द है?", options: ["संज्ञा", "सर्वनाम", "क्रिया", "विशेषण"], answer: 1 },
      { question: "'अच्छा' का विलोम शब्द?", options: ["बुरा", "ठीक", "सही", "बढ़िया"], answer: 0 },
      { question: "'फूल' का बहुवचन?", options: ["फूल", "फूलें", "फूलों", "फूले"], answer: 2 },
      { question: "'राम स्कूल जाता है' में क्रिया कौन सी है?", options: ["राम", "स्कूल", "जाता है", "है"], answer: 2 },
      { question: "'दिन' का विलोम?", options: ["रात", "सुबह", "शाम", "दोपहर"], answer: 0 },
      { question: "'क' से कौन-सा शब्द शुरू होता है?", options: ["कमल", "गमला", "तरबूज", "नल"], answer: 0 },
    ],
  },
  {
    id: "evs",
    name: "EVS",
    emoji: "🌍",
    questions: [
      { question: "Which gas do plants take in?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"], answer: 1 },
      { question: "How many seasons are in a year?", options: ["2", "3", "4", "5"], answer: 2 },
      { question: "Which is a source of light?", options: ["Sun", "Stone", "Water", "Tree"], answer: 0 },
      { question: "What do we breathe in?", options: ["Carbon dioxide", "Oxygen", "Smoke", "Dust"], answer: 1 },
      { question: "Which animal gives us milk?", options: ["Lion", "Cow", "Tiger", "Snake"], answer: 1 },
      { question: "What should we save?", options: ["Water", "Trash", "Smoke", "Noise"], answer: 0 },
      { question: "Which is a fruit?", options: ["Carrot", "Apple", "Onion", "Potato"], answer: 1 },
      { question: "Where do fish live?", options: ["Land", "Sky", "Water", "Tree"], answer: 2 },
      { question: "Sun rises in the?", options: ["West", "North", "East", "South"], answer: 2 },
      { question: "How many days are in a week?", options: ["5", "6", "7", "8"], answer: 2 },
    ],
  },
  {
    id: "cs",
    name: "Computer Science",
    emoji: "💻",
    questions: [
      { question: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Power Unit", "Central Power Unit", "Control Process Unit"], answer: 0 },
      { question: "Which is an input device?", options: ["Monitor", "Keyboard", "Printer", "Speaker"], answer: 1 },
      { question: "Which is an output device?", options: ["Mouse", "Monitor", "Keyboard", "Scanner"], answer: 1 },
      { question: "What does RAM stand for?", options: ["Random Access Memory", "Read All Memory", "Run Active Memory", "Real Access Module"], answer: 0 },
      { question: "Which one is software?", options: ["Mouse", "Windows", "Keyboard", "CPU"], answer: 1 },
      { question: "Full form of PC?", options: ["Personal Computer", "Power Computer", "Public Computer", "Private Computer"], answer: 0 },
      { question: "Which key makes capital letters?", options: ["Tab", "Shift", "Alt", "Ctrl"], answer: 1 },
      { question: "Which is a web browser?", options: ["Word", "Chrome", "Excel", "Paint"], answer: 1 },
      { question: "What does WWW mean?", options: ["World Wide Web", "Web World Wide", "Wide World Web", "World Web Wide"], answer: 0 },
      { question: "Which device stores data?", options: ["Monitor", "Hard Disk", "Mouse", "Printer"], answer: 1 },
    ],
  },
  {
    id: "ai",
    name: "AI",
    emoji: "🤖",
    questions: [
      { question: "What does AI stand for?", options: ["Apple Inside", "Artificial Intelligence", "Auto Input", "Audio Input"], answer: 1 },
      { question: "Which is an AI assistant?", options: ["Alexa", "Hammer", "Pen", "Book"], answer: 0 },
      { question: "AI can help to?", options: ["Drive cars", "Cook itself", "Sleep", "Sing only"], answer: 0 },
      { question: "A robot is?", options: ["A toy only", "A machine that can do tasks", "A book", "A drink"], answer: 1 },
      { question: "Which is an AI chatbot?", options: ["ChatGPT", "Notebook", "Pencil", "Eraser"], answer: 0 },
      { question: "AI learns from?", options: ["Data", "Sleep", "Rain", "Music only"], answer: 0 },
      { question: "Self-driving cars use?", options: ["Magic", "AI", "Wood", "Paper"], answer: 1 },
      { question: "Siri is made by?", options: ["Apple", "Google", "Amazon", "Microsoft"], answer: 0 },
      { question: "AI stands for Artificial ___?", options: ["Idea", "Intelligence", "Image", "Item"], answer: 1 },
      { question: "Which can recognize faces?", options: ["AI camera", "Brick", "Spoon", "Cup"], answer: 0 },
    ],
  },
];
