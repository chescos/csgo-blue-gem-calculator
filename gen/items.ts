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

  constructor(name: ItemName, types: FinishKey[], regions?: Region[], images?: ImagePose[]) {
    this.name = name;
    this.types = types;
    this.regions = regions || ['playside', 'backside'];

    this.images = images || [];

    if (!images) {
      const standardRegions = ['playside', 'backside'] as Region[];

      for (const region of this.regions) {
        if (standardRegions.includes(region)) {
          this.images.push(region as ImagePose);
        }
      }
    }
  }
}

export const items: Record<ItemKey, Item> = {
  ak47: new Item('AK-47', ['ch'], ['top', 'magazine'], ['playside', 'frontview']),
  bayonet: new Item('Bayonet', ['ch']),
  bowie: new Item('Bowie Knife', ['ch']),
  butterfly: new Item('Butterfly Knife', ['ch']),
  classic: new Item('Classic Knife', ['ch']),
  deagle: new Item('Desert Eagle', ['ht'], ['playside']),
  falchion: new Item('Falchion Knife', ['ch'], ['playside']),
  fiveseven: new Item('Five-SeveN', ['ch', 'ht'], ['playside']),
  flip: new Item('Flip Knife', ['ch']),
  gut: new Item('Gut Knife', ['ch']),
  huntsman: new Item('Huntsman Knife', ['ch']),
  karambit: new Item('Karambit', ['ch']),
  kukri: new Item('Kukri Knife', ['ch']),
  m9_bayonet: new Item('M9 Bayonet', ['ch']),
  mac10: new Item('MAC-10', ['ch'], ['playside']),
  navaja: new Item('Navaja Knife', ['ch']),
  nomad: new Item('Nomad Knife', ['ch']),
  paracord: new Item('Paracord Knife', ['ch']),
  shadow: new Item('Shadow Daggers', ['ch']),
  skeleton: new Item('Skeleton Knife', ['ch']),
  stiletto: new Item('Stiletto Knife', ['ch']),
  survival: new Item('Survival Knife', ['ch']),
  talon: new Item('Talon Knife', ['ch']),
  ursus: new Item('Ursus Knife', ['ch']),
};

export const finishes: Record<FinishKey, FinishName> = {
  ch: 'Case Hardened',
  ht: 'Heat Treated',
};
