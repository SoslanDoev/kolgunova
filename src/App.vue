<template>
  <div class="wrapper">

    <div class="info">
      <div class="info__inner">
        <ul class="info__list">
          <li class="info__item" @click="page = 'home', getVideo()" :class="{'info__item-active': page == 'home'}">
            <button type="submit">Главная</button>
          </li>
          <li class="info__item" @click="page = 'upload'" :class="{'info__item-active': page == 'upload'}">
            <button type="submit">Загрузить</button>
          </li>
        </ul>
      </div>
    </div>
    <template v-if="page == 'home'">
      <div class="videos">
        <div class="video__search">
          <input type="text" v-model="search" placeholder="Search...">
        </div>
        <div class="videos__inner">
          <div v-if="!!!videos.length || !!!videosComputed.length" class="videos__notfound">
            <p class="videos__notfound-error">404</p>
            <h1 class="videos__notfound-title">Пусто или ничего не найдено...</h1>
          </div>
          <template v-else>
            <div class="video" v-for="video in videosComputed" :key="video">
              <video class="video__video" controls :src="`http://localhost:3000/uploads/${video.name}`"></video>
              <p class="video__text">{{ video.name }}</p>
              <p class="video__delete" @click="videoDestroy(video.name)">Удалить</p>
            </div>
          </template>
        </div>
      </div>
    </template>

    <template v-if="page == 'upload'">
      <div class="videos">
        <div class="videos__upload-inner">
          <div class="videos__upload">
            <h1 class="videos__upload-title">Загрузить видео</h1>
          </div>
          <form @submit.prevent="uploadVideo">
            <input type="file" ref="videoFile" />
            <button type="submit">Загрузить</button>
          </form>
        </div>
      </div>
    </template>
    
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue"
  const page = ref("home")
  import axios from "axios"

  const videos = ref([])
  const search = ref("")
  const videoFile = ref(null)

  const videosComputed = computed(() => {
    return videos.value.filter((e) => {
      return e.name.toLowerCase().includes(search.value.toLowerCase())
    }) 
  })

  const uploadVideo = async () => {
    const file = videoFile.value.files[0]
    const formData = new FormData()
    formData.append("video", file)
    try {
      await axios.post("http://localhost:3000/api/videos", formData, {
        header: {
          "Content-Type": "multipart/form-data",
        },
      })
      alert("Файл успешно загружен")
    } catch (err) {
      console.log("Ошибка загрузки видео", err)
    }
  }

  const getVideo = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/videos")
      videos.value = res.data
    } catch(err) {
      console.log("error: ", err)
    }
  }

  const videoDestroy = async (name) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/videos/${name}`)
      videos.value = res.data
      getVideo()
    } catch(err) {
      console.log("error: ", err)
    }
  }

  onMounted(async () => {
    getVideo()
  })
</script>

<style>
  @font-face {
    font-family: "robot";
    src: url("./assets/font.ttf")  format('truetype');
  }
  *, *::after, *::before {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: "robot", sans-serif;
    font-size: 1.5rem;
  }
  html {
    font-size: 16px;
  }
  html, body {
    height: 100%;
  }
  .wrapper {
    height: 100%;
    display: grid;
    grid-template-columns: 270px calc(100% - 270px);
  }
  ul, ol, li { 
    list-style: none;
  }
  body {
    color: #fff;
    overflow: hidden;
  }
  #app {
    height: 100vh;
  }
  .info__item {
    cursor: pointer;
    text-align: center;
  }
  .info {
    height: 100%;
    padding: 10px;
    background-color: #343434;
  }
  .info__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .info__list button {
    background-color: #242424;
    width: 100%;
  }
  .info__item-active {
    margin-left: 50px;
  }
  .videos {
    background-color: #565656;
    padding: 10px;
  }
  .video__delete {
    cursor: pointer;
  }
  .videos__inner {
    padding: 15px 0;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    height: 100vh;
    gap: 5px;
  }
  .videos__notfound {
    padding: 25px 0 0 0;
    width: 100%;
    text-align: center;
  }
  .videos__notfound-title {
    margin-top: -20px;
    font-size: 3rem;
  }
  .videos__upload {
    padding: 25px 0 0 0;
    width: 100%;
    text-align: center;
  }
  .videos__upload-title {
    font-size: 3rem;
  }
  .videos__notfound-error {
    font-size: 10rem;
    line-height: 9.375rem;
  } 
  .video {
    background-color: #242424;
    width: calc(25% - 5px);
    height: 250px;
    border-radius: 4px;
    box-shadow: 5px 5px 5px 5px #343434;
  }
  .video__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    padding: 10px;
  }
  .video__search {
    width: 50%;
    margin: 0 auto 5px;
  }
  .video__search-title {
    text-align: center;
  }
  input {
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    background-color: #343434;
    color: #fff;
    width: 100%;
    outline: none;
    text-align: center;
    box-shadow: 5px 5px 5px 5px #242424;
  }
  form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 500px;
    margin: 0 auto;
    gap: 15px;
    padding: 10px 0;
  }
  button {
    background-color: #343434;
    color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
    border: 2px solid #fff;
    cursor: pointer;
  }
</style>
