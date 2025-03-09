export interface TestRun {
    id: number;
    status: string;
    projectId: number;
  }
  
  export interface TestCase {
    id: number;
    name: string;
    testRunId: number;
  }
  
  export interface TestSuite {
    id: number;
    name: string;
    projectId: number;
  }
  
  export interface Project {
    id: number;
    name: string;
    description: string;
    owner: { name: string }; 
}