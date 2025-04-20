// Comment out axios import since it's not being used in the mock version
// import axios from 'axios';

interface FormData {
  education: string;
  fieldOfStudy: string;
  certifications: string[];
  openToFurtherEducation: boolean;
  interests: string[];
  skills: string[];
}

interface JobSuggestion {
  title: string;
  description: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  growthRate: number; // Percentage growth over next 5 years
  demandLevel: 'high' | 'medium' | 'low';
}

// In a real application, this would call an actual OpenAI or job matching API
// For demo purposes, we're simulating the AI response
export const getAIJobSuggestions = async (formData: FormData): Promise<JobSuggestion[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This would be where you'd call the OpenAI API in a production app
  // Example OpenAI API call (commented out as it requires API key):
  /*
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4',
    messages: [
      { 
        role: 'system', 
        content: 'You are a career advisor AI that suggests personalized job roles based on education, skills, and interests.' 
      },
      { 
        role: 'user', 
        content: `Based on the following profile, suggest 3 specific job roles with salary ranges and growth forecast:
          Education: ${formData.education}
          Field of Study: ${formData.fieldOfStudy}
          Skills: ${formData.skills.join(', ')}
          Interests: ${formData.interests.join(', ')}
          Certifications: ${formData.certifications.join(', ')}
          Open to Further Education: ${formData.openToFurtherEducation ? 'Yes' : 'No'}
        `
      }
    ]
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Process OpenAI response to extract job suggestions
  const aiSuggestions = parseOpenAIResponse(response.data);
  return aiSuggestions;
  */
  
  // Mock AI suggestions based on formData
  return generateMockAISuggestions(formData);
};

// Helper function to generate mock AI suggestions based on the user's profile
function generateMockAISuggestions(formData: FormData): JobSuggestion[] {
  const suggestions: JobSuggestion[] = [];
  
  // Base salary ranges by education level (in USD)
  const salaryBaseByEducation: Record<string, number> = {
    'High School': 35000,
    'Associate\'s Degree': 45000,
    'Bachelor\'s Degree': 60000,
    'Master\'s Degree': 80000,
    'PhD': 100000
  };
  
  // Base salary by field with multipliers
  const fieldMultipliers: Record<string, number> = {
    'Computer Science': 1.3,
    'Engineering': 1.25,
    'Business': 1.1,
    'Healthcare': 1.15,
    'Education': 0.9,
    'Arts': 0.85,
    'Science': 1.2,
    'Social Services': 0.8
  };
  
  // Find the best field multiplier based on the field of study or interests
  let bestFieldMultiplier = 1.0;
  const fieldLower = formData.fieldOfStudy.toLowerCase();
  
  Object.keys(fieldMultipliers).forEach(field => {
    if (fieldLower.includes(field.toLowerCase())) {
      bestFieldMultiplier = fieldMultipliers[field];
    }
  });
  
  // If no matching field found in field of study, check interests
  if (bestFieldMultiplier === 1.0) {
    formData.interests.forEach(interest => {
      const matchingField = Object.keys(fieldMultipliers).find(
        field => field.toLowerCase() === interest.toLowerCase()
      );
      if (matchingField && fieldMultipliers[matchingField] > bestFieldMultiplier) {
        bestFieldMultiplier = fieldMultipliers[matchingField];
      }
    });
  }
  
  // Calculate base salary
  const baseSalary = (salaryBaseByEducation[formData.education] || 50000) * bestFieldMultiplier;
  
  // Generate tech-related suggestions if relevant
  if (
    formData.fieldOfStudy.toLowerCase().includes('computer') ||
    formData.fieldOfStudy.toLowerCase().includes('tech') ||
    formData.interests.includes('Technology') ||
    formData.skills.includes('Technical')
  ) {
    suggestions.push({
      title: 'AI Application Developer',
      description: 'Develop applications that leverage artificial intelligence and machine learning technologies.',
      salaryRange: {
        min: Math.round(baseSalary * 1.2),
        max: Math.round(baseSalary * 1.8),
        currency: 'USD'
      },
      growthRate: 22,
      demandLevel: 'high'
    });
    
    if (formData.skills.includes('Problem Solving') || formData.skills.includes('Critical Thinking')) {
      suggestions.push({
        title: 'DevOps Engineer',
        description: 'Build and maintain the infrastructure and tools that allow for the rapid development and deployment of software.',
        salaryRange: {
          min: Math.round(baseSalary * 1.1),
          max: Math.round(baseSalary * 1.6),
          currency: 'USD'
        },
        growthRate: 18,
        demandLevel: 'high'
      });
    }
  }
  
  // Generate business-related suggestions if relevant
  if (
    formData.fieldOfStudy.toLowerCase().includes('business') ||
    formData.interests.includes('Business')
  ) {
    suggestions.push({
      title: 'Digital Marketing Strategist',
      description: 'Develop and implement marketing strategies across digital channels to achieve business objectives.',
      salaryRange: {
        min: Math.round(baseSalary * 0.9),
        max: Math.round(baseSalary * 1.4),
        currency: 'USD'
      },
      growthRate: 15,
      demandLevel: 'medium'
    });
    
    if (formData.skills.includes('Leadership') || formData.certifications.includes('Project Management')) {
      suggestions.push({
        title: 'Agile Project Manager',
        description: 'Lead teams using agile methodologies to deliver projects efficiently and effectively.',
        salaryRange: {
          min: Math.round(baseSalary * 1.0),
          max: Math.round(baseSalary * 1.5),
          currency: 'USD'
        },
        growthRate: 12,
        demandLevel: 'medium'
      });
    }
  }
  
  // Generate healthcare-related suggestions if relevant
  if (
    formData.fieldOfStudy.toLowerCase().includes('health') ||
    formData.interests.includes('Healthcare')
  ) {
    suggestions.push({
      title: 'Telehealth Coordinator',
      description: 'Manage and coordinate virtual healthcare services between patients and providers.',
      salaryRange: {
        min: Math.round(baseSalary * 0.85),
        max: Math.round(baseSalary * 1.3),
        currency: 'USD'
      },
      growthRate: 17,
      demandLevel: 'high'
    });
  }
  
  // Generate data-related suggestions if relevant
  if (
    formData.certifications.includes('Data Analysis') ||
    formData.fieldOfStudy.toLowerCase().includes('data') ||
    formData.fieldOfStudy.toLowerCase().includes('statistics')
  ) {
    suggestions.push({
      title: 'Data Privacy Analyst',
      description: 'Ensure organization compliance with data protection regulations and implement privacy measures.',
      salaryRange: {
        min: Math.round(baseSalary * 1.0),
        max: Math.round(baseSalary * 1.5),
        currency: 'USD'
      },
      growthRate: 14,
      demandLevel: 'medium'
    });
  }
  
  // Generate creative suggestions if relevant
  if (
    formData.interests.includes('Arts') ||
    formData.skills.includes('Creativity')
  ) {
    suggestions.push({
      title: 'Content Experience Designer',
      description: 'Create engaging content experiences across different platforms and formats.',
      salaryRange: {
        min: Math.round(baseSalary * 0.8),
        max: Math.round(baseSalary * 1.3),
        currency: 'USD'
      },
      growthRate: 10,
      demandLevel: 'medium'
    });
  }
  
  // Generate education-related suggestions if relevant
  if (
    formData.interests.includes('Education') ||
    formData.fieldOfStudy.toLowerCase().includes('education')
  ) {
    suggestions.push({
      title: 'Learning Experience Designer',
      description: 'Design educational experiences that maximize engagement and learning outcomes.',
      salaryRange: {
        min: Math.round(baseSalary * 0.8),
        max: Math.round(baseSalary * 1.2),
        currency: 'USD'
      },
      growthRate: 9,
      demandLevel: 'medium'
    });
  }
  
  // Default suggestion if we don't have enough
  if (suggestions.length < 3) {
    suggestions.push({
      title: 'Remote Work Coordinator',
      description: 'Facilitate remote work policies, tools, and practices to optimize team productivity.',
      salaryRange: {
        min: Math.round(baseSalary * 0.9),
        max: Math.round(baseSalary * 1.3),
        currency: 'USD'
      },
      growthRate: 11,
      demandLevel: 'medium'
    });
  }
  
  // Add a stretch option if open to further education
  if (formData.openToFurtherEducation && suggestions.length < 4) {
    suggestions.push({
      title: 'Sustainability Consultant',
      description: 'Help organizations develop and implement sustainable business practices (requires specialized education).',
      salaryRange: {
        min: Math.round(baseSalary * 1.1),
        max: Math.round(baseSalary * 1.7),
        currency: 'USD'
      },
      growthRate: 16,
      demandLevel: 'high'
    });
  }
  
  // Return top 3-4 suggestions
  return suggestions.slice(0, formData.openToFurtherEducation ? 4 : 3);
}

// Fix the default export
const aiService = {
  getAIJobSuggestions
};

export default aiService; 