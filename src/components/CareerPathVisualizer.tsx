import React, { useState } from 'react';
import SalaryGrowthChart from './SalaryGrowthChart';
import { getAIJobSuggestions } from '../services/aiService';

interface FormData {
  education: string;
  fieldOfStudy: string;
  certifications: string[];
  openToFurtherEducation: boolean;
  interests: string[];
  skills: string[];
  school: string;
}

interface CareerSuggestion {
  title: string;
  description: string;
  requiresAdvancedEducation: boolean;
}

interface AIJobSuggestion {
  title: string;
  description: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  growthRate: number;
  demandLevel: 'high' | 'medium' | 'low';
}

const CareerPathVisualizer: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    education: '',
    fieldOfStudy: '',
    certifications: [],
    openToFurtherEducation: false,
    interests: [],
    skills: [],
    school: '',
  });
  const [results, setResults] = useState<CareerSuggestion[]>([]);
  const [aiResults, setAIResults] = useState<AIJobSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAIResults, setShowAIResults] = useState(false);

  const handleEducationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, education: e.target.value });
  };

  const handleFieldOfStudyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, fieldOfStudy: e.target.value });
  };
  
  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, school: e.target.value });
  };
  
  const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, value],
      });
    } else {
      setFormData({
        ...formData,
        certifications: formData.certifications.filter((cert) => cert !== value),
      });
    }
  };
  
  const handleFurtherEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, openToFurtherEducation: e.target.checked });
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFormData({
        ...formData,
        interests: [...formData.interests, value],
      });
    } else {
      setFormData({
        ...formData,
        interests: formData.interests.filter((interest) => interest !== value),
      });
    }
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFormData({
        ...formData,
        skills: [...formData.skills, value],
      });
    } else {
      setFormData({
        ...formData,
        skills: formData.skills.filter((skill) => skill !== value),
      });
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Function to match education, field of study, and certifications to job titles
  const matchToCareerSuggestions = (): CareerSuggestion[] => {
    const suggestions: CareerSuggestion[] = [];
    
    // Basic matching logic based on field of study and interests
    if (formData.fieldOfStudy.toLowerCase().includes('computer') || 
        formData.fieldOfStudy.toLowerCase().includes('tech') ||
        formData.interests.includes('Technology')) {
      suggestions.push({
        title: 'Software Developer',
        description: `Based on your ${formData.education.toLowerCase()} in ${formData.fieldOfStudy} and interests in ${formData.interests.slice(0, 2).join(', ')}.`,
        requiresAdvancedEducation: false
      });
      
      suggestions.push({
        title: 'UX Designer',
        description: `Leveraging your ${formData.education.toLowerCase()} education and skills in ${formData.skills.slice(0, 2).join(', ')}.`,
        requiresAdvancedEducation: false
      });
    }
    
    if (formData.fieldOfStudy.toLowerCase().includes('business') || 
        formData.interests.includes('Business')) {
      suggestions.push({
        title: 'Product Manager',
        description: `Combines your ${formData.education.toLowerCase()} background with skills in ${formData.skills.slice(0, 2).join(', ')}.`,
        requiresAdvancedEducation: false
      });
    }
    
    if (formData.fieldOfStudy.toLowerCase().includes('data') || 
        formData.certifications.includes('Data Analysis')) {
      suggestions.push({
        title: 'Data Analyst',
        description: `Perfect match for your ${formData.education.toLowerCase()} and ${formData.certifications.includes('Data Analysis') ? 'Data Analysis certification' : 'analytical skills'}.`,
        requiresAdvancedEducation: false
      });
    }
    
    if (formData.interests.includes('Healthcare')) {
      suggestions.push({
        title: 'Healthcare Administrator',
        description: `Based on your interest in healthcare and skills in ${formData.skills.slice(0, 2).join(', ')}.`,
        requiresAdvancedEducation: false
      });
    }
    
    if (formData.interests.includes('Education')) {
      suggestions.push({
        title: 'Instructional Designer',
        description: `Combines your educational background with skills in ${formData.skills.slice(0, 2).join(', ')}.`,
        requiresAdvancedEducation: false
      });
    }
    
    // Add stretch career option if open to further education
    if (formData.openToFurtherEducation) {
      if (formData.interests.includes('Technology')) {
        suggestions.push({
          title: 'Artificial Intelligence Specialist',
          description: 'This role typically requires an advanced degree in Computer Science, AI, or related field.',
          requiresAdvancedEducation: true
        });
      } else if (formData.interests.includes('Healthcare')) {
        suggestions.push({
          title: 'Healthcare Informatics Specialist',
          description: 'This role often requires advanced certifications or graduate education in health informatics.',
          requiresAdvancedEducation: true
        });
      } else if (formData.interests.includes('Business')) {
        suggestions.push({
          title: 'Management Consultant',
          description: 'This career path often benefits from an MBA or other advanced business credentials.',
          requiresAdvancedEducation: true
        });
      } else {
        suggestions.push({
          title: 'Research Analyst',
          description: 'This role typically requires graduate-level education and specialized research skills.',
          requiresAdvancedEducation: true
        });
      }
    }
    
    // Limit to a max of 3 suggestions (or 4 if stretch option is included)
    const maxSuggestions = formData.openToFurtherEducation ? 4 : 3;
    return suggestions.slice(0, maxSuggestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // Get traditional career suggestions
    const careerSuggestions = matchToCareerSuggestions();
    setResults(careerSuggestions);
    
    try {
      // Get AI-powered job suggestions
      const aiSuggestions = await getAIJobSuggestions(formData);
      setAIResults(aiSuggestions);
      setShowAIResults(true);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      setShowAIResults(false);
    } finally {
      setIsLoading(false);
      nextStep();
    }
  };

  // Function to create a URL-friendly job title
  const formatJobTitleForUrl = (title: string): string => {
    return encodeURIComponent(title.replace(/ /g, '+'));
  };

  // Function to generate specific job roles based on a general career path
  const getSpecificJobRoles = (careerPath: string) => {
    const jobRoleMap: Record<string, Array<{title: string, description: string}>> = {
      'Software Developer': [
        { title: 'Front-End Developer', description: 'Specialist in building user interfaces and experiences' },
        { title: 'Backend Software Engineer', description: 'Focus on server-side applications and databases' },
        { title: 'Full Stack Developer', description: 'Works on both client and server sides of applications' }
      ],
      'UX Designer': [
        { title: 'UX Researcher', description: 'Conducts user research to inform design decisions' },
        { title: 'Interaction Designer', description: 'Focuses on how users interact with products' },
        { title: 'UI/UX Designer', description: 'Creates both visual design and user experiences' }
      ],
      'Product Manager': [
        { title: 'Technical Product Manager', description: 'Manages products with complex technical requirements' },
        { title: 'Associate Product Manager', description: 'Entry-level role perfect for gaining experience' },
        { title: 'Product Owner', description: 'Represents users and stakeholders in agile teams' }
      ],
      'Data Analyst': [
        { title: 'Business Intelligence Analyst', description: 'Focuses on data to inform business decisions' },
        { title: 'Marketing Analyst', description: 'Specializes in analyzing marketing and customer data' },
        { title: 'Financial Data Analyst', description: 'Works with financial data and performance metrics' }
      ],
      'Healthcare Administrator': [
        { title: 'Clinical Operations Manager', description: 'Oversees daily operations in healthcare settings' },
        { title: 'Health Information Manager', description: 'Manages patient data and health records' },
        { title: 'Healthcare Compliance Officer', description: 'Ensures adherence to healthcare regulations' }
      ],
      'Instructional Designer': [
        { title: 'E-Learning Developer', description: 'Creates digital learning experiences and content' },
        { title: 'Corporate Trainer', description: 'Designs and delivers educational programs in businesses' },
        { title: 'Curriculum Developer', description: 'Creates educational curriculum and teaching materials' }
      ],
      'Artificial Intelligence Specialist': [
        { title: 'Machine Learning Engineer', description: 'Builds AI systems that can learn from data' },
        { title: 'AI Researcher', description: 'Advances the field through research and development' },
        { title: 'NLP Engineer', description: 'Specializes in natural language processing technologies' }
      ],
      'Healthcare Informatics Specialist': [
        { title: 'Clinical Informatics Specialist', description: 'Bridges healthcare and information technology' },
        { title: 'Health Data Scientist', description: 'Analyzes healthcare data for insights and improvements' },
        { title: 'EMR Implementation Specialist', description: 'Helps organizations adopt electronic medical records' }
      ],
      'Management Consultant': [
        { title: 'Strategy Consultant', description: 'Advises organizations on strategic business decisions' },
        { title: 'Operations Consultant', description: 'Improves business processes and efficiency' },
        { title: 'Change Management Consultant', description: 'Helps organizations navigate transitions' }
      ],
      'Research Analyst': [
        { title: 'Market Research Analyst', description: 'Studies market conditions and consumer demand' },
        { title: 'Policy Research Analyst', description: 'Analyzes issues to inform policy development' },
        { title: 'Academic Researcher', description: 'Conducts research in academic or scientific institutions' }
      ]
    };

    // Return default jobs if the career path isn't in our map
    if (!jobRoleMap[careerPath]) {
      return [
        { title: `Junior ${careerPath}`, description: 'Entry-level position to start your career' },
        { title: `Senior ${careerPath}`, description: 'Advanced role for experienced professionals' },
        { title: `${careerPath} Team Lead`, description: 'Leadership position overseeing a team' }
      ];
    }

    return jobRoleMap[careerPath];
  };

  // Format data for salary chart
  const formatSalaryData = () => {
    return aiResults.map(job => ({
      title: job.title,
      min: job.salaryRange.min,
      max: job.salaryRange.max,
      currency: job.salaryRange.currency
    }));
  };

  // Format data for growth chart
  const formatGrowthData = () => {
    return aiResults.map(job => ({
      title: job.title,
      growthRate: job.growthRate
    }));
  };

  // Format the school name (capitalize first letters)
  const formatSchoolName = (school: string): string => {
    if (!school) return '';
    return school
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div id="visualizer" className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Career Path Visualizer</h2>
      
      {step === 1 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Step 1: Educational Background</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Highest Level of Education</label>
              <select 
                value={formData.education}
                onChange={handleEducationChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your education</option>
                <option value="High School">High School</option>
                <option value="Associate's Degree">Associate's Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Field of Study</label>
              <input
                type="text"
                value={formData.fieldOfStudy}
                onChange={handleFieldOfStudyChange}
                placeholder="e.g., Computer Science, Business, etc."
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">College/University (Optional)</label>
              <input
                type="text"
                value={formData.school}
                onChange={handleSchoolChange}
                placeholder="e.g., University of XYZ"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Certifications (if any)</label>
              <div className="grid grid-cols-2 gap-3">
                {['Project Management', 'Data Analysis', 'Marketing', 'Web Development', 'Design', 'Cloud Computing'].map((cert) => (
                  <div key={cert} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`cert-${cert}`}
                      value={cert}
                      checked={formData.certifications.includes(cert)}
                      onChange={handleCertificationChange}
                      className="mr-2"
                    />
                    <label htmlFor={`cert-${cert}`} className="text-gray-700">{cert}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="further-education"
                checked={formData.openToFurtherEducation}
                onChange={handleFurtherEducationChange}
                className="mr-2"
              />
              <label htmlFor="further-education" className="text-gray-700">
                I'm open to further education (grad school or advanced certifications)
              </label>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick={nextStep}
              disabled={!formData.education || !formData.fieldOfStudy}
              className={`px-4 py-2 rounded ${formData.education && formData.fieldOfStudy ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Step 2: Career Interests</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {['Technology', 'Healthcare', 'Business', 'Education', 'Arts', 'Science', 'Engineering', 'Social Services', 'Finance', 'Marketing', 'Legal', 'Environmental', 'Hospitality', 'Government', 'Media', 'Construction'].map((interest) => (
              <div key={interest} className="flex items-center">
                <input
                  type="checkbox"
                  id={`interest-${interest}`}
                  value={interest}
                  checked={formData.interests.includes(interest)}
                  onChange={handleInterestChange}
                  className="mr-2"
                />
                <label htmlFor={`interest-${interest}`} className="text-gray-700">{interest}</label>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button 
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Back
            </button>
            <button 
              onClick={nextStep}
              disabled={formData.interests.length === 0}
              className={`px-4 py-2 rounded ${formData.interests.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Step 3: Applicable Skills</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {['Communication', 'Problem Solving', 'Leadership', 'Creativity', 'Technical', 'Organization', 'Teamwork', 'Critical Thinking'].map((skill) => (
              <div key={skill} className="flex items-center">
                <input
                  type="checkbox"
                  id={`skill-${skill}`}
                  value={skill}
                  checked={formData.skills.includes(skill)}
                  onChange={handleSkillChange}
                  className="mr-2"
                />
                <label htmlFor={`skill-${skill}`} className="text-gray-700">{skill}</label>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button 
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Back
            </button>
            <button 
              onClick={handleSubmit}
              disabled={formData.skills.length === 0}
              className={`px-4 py-2 rounded ${formData.skills.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Your Career Suggestions</h3>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Analyzing your profile and matching to careers...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* AI-powered suggestions section */}
                {showAIResults && (
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2">AI-POWERED</span>
                      <h4 className="text-lg font-medium">Personalized Career Matches</h4>
                    </div>
                    
                    {formData.school && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
                        <p>Great! We'll also look for roles where your school's alumni are active, such as {aiResults[0]?.title || "Software Developer"} from {formatSchoolName(formData.school)}.</p>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {aiResults.map((result, index) => (
                        <div 
                          key={`ai-${index}`} 
                          className="p-4 border rounded border-blue-300 bg-blue-50"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-semibold text-lg">{result.title}</h4>
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                  result.demandLevel === 'high' 
                                    ? 'bg-green-100 text-green-800' 
                                    : result.demandLevel === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {result.demandLevel.toUpperCase()} DEMAND
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                {result.description}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-3">
                                <div className="bg-white px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                                  Salary: {new Intl.NumberFormat('en-US', { 
                                    style: 'currency', 
                                    currency: result.salaryRange.currency,
                                    maximumFractionDigits: 0 
                                  }).format(result.salaryRange.min)} - {new Intl.NumberFormat('en-US', { 
                                    style: 'currency', 
                                    currency: result.salaryRange.currency,
                                    maximumFractionDigits: 0 
                                  }).format(result.salaryRange.max)}
                                </div>
                                <div className="bg-white px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                                  Growth: {result.growthRate}% over 5 years
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <a 
                              href={`https://www.indeed.com/jobs?q=${formatJobTitleForUrl(result.title)}&l=remote`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                              Search on Indeed
                            </a>
                            <a 
                              href={`https://www.linkedin.com/jobs/search/?keywords=${formatJobTitleForUrl(result.title)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                              Search on LinkedIn
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Salary and growth charts */}
                    {aiResults.length > 0 && (
                      <SalaryGrowthChart 
                        salaryData={formatSalaryData()} 
                        growthData={formatGrowthData()} 
                      />
                    )}
                  </div>
                )}
                
                {/* Traditional suggestions section */}
                <div>
                  <h4 className="text-lg font-medium mb-4">Additional Role Suggestions</h4>
                  <div className="space-y-6">
                    {results.map((result, index) => (
                      <div 
                        key={index} 
                        className={`p-4 border rounded ${result.requiresAdvancedEducation ? 'border-purple-200 bg-purple-50' : 'border-blue-200 bg-blue-50'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{result.title}</h4>
                            <p className="text-sm text-gray-600 mt-2">
                              {result.description}
                            </p>
                            {result.requiresAdvancedEducation && (
                              <p className="text-sm italic text-purple-700 mt-1">
                                This is a stretch option that requires advanced education.
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-700 mb-2">Specific Roles to Explore:</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Generate specific job titles based on the result.title */}
                            {getSpecificJobRoles(result.title).map((job, i) => (
                              <div key={i} className="bg-white p-3 rounded border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <p className="font-medium text-gray-800">{job.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{job.description}</p>
                                <div className="mt-3 flex space-x-2">
                                  <a
                                    href={`https://www.indeed.com/jobs?q=${formatJobTitleForUrl(job.title)}&l=remote`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-200"
                                  >
                                    Indeed
                                    <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                    </svg>
                                  </a>
                                  <a
                                    href={`https://www.linkedin.com/jobs/search/?keywords=${formatJobTitleForUrl(job.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded hover:bg-blue-200"
                                  >
                                    LinkedIn
                                    <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                    </svg>
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => {
                setStep(1);
                setFormData({
                  education: '',
                  fieldOfStudy: '',
                  certifications: [],
                  openToFurtherEducation: false,
                  interests: [],
                  skills: [],
                  school: '',
                });
                setResults([]);
                setAIResults([]);
                setShowAIResults(false);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPathVisualizer; 