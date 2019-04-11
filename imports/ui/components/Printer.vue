<template>
  <div class="printer filler" style="background-color: gray; color: white; overflow: auto; font-size: .75rem;">
    <pre><samp>{{ content }}</samp></pre>
  </div>
</template>

<script>
  export default {
    name: "Printer",
    props: ['content'],
    computed: {
      printableContent() {
        return JSON.stringify(content, null, 2);
      },
    },
  };
</script>
