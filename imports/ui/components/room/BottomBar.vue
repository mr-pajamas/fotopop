<template>
  <div class="bottom-bar d-flex align-items-center">
    <!--
    <div class="input-group flexible d-flex align-items-center">
      &lt;!&ndash;<input type="text" placeholder="输入文字" class="flexible">&ndash;&gt;
      <span class="flexible">输入文字</span>
      <span class="input-append inflexible small">0/60</span>
    </div>
    -->
    <button class="btn inflexible d-flex align-items-center message-btn" @click="$emit('show-message')">
      <span class="flexible" style="margin-right: 1.5em;">输入文字</span>
    </button>
    <button class="btn inflexible icon-btn" @click="$emit('show-snippets')">
      <img alt="snippets" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAMAAACLrFl+AAAAY1BMVEUAAAADAwMEBAQEBAQDAwMDAwMEBAQEBAQEBAQFBQUICAgLCwsGBgYEBAQzMzP///8DAwPl5eUeHh77+/uXl5cICAjLy8vJycljY2NISEi3t7czMzPOzs5UVFREREQsLCyPj4884ztxAAAAD3RSTlMA+z3M6+TAsaxlIBhcfAWW5oKBAAABBUlEQVQ4y+2V2W6DMBQFsc1OEo9t1qbb/39lUUVrIYXg+555ZoSX63Oy7HY1imeowtRNl0VuhiRK/a9cSaVqN8XAd7DPCG7slwHItx8pCPYcNwPq8qsANonJg9Iixbo75K1Isc5DJVPsBGiZYmcohYoboJMpdoFGqPRQ75Q3z2O+3rcvRjA7xXPE599moBAqAZRwYRZI3f5LicrBIQ8f4UhREB5fZW93xKsswCUpcWAMjEkLi2NZQy8c/gYW4RPrYHCyh5yVMMviItPAJAmllQq8E0TfSpvD3QkCdkUr8FNijG9cFDC7tLLY0DkwLP3owkklRdoqufgiukyu10jX1KZQ5yX+A+QYbuTY6Hq6AAAAAElFTkSuQmCC">
      <span class="small d-block text-center">快捷输入</span>
    </button>
    <button class="btn inflexible icon-btn" @click="$emit('show-broadcast')">
      <!--<img src="/images/snippets.svg" class="d-block mx-auto">-->
      <!-- 喇叭 -->
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAyCAMAAAD7sXLbAAAA6lBMVEUAAAADAwMDAwMbGxsJCQkDAwMEBAQDAwMEBAQFBQUDAwMDAwNWVlYEBAQEBAQDAwMEBAQDAwMEBAQPDw8pKSkFBQUGBgYEBAQEBAQDAwMFBQUICAgJICoEBAQEBAQJISwDAwMEBAQFBQUGBgYEBAQFBQUHBwcICAgSEhIDAwP/////zyUkpeUEBwldXV3kuSEjoN6CgoJ4eHhMPg2srKxnZ2cbGxsWFhYKCgrq6urf39/BwcG7u7ufn5+dnZ1sbGxkZGReXl5XV1dPT084ODgNDQ319fXy8vLR0dHLy8uurq5FRUU+Pj4lJSWpNBKBAAAAKXRSTlMA/ecJG+2ypjwt8vcDzb5TQp16EAZuWNeMSjcf2s/MyZWCZVk/NSMiDUw9YYEAAAGzSURBVEjH5dbnbtswFIbhQ2oPy3LsOKt7f8e1XSte2WmS7vb+b6e0GKASPUAgDRAg7+9HFEX9OKT/WOhLLwut+ZaASmzZri5QJizf4AOHw+Eh4FtxNwGGvd4QkDa86QHoqQDQIifM22t1uwVUvX4+2V63uITht1HWXaXf+VB9rvomMDsfT7GzrN+3hCLTn1zxjofZd+YColOlnaj58ilU4uIbV30InDPzzeKonvcroezXD+aaz4Exs9rhLhGM5tcnzIZvJ5gWN0DDMfx1Mf7KbHp9PIq3qfSfdAC0XPbU3RFy1yHtP+o2eJU+GXtPj8m7gQRk4Fp610OZ59r5AGIwGg0EAjsvMWDVAPLO3n4/9t9rf54P5f/ev3f3otTef2gBaES3vq/b4BVXxfva/2t2ebLKu8Dv00IgPiB6gnp/RkdLfg84ZT4T5ahxboteBRKLvlwcGz4CCma+QpxSrbcvPKj6l8c1nzYgzpgnSJSv13ndgGo+Oap4imKIq8kcGa0oz8pdVT3tx1AlEa3sTQZzfh34cZIpvqb8GWDM0zSlTXVj63mty837gP19w/4+I/2Q7tRfm/ziXbyKECkAAAAASUVORK5CYII=">
      <span class="small d-block text-center">发送喇叭</span>
    </button>
    <button class="btn inflexible icon-btn" @click="$emit('show-items')">
      <!--<img src="/images/snippets.svg" class="d-block mx-auto">-->
      <!-- 道具 -->
      <img class="mx-auto d-block" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAuCAMAAABpjHt/AAAA/FBMVEUAAAADAwMDAwMDAwP/zyUkpeVaWM7////luiEEBAYPDAQEBAMfHkX5yiRWVMWykBpmUxBMPg0pIQg8OoeWehdNS7AyMXEJCREHBwxOTLIKCAP19fVFQ5wwL20RESaTdxfp6enAwMBRT7pCQZcrKWAYGDUPDh7Enx0jHxQMDAxYVsrJyclUUsClpaVHRaJAPpI4N4B4eHg0M3YpKFwoJ1olJFJLSkobGjkjIh8GERcVFRXr6+v58+LQ0NDn27y7u7vj1rZKSKebm5sZcJuHh4eAgIBwcHCekG2Th2dXV1dbV08cGz1IRDxBPTMtLS0TEyjGoB0sJhmLcRYVEw91TfkuAAAAA3RSTlMA6VOHqIw1AAAByElEQVQ4y7XV53LaQBSGYcOXHGklIaGCVSjGgAm4dzu9957c/71EqwPj8eSoeDJ5f0oPy2p2V9pot1Bbq72hY1lnC4pGrem9mu5Ceb5MkfdAQnyXbXMKpuWTWNH7/0TNyA8yK/Ajs4x2Ogy7NlbZXcb5nduU8ywoJzzDTi90FCyPr0p0y4aTkhsDA6LUgb1VRj1gk4iGAHYobxO2J1PT0lIP+hEYsLVMkXbhUDHoo/4lD0sOuhI1bRUez5yRwhtjD5h/Pj89mirbFOgvcPmghnEJTiESqI8Y+HbyantsGEZ/7+Dtl1zO4As0wGCO5bax7tlPJNMeAoFacCcjLJ+v5IsFkgG5sGRK+9+R8LiPF4gPqYQG6BHtJzgo6BiYEpE8AR+hHgVPeQK/cZTTUHysSK/AIVT/yYfrd2PjK4bFGkTyEqR0jOv3CwDLk0/6lykvgbiwZ8hLLubIG/HClm2XK0CdT2j3NAbUrrxddJ6NRF1MSOcOY8xgexVb+yqlVS9H661dcWB6rlt9YKRjyFUdbks63P/97ZJlPwSYZQItexP+RTt5guTrt2hNN7Q+ps0+Rg8L2m41kK8LqtP/UN0NbdQdP54NP8l/AG6hNXLQ4ZKoAAAAAElFTkSuQmCC">
      <span class="small d-block text-center">道具</span>
    </button>
    <button class="btn inflexible icon-btn disabled">
      <!--<img src="/images/gift.svg" class="d-block mx-auto">-->
      <svg class="mx-auto" width="45" height="44" viewBox="0 0 45 44" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-14 -9)" stroke="#030303" stroke-width="3" fill="none" fill-rule="evenodd"><path d="M35 17.5L21 26V12.554a2 2 0 0 1 3.038-1.71L35 17.5zM37 17.5L51 26V12.554a2 2 0 0 0-3.038-1.71L37 17.5z" fill="#FFCF25"/><circle fill="#FFCF25" cx="37" cy="17" r="4"/><rect fill="#FA4B7F" x="17.5" y="22.5" width="38" height="29" rx="2"/><rect fill="#FFF" x="15.5" y="18.5" width="42" height="6" rx="2"/><path fill="#FFF" d="M34.5 18.5h5v33h-5z"/></g></svg>
      <span class="small d-block text-center">礼物</span>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'bottom-bar',
  };
</script>

<style lang="scss" scoped>
  .bottom-bar {
    padding: .6rem .6rem 1rem;
    background-color: #2d2c66;
    /*z-index: 3;*/
    position: relative;

    .input-group {
      border-radius: .5rem;
      color: #a0a0a0;
      background-color: #f5f5f5;
      padding: .6rem .7rem;
      input {
        background-color: inherit;
        border: none;
        box-shadow: none;
        outline: 0;
        line-height: 1;
        padding: 0;
        margin: 0;
      }
    }

    .message-btn {
      background-color: #fff;
      border-radius: .3rem;
      /*color: #030303;*/
      color: #a0a0a0;
      border: .05rem #030303 solid;
      font-size: .875rem;
      height: 2.4rem;
      padding: 0 .6rem;
      margin-right: auto;

      img {
        width: .875rem;
        margin-left: .5rem;
      }
    }

    .icon-btn {
      margin-left: .6rem;
      color: #fff;
      padding: .1rem;
      img, svg {
        height: 1.5rem;
        width: auto;
        margin-bottom: .2rem;
      }
      .small {
        font-size: .75rem;
        min-width: 2.4rem;
      }
    }
  }
</style>
