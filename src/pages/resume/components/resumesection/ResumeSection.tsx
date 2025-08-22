import React from 'react';

const ResumeSection = () => {
  return (
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Resume</h2>
        <div className="flex justify-center mt-2 mb-10">
          <div className="w-16 h-1 bg-blue-600"></div>
        </div>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          I'm a full stack developer with 4+ years of experience in web development and teaching programming.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Summary</h3>
            <div className="relative pl-8 border-l-2 border-blue-600 mb-8">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-600"></div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">NGUYEN THE QUYET</h4>
              <p className="text-gray-600 mb-4">
                Full Stack Developer with 4+ years of experience in web development and teaching programming.
                Passionate about creating efficient solutions and sharing knowledge with others.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Thanh Hoa, Vietnam</li>
                <li>(+84) 913 118 423</li>
                <li>ntq.145@gmail.com</li>
              </ul>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Education</h3>
            <div className="relative pl-8 border-l-2 border-blue-600 mb-8">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-600"></div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">BACHELOR OF INFORMATION TECHNOLOGY</h4>
              <p className="text-blue-600 mb-1">2018 - 2020</p>
              <p className="text-gray-600 italic mb-2">Hong Duc University, Thanh Hoa</p>
              <p className="text-gray-600 mb-2">Graduated with Excellent grade</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>3rd Prize in National Student Olympiad in Informatics 2019</li>
                <li>Consolation Prize in ICPC North Central Region 2020</li>
                <li>Participated in Asia International Collegiate Programming Contest 2020 in Can Tho</li>
              </ul>
            </div>
            
            <div className="relative pl-8 border-l-2 border-blue-600 mb-8">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-600"></div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">BACHELOR OF MATHEMATICS EDUCATION</h4>
              <p className="text-blue-600 mb-1">2012 - 2016</p>
              <p className="text-gray-600 italic mb-2">Hong Duc University, Thanh Hoa</p>
              <p className="text-gray-600">Graduated with Good grade</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Professional Experience</h3>
            <div className="relative pl-8 border-l-2 border-blue-600 mb-8">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-600"></div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">PROGRAMMING INSTRUCTOR</h4>
              <p className="text-blue-600 mb-1">2023 - Present</p>
              <p className="text-gray-600 italic mb-2">ThinkEdu Center, Thanh Hoa, Vietnam</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Teaching programming fundamentals and advanced concepts to students</li>
                <li>Developing curriculum and course materials</li>
                <li>Mentoring students in programming competitions and projects</li>
              </ul>
            </div>
            
            <div className="relative pl-8 border-l-2 border-blue-600 mb-8">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-600"></div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">FULL STACK DEVELOPER</h4>
              <p className="text-blue-600 mb-1">2020 - Present</p>
              <p className="text-gray-600 italic mb-2">ThinkLabs, Thanh Hoa, Vietnam</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Developing and maintaining web applications using modern technologies</li>
                <li>Implementing both frontend and backend solutions</li>
                <li>Collaborating with team members on project development</li>
                <li>Optimizing application performance and user experience</li>
              </ul>
            </div>
            
            <div className="relative pl-8 border-l-2 border-blue-600">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-600"></div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">INTERNSHIP</h4>
              <p className="text-blue-600 mb-1">2019</p>
              <p className="text-gray-600 italic mb-2">ThinkLabs, Thanh Hoa, Vietnam</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Gained hands-on experience in web development</li>
                <li>Learned industry best practices and development workflows</li>
                <li>Participated in team projects and code reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ResumeSection; 