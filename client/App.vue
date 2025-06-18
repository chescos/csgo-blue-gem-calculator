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
          });
        }
      }
    });
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
      activeImages: false,
      seedInput: null,
      imageCache: {},
      screenshotUrl: null,
    };
  },

  created() {
    this.registerArrowHandling();
    this.syncSortOrder();
    this.syncSeedInput();
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
      this.syncSeedInput();
      this.syncScreenshotUrl();
    },

    activeFinish() {
      this.syncActivePose();
      this.syncActiveIndex();
      this.syncSortOrder();
      this.syncSeedInput();
      this.syncScreenshotUrl();
    },

    activePose() {
      this.syncActiveIndex();
      this.syncSortOrder();
      this.syncSeedInput();
      this.syncScreenshotUrl();
    },

    activeIndex() {
      this.syncSortOrder();
      this.syncSeedInput();
      this.syncScreenshotUrl();
    },

    activeOrder() {
      this.syncActiveIndex();
      this.syncSortOrder();
      this.syncSeedInput();
      this.syncScreenshotUrl();
    },

    activeSort() {
      this.syncActiveIndex();
      this.syncSortOrder();
      this.syncSeedInput();
      this.syncScreenshotUrl();
    },

    activeImages() {
      this.syncScreenshotUrl();
    },
  },

  methods: {
    registerArrowHandling() {
      document.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowLeft' && this.activeIndex > 0) {
          this.activeIndex--;
        } else if (e.code === 'ArrowRight' && this.activeIndex < 1000) {
          this.activeIndex++;
        }
      });
    },

    syncSortOrder() {
      this.data[this.activeItem][this.activeFinish][this.activePose].sort((a, b) =>
        this.activeSort === 'asc'
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

    syncSeedInput() {
      this.seedInput = String(this.data[this.activeItem][this.activeFinish][this.activePose][this.activeIndex].seed);
    },

    titleCase(str) {
      return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

    onSeedInputChange() {
      const newSeed = String(this.seedInput);

      const index = this.data[this.activeItem][this.activeFinish][this.activePose].findIndex(
        (s) => String(s.seed) === newSeed,
      );

      if (index !== -1) {
        this.activeIndex = index;
      }
    },
  },
};
</script>

<template>
  <!-- Top Menu -->
  <div class="flex flex-wrap items-center justify-center p-4">
    <!-- Item Select -->
    <div class="mx-4">
      <label class="uppercase font-bold text-xs tracking-widest flex" for="item">
        <svg class="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path
            d="M528 56c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 8L32 64C14.3 64 0 78.3 0 96L0 208c0 17.7 14.3 32 32 32l10 0c20.8 0 36.1 19.6 31 39.8L33 440.2c-2.4 9.6-.2 19.7 5.8 27.5S54.1 480 64 480l96 0c14.7 0 27.5-10 31-24.2L217 352l104.5 0c23.7 0 44.8-14.9 52.7-37.2L400.9 240l31.1 0c8.5 0 16.6-3.4 22.6-9.4L477.3 208l66.7 0c17.7 0 32-14.3 32-32l0-80c0-17.7-14.3-32-32-32l-16 0 0-8zM321.4 304L229 304l16-64 105 0-21 58.7c-1.1 3.2-4.2 5.3-7.5 5.3zM80 128l384 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L80 160c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
          />
        </svg>
        <span>Item</span>
      </label>
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
        <span class="absolute text-gray-200 inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
      <label class="uppercase font-bold text-xs tracking-widest flex" for="finish">
        <svg class="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3L344 320c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
          />
        </svg>
        <span>Finish</span>
      </label>
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
        <span class="absolute text-gray-200 inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
      <label class="uppercase font-bold text-xs tracking-widest flex" for="pose">
        <svg class="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
          />
        </svg>
        <span>Pose</span>
      </label>
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
        <span class="absolute text-gray-200 inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
      <label class="uppercase font-bold text-xs tracking-widest flex" for="order">
        <svg class="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path
            d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"
          />
        </svg>
        <span>Order</span>
      </label>
      <div class="relative mt-2">
        <select
          id="order"
          class="appearance-none rounded p-3 pr-10 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
          v-model="activeOrder"
        >
          <option v-for="(value, key) in { blue: 'Blue', gold: 'Gold', purple: 'Purple', other: 'Other' }" :value="key">
            {{ value }}
          </option>
        </select>
        <span class="absolute text-gray-200 inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
      <label class="uppercase font-bold text-xs tracking-widest flex" for="sort">
        <svg class="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path
            d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8L32 224c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"
          />
        </svg>
        <span>Sort</span>
      </label>
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
        <span class="absolute text-gray-200 inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
      <label class="uppercase font-bold text-xs tracking-widest flex" for="seed">
        <svg class="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0l32 0c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64l32 0c123.7 0 224 100.3 224 224l0 32 0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160C100.3 320 0 219.7 0 96z"
          />
        </svg>
        <span>Seed</span>
      </label>
      <div class="mt-2">
        <input
          id="seed"
          type="number"
          min="0"
          max="1000"
          step="1"
          class="w-24 rounded p-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="Seed"
          aria-label="Seed"
          v-model="seedInput"
          @input="onSeedInputChange"
        />
      </div>
    </div>

    <!-- Pose Images Toggle -->
    <div class="mx-4">
      <label class="uppercase font-bold text-xs tracking-widest flex" for="seed">
        <svg class="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path
            d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
          />
        </svg>
        <span>Pose Images</span>
      </label>
      <label class="block items-center cursor-pointer mt-2">
        <input type="checkbox" v-model="activeImages" class="sr-only peer" />
        <span
          class="block relative w-20 h-11 bg-gray-700 peer-focus:outline-none rounded peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded after:h-9 after:w-9 after:transition-all peer-checked:bg-blue-600 transition-colors"
        ></span>
      </label>
    </div>
  </div>

  <!-- Image -->
  <div class="flex">
    <button
      aria-label="Previous Seed"
      class="transition-colors focus:outline-none text-gray-400 p-4"
      :class="{ 'hover:text-white cursor-pointer': activeIndex !== 0, 'opacity-30': activeIndex === 0 }"
      type="button"
      :disabled="activeIndex === 0"
      @click="activeIndex--"
    >
      <svg class="h-11 w-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path
          d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
        />
      </svg>
    </button>

    <img class="block w-auto mx-auto max-h-[50vh] my-20" :src="screenshotUrl" alt="Screenshot" />

    <button
      aria-label="Next Seed"
      class="transition-colors focus:outline-none text-gray-400 p-4"
      :class="{ 'hover:text-white cursor-pointer': activeIndex !== 1000, 'opacity-30': activeIndex === 1000 }"
      type="button"
      :disabled="activeIndex === 1000"
      @click="activeIndex++"
    >
      <svg class="h-11 w-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path
          d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
        />
      </svg>
    </button>
  </div>

  <!-- Table -->
  <table class="table-fixed overflow-hidden w-full">
    <thead class="bg-gray-700 text-white text-left text-xs font-bold tracking-widest">
      <tr>
        <th class="p-4 uppercase">Rank</th>
        <th
          v-for="(key, value) in {
            blue: 'bg-blue-600',
            gold: 'bg-yellow-500',
            purple: 'bg-purple-600',
            other: 'bg-stone-400',
          }"
          class="p-4 uppercase"
        >
          <div class="flex items-center">
            <div class="rounded-full h-5 w-5 mr-2" :class="key"></div>
            <div>{{ value }}</div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody class="text-gray-400 divide-y divide-gray-700">
      <tr class="">
        <td class="p-4">#{{ activeIndex + 1 }}</td>
        <td
          v-for="value in ['blue', 'gold', 'purple', 'other']"
          class="p-4"
          :class="{ 'text-white': value === activeOrder }"
        >
          {{ data[activeItem][activeFinish][activePose][activeIndex][value].toFixed(2) }}%
        </td>
      </tr>
    </tbody>
  </table>
</template>
