import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BookOpen, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <BookOpen size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">StudyWatch</h1>
          <p className="text-gray-600">Daily Study Tracker</p>
        </div>
        
        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-center mb-6">
              Choose Your Role
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={() => login('student')}
                className="w-full p-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 bg-white hover:bg-blue-50 transition-colors duration-200 flex items-center"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-800">Student</h3>
                  <p className="text-sm text-gray-600">
                    Track your study progress
                  </p>
                </div>
              </button>
              
              <button
                onClick={() => login('parent')}
                className="w-full p-4 rounded-lg border-2 border-purple-200 hover:border-purple-400 bg-white hover:bg-purple-50 transition-colors duration-200 flex items-center"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <User size={20} className="text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-800">Parent</h3>
                  <p className="text-sm text-gray-600">
                    Monitor your child's progress
                  </p>
                </div>
              </button>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                In a real application, this would be a secure login form.
                <br />
                For demo purposes, simply choose a role.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;