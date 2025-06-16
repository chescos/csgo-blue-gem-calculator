export type PaintType = 'ch' | 'ht';
type Pose = 'default' | 'frontview' | 'playside' | 'backside';

interface Item {
  name: string;
  slug: string;
  types: PaintType[];
  images: Pose[];
}

export const items: Record<string, Item> = {
  ak47: {
    name: 'AK-47',
    slug: 'ak47',
    types: ['ch'],
    images: ['frontview', 'playside'],
  },
  bayonet: {
    name: 'Bayonet',
    slug: 'bayonet',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  bowie: {
    name: 'Bowie Knife',
    slug: 'bowie',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  butterfly: {
    name: 'Butterfly Knife',
    slug: 'butterfly',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  classic: {
    name: 'Classic Knife',
    slug: 'classic',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  deagle: {
    name: 'Desert Eagle',
    slug: 'deagle',
    types: ['ht'],
    images: ['default'],
  },
  falchion: {
    name: 'Falchion Knife',
    slug: 'falchion',
    types: ['ch'],
    images: ['default'],
  },
  fiveSeven: {
    name: 'Five-SeveN',
    slug: 'fiveseven',
    types: ['ch', 'ht'],
    images: ['default'],
  },
  flip: {
    name: 'Flip Knife',
    slug: 'flip',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  gut: {
    name: 'Gut Knife',
    slug: 'gut',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  huntsman: {
    name: 'Huntsman Knife',
    slug: 'huntsman',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  karambit: {
    name: 'Karambit',
    slug: 'karambit',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  kukri: {
    name: 'Kukri Knife',
    slug: 'kukri',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  m9: {
    name: 'M9 Bayonet',
    slug: 'm9_bayonet',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  mac10: {
    name: 'MAC-10',
    slug: 'mac10',
    types: ['ch'],
    images: ['default'],
  },
  navaja: {
    name: 'Navaja Knife',
    slug: 'navaja',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  nomad: {
    name: 'Nomad Knife',
    slug: 'nomad',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  paracord: {
    name: 'Paracord Knife',
    slug: 'paracord',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  shadow: {
    name: 'Shadow Daggers',
    slug: 'shadow',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  skeleton: {
    name: 'Skeleton Knife',
    slug: 'skeleton',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  stiletto: {
    name: 'Stiletto Knife',
    slug: 'stiletto',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  survival: {
    name: 'Survival Knife',
    slug: 'survival',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  talon: {
    name: 'Talon Knife',
    slug: 'talon',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  ursus: {
    name: 'Ursus Knife',
    slug: 'ursus',
    types: ['ch'],
    images: ['default', 'backside'],
  },
};
