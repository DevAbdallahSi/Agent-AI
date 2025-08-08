import React, { useState } from 'react';
import { Play, Eye, Layers, GitBranch, Database, Cpu } from 'lucide-react';

const VisualLearning: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('data-structures');
  const [activeDemo, setActiveDemo] = useState(null);

  const topics = [
    { id: 'data-structures', name: 'Data Structures', icon: Database, color: 'blue' },
    { id: 'algorithms', name: 'Algorithm Flow', icon: GitBranch, color: 'green' },
    { id: 'memory', name: 'Memory Management', icon: Cpu, color: 'purple' },
    { id: 'oop', name: 'OOP Concepts', icon: Layers, color: 'orange' }
  ];

  const visualizations = {
    'data-structures': [
      {
        id: '1',
        title: 'Array Operations',
        description: 'See how arrays store and access data in memory',
        type: 'interactive',
        difficulty: 'Beginner'
      },
      {
        id: '2',
        title: 'Linked List Traversal',
        description: 'Visual representation of linked list node connections',
        type: 'animation',
        difficulty: 'Beginner'
      },
      {
        id: '3',
        title: 'Binary Tree Structure',
        description: 'Interactive binary tree with insertion and deletion',
        type: 'interactive',
        difficulty: 'Intermediate'
      },
      {
        id: '4',
        title: 'Hash Table Collision Resolution',
        description: 'Visualize how hash tables handle collisions',
        type: 'simulation',
        difficulty: 'Intermediate'
      }
    ],
    'algorithms': [
      {
        id: '5',
        title: 'Bubble Sort Animation',
        description: 'Step-by-step bubble sort with comparisons highlighted',
        type: 'animation',
        difficulty: 'Beginner'
      },
      {
        id: '6',
        title: 'Binary Search Process',
        description: 'Visual binary search with array divisions',
        type: 'interactive',
        difficulty: 'Beginner'
      },
      {
        id: '7',
        title: 'Dijkstra\'s Algorithm',
        description: 'Shortest path finding in weighted graphs',
        type: 'simulation',
        difficulty: 'Advanced'
      }
    ]
  };

  const currentVisualizations = visualizations[selectedTopic] || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Visual Learning Lab
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive visualizations and animations to understand programming concepts
        </p>
      </div>

      {/* Topic Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Choose a Topic</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedTopic === topic.id
                  ? `border-${topic.color}-500 bg-${topic.color}-50 dark:bg-${topic.color}-900/20`
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <div className={`inline-flex p-3 rounded-full bg-${topic.color}-100 dark:bg-${topic.color}-900/20 mb-3`}>
                  <topic.icon className={`h-6 w-6 text-${topic.color}-600 dark:text-${topic.color}-400`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{topic.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Demo Area */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Interactive Demo: Array Operations
          </h2>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Array Insert Operation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Click on a position to insert a new element
              </p>
            </div>

            {/* Array Visualization */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {[42, 17, 93, 28, 55].map((value, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={() => setActiveDemo(index)}
                  >
                    <div className="w-16 h-16 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-lg hover:bg-blue-600 transition-colors">
                      {value}
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
                      [{index}]
                    </div>
                    {activeDemo === index && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500">
                  +
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Insert
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Search
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Sort
              </button>
            </div>

            {/* Code Display */}
            <div className="mt-6 bg-gray-900 rounded-lg p-4">
              <pre className="text-green-400 text-sm">
{`// Array Insert Operation
function insertAt(arr, index, value) {
  // Shift elements to the right
  for (let i = arr.length; i > index; i--) {
    arr[i] = arr[i - 1];
  }
  // Insert new value
  arr[index] = value;
  return arr;
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Available Visualizations
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVisualizations.map((viz) => (
              <div key={viz.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${
                      viz.type === 'interactive' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      viz.type === 'animation' ? 'bg-green-100 dark:bg-green-900/20' :
                      'bg-purple-100 dark:bg-purple-900/20'
                    }`}>
                      {viz.type === 'interactive' ? 
                        <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" /> :
                        viz.type === 'animation' ?
                        <Play className="h-4 w-4 text-green-600 dark:text-green-400" /> :
                        <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      }
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      viz.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                      viz.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {viz.difficulty}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {viz.type}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {viz.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {viz.description}
                </p>

                <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                  <Play className="h-4 w-4" />
                  <span>Launch Visualization</span>
                </button>
              </div>
            ))}
          </div>

          {currentVisualizations.length === 0 && (
            <div className="text-center py-12">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No visualizations available for this topic yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI-Generated Diagrams Section */}
      <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Generated Learning Diagrams
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Our AI creates custom diagrams and visualizations based on your learning progress and the concepts you're studying. 
            Get personalized visual explanations that adapt to your learning style.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium">
            Generate Custom Diagram
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualLearning;