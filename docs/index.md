---
layout: home
---

<script setup>
import { useRouter } from 'vitepress'
const router = useRouter()
if (typeof window !== 'undefined') {
  router.go('/zh/')
}
</script>
