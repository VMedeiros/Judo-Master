export interface Technique {
  id: number;
  name: string;
  translation: string;
  description: string;
  execution: string;
  application: string;
  demoUrl: string;
  category: string;
}

export interface Belt {
  id: number;
  name: string;
  color: string;
  textColor: string;
  ageGroup: string;
  prerequisites: string;
  information: string;
  beltImage: string;
  techniques: Technique[];
}
