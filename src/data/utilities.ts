export interface Utility {
  id: number;
  icon?: string;
  title: string;
  description: string;
  category: string;
}

export const utilities: Utility[] = [
  // {
  //   id: 7,
  //   icon: "/icons/voice-gallery.svg",
  //   title: "Voice gallery",
  //   description: "Quickly pick from a variety of prebuilt voices to use in your text-to-speech apps.",
  //   category: "Text to speech"
  // },
  // {
  //   id: 11,
  //   title: "Portfolio",
  //   description: "Manage your account settings and personal information in one place.",
  //   category: "Account"
  // },
  {
    id: 12,
    title: "My Resume",
    description: "Professional resume displaying skills, work experience, and educational background.",
    category: "Profile"
  },
  {
    id: 8,
    title: "Text to Speech",
    description: "Bring text to life with natural-sounding voices using advanced AI technology.",
    category: "Text to speech"
  },
  // {
  //   id: 9,
  //   icon: "/icons/meme-generator.svg",
  //   title: "Tạo Meme nhanh",
  //   description: "Biến những khoảnh khắc đời thường thành meme viral chỉ trong tích tắc. Vì đôi khi, một bức ảnh đáng giá bằng cả ngàn từ... và một caption hài hước!",
  //   category: "Meme"
  // },
  {
    id: 10,
    title: "Spin Wheel",
    description: "Create a fun and interactive spinning wheel to make random selections or decisions.",
    category: "Games"
  },
  {
    id: 13,
    title: "Elite Web",
    description: "Discover and share the best websites across various categories. Find useful resources, tools, and platforms.",
    category: "Web Resources"
  },
  {
    id: 14,
    title: "Unit Converter",
    description: "Convert between different units of measurement including length, mass, temperature, and more.",
    category: "Tools"
  },
  {
    id: 15,
    title: "QR Code Generator",
    description: "Create QR codes for various types of data including text, URLs, contact information, and WiFi credentials.",
    category: "Tools"
  },
  {
    id: 16,
    title: "Dice Roller",
    description: "Roll virtual dice with customizable options including different types of dice and quantities.",
    category: "Games"
  },
  {
    id: 17,
    title: "Football Formation Builder",
    description: "Create, customize and visualize football formations (5v5, 7v7, 11v11) with drag-and-drop functionality.",
    category: "Sports"
  },
  {
    id: 18,
    title: "AI Data Analysis",
    description: "Analyze data with AI, create visualizations, predict trends, detect anomalies, and generate automated reports.",
    category: "Data Analysis"
  },
  {
    id: 19,
    title: "Student Ranking System",
    description: "Manage student classes, track scores, and create leaderboards with a gamified ranking system.",
    category: "Education"
  }
];

export const filterCategories = [
  'All',
  'Text to speech',
  'Games',
  'Profile',
  'Tools',
  'Sports',
  'Web Resources',
  'Data Analysis',
  'Education'
];
