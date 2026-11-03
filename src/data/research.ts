export interface ResearchArea {
  name: string;
  description: string;
}

/** Research interests shown on the homepage and the Research page. */
export const researchAreas: ResearchArea[] = [
  {
    name: 'Machine Learning',
    description:
      'Predictive modeling and intelligent decision systems built from data.',
  },
  {
    name: 'Operations Research',
    description:
      'Mathematical optimization, exact methods, and heuristic algorithms.',
  },
  {
    name: 'Workload Scheduling',
    description:
      'Resource allocation and scheduling policies for computing workloads.',
  },
  {
    name: 'Data Science',
    description:
      'Data analysis, statistical modeling, and decision support.',
  },
  {
    name: 'Optimization',
    description:
      'Computational optimization and the development of practical algorithms.',
  },
];

/**
 * The active research project. States below describe the work as it stands:
 * the problem, the questions, and the plan — not completed results.
 */
export const currentResearch = {
  title: 'Machine Learning for Workload Scheduling',
  status: 'In Progress' as const,
  summary:
    'An ongoing study of how machine learning can inform scheduling and resource-allocation decisions for cluster workloads. The project is at the stage of problem formulation, data preparation, and method design; results will be published here once the experiments are complete and verified.',
  questions: [
    'Which features of a cluster workload — job size, arrival pattern, resource demand, and runtime — are most informative for scheduling decisions?',
    'Can a learned policy match or improve on classical scheduling heuristics under realistic workload conditions?',
    'How sensitive are learned scheduling policies to distribution shift between training and evaluation workloads?',
  ],
  methods: [
    'Workload characterization and exploratory data analysis',
    'Supervised learning for job runtime and resource-demand estimation',
    'Reinforcement learning for sequential scheduling decisions',
    'Simulation-based evaluation against baseline heuristics',
  ],
  scope: [
    'Problem definition and a review of existing scheduling policies.',
    'Workload data preparation and a simulation environment for experiments.',
    'Baseline heuristics with a consistent evaluation protocol.',
    'Learned scheduling policies, compared against those baselines.',
  ],
};

/** Tools and methods that recur across the research work. */
export const researchMethods = [
  {
    label: 'Programming',
    items: ['Python', 'SQL'],
  },
  {
    label: 'Machine learning',
    items: ['scikit-learn', 'Statistical learning', 'Model evaluation'],
  },
  {
    label: 'Optimization',
    items: ['Mathematical programming', 'Heuristic design', 'Scheduling'],
  },
  {
    label: 'Data',
    items: ['pandas', 'NumPy', 'Matplotlib'],
  },
] as const;
