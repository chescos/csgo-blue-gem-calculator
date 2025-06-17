<script>
import BlueGemCalculator from '../lib/main.js';

const calculator = new BlueGemCalculator();

const data = calculator.getData();

export default {
  data() {
    return {
      data,
      activeItem: 'ak47',
      activePaint: 'ch',
      activePose: 'playside',
      activeIndex: 0,
      imageCache: {},
      screenshotUrl: null,
    };
  },

  created() {
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
      this.sync();
    },

    activePaint() {
      this.sync();
    },
  },

  methods: {
    sync() {
      this.syncActivePaint();
      this.syncActivePose();
      this.syncActiveIndex();
      this.syncScreenshotUrl();
    },

    syncScreenshotUrl() {
      const selectedSeed = this.data[this.activeItem][this.activePaint][this.activePose][this.activeIndex];

      const fileName = this.activePose === 'default'
        ? `${this.activeItem}_${this.activePaint}_${selectedSeed.seed}.png`
        : `${this.activeItem}_${this.activePaint}_${this.activePose}_${selectedSeed.seed}.png`;

      this.screenshotUrl = `https://cdn.csgoskins.gg/public/images/gems/v1/${fileName}`;
    },

    syncActivePaint() {
      this.activePaint = this.data[this.activeItem].ch
        ? 'ch'
        : 'ht';
    },

    syncActivePose() {
      this.activePose = this.data[this.activeItem][this.activePaint].default
        ? 'default'
        : 'playside';
    },

    syncActiveIndex() {
      this.activeIndex = 0;
    },
  },
}
</script>

<template>
  <div class="p-4 sm:p-12">
    <!-- Top Menu -->
    <div class="flex flex-wrap items-center justify-center">

      <!-- Item Select -->
      <div class="flex-none ml-0 sm:ml-12">
        <div class="relative">
          <select
            class="w-48 appearance-none rounded p-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            v-model="activeItem"
            aria-label="Item"
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

      <!-- Paint Select -->
      <div class="flex-none ml-0 sm:ml-12">
        <div class="relative">
          <select
            class="w-48 appearance-none rounded p-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            v-model="activePaint"
            aria-label="Paint"
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

      <!-- Seed Input -->
      <div class="flex-none ml-4">
        <input
          type="number"
          min="0"
          max="1000"
          step="1"
          class="w-24 appearance-none rounded p-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Seed"
          aria-label="Seed"
        >
      </div>
    </div>

    <!-- Image -->
    <div class="my-20">
      <img class="block w-auto mx-auto" style="max-height: 50vh;" :src="screenshotUrl" alt="Screenshot">
    </div>

    <!-- Table -->
    <table class="rounded table-fixed overflow-hidden w-full">
      <thead class="bg-gray-700 text-white text-left text-sm font-medium">
        <tr>
          <template v-for="(value, key) in data[activeItem][activePaint]" :key="key">
            <th v-for="value in ['blue', 'gold', 'purple', 'other']" class="px-4 py-3 uppercase">
              {{ key }} {{ value }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody class="text-gray-400 divide-y divide-gray-700">
        <tr class="">
          <template v-for="(value, key) in data[activeItem][activePaint]" :key="key">
            <td v-for="value in ['blue', 'gold', 'purple', 'other']" class="p-4">
              {{ data[activeItem][activePaint][key][activeIndex][value].toFixed(2) }}%
            </td>
          </template>
        </tr>
      </tbody>
    </table>

  </div>
</template>
