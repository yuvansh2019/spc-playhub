export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // index of correct option
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
      { question: "What is 25 × 48?", options: ["1100", "1200", "1300", "1000"], answer: 1 },
      { question: "What is the square root of 144?", options: ["11", "12", "13", "14"], answer: 1 },
      { question: "If x + 7 = 15, what is x?", options: ["7", "8", "9", "22"], answer: 1 },
      { question: "What is 3/4 + 1/2?", options: ["1", "5/4", "4/6", "7/4"], answer: 1 },
      { question: "How many degrees in a triangle?", options: ["90", "180", "270", "360"], answer: 1 },
      { question: "What is 15% of 200?", options: ["20", "30", "25", "35"], answer: 1 },
      { question: "What is the next prime after 7?", options: ["9", "10", "11", "13"], answer: 2 },
      { question: "What is 2⁵?", options: ["16", "32", "64", "25"], answer: 1 },
      { question: "What is the LCM of 4 and 6?", options: ["12", "24", "6", "8"], answer: 0 },
      { question: "What is 999 + 1?", options: ["1000", "9991", "999", "1001"], answer: 0 },
    ],
  },
  {
    id: "english",
    name: "English",
    emoji: "📖",
    questions: [
      { question: "What is the plural of 'child'?", options: ["Childs", "Children", "Childen", "Childes"], answer: 1 },
      { question: "Which is a synonym for 'happy'?", options: ["Sad", "Joyful", "Angry", "Tired"], answer: 1 },
      { question: "What part of speech is 'quickly'?", options: ["Noun", "Verb", "Adverb", "Adjective"], answer: 2 },
      { question: "Which sentence is correct?", options: ["He don't know.", "He doesn't know.", "He doesn't knows.", "He don't knows."], answer: 1 },
      { question: "What is the antonym of 'ancient'?", options: ["Old", "Modern", "Historic", "Classic"], answer: 1 },
      { question: "Identify the noun: 'The cat sat on the mat.'", options: ["sat", "on", "cat", "the"], answer: 2 },
      { question: "What is a simile?", options: ["A type of poem", "Comparison using like/as", "A rhyme", "A metaphor"], answer: 1 },
      { question: "Which word is spelled correctly?", options: ["Recieve", "Receive", "Receve", "Receave"], answer: 1 },
      { question: "What is the past tense of 'run'?", options: ["Runned", "Ran", "Running", "Runs"], answer: 1 },
      { question: "What does 'benevolent' mean?", options: ["Evil", "Kind", "Lazy", "Smart"], answer: 1 },
    ],
  },
  {
    id: "hindi",
    name: "Hindi",
    emoji: "🇮🇳",
    questions: [
      { question: "हिंदी वर्णमाला में कितने स्वर हैं?", options: ["10", "11", "13", "15"], answer: 2 },
      { question: "'पुस्तक' का बहुवचन क्या है?", options: ["पुस्तकें", "पुस्तकों", "पुस्तके", "पुस्तकी"], answer: 0 },
      { question: "'सूर्य' का पर्यायवाची शब्द क्या है?", options: ["चंद्र", "रवि", "तारा", "ग्रह"], answer: 1 },
      { question: "'गाय' शब्द का लिंग क्या है?", options: ["पुल्लिंग", "स्त्रीलिंग", "नपुंसकलिंग", "कोई नहीं"], answer: 1 },
      { question: "हिंदी दिवस कब मनाया जाता है?", options: ["14 सितंबर", "26 जनवरी", "15 अगस्त", "2 अक्टूबर"], answer: 0 },
      { question: "'खाना' क्रिया का भूतकाल क्या है?", options: ["खाया", "खाता", "खाएगा", "खाऊं"], answer: 0 },
      { question: "'नदी' का विलोम शब्द क्या है?", options: ["पहाड़", "समुद्र", "नाला", "कोई नहीं"], answer: 3 },
      { question: "'क' से 'ज्ञ' तक कितने व्यंजन हैं?", options: ["33", "36", "39", "30"], answer: 0 },
      { question: "'राम ने खाना खाया' में कर्ता कौन है?", options: ["खाना", "राम", "खाया", "ने"], answer: 1 },
      { question: "संज्ञा के कितने भेद होते हैं?", options: ["3", "4", "5", "6"], answer: 2 },
    ],
  },
  {
    id: "evs",
    name: "EVS",
    emoji: "🌍",
    questions: [
      { question: "Which gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: 2 },
      { question: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Skin", "Brain"], answer: 2 },
      { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
      { question: "What do herbivores eat?", options: ["Meat", "Plants", "Both", "Neither"], answer: 1 },
      { question: "How many bones does an adult human have?", options: ["206", "208", "300", "195"], answer: 0 },
      { question: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
      { question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "80°C"], answer: 1 },
      { question: "Which animal is known as the 'Ship of the Desert'?", options: ["Horse", "Camel", "Elephant", "Donkey"], answer: 1 },
      { question: "What causes a rainbow?", options: ["Rain only", "Sunlight refraction", "Wind", "Clouds"], answer: 1 },
      { question: "Which part of the plant makes food?", options: ["Root", "Stem", "Leaf", "Flower"], answer: 2 },
    ],
  },
  {
    id: "cs",
    name: "Computer Science",
    emoji: "💻",
    questions: [
      { question: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Program Unit"], answer: 1 },
      { question: "Which language is used for web styling?", options: ["HTML", "JavaScript", "CSS", "Python"], answer: 2 },
      { question: "What does RAM stand for?", options: ["Read Access Memory", "Random Access Memory", "Run Access Memory", "Random Active Memory"], answer: 1 },
      { question: "Which is an input device?", options: ["Monitor", "Printer", "Keyboard", "Speaker"], answer: 2 },
      { question: "What is the binary for 5?", options: ["100", "101", "110", "111"], answer: 1 },
      { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], answer: 0 },
      { question: "Which is a programming language?", options: ["Photoshop", "Excel", "Python", "Chrome"], answer: 2 },
      { question: "What is 1 byte equal to?", options: ["4 bits", "8 bits", "16 bits", "32 bits"], answer: 1 },
      { question: "What does URL stand for?", options: ["Uniform Resource Locator", "Universal Resource Link", "Uniform Register Locator", "United Resource Locator"], answer: 0 },
      { question: "Which company created Windows?", options: ["Apple", "Google", "Microsoft", "IBM"], answer: 2 },
    ],
  },
  {
    id: "ai",
    name: "AI",
    emoji: "🤖",
    questions: [
      { question: "What does AI stand for?", options: ["Automatic Intelligence", "Artificial Intelligence", "Advanced Integration", "Auto Information"], answer: 1 },
      { question: "Who is considered the father of AI?", options: ["Alan Turing", "John McCarthy", "Elon Musk", "Bill Gates"], answer: 1 },
      { question: "What is machine learning?", options: ["Programming robots", "AI learning from data", "Building machines", "Computer repair"], answer: 1 },
      { question: "Which is an AI assistant?", options: ["Excel", "Siri", "Notepad", "Calculator"], answer: 1 },
      { question: "What does NLP stand for in AI?", options: ["New Language Program", "Natural Language Processing", "Network Learning Protocol", "Neural Logic Programming"], answer: 1 },
      { question: "What is a neural network modeled after?", options: ["Internet", "Human brain", "Computer chips", "Databases"], answer: 1 },
      { question: "Which company made ChatGPT?", options: ["Google", "Microsoft", "OpenAI", "Meta"], answer: 2 },
      { question: "What is computer vision?", options: ["Better monitors", "AI understanding images", "VR headsets", "Screen resolution"], answer: 1 },
      { question: "What is a chatbot?", options: ["A video game", "AI that converses with humans", "A search engine", "A browser"], answer: 1 },
      { question: "What does GPT stand for?", options: ["General Processing Tool", "Generative Pre-trained Transformer", "Global Programming Technology", "Guided Pattern Training"], answer: 1 },
    ],
  },
];
