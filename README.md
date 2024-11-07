# DevScope

DevScope是一个基于 Vue3.js + TypeScript 的前端框架，用于提供 DevScope 的前端界面和用户交互。

## 模块介绍

### 1. 首页
首页，由 **项目标题**“DevScope” 、 **搜索区域** 、 **搜索模式切换按钮** 以及 **搜索图标** 组成。
用户初次进入网页，即可看到普通模式。以下为两种搜索模式的搜索流程：

#### 1. 普通模式（根据用户名搜索）
step1 · 用户在输入框中输入用户名后，点击右侧的搜索图标，前端调用后端api接口，获取该用户的信息，包括基本信息、就职信息（即公司名称）；
step2 · 同时，对这些信息进行预处理（将空信息设置为“N/A”）、封装和填充；
step3 · 随后，跳转到列表详情页。

#### 2. 领域模式（根据领域搜索）
step1 · 当用户点击 switch 开关，切换为领域模式后，用户在下拉框中选择需要查询的领域，（在输入框中输入想要筛选的国籍，这一步可选，）点击右侧的搜索图标，前端调用后端api接口，获取指定领域的所有用户排名<sup>1</sup>；
step2 · 若有选择国籍，则从<sup>1</sup>的返回结果中筛选指定国籍的用户；
step3 · 同时，对这些信息进行预处理（将空信息设置为“N/A”）、封装和填充；
step4 · 随后，跳转到列表详情页。

### 2. 列表详情页
#### 1. 页面组成
页面由列表、具体信息的左右两栏布局实现。
其中，左侧的列表部分，存放两种搜索模式搜索到的用户排名表，包含各用户的 **排名** 、 **用户名** 、 **开发者技术能力总分** 。
右侧的具体信息部分，分为 **基本信息** 、 **Talent Rank图表** 。两部分内容如功能模块图所示。

#### 2. 前端实现


## 项目所使用技术
项目使用了如下技术、框架：
1. Vue3.js + TypeScript（使用Vite+Pinia搭建初始化项目）
2. Axios（经过封装，用于前后端数据通信）
3. 

## 相关图表

### 1. 系统流程图

<p align="center">
  <img src="./flowChart.png" alt="系统流程图" style="width:600px;height:400px;" />
</p>


### 2. 功能模块图

<p align="center">
  <img src="./moduleDiagram.png" alt="功能模块图" style="width:600px;height:600px;" />
</p>

### 3. 界面效果图

<p align="center">
  <img src="./moduleDiagram.png" alt="界面效果图1" style="width:600px;height:600px;" />
</p>


# 如何使用项目

请参照以下内容使用该项目。

## 1. 推荐的IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## 2. 项目搭建

```sh
npm install
```

### 1. 编译和热加载

```sh
npm run dev
```

### 2. （可选）生产环境下的类型检查、编译和压缩

```sh
npm run build
```
