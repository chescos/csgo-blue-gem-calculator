type ItemType = 'ch' | 'ht';
type ImageType = 'default' | 'frontview' | 'playside' | 'backside';

interface Item {
  name: string;
  slug: string;
  types: ItemType[];
  images: ImageType[];
}

export const items: Record<string, Item> = {
  ak47: {
    name: 'AK-47',
    slug: 'ak47',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  bayonet: {
    name: 'Bayonet',
    slug: 'bayonet',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  bowie: {
    name: 'Bowie Knife',
    slug: 'bowie',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  butterfly: {
    name: 'Butterfly Knife',
    slug: 'butterfly',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  classic: {
    name: 'Classic Knife',
    slug: 'classic',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  deagle: {
    name: 'Desert Eagle',
    slug: 'deagle',
    types: ['ht'],
    images: ['playside', 'backside'],
  },
  falchion: {
    name: 'Falchion Knife',
    slug: 'falchion',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  fiveSeven: {
    name: 'Five-SeveN',
    slug: 'five-seven',
    types: ['ch', 'ht'],
    images: ['playside', 'backside'],
  },
  flip: {
    name: 'Flip Knife',
    slug: 'flip',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  gut: {
    name: 'Gut Knife',
    slug: 'gut',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  huntsman: {
    name: 'Huntsman Knife',
    slug: 'huntman',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  hydra: {
    name: 'Hydra Gloves',
    slug: 'hydra',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  karambit: {
    name: 'Karambit',
    slug: 'karambit',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  kukri: {
    name: 'Kukri Knife',
    slug: 'kukri',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  m9: {
    name: 'M9 Bayonet',
    slug: 'm9',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  mac10: {
    name: 'MAC-10',
    slug: 'mac10',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  navaja: {
    name: 'Navaja Knife',
    slug: 'navaja',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  nomad: {
    name: 'Nomad Knife',
    slug: 'nomad',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  paracord: {
    name: 'Paracord Knife',
    slug: 'paracord',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  shadow: {
    name: 'Shadow Daggers',
    slug: 'shadow',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  skeleton: {
    name: 'Skeleton Knife',
    slug: 'skeleton',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  stiletto: {
    name: 'Stiletto Knife',
    slug: 'stiletto',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  survival: {
    name: 'Survival Knife',
    slug: 'survival',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  talon: {
    name: 'Talon Knife',
    slug: 'talon',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  ursus: {
    name: 'Ursus Knife',
    slug: 'ursus',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
};
