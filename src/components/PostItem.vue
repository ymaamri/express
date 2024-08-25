<template>
  <div :class="['post-item', { 'saved-background': isSaved }]">
    <div class="star-icon" @click="toggleSavePost">
      <span :class="{ saved: isSaved }">★</span>
    </div>
    <p class="post-date">{{ post.title.rendered }}</p>
    <p class="formatted-date">{{ formattedDate }}</p>
    <a :href="post.link" target="_blank">
      <button>Lire la suite</button>
    </a>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  isSaved: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-save'])

const toggleSavePost = () => {
  emit('toggle-save', props.post)
}

const formattedDate = computed(() => {
  const date = new Date(props.post.date)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}-${month}-${year} ${hours}:${minutes}`
})
</script>

<style scoped>
.post-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
  width: 50%;
  position: relative;
  background-color: white;
}
.post-date {
  padding-top: 10px;
}

.formatted-date {
  color: rgb(157, 148, 136);
}

.saved-background {
  background-color: #f4f4f4;
}

.star-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.star-icon span {
  font-size: 20px;
  color: lightgray;
}

.star-icon span.saved {
  color: gold;
}

button {
  background-color: #42b983;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  transition: 0.3s ease;
}

button:hover {
  background-color: #339b72;
}
</style>
