export type PercentageNumbers = {
  blue: number;
  purple: number;
  gold: number;
  other: number;
};

export type CommonRegions = 'playside' | 'backside';
export type AK47Regions = 'top' | 'magazine';
export type Region = CommonRegions | AK47Regions;

export type FinishKey = 'ch' | 'ht';
export type FinishName = 'Case Hardened' | 'Heat Treated';

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

export type ImagePose = 'playside' | 'backside' | 'frontview';

export class Item {
  name: ItemName;
  types: FinishKey[];
  regions: Region[];
  images: ImagePose[];

  constructor(name: ItemName, types: FinishKey[], regions: Region[], images?: ImagePose[]) {
    this.name = name;
    this.types = types;
    this.regions = regions;

    this.images = images || [];

    if (!images) {
      const standardRegions = ['playside', 'backside'] as Region[];

      for (const region of regions) {
        if (!standardRegions.includes(region)) {
          this.images.push(region as ImagePose);
        }
      }
    }
  }
}

export const items: Record<ItemKey, Item> = {
  ak47: new Item('AK-47', ['ch'], ['top', 'magazine'], ['playside', 'frontview']),
  /*
  bayonet: {
    name: 'Bayonet',
    types: ['ch'],
    regions: ['playside', 'backside'],
  },
  bowie: {
    name: 'Bowie Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  butterfly: {
    name: 'Butterfly Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  classic: {
    name: 'Classic Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  deagle: {
    name: 'Desert Eagle',
    types: ['ht'],
    images: ['playside'],
  },
  falchion: {
    name: 'Falchion Knife',
    types: ['ch'],
    images: ['playside'],
  },
  fiveseven: {
    name: 'Five-SeveN',
    types: ['ch', 'ht'],
    images: ['playside'],
  },
  flip: {
    name: 'Flip Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  gut: {
    name: 'Gut Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  huntsman: {
    name: 'Huntsman Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  karambit: {
    name: 'Karambit',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  kukri: {
    name: 'Kukri Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  m9_bayonet: {
    name: 'M9 Bayonet',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  mac10: {
    name: 'MAC-10',
    types: ['ch'],
    images: ['playside'],
  },
  navaja: {
    name: 'Navaja Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  nomad: {
    name: 'Nomad Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  paracord: {
    name: 'Paracord Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  shadow: {
    name: 'Shadow Daggers',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  skeleton: {
    name: 'Skeleton Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  stiletto: {
    name: 'Stiletto Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  survival: {
    name: 'Survival Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  talon: {
    name: 'Talon Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
  ursus: {
    name: 'Ursus Knife',
    types: ['ch'],
    images: ['playside', 'backside'],
  },
*/
};

export const finishes: Record<FinishKey, FinishName> = {
  ch: 'Case Hardened',
  ht: 'Heat Treated',
};
