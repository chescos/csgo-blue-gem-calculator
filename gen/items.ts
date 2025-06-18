export type PercentageNumbers = {
  blue: number;
  purple: number;
  gold: number;
  other: number;
};

export type FinishKey = 'ch' | 'ht';

export type FinishName = 'Case Hardened' | 'Heat Treated';

export type ImagePose = 'default' | 'frontview' | 'playside' | 'backside';

export type ItemName =
  | 'AK-47'
  | 'Bayonet'
  | 'Bowie Knife'
  | 'Butterfly Knife'
  | 'Classic Knife'
  | 'Desert Eagle'
  | 'Falchion Knife'
  | 'Five-SeveN'
  | 'Flip Knife'
  | 'Gut Knife'
  | 'Huntsman Knife'
  | 'Karambit'
  | 'Kukri Knife'
  | 'M9 Bayonet'
  | 'MAC-10'
  | 'Navaja Knife'
  | 'Nomad Knife'
  | 'Paracord Knife'
  | 'Shadow Daggers'
  | 'Skeleton Knife'
  | 'Stiletto Knife'
  | 'Survival Knife'
  | 'Talon Knife'
  | 'Ursus Knife';

export type ItemKey =
  | 'ak47'
  | 'bayonet'
  | 'bowie'
  | 'butterfly'
  | 'classic'
  | 'deagle'
  | 'falchion'
  | 'fiveseven'
  | 'flip'
  | 'gut'
  | 'huntsman'
  | 'karambit'
  | 'kukri'
  | 'm9_bayonet'
  | 'mac10'
  | 'navaja'
  | 'nomad'
  | 'paracord'
  | 'shadow'
  | 'skeleton'
  | 'stiletto'
  | 'survival'
  | 'talon'
  | 'ursus';

export type Item = {
  name: ItemName;
  types: FinishKey[];
  images: ImagePose[];
};

export const items: Record<ItemKey, Item> = {
  ak47: {
    name: 'AK-47',
    types: ['ch'],
    images: ['frontview', 'playside'],
  },
  bayonet: {
    name: 'Bayonet',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  bowie: {
    name: 'Bowie Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  butterfly: {
    name: 'Butterfly Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  classic: {
    name: 'Classic Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  deagle: {
    name: 'Desert Eagle',
    types: ['ht'],
    images: ['default'],
  },
  falchion: {
    name: 'Falchion Knife',
    types: ['ch'],
    images: ['default'],
  },
  fiveseven: {
    name: 'Five-SeveN',
    types: ['ch', 'ht'],
    images: ['default'],
  },
  flip: {
    name: 'Flip Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  gut: {
    name: 'Gut Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  huntsman: {
    name: 'Huntsman Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  karambit: {
    name: 'Karambit',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  kukri: {
    name: 'Kukri Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  m9_bayonet: {
    name: 'M9 Bayonet',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  mac10: {
    name: 'MAC-10',
    types: ['ch'],
    images: ['default'],
  },
  navaja: {
    name: 'Navaja Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  nomad: {
    name: 'Nomad Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  paracord: {
    name: 'Paracord Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  shadow: {
    name: 'Shadow Daggers',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  skeleton: {
    name: 'Skeleton Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  stiletto: {
    name: 'Stiletto Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  survival: {
    name: 'Survival Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  talon: {
    name: 'Talon Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
  ursus: {
    name: 'Ursus Knife',
    types: ['ch'],
    images: ['default', 'backside'],
  },
};

export const finishes: Record<FinishKey, FinishName> = {
  ch: 'Case Hardened',
  ht: 'Heat Treated',
};
