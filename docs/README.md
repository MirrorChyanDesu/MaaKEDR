---
index: false
---

<script setup>
import { useRouter } from 'vuepress/client'
import { onMounted } from 'vue'

const router = useRouter()
onMounted(() => {
  router.replace('/zh/')
})
</script>
