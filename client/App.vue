<script>
import BlueGemCalculator from '../lib/main.js';

const calculator = new BlueGemCalculator();

const data = {};

[
  {
    finish: 'Case Hardened',
    data: calculator.getList('Case Hardened'),
  },
  {
    finish: 'Heat Treated',
    data: calculator.getList('Heat Treated'),
  },
].forEach((list) => {
  list.data.forEach((item) => {
    if (!data[item.item]) data[item.item] = {};
    if (!data[item.item][list.finish]) data[item.item][list.finish] = {};

    Object.keys(item.percentages[0]).forEach((key) => {
      if (key !== 'seed') {
        if (!data[item.item][list.finish][key]) data[item.item][list.finish][key] = [];

        for (let seed = 0; seed <= 1000; seed++) {
          data[item.item][list.finish][key].push({
            seed,
            blue: item.percentages[seed][key].blue,
            purple: item.percentages[seed][key].purple,
            gold: item.percentages[seed][key].gold,
            other: item.percentages[seed][key].other,
          })
        }
      }
    })

  });
});

export default {
  data() {
    return {
      data,
      activeItem: 'AK-47',
      activeFinish: 'Case Hardened',
      activePose: 'playside',
      activeIndex: 0,
      activeOrder: 'blue',
      activeSort: 'desc',
      imageCache: {},
      screenshotUrl: null,
    };
  },

  created() {
    this.syncSortOrder();
    this.syncScreenshotUrl();
  },

  watch: {
    screenshotUrl(newScreenshotUrl) {
      // Chrome automatically cancels image requests when the image source changes before the image
      // was loaded. We can prevent this by creating image elements with the source and store them in memory.
      if (!this.imageCache[newScreenshotUrl]) {
        const img = new Image();
        img.src = newScreenshotUrl;
        this.imageCache[newScreenshotUrl] = img;
      }
    },

    activeItem() {
      this.syncActiveFinish();
      this.syncActivePose();
      this.syncActiveIndex();
      this.syncSortOrder();
      this.syncScreenshotUrl();
    },

    activeFinish() {
      this.syncActivePose();
      this.syncActiveIndex();
      this.syncSortOrder();
      this.syncScreenshotUrl();
    },

    activePose() {
      this.syncSortOrder();
      this.syncScreenshotUrl();
    },

    activeOrder() {
      this.syncSortOrder();
      this.syncScreenshotUrl();
    },

    activeSort() {
      this.syncSortOrder();
      this.syncScreenshotUrl();
    },
  },

  methods: {
    syncSortOrder() {
      this.data[this.activeItem][this.activeFinish][this.activePose].sort((a, b) => this.activeSort === 'asc'
        ? a[this.activeOrder] - b[this.activeOrder]
        : b[this.activeOrder] - a[this.activeOrder],
      );
    },

    syncScreenshotUrl() {
      const selectedSeed = this.data[this.activeItem][this.activeFinish][this.activePose][this.activeIndex];
      const itemKey = calculator.itemNameToKey(this.activeItem);
      const finishKey = calculator.finishNameToKey(this.activeFinish);

      const fileName =
        this.activePose === 'default'
          ? `${itemKey}_${finishKey}_${selectedSeed.seed}.png`
          : `${itemKey}_${finishKey}_${this.activePose}_${selectedSeed.seed}.png`;

      this.screenshotUrl = `https://cdn.csgoskins.gg/public/images/gems/v1/${fileName}`;
    },

    syncActiveFinish() {
      this.activeFinish = this.data[this.activeItem]['Case Hardened'] ? 'Case Hardened' : 'Heat Treated';
    },

    syncActivePose() {
      this.activePose = this.data[this.activeItem][this.activeFinish].default ? 'default' : 'playside';
    },

    syncActiveIndex() {
      this.activeIndex = 0;
    },

    titleCase(str) {
      return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
  },
};
</script>

<template>
  <div class="p-4">
    <!-- Top Menu -->
    <div class="flex flex-wrap items-center justify-center">
      <!-- Item Select -->
      <div class="mx-4">
        <label class="uppercase font-bold text-xs tracking-widest" for="item">Item</label>
        <div class="relative mt-2">
          <select
            id="item"
            class="appearance-none rounded p-3 pr-10 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            v-model="activeItem"
          >
            <option v-for="(value, key) in data" :value="key">
              {{ key }}
            </option>
          </select>
          <span class="absolute text-gray-200 inset-y-0 right-0 flex items-center pr-3">
            <svg class="w-3 h-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 7">
              <path
                d="M11.261 2.02A.96.96 0 009.941.623L6 4.35 2.06.623A.96.96 0 00.74 2.02l4.573 4.33a1 1 0 001.374 0l4.574-4.33z"
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <!-- Finish Select -->
      <div class="mx-4">
        <label class="uppercase font-bold text-xs tracking-widest" for="finish">Finish</label>
        <div class="relative mt-2">
          <select
            id="finish"
            class="appearance-none rounded p-3 pr-10 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            v-model="activeFinish"
          >
            <option v-for="(value, key) in data[activeItem]" :value="key">
              {{ key }}
            </option>
          </select>
          <span class="absolute text-gray-200 inset-y-0 right-0 flex items-center pr-3">
            <svg class="w-3 h-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 7">
              <path
                d="M11.261 2.02A.96.96 0 009.941.623L6 4.35 2.06.623A.96.96 0 00.74 2.02l4.573 4.33a1 1 0 001.374 0l4.574-4.33z"
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <!-- Pose Select -->
      <div class="mx-4">
        <label class="uppercase font-bold text-xs tracking-widest" for="pose">Pose</label>
        <div class="relative mt-2">
          <select
            id="pose"
            class="appearance-none rounded p-3 pr-10 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            v-model="activePose"
          >
            <option v-for="(value, key) in data[activeItem][activeFinish]" :value="key">
              {{ titleCase(key) }}
            </option>
          </select>
          <span class="absolute text-gray-200 inset-y-0 right-0 flex items-center pr-3">
            <svg class="w-3 h-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 7">
              <path
                d="M11.261 2.02A.96.96 0 009.941.623L6 4.35 2.06.623A.96.96 0 00.74 2.02l4.573 4.33a1 1 0 001.374 0l4.574-4.33z"
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <!-- Order Select -->
      <div class="mx-4">
        <label class="uppercase font-bold text-xs tracking-widest" for="order">Order</label>
        <div class="relative mt-2">
          <select
            id="order"
            class="appearance-none rounded p-3 pr-10 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            v-model="activeOrder"
          >
            <option v-for="(value, key) in { blue: 'Blue', purple: 'Purple', gold: 'Gold', other: 'Other' }" :value="key">
              {{ value }}
            </option>
          </select>
          <span class="absolute text-gray-200 inset-y-0 right-0 flex items-center pr-3">
            <svg class="w-3 h-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 7">
              <path
                d="M11.261 2.02A.96.96 0 009.941.623L6 4.35 2.06.623A.96.96 0 00.74 2.02l4.573 4.33a1 1 0 001.374 0l4.574-4.33z"
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <!-- Sort Select -->
      <div class="mx-4">
        <label class="uppercase font-bold text-xs tracking-widest" for="sort">Sort</label>
        <div class="relative mt-2">
          <select
            id="sort"
            class="appearance-none rounded p-3 pr-10 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            v-model="activeSort"
          >
            <option v-for="(value, key) in { desc: 'Descending', asc: 'Ascending' }" :value="key">
              {{ value }}
            </option>
          </select>
          <span class="absolute text-gray-200 inset-y-0 right-0 flex items-center pr-3">
            <svg class="w-3 h-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 7">
              <path
                d="M11.261 2.02A.96.96 0 009.941.623L6 4.35 2.06.623A.96.96 0 00.74 2.02l4.573 4.33a1 1 0 001.374 0l4.574-4.33z"
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <!-- Seed Input -->
      <div class="mx-4">
        <label class="uppercase font-bold text-xs tracking-widest" for="seed">Seed</label>
        <div class="mt-2">
          <input
            id="seed"
            type="number"
            min="0"
            max="1000"
            step="1"
            class="w-24 appearance-none rounded p-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Seed"
            aria-label="Seed"
          />
        </div>
      </div>
    </div>

    <!-- Image -->
    <div class="my-20">
      <img class="block w-auto mx-auto" style="max-height: 50vh" :src="screenshotUrl" alt="Screenshot" />
    </div>

    <!-- Table -->
    <table class="rounded table-fixed overflow-hidden w-full">
      <thead class="bg-gray-700 text-white text-left text-sm font-medium">
        <tr>
          <template v-for="(value, key) in data[activeItem][activeFinish]" :key="key">
            <th v-for="value in ['blue', 'gold', 'purple', 'other']" class="px-4 py-3 uppercase">
              {{ key }} {{ value }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody class="text-gray-400 divide-y divide-gray-700">
        <tr class="">
          <template v-for="(value, key) in data[activeItem][activeFinish]" :key="key">
            <td v-for="value in ['blue', 'gold', 'purple', 'other']" class="p-4">
              {{ data[activeItem][activeFinish][key][activeIndex][value].toFixed(2) }}%
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
