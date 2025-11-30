
export interface WikiRole {
    slug: string;
    title: string;
    overview: string;
    responsibilities: string[];
    skills: {
        technical: string[];
        soft: string[];
    };
    careerPath: {
        entry: string;
        mid: string;
        senior: string;
        leadership: string;
    };
    salary: {
        us: { entry: string; mid: string; senior: string; leadership: string };
        eu: { entry: string; mid: string; senior: string; leadership: string };
        asia: { entry: string; mid: string; senior: string; leadership: string };
    };
    education: string[];
    outlook: string;
}

export const wikiRoles: Record<string, WikiRole> = {
    'software-engineer': {
        slug: 'software-engineer',
        title: 'Software Engineer',
        overview: 'Software Engineers design, develop, and maintain software applications and systems. They apply engineering principles to create efficient, reliable, and scalable software solutions that solve complex problems.',
        responsibilities: [
            'Write clean, maintainable, and efficient code',
            'Design and architect software systems',
            'Debug and resolve technical issues',
            'Collaborate with cross-functional teams',
            'Participate in code reviews and technical discussions'
        ],
        skills: {
            technical: ['JavaScript/TypeScript', 'Python/Java/C++', 'Git/Version Control', 'Database Management', 'System Design'],
            soft: ['Problem Solving', 'Communication', 'Teamwork', 'Adaptability', 'Attention to Detail']
        },
        careerPath: {
            entry: 'Junior Engineer: Focus on learning codebase, fixing bugs, and implementing small features.',
            mid: 'Mid-Level Engineer: Own features, design small systems, and mentor juniors.',
            senior: 'Senior Engineer: Lead technical design, solve complex architectural problems, and guide team strategy.',
            leadership: 'Staff/Principal Engineer or Engineering Manager: Set technical direction or manage teams.'
        },
        salary: {
            us: { entry: '$80k - $120k', mid: '$120k - $160k', senior: '$160k - $220k', leadership: '$220k+' },
            eu: { entry: '€40k - €60k', mid: '€60k - €85k', senior: '€85k - €120k', leadership: '€120k+' },
            asia: { entry: '$30k - $50k', mid: '$50k - $80k', senior: '$80k - $120k', leadership: '$120k+' }
        },
        education: ['Bachelor\'s in Computer Science or related field', 'Coding Bootcamps', 'Self-taught with portfolio'],
        outlook: 'High demand across all industries as digital transformation continues to accelerate.'
    },
    'data-scientist': {
        slug: 'data-scientist',
        title: 'Data Scientist',
        overview: 'Data Scientists analyze complex data sets to identify trends, patterns, and insights. They use statistical methods and machine learning algorithms to solve business problems and predict future outcomes.',
        responsibilities: [
            'Collect, clean, and analyze large datasets',
            'Build and train machine learning models',
            'Visualize data to communicate findings',
            'Collaborate with stakeholders to understand business needs',
            'Deploy models into production environments'
        ],
        skills: {
            technical: ['Python/R', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistics'],
            soft: ['Critical Thinking', 'Business Acumen', 'Communication', 'Curiosity', 'Storytelling']
        },
        careerPath: {
            entry: 'Junior Data Scientist: Data cleaning, basic analysis, and model maintenance.',
            mid: 'Data Scientist: End-to-end modeling, feature engineering, and stakeholder communication.',
            senior: 'Senior Data Scientist: Lead complex projects, design ML systems, and mentor team.',
            leadership: 'Lead Data Scientist or Head of Data: Strategy, team management, and cross-functional leadership.'
        },
        salary: {
            us: { entry: '$90k - $130k', mid: '$130k - $170k', senior: '$170k - $230k', leadership: '$230k+' },
            eu: { entry: '€45k - €65k', mid: '€65k - €90k', senior: '€90k - €130k', leadership: '€130k+' },
            asia: { entry: '$35k - $60k', mid: '$60k - $90k', senior: '$90k - $140k', leadership: '$140k+' }
        },
        education: ['Master\'s or PhD in Statistics, CS, or Math', 'Bachelor\'s with strong portfolio'],
        outlook: 'Rapidly growing field with increasing importance of AI and big data in decision making.'
    },
    'devops-engineer': {
        slug: 'devops-engineer',
        title: 'DevOps Engineer',
        overview: 'DevOps Engineers bridge the gap between software development and IT operations. They automate deployment processes, ensure system reliability, and optimize infrastructure performance.',
        responsibilities: [
            'Manage CI/CD pipelines',
            'Monitor system health and performance',
            'Automate infrastructure provisioning',
            'Ensure security and compliance',
            'Troubleshoot production issues'
        ],
        skills: {
            technical: ['Linux/Unix', 'Docker/Kubernetes', 'AWS/Azure/GCP', 'CI/CD Tools', 'Scripting (Bash/Python)'],
            soft: ['Collaboration', 'Problem Solving', 'Crisis Management', 'Process Improvement', 'Communication']
        },
        careerPath: {
            entry: 'Junior DevOps: Assist with monitoring, basic scripting, and pipeline maintenance.',
            mid: 'DevOps Engineer: Manage cloud infrastructure, optimize pipelines, and handle incidents.',
            senior: 'Senior DevOps: Architect infrastructure, lead automation initiatives, and ensure reliability.',
            leadership: 'SRE Manager or Head of Infrastructure: Strategic planning, budget management, and team leadership.'
        },
        salary: {
            us: { entry: '$85k - $125k', mid: '$125k - $165k', senior: '$165k - $210k', leadership: '$210k+' },
            eu: { entry: '€45k - €65k', mid: '€65k - €90k', senior: '€90k - €120k', leadership: '€120k+' },
            asia: { entry: '$35k - $55k', mid: '$55k - $85k', senior: '$85k - $130k', leadership: '$130k+' }
        },
        education: ['Bachelor\'s in CS or Engineering', 'Cloud Certifications (AWS, Azure, GCP)'],
        outlook: 'Critical role as companies move to cloud-native architectures and seek faster release cycles.'
    },
    'product-manager': {
        slug: 'product-manager',
        title: 'Product Manager',
        overview: 'Product Managers define the vision, strategy, and roadmap for a product. They work with engineering, design, and marketing teams to deliver products that meet customer needs and business goals.',
        responsibilities: [
            'Define product vision and strategy',
            'Gather and prioritize product requirements',
            'Work with engineering and design to build features',
            'Analyze market trends and competitor landscape',
            'Launch products and measure success'
        ],
        skills: {
            technical: ['Data Analysis', 'Agile/Scrum', 'User Research', 'Roadmapping Tools', 'Technical Understanding'],
            soft: ['Leadership', 'Communication', 'Empathy', 'Strategic Thinking', 'Prioritization']
        },
        careerPath: {
            entry: 'Associate PM: Support PMs, gather requirements, and manage backlog.',
            mid: 'Product Manager: Own a feature or product area, define roadmap, and execute.',
            senior: 'Senior PM: Own complex products, mentor APMs, and drive strategy.',
            leadership: 'Director of Product or VP of Product: Portfolio management, organizational strategy, and team building.'
        },
        salary: {
            us: { entry: '$90k - $130k', mid: '$130k - $170k', senior: '$170k - $220k', leadership: '$220k+' },
            eu: { entry: '€50k - €70k', mid: '€70k - €95k', senior: '€95k - €130k', leadership: '€130k+' },
            asia: { entry: '$40k - $65k', mid: '$65k - $95k', senior: '$95k - $140k', leadership: '$140k+' }
        },
        education: ['Bachelor\'s degree (MBA often preferred for senior roles)', 'Product Management Certifications'],
        outlook: 'Strong demand as companies focus on user-centric product development.'
    },
    'ux-designer': {
        slug: 'ux-designer',
        title: 'UX Designer',
        overview: 'UX Designers create meaningful and relevant experiences for users. They focus on the usability, accessibility, and pleasure provided in the interaction between the user and the product.',
        responsibilities: [
            'Conduct user research and testing',
            'Create wireframes, prototypes, and user flows',
            'Collaborate with developers and PMs',
            'Analyze user feedback and iterate on designs',
            'Ensure design consistency and accessibility'
        ],
        skills: {
            technical: ['Figma/Sketch', 'Prototyping', 'User Research', 'Information Architecture', 'Usability Testing'],
            soft: ['Empathy', 'Communication', 'Collaboration', 'Creativity', 'Critical Thinking']
        },
        careerPath: {
            entry: 'Junior Designer: Assist with wireframing, UI assets, and basic research.',
            mid: 'UX Designer: Lead design for features, conduct research, and present solutions.',
            senior: 'Senior Designer: Lead complex projects, define design systems, and mentor juniors.',
            leadership: 'Design Lead or UX Director: Design strategy, team management, and cross-functional alignment.'
        },
        salary: {
            us: { entry: '$75k - $105k', mid: '$105k - $145k', senior: '$145k - $190k', leadership: '$190k+' },
            eu: { entry: '€35k - €55k', mid: '€55k - €75k', senior: '€75k - €100k', leadership: '€100k+' },
            asia: { entry: '$25k - $45k', mid: '$45k - $70k', senior: '$70k - $100k', leadership: '$100k+' }
        },
        education: ['Bachelor\'s in Design, HCI, or Psychology', 'Design Bootcamps', 'Portfolio is key'],
        outlook: 'Growing importance as digital experience becomes a key competitive differentiator.'
    },
    'technical-writer': {
        slug: 'technical-writer',
        title: 'Technical Writer',
        overview: 'Technical Writers communicate complex information clearly and concisely. They create documentation, manuals, and guides that help users understand and use products effectively.',
        responsibilities: [
            'Write and edit technical documentation',
            'Collaborate with SMEs to gather information',
            'Create diagrams and illustrations',
            'Maintain and update existing documentation',
            'Ensure consistency in terminology and style'
        ],
        skills: {
            technical: ['Technical Writing', 'Markdown/XML', 'Documentation Tools', 'Basic Coding Knowledge', 'Content Management'],
            soft: ['Communication', 'Attention to Detail', 'Curiosity', 'Organization', 'Empathy for User']
        },
        careerPath: {
            entry: 'Junior Writer: Edit existing docs, write simple guides.',
            mid: 'Technical Writer: Own documentation sets, plan content structure.',
            senior: 'Senior Writer: Lead documentation strategy, manage complex projects.',
            leadership: 'Documentation Manager: Manage team, set standards, and align with product goals.'
        },
        salary: {
            us: { entry: '$60k - $85k', mid: '$85k - $115k', senior: '$115k - $150k', leadership: '$150k+' },
            eu: { entry: '€35k - €50k', mid: '€50k - €70k', senior: '€70k - €90k', leadership: '€90k+' },
            asia: { entry: '$25k - $40k', mid: '$40k - $65k', senior: '$65k - $90k', leadership: '$90k+' }
        },
        education: ['Bachelor\'s in English, Communications, or CS', 'Technical Writing Certificates'],
        outlook: 'Steady demand, especially in software and engineering sectors.'
    },
    'marketing-manager': {
        slug: 'marketing-manager',
        title: 'Marketing Manager',
        overview: 'Marketing Managers develop and execute strategies to promote products or services. They analyze market trends, manage campaigns, and measure performance to drive growth.',
        responsibilities: [
            'Develop marketing strategies and plans',
            'Manage marketing campaigns across channels',
            'Analyze market research and competitor data',
            'Collaborate with sales and product teams',
            'Track and report on marketing KPIs'
        ],
        skills: {
            technical: ['SEO/SEM', 'Analytics Tools', 'Content Marketing', 'Social Media', 'CRM'],
            soft: ['Creativity', 'Communication', 'Strategic Thinking', 'Project Management', 'Leadership']
        },
        careerPath: {
            entry: 'Marketing Coordinator: Support campaigns, content creation, and reporting.',
            mid: 'Marketing Manager: Manage specific channels or product lines.',
            senior: 'Senior Marketing Manager: Lead comprehensive strategies and larger budgets.',
            leadership: 'Marketing Director or CMO: Overall marketing strategy and brand vision.'
        },
        salary: {
            us: { entry: '$65k - $95k', mid: '$95k - $135k', senior: '$135k - $175k', leadership: '$175k+' },
            eu: { entry: '€40k - €60k', mid: '€60k - €80k', senior: '€80k - €110k', leadership: '€110k+' },
            asia: { entry: '$30k - $50k', mid: '$50k - $80k', senior: '$80k - $120k', leadership: '$120k+' }
        },
        education: ['Bachelor\'s in Marketing or Business', 'Digital Marketing Certifications'],
        outlook: 'Evolving role with shift towards digital and data-driven marketing.'
    },
    'financial-analyst': {
        slug: 'financial-analyst',
        title: 'Financial Analyst',
        overview: 'Financial Analysts guide businesses and individuals in making investment decisions. They assess the performance of stocks, bonds, and other types of investments.',
        responsibilities: [
            'Analyze financial data and trends',
            'Create financial models and forecasts',
            'Prepare reports and presentations',
            'Evaluate investment opportunities',
            'Monitor economic and market conditions'
        ],
        skills: {
            technical: ['Excel', 'Financial Modeling', 'Data Analysis', 'Accounting Principles', 'Financial Software'],
            soft: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Decision Making', 'Ethics']
        },
        careerPath: {
            entry: 'Junior Analyst: Data gathering, basic modeling, and reporting.',
            mid: 'Financial Analyst: Complex modeling, sector coverage, and recommendations.',
            senior: 'Senior Analyst: Lead analysis, strategic advising, and mentoring.',
            leadership: 'Finance Manager or CFO: Financial strategy and organizational leadership.'
        },
        salary: {
            us: { entry: '$65k - $90k', mid: '$90k - $125k', senior: '$125k - $160k', leadership: '$160k+' },
            eu: { entry: '€40k - €60k', mid: '€60k - €85k', senior: '€85k - €110k', leadership: '€110k+' },
            asia: { entry: '$30k - $50k', mid: '$50k - $80k', senior: '$80k - $110k', leadership: '$110k+' }
        },
        education: ['Bachelor\'s in Finance, Economics, or Accounting', 'CFA Certification'],
        outlook: 'Steady growth, with increasing reliance on big data and technology.'
    },
    'business-consultant': {
        slug: 'business-consultant',
        title: 'Business Consultant',
        overview: 'Business Consultants help organizations improve their performance and efficiency. They analyze businesses and create solutions to help them meet their goals.',
        responsibilities: [
            'Analyze business problems and data',
            'Interview stakeholders and employees',
            'Develop solutions and recommendations',
            'Present findings to management',
            'Assist with implementation of changes'
        ],
        skills: {
            technical: ['Data Analysis', 'Process Mapping', 'Financial Analysis', 'Project Management', 'Presentation Tools'],
            soft: ['Problem Solving', 'Communication', 'Adaptability', 'Interpersonal Skills', 'Persuasion']
        },
        careerPath: {
            entry: 'Associate Consultant: Research, data analysis, and support.',
            mid: 'Consultant: Lead workstreams, client interaction, and solution design.',
            senior: 'Senior Consultant/Manager: Manage projects, client relationships, and teams.',
            leadership: 'Partner/Director: Business development, firm strategy, and key accounts.'
        },
        salary: {
            us: { entry: '$70k - $100k', mid: '$100k - $140k', senior: '$140k - $190k', leadership: '$190k+' },
            eu: { entry: '€45k - €65k', mid: '€65k - €90k', senior: '€90k - €130k', leadership: '€130k+' },
            asia: { entry: '$35k - $60k', mid: '$60k - $90k', senior: '$90k - $140k', leadership: '$140k+' }
        },
        education: ['Bachelor\'s degree', 'MBA is highly valued'],
        outlook: 'Strong demand as companies seek efficiency and navigate change.'
    },
    'graphic-designer': {
        slug: 'graphic-designer',
        title: 'Graphic Designer',
        overview: 'Graphic Designers create visual concepts to communicate ideas that inspire, inform, and captivate consumers. They develop the overall layout and production design for various applications.',
        responsibilities: [
            'Create visual assets and illustrations',
            'Design layouts for print and digital',
            'Select colors, fonts, and images',
            'Collaborate with copywriters and creative directors',
            'Ensure brand consistency'
        ],
        skills: {
            technical: ['Adobe Creative Suite', 'Typography', 'Layout Design', 'Color Theory', 'Branding'],
            soft: ['Creativity', 'Communication', 'Time Management', 'Attention to Detail', 'Receptiveness to Feedback']
        },
        careerPath: {
            entry: 'Junior Designer: Production work, basic design tasks.',
            mid: 'Graphic Designer: Own projects, concept development.',
            senior: 'Senior Designer: Lead campaigns, mentor juniors, art direction.',
            leadership: 'Art Director or Creative Director: Vision, team management, and strategy.'
        },
        salary: {
            us: { entry: '$50k - $70k', mid: '$70k - $95k', senior: '$95k - $125k', leadership: '$125k+' },
            eu: { entry: '€30k - €45k', mid: '€45k - €65k', senior: '€65k - €85k', leadership: '€85k+' },
            asia: { entry: '$20k - $40k', mid: '$40k - $65k', senior: '$65k - $90k', leadership: '$90k+' }
        },
        education: ['Bachelor\'s in Graphic Design or Fine Arts', 'Strong Portfolio'],
        outlook: 'Competitive field; digital design skills are increasingly important.'
    },
    'content-writer': {
        slug: 'content-writer',
        title: 'Content Writer',
        overview: 'Content Writers create engaging and informative content for various platforms. They research topics and write articles, blog posts, and marketing copy to attract and retain audiences.',
        responsibilities: [
            'Research industry-related topics',
            'Write clear and compelling copy',
            'Proofread and edit content',
            'Optimize content for SEO',
            'Collaborate with marketing and design teams'
        ],
        skills: {
            technical: ['Copywriting', 'SEO', 'CMS (WordPress)', 'Research', 'Editing'],
            soft: ['Creativity', 'Time Management', 'Adaptability', 'Communication', 'Attention to Detail']
        },
        careerPath: {
            entry: 'Junior Writer: Blog posts, social captions, basic copy.',
            mid: 'Content Writer: Long-form content, strategy contribution.',
            senior: 'Senior Writer/Editor: Content strategy, editing, managing writers.',
            leadership: 'Content Manager or Head of Content: Strategy, team management, and editorial direction.'
        },
        salary: {
            us: { entry: '$45k - $65k', mid: '$65k - $90k', senior: '$90k - $120k', leadership: '$120k+' },
            eu: { entry: '€30k - €45k', mid: '€45k - €60k', senior: '€60k - €80k', leadership: '€80k+' },
            asia: { entry: '$20k - $35k', mid: '$35k - $55k', senior: '$55k - $80k', leadership: '$80k+' }
        },
        education: ['Bachelor\'s in English, Journalism, or Communications', 'Portfolio'],
        outlook: 'Growing demand for high-quality digital content.'
    },
    'video-editor': {
        slug: 'video-editor',
        title: 'Video Editor',
        overview: 'Video Editors manipulate and edit film pieces in a way that is invisible to the audience. They take raw footage and transform it into a polished final product.',
        responsibilities: [
            'Assemble raw footage',
            'Input sound and graphics',
            'Color grading and correction',
            'Ensure logical sequencing and smooth running',
            'Consult with director and production team'
        ],
        skills: {
            technical: ['Premiere Pro/Final Cut', 'After Effects', 'Color Grading', 'Audio Editing', 'Storytelling'],
            soft: ['Creativity', 'Patience', 'Attention to Detail', 'Communication', 'Time Management']
        },
        careerPath: {
            entry: 'Assistant Editor: Organizing footage, basic cuts.',
            mid: 'Video Editor: Full editing responsibility, creative input.',
            senior: 'Senior Editor: Complex projects, narrative structure, supervising assistants.',
            leadership: 'Post-Production Supervisor: Managing workflow, budgets, and teams.'
        },
        salary: {
            us: { entry: '$50k - $75k', mid: '$75k - $100k', senior: '$100k - $140k', leadership: '$140k+' },
            eu: { entry: '€30k - €50k', mid: '€50k - €70k', senior: '€70k - €90k', leadership: '€90k+' },
            asia: { entry: '$20k - $40k', mid: '$40k - $65k', senior: '$65k - $90k', leadership: '$90k+' }
        },
        education: ['Bachelor\'s in Film or Media', 'Portfolio/Reel'],
        outlook: 'High demand due to explosion of video content on social media and streaming.'
    },
    'registered-nurse': {
        slug: 'registered-nurse',
        title: 'Registered Nurse',
        overview: 'Registered Nurses (RNs) provide and coordinate patient care, educate patients and the public about various health conditions, and provide advice and emotional support to patients and their families.',
        responsibilities: [
            'Assess patient health problems and needs',
            'Develop and implement nursing care plans',
            'Administer medications and treatments',
            'Monitor and record patient progress',
            'Educate patients on health maintenance'
        ],
        skills: {
            technical: ['Clinical Skills', 'Patient Care', 'Medical Terminology', 'EMR Systems', 'Pharmacology'],
            soft: ['Empathy', 'Communication', 'Critical Thinking', 'Stamina', 'Emotional Stability']
        },
        careerPath: {
            entry: 'Staff Nurse: Direct patient care under supervision.',
            mid: 'Charge Nurse: Shift leadership, specialized care.',
            senior: 'Nurse Manager/Specialist: Unit management, advanced practice.',
            leadership: 'Director of Nursing: Departmental leadership, policy, and quality assurance.'
        },
        salary: {
            us: { entry: '$60k - $80k', mid: '$80k - $100k', senior: '$100k - $130k', leadership: '$130k+' },
            eu: { entry: '€35k - €50k', mid: '€50k - €70k', senior: '€70k - €90k', leadership: '€90k+' },
            asia: { entry: '$25k - $45k', mid: '$45k - $70k', senior: '$70k - $95k', leadership: '$95k+' }
        },
        education: ['Bachelor of Science in Nursing (BSN)', 'NCLEX-RN Licensure'],
        outlook: 'Very strong demand due to aging populations and healthcare needs.'
    },
    'medical-doctor': {
        slug: 'medical-doctor',
        title: 'Medical Doctor',
        overview: 'Medical Doctors diagnose and treat injuries and illnesses. They examine patients, take medical histories, prescribe medications, and order, perform, and interpret diagnostic tests.',
        responsibilities: [
            'Examine patients and assess health',
            'Diagnose illnesses and injuries',
            'Prescribe treatments and medications',
            'Order and interpret diagnostic tests',
            'Counsel patients on diet, hygiene, and preventive care'
        ],
        skills: {
            technical: ['Medical Knowledge', 'Diagnosis', 'Treatment Planning', 'Surgery (if applicable)', 'Patient Management'],
            soft: ['Empathy', 'Communication', 'Decision Making', 'Leadership', 'Problem Solving']
        },
        careerPath: {
            entry: 'Resident: Supervised practice, specialized training.',
            mid: 'Attending Physician: Independent practice, patient management.',
            senior: 'Department Chief: Clinical leadership, administration.',
            leadership: 'Medical Director: Hospital strategy, policy, and oversight.'
        },
        salary: {
            us: { entry: '$60k - $80k (Residency)', mid: '$200k - $300k', senior: '$300k - $450k', leadership: '$450k+' },
            eu: { entry: '€40k - €60k', mid: '€80k - €150k', senior: '€150k - €250k', leadership: '€250k+' },
            asia: { entry: '$30k - $50k', mid: '$80k - $150k', senior: '$150k - $250k', leadership: '$250k+' }
        },
        education: ['Doctor of Medicine (MD) or DO', 'Residency Training', 'Medical License'],
        outlook: 'Consistent demand, with shortages in many specialties and regions.'
    },
    'pharmacist': {
        slug: 'pharmacist',
        title: 'Pharmacist',
        overview: 'Pharmacists dispense prescription medications to patients and offer expertise in the safe use of prescriptions. They also may conduct health and wellness screenings and provide immunizations.',
        responsibilities: [
            'Dispense prescription medications',
            'Check for drug interactions',
            'Advise patients on medication use',
            'Administer immunizations',
            'Manage pharmacy inventory'
        ],
        skills: {
            technical: ['Pharmacology', 'Drug Interactions', 'Pharmacy Law', 'Compounding', 'Patient Counseling'],
            soft: ['Attention to Detail', 'Communication', 'Integrity', 'Analytical Skills', 'Customer Service']
        },
        careerPath: {
            entry: 'Staff Pharmacist: Dispensing, patient counseling.',
            mid: 'Clinical Pharmacist: Specialized care, hospital rounds.',
            senior: 'Pharmacy Manager: Operations, staff supervision.',
            leadership: 'Director of Pharmacy: Strategic management, compliance.'
        },
        salary: {
            us: { entry: '$110k - $130k', mid: '$130k - $150k', senior: '$150k - $170k', leadership: '$170k+' },
            eu: { entry: '€50k - €70k', mid: '€70k - €90k', senior: '€90k - €110k', leadership: '€110k+' },
            asia: { entry: '$40k - $60k', mid: '$60k - $90k', senior: '$90k - $120k', leadership: '$120k+' }
        },
        education: ['Doctor of Pharmacy (Pharm.D.)', 'Pharmacy License'],
        outlook: 'Stable demand, with roles expanding into clinical services.'
    },
    'teacher': {
        slug: 'teacher',
        title: 'Teacher',
        overview: 'Teachers help students learn and apply concepts in subjects such as science, mathematics, and language arts. They plan lessons, grade assignments, and manage classroom dynamics.',
        responsibilities: [
            'Plan and deliver lessons',
            'Assess student progress',
            'Manage classroom behavior',
            'Communicate with parents',
            'Adapt teaching methods to student needs'
        ],
        skills: {
            technical: ['Curriculum Design', 'Subject Knowledge', 'Educational Technology', 'Assessment', 'Classroom Management'],
            soft: ['Patience', 'Communication', 'Creativity', 'Leadership', 'Empathy']
        },
        careerPath: {
            entry: 'Teacher: Classroom instruction.',
            mid: 'Lead Teacher/Mentor: Curriculum development, mentoring new teachers.',
            senior: 'Department Head: Subject area leadership.',
            leadership: 'Principal/Administrator: School management and operations.'
        },
        salary: {
            us: { entry: '$45k - $60k', mid: '$60k - $80k', senior: '$80k - $100k', leadership: '$100k+' },
            eu: { entry: '€30k - €45k', mid: '€45k - €60k', senior: '€60k - €80k', leadership: '€80k+' },
            asia: { entry: '$20k - $40k', mid: '$40k - $60k', senior: '$60k - $80k', leadership: '$80k+' }
        },
        education: ['Bachelor\'s in Education or Subject', 'Teaching License/Certification'],
        outlook: 'Constant demand, though varies by region and subject.'
    },
    'professor': {
        slug: 'professor',
        title: 'Professor',
        overview: 'Professors teach students at the college and university level. They also conduct research, publish scholarly papers, and contribute to the academic community.',
        responsibilities: [
            'Teach undergraduate and graduate courses',
            'Conduct original research',
            'Publish findings in journals',
            'Mentor students',
            'Serve on academic committees'
        ],
        skills: {
            technical: ['Subject Expertise', 'Research Methods', 'Academic Writing', 'Public Speaking', 'Grant Writing'],
            soft: ['Critical Thinking', 'Communication', 'Mentorship', 'Intellectual Curiosity', 'Organization']
        },
        careerPath: {
            entry: 'Assistant Professor: Teaching, establishing research.',
            mid: 'Associate Professor: Tenured, established research record.',
            senior: 'Full Professor: Leadership in field, extensive publication.',
            leadership: 'Department Chair/Dean: Administrative leadership.'
        },
        salary: {
            us: { entry: '$70k - $100k', mid: '$100k - $140k', senior: '$140k - $200k', leadership: '$200k+' },
            eu: { entry: '€50k - €70k', mid: '€70k - €90k', senior: '€90k - €120k', leadership: '€120k+' },
            asia: { entry: '$40k - $70k', mid: '$70k - $100k', senior: '$100k - $150k', leadership: '$150k+' }
        },
        education: ['PhD in relevant field'],
        outlook: 'Competitive academic market, but steady demand for higher education.'
    },
    'training-specialist': {
        slug: 'training-specialist',
        title: 'Training Specialist',
        overview: 'Training Specialists plan, conduct, and administer programs that train employees and improve their skills and knowledge. They assess training needs and create development plans.',
        responsibilities: [
            'Assess training needs',
            'Design training programs and materials',
            'Conduct training sessions',
            'Evaluate training effectiveness',
            'Manage training budgets and schedules'
        ],
        skills: {
            technical: ['Instructional Design', 'LMS Platforms', 'Presentation', 'Facilitation', 'Assessment'],
            soft: ['Communication', 'Enthusiasm', 'Organization', 'Adaptability', 'Interpersonal Skills']
        },
        careerPath: {
            entry: 'Trainer: Delivering established content.',
            mid: 'Training Specialist: Designing content and programs.',
            senior: 'Training Manager: Overseeing training strategy and team.',
            leadership: 'Director of L&D: Organizational learning strategy.'
        },
        salary: {
            us: { entry: '$55k - $75k', mid: '$75k - $95k', senior: '$95k - $120k', leadership: '$120k+' },
            eu: { entry: '€35k - €50k', mid: '€50k - €70k', senior: '€70k - €90k', leadership: '€90k+' },
            asia: { entry: '$25k - $45k', mid: '$45k - $70k', senior: '$70k - $95k', leadership: '$95k+' }
        },
        education: ['Bachelor\'s in HR, Education, or Psychology', 'CptD Certification'],
        outlook: 'Growing as companies invest in employee retention and upskilling.'
    },
    'lawyer': {
        slug: 'lawyer',
        title: 'Lawyer',
        overview: 'Lawyers advise and represent individuals, businesses, and government agencies on legal issues and disputes. They research laws, draft legal documents, and argue cases in court.',
        responsibilities: [
            'Advise clients on legal rights and obligations',
            'Represent clients in court',
            'Draft legal documents and contracts',
            'Research legal precedents',
            'Negotiate settlements'
        ],
        skills: {
            technical: ['Legal Research', 'Litigation', 'Contract Drafting', 'Negotiation', 'Legal Writing'],
            soft: ['Analytical Thinking', 'Persuasion', 'Communication', 'Ethics', 'Stress Management']
        },
        careerPath: {
            entry: 'Associate: Legal research, drafting, supporting partners.',
            mid: 'Senior Associate: Managing cases, client interaction.',
            senior: 'Partner: Client acquisition, firm management, high-stakes cases.',
            leadership: 'Managing Partner: Firm leadership and strategy.'
        },
        salary: {
            us: { entry: '$80k - $160k', mid: '$160k - $250k', senior: '$250k - $400k', leadership: '$400k+' },
            eu: { entry: '€50k - €80k', mid: '€80k - €120k', senior: '€120k - €200k', leadership: '€200k+' },
            asia: { entry: '$40k - $70k', mid: '$70k - $120k', senior: '$120k - $200k', leadership: '$200k+' }
        },
        education: ['Juris Doctor (JD) or LLB', 'Bar Exam Passage'],
        outlook: 'Competitive but steady; specialized areas like tech and IP law are growing.'
    },
    'paralegal': {
        slug: 'paralegal',
        title: 'Paralegal',
        overview: 'Paralegals assist lawyers by investigating facts, preparing legal documents, and researching legal precedent. They support legal proceedings and help maintain efficiency in law firms.',
        responsibilities: [
            'Conduct legal research',
            'Draft legal documents and correspondence',
            'Organize and maintain files',
            'Assist during trials',
            'Communicate with clients and witnesses'
        ],
        skills: {
            technical: ['Legal Research', 'Document Management', 'Legal Writing', 'Case Management Software', 'Procedural Knowledge'],
            soft: ['Organization', 'Attention to Detail', 'Communication', 'Multitasking', 'Ethics']
        },
        careerPath: {
            entry: 'Junior Paralegal: Administrative tasks, basic research.',
            mid: 'Paralegal: Drafting, case management, client contact.',
            senior: 'Senior Paralegal: Complex cases, mentoring, specialized areas.',
            leadership: 'Paralegal Manager: Overseeing support staff and workflow.'
        },
        salary: {
            us: { entry: '$45k - $60k', mid: '$60k - $80k', senior: '$80k - $100k', leadership: '$100k+' },
            eu: { entry: '€30k - €45k', mid: '€45k - €60k', senior: '€60k - €75k', leadership: '€75k+' },
            asia: { entry: '$20k - $35k', mid: '$35k - $55k', senior: '$55k - $75k', leadership: '$75k+' }
        },
        education: ['Associate\'s or Bachelor\'s degree', 'Paralegal Certificate'],
        outlook: 'Strong demand as firms seek to increase efficiency and reduce costs.'
    },
    'compliance-officer': {
        slug: 'compliance-officer',
        title: 'Compliance Officer',
        overview: 'Compliance Officers ensure that an organization adheres to legal standards and in-house policies. They enforce regulations and provide guidance on compliance matters.',
        responsibilities: [
            'Monitor business operations for compliance',
            'Conduct risk assessments',
            'Develop and implement compliance policies',
            'Investigate compliance breaches',
            'Train employees on regulations'
        ],
        skills: {
            technical: ['Regulatory Knowledge', 'Risk Assessment', 'Auditing', 'Policy Writing', 'Data Analysis'],
            soft: ['Integrity', 'Communication', 'Attention to Detail', 'Problem Solving', 'Firmness']
        },
        careerPath: {
            entry: 'Compliance Analyst: Monitoring, reporting, basic audits.',
            mid: 'Compliance Officer: Managing specific programs, advisory.',
            senior: 'Compliance Manager: Overseeing team, strategy, regulatory relationships.',
            leadership: 'Chief Compliance Officer: Executive leadership, risk strategy.'
        },
        salary: {
            us: { entry: '$65k - $90k', mid: '$90k - $120k', senior: '$120k - $160k', leadership: '$160k+' },
            eu: { entry: '€40k - €60k', mid: '€60k - €85k', senior: '€85k - €110k', leadership: '€110k+' },
            asia: { entry: '$30k - $50k', mid: '$50k - $80k', senior: '$80k - $110k', leadership: '$110k+' }
        },
        education: ['Bachelor\'s in Law, Business, or Finance', 'Compliance Certifications'],
        outlook: 'Growing importance due to increasing regulation in finance, tech, and healthcare.'
    },
    'sales-manager': {
        slug: 'sales-manager',
        title: 'Sales Manager',
        overview: 'Sales Managers direct organizations\' sales teams. They set sales goals, analyze data, and develop training programs for organizations\' sales representatives.',
        responsibilities: [
            'Set sales goals and quotas',
            'Analyze sales statistics',
            'Develop sales strategies',
            'Hire and train sales staff',
            'Manage customer relationships'
        ],
        skills: {
            technical: ['CRM (Salesforce)', 'Sales Forecasting', 'Data Analysis', 'Pipeline Management', 'Negotiation'],
            soft: ['Leadership', 'Communication', 'Motivation', 'Strategic Thinking', 'Resilience']
        },
        careerPath: {
            entry: 'Sales Representative: Individual contributor, closing deals.',
            mid: 'Sales Manager: Managing a team, hitting team quotas.',
            senior: 'Director of Sales: Regional or segment leadership, strategy.',
            leadership: 'VP of Sales or CRO: Revenue strategy, executive leadership.'
        },
        salary: {
            us: { entry: '$80k - $120k', mid: '$120k - $180k', senior: '$180k - $250k', leadership: '$250k+' },
            eu: { entry: '€50k - €80k', mid: '€80k - €120k', senior: '€120k - €160k', leadership: '€160k+' },
            asia: { entry: '$40k - $70k', mid: '$70k - $110k', senior: '$110k - $160k', leadership: '$160k+' }
        },
        education: ['Bachelor\'s in Business or related field', 'Proven sales record'],
        outlook: 'Crucial role for revenue generation; high demand for effective leaders.'
    },
    'account-executive': {
        slug: 'account-executive',
        title: 'Account Executive',
        overview: 'Account Executives serve as the primary point of contact between a business and its clients. They are responsible for finding new clients and maintaining existing relationships.',
        responsibilities: [
            'Identify and prospect new clients',
            'Present products or services',
            'Negotiate contracts and close deals',
            'Manage client relationships',
            'Meet sales quotas'
        ],
        skills: {
            technical: ['Sales Methodologies', 'CRM', 'Presentation', 'Negotiation', 'Product Knowledge'],
            soft: ['Communication', 'Persuasion', 'Resilience', 'Active Listening', 'Time Management']
        },
        careerPath: {
            entry: 'SDR/BDR: Lead generation, prospecting.',
            mid: 'Account Executive: Closing deals, managing pipeline.',
            senior: 'Senior AE / Enterprise AE: Large complex deals, strategic accounts.',
            leadership: 'Sales Manager: Team leadership.'
        },
        salary: {
            us: { entry: '$60k - $90k', mid: '$90k - $150k', senior: '$150k - $250k', leadership: '$250k+' },
            eu: { entry: '€40k - €60k', mid: '€60k - €90k', senior: '€90k - €140k', leadership: '€140k+' },
            asia: { entry: '$30k - $50k', mid: '$50k - $80k', senior: '$80k - $120k', leadership: '$120k+' }
        },
        education: ['Bachelor\'s degree', 'Sales experience'],
        outlook: 'High demand, especially in B2B tech and services.'
    },
    'customer-success-manager': {
        slug: 'customer-success-manager',
        title: 'Customer Success Manager',
        overview: 'Customer Success Managers ensure customers achieve their desired outcomes while using a product or service. They focus on retention, adoption, and customer satisfaction.',
        responsibilities: [
            'Onboard new customers',
            'Drive product adoption and usage',
            'Address customer concerns and issues',
            'Identify upsell opportunities',
            'Advocate for customer needs internally'
        ],
        skills: {
            technical: ['Product Knowledge', 'CRM', 'Support Tools', 'Data Analysis', 'Project Management'],
            soft: ['Empathy', 'Communication', 'Problem Solving', 'Relationship Building', 'Patience']
        },
        careerPath: {
            entry: 'CS Associate: Support tasks, basic onboarding.',
            mid: 'CS Manager: Managing portfolio of accounts.',
            senior: 'Senior CSM / Enterprise CSM: High-value accounts, strategic partnership.',
            leadership: 'Director of CS: Strategy, team management, retention goals.'
        },
        salary: {
            us: { entry: '$60k - $85k', mid: '$85k - $120k', senior: '$120k - $160k', leadership: '$160k+' },
            eu: { entry: '€40k - €55k', mid: '€55k - €75k', senior: '€75k - €100k', leadership: '€100k+' },
            asia: { entry: '$30k - $50k', mid: '$50k - $75k', senior: '$75k - $100k', leadership: '$100k+' }
        },
        education: ['Bachelor\'s degree', 'Experience in support or sales'],
        outlook: 'Rapidly growing role in SaaS and subscription-based businesses.'
    },
    'operations-manager': {
        slug: 'operations-manager',
        title: 'Operations Manager',
        overview: 'Operations Managers oversee the production of goods and provision of services. They ensure the organization runs efficiently and effectively to meet customer requirements.',
        responsibilities: [
            'Manage daily operations and processes',
            'Monitor budget and expenses',
            'Supervise staff and allocate resources',
            'Improve operational systems',
            'Ensure compliance with policies'
        ],
        skills: {
            technical: ['Process Improvement', 'Budgeting', 'Supply Chain', 'Project Management', 'Data Analysis'],
            soft: ['Leadership', 'Problem Solving', 'Decision Making', 'Communication', 'Organization']
        },
        careerPath: {
            entry: 'Operations Coordinator: Support tasks, scheduling, reporting.',
            mid: 'Operations Manager: Managing specific department or function.',
            senior: 'Senior Ops Manager: Multi-department oversight, strategy.',
            leadership: 'COO or VP of Operations: Organizational strategy and execution.'
        },
        salary: {
            us: { entry: '$65k - $90k', mid: '$90k - $130k', senior: '$130k - $170k', leadership: '$170k+' },
            eu: { entry: '€40k - €60k', mid: '€60k - €85k', senior: '€85k - €110k', leadership: '€110k+' },
            asia: { entry: '$30k - $50k', mid: '$50k - $80k', senior: '$80k - $110k', leadership: '$110k+' }
        },
        education: ['Bachelor\'s in Business or Operations', 'MBA often preferred'],
        outlook: 'Steady demand across all sectors to drive efficiency.'
    },
    'supply-chain-analyst': {
        slug: 'supply-chain-analyst',
        title: 'Supply Chain Analyst',
        overview: 'Supply Chain Analysts analyze data to improve the efficiency of the supply chain. They look for ways to reduce costs, improve delivery times, and manage inventory.',
        responsibilities: [
            'Analyze supply chain data',
            'Forecast demand and inventory needs',
            'Evaluate vendor performance',
            'Identify process bottlenecks',
            'Recommend improvements'
        ],
        skills: {
            technical: ['Data Analysis', 'ERP Systems', 'Forecasting', 'Logistics', 'Excel/SQL'],
            soft: ['Analytical Thinking', 'Communication', 'Problem Solving', 'Attention to Detail', 'Negotiation']
        },
        careerPath: {
            entry: 'Junior Analyst: Data entry, basic reporting.',
            mid: 'Supply Chain Analyst: Modeling, vendor management, process improvement.',
            senior: 'Senior Analyst/Manager: Strategy, complex network design.',
            leadership: 'Director of Supply Chain: Global strategy, end-to-end management.'
        },
        salary: {
            us: { entry: '$60k - $80k', mid: '$80k - $110k', senior: '$110k - $140k', leadership: '$140k+' },
            eu: { entry: '€35k - €55k', mid: '€55k - €75k', senior: '€75k - €95k', leadership: '€95k+' },
            asia: { entry: '$25k - $45k', mid: '$45k - $70k', senior: '$70k - $100k', leadership: '$100k+' }
        },
        education: ['Bachelor\'s in Supply Chain, Business, or Engineering'],
        outlook: 'Crucial role as global supply chains become more complex.'
    },
    'project-manager': {
        slug: 'project-manager',
        title: 'Project Manager',
        overview: 'Project Managers plan, execute, and close projects. They define the scope, build timelines, manage resources, and ensure projects are delivered on time and within budget.',
        responsibilities: [
            'Define project scope and objectives',
            'Create project plans and schedules',
            'Manage resources and budget',
            'Communicate with stakeholders',
            'Mitigate project risks'
        ],
        skills: {
            technical: ['Project Management Methodologies (Agile/Waterfall)', 'Scheduling Tools', 'Budgeting', 'Risk Management', 'Reporting'],
            soft: ['Leadership', 'Communication', 'Organization', 'Negotiation', 'Problem Solving']
        },
        careerPath: {
            entry: 'Project Coordinator: Support PMs, schedule meetings, track tasks.',
            mid: 'Project Manager: Lead small to medium projects.',
            senior: 'Senior PM: Lead large, complex, or multiple projects.',
            leadership: 'Program Manager or Portfolio Manager: Strategic alignment of multiple projects.'
        },
        salary: {
            us: { entry: '$70k - $100k', mid: '$100k - $140k', senior: '$140k - $180k', leadership: '$180k+' },
            eu: { entry: '€45k - €65k', mid: '€65k - €90k', senior: '€90k - €120k', leadership: '€120k+' },
            asia: { entry: '$35k - $60k', mid: '$60k - $90k', senior: '$90k - $130k', leadership: '$130k+' }
        },
        education: ['Bachelor\'s degree', 'PMP or Agile Certification'],
        outlook: 'High demand across IT, construction, and healthcare sectors.'
    }
};
