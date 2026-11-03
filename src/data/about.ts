/**
 * About-page data.
 *
 * Education, professional experience, and awards are intentionally empty
 * until the details are confirmed against the CV. Empty sections are not
 * rendered, so nothing unverified appears on the site.
 */

export interface EducationEntry {
  institution: string;
  qualification: string;
  field: string;
  period: string;
  detail?: string;
}

export const education: EducationEntry[] = [
  { institution: 'Shahid Bahonar University of Kerman', 
    qualification: "Bachelor's degree", 
    field: 'Industrial Engineering', 
    period: '2022 - 2026'
  }
];

export interface ExperienceEntry {
  organisation: string;
  role: string;
  period: string;
  description: string;
}

export const experience: ExperienceEntry[] = [];

export interface SkillGroup {
  label: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  { label: 'Programming', items: ['Python', 'SQL', 'C++', 'Go'] },
  { label: 'Data Science', items: ['MS Excel', 'Pandas', 'NumPy', 'Polars', 'SymPy', 'SciPy', 'SimPy'] },
  { label: 'Machine Learning', items: ['Scikit-learn', 'TensorFlow', 'PyTourch'] },
  { label: 'Visualization', items: ['Matlotlib', 'Seaborn'] },
  {
    label: 'Optimization',
    items: ['Heuristic algorithms', 'LP', 'MILP/MIP', 'Dynamic programming', 'Pyomo', 'OR-Tools'],
  },
  { label: 'Development', items: ['Git', 'GitHub', 'Docker', 'Testing', 'Agentic AI', 'Vibe Coding'] },
];

export const certifications: string[] = [
  'CS50X: Introduction to Computer Science — Harvard University',
  'CS50P: Introduction to Programming with Python — Harvard University',
  'Machine Learning with Python — Maktabkhooneh',
  'Future Managers Professional Skills Bootcamp — Iran Elites Network'
];


