import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, RotateCcw, CheckCircle, ArrowLeft, ArrowRight, Mic, Volume2 } from 'lucide-react';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import { useAI } from '../contexts/AIContext';
import { useUser } from '../contexts/UserContext';

const LessonDetail: React.FC = () => {
  const { id } = useParams();
  const { addMessage, isVoiceActive, toggleVoice } = useAI();
  const { addXP, addBadge } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [code, setCode] = useState('// Write your JavaScript code here\nfunction greet(name) {\n  // Your code here\n}');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');

  const lesson = {
    id: '1',
    title: 'JavaScript Functions',
    description: 'Learn how to create and use functions in JavaScript',
    language: 'JavaScript',
    steps: [
      {
        title: 'Introduction to Functions',
        content: 'Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.',
        instruction: 'Listen to the AI explanation about functions',
        code: '// A simple function example\nfunction sayHello() {\n  return "Hello, World!";\n}',
        expected: null
      },
      {
        title: 'Creating Your First Function',
        content: 'Now let\'s create a function that takes a parameter and returns a greeting.',
        instruction: 'Create a function called "greet" that takes a name parameter and returns "Hello, [name]!"',
        code: 'function greet(name) {\n  // Your code here\n}',
        expected: 'function greet(name) {\n  return "Hello, " + name + "!";\n}'
      },
      {
        title: 'Function Parameters',
        content: 'Functions can accept multiple parameters to make them more flexible.',
        instruction: 'Modify your function to accept both first and last name',
        code: 'function greet(firstName, lastName) {\n  // Your code here\n}',
        expected: 'function greet(firstName, lastName) {\n  return "Hello, " + firstName + " " + lastName + "!";\n}'
      },
      {
        title: 'Calling Functions',
        content: 'Learn how to call functions and use their return values.',
        instruction: 'Call your greet function with your name and store the result in a variable',
        code: 'function greet(name) {\n  return "Hello, " + name + "!";\n}\n\n// Call the function here\n',
        expected: 'const message = greet("Alex");'
      }
    ]
  };

  const currentStepData = lesson.steps[currentStep];

  const runCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      try {
        // Simulate code execution
        const result = 'Hello, World!';
        setOutput(`Output: ${result}`);
        addXP(25);
      } catch (error) {
        setOutput(`Error: ${error}`);
      }
      setIsRunning(false);
    }, 1000);
  };

  const checkCode = () => {
    const isCorrect = code.includes('return') && code.includes('Hello');
    if (isCorrect) {
      setOutput('✅ Great job! Your code is correct.');
      addXP(50);
      if (currentStep === lesson.steps.length - 1) {
        addBadge('Function Master');
      }
    } else {
      setOutput('❌ Not quite right. Try again!');
      addMessage('I need help with this exercise', 'user');
    }
  };

  const nextStep = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCode(lesson.steps[currentStep + 1].code);
      setOutput('');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCode(lesson.steps[currentStep - 1].code);
      setOutput('');
    }
  };

  const speakContent = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentStepData.content);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">Step {currentStep + 1} of {lesson.steps.length}: {currentStepData.title}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-lg ${isVoiceActive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} hover:opacity-80 transition-colors`}
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={speakContent}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:opacity-80 transition-colors"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(((currentStep + 1) / lesson.steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / lesson.steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Content Panel */}
        <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {currentStepData.content}
            </p>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Your Task:</h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                {currentStepData.instruction}
              </p>
            </div>
          </div>

          {/* AI Tutor Chat */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Mic className="h-4 w-4 mr-2 text-blue-600" />
              AI Tutor
            </h3>
            <div className="space-y-2 text-sm">
              <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-200">
                  I'm here to help! Try writing the function step by step. Remember that functions need a return statement to give back a value.
                </p>
              </div>
              {isVoiceActive && (
                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 flex items-center">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Voice mode active - I can hear you!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <CodeEditor
              value={code}
              onChange={setCode}
              language="javascript"
              theme="vs-dark"
            />
          </div>

          {/* Output Panel */}
          <div className="h-32 bg-gray-900 text-white p-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Output</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>
                <button
                  onClick={checkCode}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  <CheckCircle className="h-3 w-3" />
                  <span>Check</span>
                </button>
                <button
                  onClick={() => setCode(currentStepData.code)}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
            <div className="font-mono text-sm text-gray-300">
              {output || 'Run your code to see the output...'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {lesson.steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentStep ? 'bg-blue-600' : 
                  index < currentStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === lesson.steps.length - 1}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;