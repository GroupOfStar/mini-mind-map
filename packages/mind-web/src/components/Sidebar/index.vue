<template>
  <div class="sider">
    <div class="sidebarLeft" @click.stop>
      <div class="trigger">
        <div
          class="triggerItem"
          v-for="(item, index) in sidebarTriggerList"
          :key="item.value"
          @click="trigger(item, index)"
        >
          <div class="line-box">
            <div class="triggerIcon">
              <i :class="['icon', item.icon]"></i>
            </div>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="containerLeft" @click.stop>
      <span class="closeBtn"><i class="icon-mind icon-close" @click="close"></i></span>
      <div class="sidebarHeader">title</div>

      <div class="sidebarContent">
        <button v-for="item in layoutList" :key="item.value" @click="() => onLayout(item)">
          {{ item.title }}
        </button>
        <div>
          <button @click="onTestClick">测试按钮</button>
        </div>
      </div>

      <div class="directionLeft" style="left: 269px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Graph, ILayoutType } from "@mini-mind-map/mind-core";
import { sidebarTriggerList, layoutList } from "./../../config";

const props = defineProps({
  mindMap: {
    type: Graph,
    required: true,
  },
});

const trigger = (...args: any[]) => {
  console.log("args :>> ", args);
};

// 关闭侧边栏
const close = () => {
  console.log("close");
};

// 测试按钮
const onTestClick = (e: MouseEvent) => {
  e.preventDefault();
  const mindMap = props.mindMap;
  const transform = mindMap.graphGroup.transform();
  const width = mindMap.graphGroup.width();
  const height = mindMap.graphGroup.height();
  const x = mindMap.graphGroup.x();
  const y = mindMap.graphGroup.y();
  console.log("x :>> ", x);
  console.log("y :>> ", y);
  console.log("transform :>> ", transform);
  console.log("width :>> ", width);
  console.log("height :>> ", height);
};

const onLayout = (item: IStatusEnum<ILayoutType>) => {
  const mindMap = props.mindMap;
  mindMap.theme.config.layout = item.value;
  mindMap.layout();
  mindMap.onResize();
};
</script>

<style scoped lang="less">
.sider {
  .sidebarLeft {
    position: fixed;
    right: 0;
    margin-right: 15px;
    transition: all 0.3s;
    width: 49px;
    background-color: #fff;
    box-shadow: 0 3.5px 8.75px 0 #0000001a;
    border-radius: 14px;
    top: 36px;
    .trigger {
      border-color: #eee;
      padding: 10px 0;
      overflow: hidden;
      .triggerItem {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        &.active {
          color: #7716d9;
          font-weight: bold;
        }
        .triggerIcon {
          width: 35px;
          height: 35px;
          background: #ffffff;
          border-radius: 8px;
          text-align: center;
          line-height: 35px;
          .icon {
            font-size: 21px;
          }
          &:hover {
            background: #f5f4f6;
          }
        }
        .line-box {
          .line {
            width: 40px;
            height: 1px;
            background: #f0f0f0;
          }
        }
      }
    }
  }

  .containerLeft {
    position: fixed;
    right: 58px;
    bottom: 0;
    top: 30px;
    width: 272px;
    margin-right: 17px;
    background-color: #fff;
    border-right: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
    box-shadow: 0 3.5px 8.75px 0 #0000001a;
    border-radius: 14px;
    height: calc(100vh - 122px);

    .closeBtn {
      position: absolute;
      right: 20px;
      top: 25px;
      font-size: 17px;
      cursor: pointer;
    }

    .sidebarHeader {
      width: 100%;
      height: 68px;
      display: flex;
      align-items: center;
      flex-grow: 0;
      margin-left: 24px;
      flex-shrink: 0;
      font-weight: 500;
      font-size: 18px;
      color: #191919;
    }

    .sidebarContent {
      width: 100%;
      height: 100%;
      overflow: overlay;
    }

    .sidebarContent::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }

    /* 两个滚动条交接处 -- x轴和y轴 */

    .sidebarContent::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    /* 滚动条滑块 */

    .sidebarContent::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #dfe0df;
    }

    /* 滚动条轨道 */

    .sidebarContent::-webkit-scrollbar-track {
      border-radius: 10px;
      background: #ffffff;
    }

    .directionLeft {
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-right: 6px solid #ffffff;
      position: absolute;
      right: 269px;
    }
  }
}
</style>
