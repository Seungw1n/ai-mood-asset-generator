
import type { Workspace } from './types';

export const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'y2k',
    name: 'Y2K',
    description: 'Icons with a retro-futuristic Y2K aesthetic, featuring glossy and translucent elements.',
    style: {
      style: 'glossy plastic and chrome',
      material: 'translucent plastic and bubbly shapes',
      finish: 'shiny and iridescent',
      texture: 'smooth with cybernetic details',
    },
    creator: 'system',
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
  },
  {
    id: 'analog',
    name: 'Analog',
    description: 'Retro-style icons with a warm, analog feel.',
    style: {
      style: 'retro analog',
      material: 'bakelite plastic and warm wood',
      finish: 'matte and satin',
      texture: 'textured with physical knobs',
    },
    creator: 'system',
    createdAt: new Date('2023-10-26T10:05:00Z').toISOString(),
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Faded and distressed icons with a vintage aesthetic.',
    style: {
      style: 'faded vintage',
      material: 'aged paper and distressed leather',
      finish: 'dull and worn',
      texture: 'cracked and weathered',
    },
    creator: 'system',
    createdAt: new Date('2023-10-26T10:10:00Z').toISOString(),
  },
];
