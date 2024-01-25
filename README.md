# mini-mind-map

[CN](README.md)

## 一、What

mini版思维导图

## 二、How

安装

```bash
pnpm i

# 装到根目录的运行依赖中
pnpm add uuid -w

# 装到某个包的运行依赖中
pnpm --filter mind-web add  quill@^1.3.7

# 装到某个包的开发依赖中
pnpm --filter mind-web add -D  @types/quill
```

运行

```bash
# 运行库
cd packages/mind-core
pnpm build

# 运行视图
cd packages/mind-web
pnpm dev
```
