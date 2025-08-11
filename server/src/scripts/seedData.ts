import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { connectDB } from '../config/database'
import Lesson from '../models/Lesson'
import Algorithm from '../models/Algorithm'

dotenv.config()

const seedLessons = async () => {
  const lessons = [
    {
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming including variables, functions, and control structures.',
      language: 'JavaScript',
      level: 'Beginner',
      duration: 45,
      rating: 4.8,
      students: 1200,
      modules: 8,
      locked: false,
      steps: [
        {
          id: '1',
          title: 'Introduction to Variables',
          content: 'Variables are containers that store data values. In JavaScript, you can declare variables using let, const, or var.',
          instruction: 'Create a variable called "message" and assign it the value "Hello, World!"',
          code: '// Create your variable here\nlet message = "";',
          expected: 'let message = "Hello, World!";'
        },
        {
          id: '2',
          title: 'Working with Functions',
          content: 'Functions are reusable blocks of code that perform specific tasks.',
          instruction: 'Create a function called "greet" that takes a name parameter and returns a greeting',
          code: '// Create your function here\nfunction greet(name) {\n  // Your code here\n}',
          expected: 'function greet(name) {\n  return "Hello, " + name + "!";\n}'
        }
      ]
    },
    {
      title: 'Python Data Structures',
      description: 'Master lists, dictionaries, sets, and tuples in Python with hands-on exercises.',
      language: 'Python',
      level: 'Intermediate',
      duration: 60,
      rating: 4.9,
      students: 980,
      modules: 10,
      locked: false,
      steps: [
        {
          id: '1',
          title: 'Working with Lists',
          content: 'Lists are ordered collections of items in Python. They are mutable and can contain different data types.',
          instruction: 'Create a list of your favorite programming languages',
          code: '# Create your list here\nfavorite_languages = []',
          expected: 'favorite_languages = ["Python", "JavaScript", "Java"]'
        }
      ]
    },
    {
      title: 'React Components & Props',
      description: 'Build dynamic user interfaces with React components and learn prop management.',
      language: 'React',
      level: 'Intermediate',
      duration: 75,
      rating: 4.7,
      students: 856,
      modules: 12,
      locked: false,
      steps: [
        {
          id: '1',
          title: 'Creating Your First Component',
          content: 'React components are the building blocks of React applications. They are JavaScript functions that return JSX.',
          instruction: 'Create a functional component called "Welcome" that accepts a name prop',
          code: '// Create your component here\nfunction Welcome(props) {\n  // Your code here\n}',
          expected: 'function Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}'
        }
      ]
    }
  ]

  await Lesson.deleteMany({})
  await Lesson.insertMany(lessons)
  console.log('✅ Lessons seeded successfully')
}

const seedAlgorithms = async () => {
  const algorithms = [
    {
      name: 'Bubble Sort',
      category: 'sorting',
      difficulty: 'Easy',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      implementation: `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`,
      explanation: 'Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The algorithm gets its name from the way smaller elements "bubble" to the top of the list.',
      estimatedTime: 15
    },
    {
      name: 'Quick Sort',
      category: 'sorting',
      difficulty: 'Medium',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      description: 'An efficient divide-and-conquer sorting algorithm that works by selecting a pivot element and partitioning the array around it.',
      implementation: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      explanation: 'Quick Sort is a divide-and-conquer algorithm that works by selecting a pivot element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.',
      estimatedTime: 30
    },
    {
      name: 'Binary Search',
      category: 'searching',
      difficulty: 'Easy',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      description: 'An efficient algorithm for finding an item from a sorted list of items by repeatedly dividing the search interval in half.',
      implementation: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}`,
      explanation: 'Binary Search works on sorted arrays by repeatedly dividing the search interval in half. If the value is less than the item in the middle of the interval, it narrows the interval to the lower half. Otherwise, it narrows it to the upper half.',
      estimatedTime: 20
    }
  ]

  await Algorithm.deleteMany({})
  await Algorithm.insertMany(algorithms)
  console.log('✅ Algorithms seeded successfully')
}

const seedData = async () => {
  try {
    await connectDB()
    await seedLessons()
    await seedAlgorithms()
    console.log('🌱 Database seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedData()