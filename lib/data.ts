export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: "multiple-choice" | "true-false" | "multi-select";
  options: QuizOption[];
  correctAnswerIds: string[];
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "link";
  duration: string;
  content: string;
  url?: string;
  questions?: QuizQuestion[];
  passingScore?: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  modules: Module[];
  isCustom?: boolean;
  createdAt?: string;
}

export const courses: Course[] = [
  {
    id: "workplace-safety",
    title: "Workplace Safety Essentials",
    description:
      "Learn the fundamentals of maintaining a safe workplace. Covers hazard identification, emergency procedures, PPE requirements, and OSHA compliance standards every employee should know.",
    category: "Compliance",
    thumbnail: "🛡️",
    duration: "45 min",
    lessons: 6,
    level: "Beginner",
    modules: [
      {
        id: "ws-m1",
        title: "Introduction to Workplace Safety",
        lessons: [
          {
            id: "ws-l1",
            title: "Why Safety Matters",
            type: "text",
            duration: "5 min",
            content:
              "Workplace safety is not just a legal obligation—it's a moral one. Every year, thousands of preventable injuries occur in the workplace. This lesson introduces the core principles of occupational safety, including the employer's duty of care, employee rights, and the real cost of workplace incidents. You'll learn about the hierarchy of controls and how organizations build a culture of safety from the ground up.",
          },
          {
            id: "ws-l2",
            title: "Hazard Identification",
            type: "video",
            duration: "10 min",
            content:
              "In this video lesson, you'll walk through real-world examples of common workplace hazards across office, warehouse, and manufacturing environments. Learn to spot physical hazards (wet floors, exposed wiring), chemical hazards (improper storage, missing MSDS), ergonomic risks (poor workstation setup), and biological hazards. Practice using a hazard assessment checklist.",
          },
          {
            id: "ws-l3",
            title: "Knowledge Check: Hazards",
            type: "quiz",
            duration: "5 min",
            content:
              "Test your understanding of hazard identification with this interactive quiz covering the material from the first two lessons.",
            passingScore: 75,
            questions: [
              {
                id: "ws-q1",
                text: "Which of the following is an example of a chemical hazard in the workplace?",
                type: "multiple-choice",
                options: [
                  { id: "a", text: "A wet floor near the entrance" },
                  { id: "b", text: "Improperly stored solvents without an MSDS" },
                  { id: "c", text: "A frayed electrical cord" },
                  { id: "d", text: "Repetitive typing motions" },
                ],
                correctAnswerIds: ["b"],
                explanation: "Improperly stored solvents are a chemical hazard. Wet floors are physical hazards, frayed cords are electrical hazards, and repetitive motions are ergonomic hazards.",
              },
              {
                id: "ws-q2",
                text: "The hierarchy of controls prioritizes eliminating a hazard over providing PPE.",
                type: "true-false",
                options: [
                  { id: "t", text: "True" },
                  { id: "f", text: "False" },
                ],
                correctAnswerIds: ["t"],
                explanation: "The hierarchy of controls ranks elimination as the most effective control, followed by substitution, engineering controls, administrative controls, and finally PPE as the last resort.",
              },
              {
                id: "ws-q3",
                text: "Which of these are considered ergonomic hazards? (Select all that apply)",
                type: "multi-select",
                options: [
                  { id: "a", text: "Poor workstation setup" },
                  { id: "b", text: "Exposed wiring" },
                  { id: "c", text: "Repetitive lifting without breaks" },
                  { id: "d", text: "Improper monitor height" },
                ],
                correctAnswerIds: ["a", "c", "d"],
                explanation: "Poor workstation setup, repetitive lifting, and improper monitor height are all ergonomic hazards. Exposed wiring is an electrical/physical hazard.",
              },
              {
                id: "ws-q4",
                text: "What document contains safety information about chemicals used in the workplace?",
                type: "multiple-choice",
                options: [
                  { id: "a", text: "Employee handbook" },
                  { id: "b", text: "Safety Data Sheet (SDS/MSDS)" },
                  { id: "c", text: "Insurance policy" },
                  { id: "d", text: "Building permit" },
                ],
                correctAnswerIds: ["b"],
                explanation: "Safety Data Sheets (SDS), formerly known as Material Safety Data Sheets (MSDS), contain detailed information about chemical hazards, safe handling, storage, and emergency procedures.",
              },
            ],
          },
        ],
      },
      {
        id: "ws-m2",
        title: "Emergency Procedures & PPE",
        lessons: [
          {
            id: "ws-l4",
            title: "Emergency Response Plans",
            type: "text",
            duration: "8 min",
            content:
              "Every workplace needs a clear emergency response plan. This lesson covers evacuation routes, assembly points, fire extinguisher types (A, B, C, D, K) and their uses, first aid basics, and how to report incidents. You'll understand the roles of floor wardens, first aid officers, and emergency coordinators.",
          },
          {
            id: "ws-l5",
            title: "Personal Protective Equipment",
            type: "video",
            duration: "12 min",
            content:
              "PPE is your last line of defense. This video demonstrates proper selection, fitting, use, and maintenance of common PPE including hard hats, safety glasses, gloves, respirators, hearing protection, and fall protection harnesses. Learn when PPE is required and how to inspect it before each use.",
          },
          {
            id: "ws-l6",
            title: "Final Assessment",
            type: "quiz",
            duration: "5 min",
            content:
              "Complete this final assessment to earn your Workplace Safety Essentials certification. Covers all material from both modules.",
            passingScore: 80,
            questions: [
              {
                id: "ws-fa1",
                text: "What is the FIRST thing you should do when discovering a fire in your workplace?",
                type: "multiple-choice",
                options: [
                  { id: "a", text: "Try to extinguish it yourself" },
                  { id: "b", text: "Activate the fire alarm and alert others" },
                  { id: "c", text: "Gather your personal belongings" },
                  { id: "d", text: "Call your supervisor" },
                ],
                correctAnswerIds: ["b"],
                explanation: "Activating the fire alarm is the first priority to ensure everyone is alerted and can begin evacuation. Fighting the fire is only appropriate if it is small and you are trained.",
              },
              {
                id: "ws-fa2",
                text: "A Class B fire extinguisher is used for which type of fire?",
                type: "multiple-choice",
                options: [
                  { id: "a", text: "Ordinary combustibles (wood, paper)" },
                  { id: "b", text: "Flammable liquids (gasoline, oil)" },
                  { id: "c", text: "Electrical equipment" },
                  { id: "d", text: "Cooking oils and fats" },
                ],
                correctAnswerIds: ["b"],
                explanation: "Class B extinguishers are designed for flammable liquids. Class A is for ordinary combustibles, Class C for electrical, and Class K for cooking oils.",
              },
              {
                id: "ws-fa3",
                text: "PPE should be your first line of defense against workplace hazards.",
                type: "true-false",
                options: [
                  { id: "t", text: "True" },
                  { id: "f", text: "False" },
                ],
                correctAnswerIds: ["f"],
                explanation: "PPE is actually the LAST line of defense in the hierarchy of controls. Elimination, substitution, engineering controls, and administrative controls should all be considered first.",
              },
              {
                id: "ws-fa4",
                text: "Which PPE items should be inspected before EVERY use? (Select all that apply)",
                type: "multi-select",
                options: [
                  { id: "a", text: "Hard hat" },
                  { id: "b", text: "Fall protection harness" },
                  { id: "c", text: "Safety glasses" },
                  { id: "d", text: "All of the above" },
                ],
                correctAnswerIds: ["a", "b", "c", "d"],
                explanation: "All PPE should be inspected before every use to ensure it is in good condition and will provide adequate protection.",
              },
              {
                id: "ws-fa5",
                text: "Who is responsible for workplace safety?",
                type: "multiple-choice",
                options: [
                  { id: "a", text: "Only the safety officer" },
                  { id: "b", text: "Only management" },
                  { id: "c", text: "Everyone in the workplace" },
                  { id: "d", text: "Only OSHA inspectors" },
                ],
                correctAnswerIds: ["c"],
                explanation: "Workplace safety is a shared responsibility. While employers have a duty of care and OSHA sets standards, every employee plays a role in maintaining a safe work environment.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "data-privacy",
    title: "Data Privacy & Security Awareness",
    description:
      "Understand your role in protecting sensitive information. Covers GDPR basics, phishing prevention, password security, data classification, and incident reporting procedures.",
    category: "Compliance",
    thumbnail: "🔒",
    duration: "35 min",
    lessons: 5,
    level: "Beginner",
    modules: [
      {
        id: "dp-m1",
        title: "Understanding Data Privacy",
        lessons: [
          {
            id: "dp-l1",
            title: "What is Personal Data?",
            type: "text",
            duration: "7 min",
            content:
              "Personal data is any information that can identify an individual—directly or indirectly. This lesson defines PII, sensitive personal data, and special categories under GDPR. You'll learn about data subjects' rights including access, rectification, erasure, and portability. Real-world examples show how seemingly anonymous data can be re-identified.",
          },
          {
            id: "dp-l2",
            title: "Data Classification & Handling",
            type: "text",
            duration: "8 min",
            content:
              "Not all data requires the same level of protection. Learn the four-tier classification system: Public, Internal, Confidential, and Restricted. Each tier has specific handling requirements for storage, transmission, sharing, and disposal. This lesson includes practical scenarios for classifying common business documents.",
          },
        ],
      },
      {
        id: "dp-m2",
        title: "Threats & Prevention",
        lessons: [
          {
            id: "dp-l3",
            title: "Recognizing Phishing Attacks",
            type: "video",
            duration: "8 min",
            content:
              "Phishing remains the #1 attack vector. This video walks through real phishing emails, SMS (smishing), and voice (vishing) attempts. Learn the red flags: urgency tactics, sender spoofing, suspicious links, and unusual requests. Practice evaluating emails in a simulated inbox exercise.",
          },
          {
            id: "dp-l4",
            title: "Password & Access Security",
            type: "text",
            duration: "6 min",
            content:
              "Strong authentication is your first defense. This lesson covers password best practices, why length beats complexity, the role of password managers, and multi-factor authentication (MFA). Learn about single sign-on (SSO), the principle of least privilege, and why you should never share credentials.",
          },
          {
            id: "dp-l5",
            title: "Security Awareness Quiz",
            type: "quiz",
            duration: "6 min",
            content:
              "Test your ability to identify security threats and apply data handling best practices across all modules.",
          },
        ],
      },
    ],
  },
  {
    id: "leadership-fundamentals",
    title: "Leadership Fundamentals",
    description:
      "Build core leadership skills for new and aspiring managers. Covers communication, delegation, feedback, team motivation, and conflict resolution.",
    category: "Professional Development",
    thumbnail: "🎯",
    duration: "60 min",
    lessons: 8,
    level: "Intermediate",
    modules: [
      {
        id: "lf-m1",
        title: "Communication & Delegation",
        lessons: [
          {
            id: "lf-l1",
            title: "Effective Communication Styles",
            type: "text",
            duration: "8 min",
            content:
              "Great leaders adapt their communication style. This lesson explores directive, coaching, supportive, and delegating styles and when to use each. Learn active listening techniques, how to ask powerful questions, and the difference between assertive and aggressive communication. Includes a self-assessment to identify your natural style.",
          },
          {
            id: "lf-l2",
            title: "The Art of Delegation",
            type: "video",
            duration: "10 min",
            content:
              "Delegation isn't about offloading work—it's about developing your team. This video covers the delegation framework: choosing the right task, selecting the right person, defining clear expectations, providing authority and resources, and following up without micromanaging. Learn common delegation mistakes and how to avoid them.",
          },
          {
            id: "lf-l3",
            title: "Delegation Scenarios",
            type: "quiz",
            duration: "5 min",
            content:
              "Apply your delegation knowledge to realistic workplace scenarios. Choose the best approach for each situation.",
          },
        ],
      },
      {
        id: "lf-m2",
        title: "Feedback & Team Dynamics",
        lessons: [
          {
            id: "lf-l4",
            title: "Giving Constructive Feedback",
            type: "text",
            duration: "7 min",
            content:
              "Feedback is a gift when delivered well. Learn the SBI model (Situation-Behavior-Impact), how to prepare for difficult conversations, and techniques for making feedback specific, timely, and actionable. Understand the difference between appreciation, coaching, and evaluation feedback.",
          },
          {
            id: "lf-l5",
            title: "Motivating Your Team",
            type: "video",
            duration: "10 min",
            content:
              "Motivation goes beyond bonuses and perks. This video explores intrinsic vs. extrinsic motivation, autonomy-mastery-purpose framework, and practical strategies for recognizing contributions, setting meaningful goals, and creating psychological safety. Learn what drives engagement and how to spot disengagement early.",
          },
          {
            id: "lf-l6",
            title: "Conflict Resolution",
            type: "text",
            duration: "7 min",
            content:
              "Conflict is inevitable—mismanagement is optional. Learn the five conflict resolution styles (competing, collaborating, compromising, avoiding, accommodating), when to use each, and how to mediate disputes between team members. Practice de-escalation techniques and understand when to involve HR.",
          },
          {
            id: "lf-l7",
            title: "Building Trust",
            type: "video",
            duration: "8 min",
            content:
              "Trust is the foundation of high-performing teams. This video covers the trust equation (credibility + reliability + intimacy / self-orientation), vulnerability-based trust, and how to rebuild trust after it's broken. Learn practical daily habits that build trust over time.",
          },
          {
            id: "lf-l8",
            title: "Leadership Assessment",
            type: "quiz",
            duration: "5 min",
            content:
              "Comprehensive assessment covering communication, delegation, feedback, motivation, and conflict resolution.",
          },
        ],
      },
    ],
  },
  {
    id: "dei-workplace",
    title: "Diversity, Equity & Inclusion",
    description:
      "Foster an inclusive workplace culture. Covers unconscious bias, microaggressions, inclusive language, allyship, and creating equitable processes.",
    category: "Compliance",
    thumbnail: "🤝",
    duration: "40 min",
    lessons: 5,
    level: "Beginner",
    modules: [
      {
        id: "dei-m1",
        title: "Understanding DEI",
        lessons: [
          {
            id: "dei-l1",
            title: "Foundations of DEI",
            type: "text",
            duration: "8 min",
            content:
              "Diversity, equity, and inclusion are interconnected but distinct concepts. Diversity is about representation—who is in the room. Equity ensures fair access and opportunities by addressing systemic barriers. Inclusion means everyone feels valued and can contribute fully. This lesson defines key terms, explores the business case for DEI, and sets the stage for personal reflection.",
          },
          {
            id: "dei-l2",
            title: "Unconscious Bias",
            type: "video",
            duration: "10 min",
            content:
              "We all have unconscious biases—cognitive shortcuts that can lead to unfair judgments. This video explains affinity bias, confirmation bias, halo/horn effect, and attribution bias with workplace examples. Learn about bias in hiring, performance reviews, and daily interactions. Discover practical strategies to interrupt your own biases.",
          },
          {
            id: "dei-l3",
            title: "Inclusive Language & Allyship",
            type: "text",
            duration: "8 min",
            content:
              "Words matter. This lesson covers inclusive language practices, how to recognize and respond to microaggressions, and what it means to be an active ally. Learn the difference between intent and impact, how to apologize effectively, and concrete actions you can take to support underrepresented colleagues.",
          },
        ],
      },
      {
        id: "dei-m2",
        title: "Putting DEI into Practice",
        lessons: [
          {
            id: "dei-l4",
            title: "Building Inclusive Teams",
            type: "video",
            duration: "9 min",
            content:
              "Inclusive teams outperform homogeneous ones. This video covers inclusive meeting practices, equitable project assignments, accessible communication, and how to create spaces where diverse perspectives are actively sought. Learn how managers can model inclusive behavior and hold their teams accountable.",
          },
          {
            id: "dei-l5",
            title: "DEI Knowledge Check",
            type: "quiz",
            duration: "5 min",
            content:
              "Reflect on what you've learned with scenario-based questions about recognizing bias, using inclusive language, and being an effective ally.",
          },
        ],
      },
    ],
  },
  {
    id: "customer-service",
    title: "Customer Service Excellence",
    description:
      "Master the art of exceptional customer service. Learn active listening, problem resolution, handling difficult customers, and turning complaints into loyalty.",
    category: "Skills Training",
    thumbnail: "⭐",
    duration: "50 min",
    lessons: 7,
    level: "Beginner",
    modules: [
      {
        id: "cs-m1",
        title: "Service Fundamentals",
        lessons: [
          {
            id: "cs-l1",
            title: "The Customer Service Mindset",
            type: "text",
            duration: "6 min",
            content:
              "Excellent customer service starts with mindset. This lesson covers the service-profit chain, why customer experience drives business results, and the attitudes that separate good service from great service. Learn about emotional intelligence in service interactions and the concept of 'moments of truth.'",
          },
          {
            id: "cs-l2",
            title: "Active Listening Skills",
            type: "video",
            duration: "8 min",
            content:
              "Most people listen to respond, not to understand. This video demonstrates active listening techniques: paraphrasing, reflecting emotions, asking clarifying questions, and avoiding common listening barriers. Watch real service interactions and identify what the representative does well and what could improve.",
          },
          {
            id: "cs-l3",
            title: "Communication Channels",
            type: "text",
            duration: "7 min",
            content:
              "Phone, email, chat, social media—each channel has unique best practices. Learn tone and format guidelines for written communication, phone etiquette, chat efficiency tips, and social media response protocols. Understand channel escalation paths and when to switch channels.",
          },
        ],
      },
      {
        id: "cs-m2",
        title: "Problem Resolution",
        lessons: [
          {
            id: "cs-l4",
            title: "Handling Difficult Situations",
            type: "video",
            duration: "10 min",
            content:
              "Difficult customers are an opportunity. This video teaches de-escalation techniques, the HEAT method (Hear, Empathize, Apologize, Take action), how to set boundaries professionally, and strategies for managing your own stress during tough interactions. Includes role-play examples.",
          },
          {
            id: "cs-l5",
            title: "Problem-Solving Framework",
            type: "text",
            duration: "7 min",
            content:
              "A structured approach to problem resolution ensures consistency. Learn the LAST framework (Listen, Acknowledge, Solve, Thank), root cause analysis for recurring issues, when and how to escalate, and documentation best practices. Understand service recovery and how resolving problems well can increase loyalty.",
          },
          {
            id: "cs-l6",
            title: "Service Recovery Scenarios",
            type: "quiz",
            duration: "6 min",
            content:
              "Practice your problem-resolution skills with realistic customer scenarios across multiple channels.",
          },
          {
            id: "cs-l7",
            title: "Final Service Assessment",
            type: "quiz",
            duration: "6 min",
            content:
              "Comprehensive assessment covering service mindset, communication skills, and problem resolution techniques.",
          },
        ],
      },
    ],
  },
  {
    id: "project-management",
    title: "Project Management Basics",
    description:
      "Learn essential project management skills including planning, scheduling, risk management, stakeholder communication, and Agile methodology basics.",
    category: "Professional Development",
    thumbnail: "📋",
    duration: "55 min",
    lessons: 7,
    level: "Intermediate",
    modules: [
      {
        id: "pm-m1",
        title: "Planning & Execution",
        lessons: [
          {
            id: "pm-l1",
            title: "Project Lifecycle Overview",
            type: "text",
            duration: "8 min",
            content:
              "Every project follows a lifecycle: initiation, planning, execution, monitoring, and closure. This lesson walks through each phase, key deliverables, and decision gates. Learn about project charters, scope statements, and the triple constraint (scope, time, cost). Understand how to define success criteria upfront.",
          },
          {
            id: "pm-l2",
            title: "Work Breakdown & Scheduling",
            type: "video",
            duration: "10 min",
            content:
              "Breaking complex projects into manageable pieces is essential. This video covers creating a Work Breakdown Structure (WBS), estimating task durations, identifying dependencies, building Gantt charts, and finding the critical path. Learn practical tips for realistic scheduling and buffer management.",
          },
          {
            id: "pm-l3",
            title: "Risk Management",
            type: "text",
            duration: "7 min",
            content:
              "Every project faces risks. This lesson teaches risk identification techniques (brainstorming, checklists, SWOT), qualitative and quantitative risk analysis, risk response strategies (avoid, mitigate, transfer, accept), and how to maintain a risk register. Learn the difference between risks, issues, and assumptions.",
          },
        ],
      },
      {
        id: "pm-m2",
        title: "Agile & Stakeholder Management",
        lessons: [
          {
            id: "pm-l4",
            title: "Introduction to Agile",
            type: "video",
            duration: "10 min",
            content:
              "Agile is more than a methodology—it's a mindset. This video introduces the Agile Manifesto, Scrum framework (sprints, standups, retrospectives), Kanban basics, and when to use Agile vs. Waterfall. Learn about user stories, story points, velocity, and iterative delivery.",
          },
          {
            id: "pm-l5",
            title: "Stakeholder Communication",
            type: "text",
            duration: "7 min",
            content:
              "Stakeholder management can make or break a project. Learn stakeholder identification and analysis, communication planning (who needs what, when, how), status reporting best practices, and techniques for managing expectations. Understand the difference between informing, consulting, and collaborating.",
          },
          {
            id: "pm-l6",
            title: "Agile vs Waterfall Scenarios",
            type: "quiz",
            duration: "6 min",
            content:
              "Apply your project management knowledge to choose the right approach for different project scenarios.",
          },
          {
            id: "pm-l7",
            title: "Project Management Assessment",
            type: "quiz",
            duration: "7 min",
            content:
              "Final assessment covering project lifecycle, scheduling, risk management, Agile, and stakeholder communication.",
          },
        ],
      },
    ],
  },
];

export const categories = [...new Set(courses.map((c) => c.category))];
