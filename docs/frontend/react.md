# React 面试题
## API 高频考题
1. 高阶组件（HOC）是什么？你在业务中使用过解决了什么问题？
  - 高阶组件是一个函数，它接受一个组件作为参数并返回一个新的组件，返回的新组件拥有被包裹的组件的所有 props，并且可以添加额外的 props 或逻辑。
  - 在业务中使用 HOC 可以解决跨多个组件共享状态或行为的问题，例如权限控制、日志记录、性能优化等。 

2. 什么时候应该使用类组件而不是函数组件？React 组件错误捕获怎么做？
  - 在早期的 React 中，类组件是唯一支持生命周期方法和内部状态管理的方式，而函数组件是没有状态的，只能通过 Hooks 来模拟类组件的功能。
  - React 16.6 引入了 Hooks，使得函数组件也可以处理状态和副作用，因此现在大多数情况下推荐使用函数组件。
  - React 组件错误捕获可以通过 `componentDidCatch` 生命周期方法来实现，或者使用 Error Boundary 包裹组件树（通常用类组件实现，作为高阶组件包裹需捕获错误的组件树），React 16+ 支持，可在错误边界组件里记录错误、展示 fallback UI 。
  ```
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      // 更新 state 使下一次渲染能够显示降级后的 UI
      return { hasError: true };
    }
  
    componentDidCatch(error, info) {
      // 记录错误信息
      this.setState({ hasError: true });
    }
  
    render() {
      if (this.state.hasError) {
        // 渲染错误信息
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children; 
    }
  }
  ```
  使用：
  ```
  <ErrorBoundary>
    <MyComponent />
  </ErrorBoundary>
  ```
  这样，当 `MyComponent` 组件内部抛出错误时，ErrorBoundary 会捕获错误并渲染错误信息，而不会影响到其他组件的渲染。

3. 如何在 React 中对 props 应用验证？
  - 可以使用 React 提供的 PropTypes 库或 TypeScript 类型注解来对组件 props 进行验证。
  - 验证 props 可以避免在组件使用时传入错误类型或缺失的属性，提高代码的健壮性和可维护性。
  |验证需求	|PropTypes	|TypeScript|
  |--|--|--|
  |基本类型	|PropTypes.string	|string|
  |必填属性	|.isRequired	|不加 ? 修饰符|
  |可选属性	|不加 .isRequired	|加 ? 修饰符|
  |数组	|PropTypes.arrayOf(...)	|Type[]|
  |对象结构	|PropTypes.shape({...})	|接口定义 interface|
  |联合类型	|PropTypes.oneOfType([...])	|`Type1	Type2`|
  |枚举值	|PropTypes.oneOf([...])	|字面量联合 `'val1'	'val2'`|
  |自定义验证	|验证函数	|类型断言 + 运行时检查|
  |检查时机	|运行时	|编译时|

4. React 中常用的组件通信方式有哪些？
  - 父组件向子组件通信：通过 props 传递数据。
  - 子组件向父组件通信：通过回调函数或发布-订阅模式。
  - 跨层级组件通信：使用 Context API 或状态管理库（如 Redux、Mobx）。

5. React 中的 key 属性有什么作用？
  - key 是 React 用于标识组件列表中唯一的标识符。
  - 它帮助 React 在更新组件时识别哪些元素发生了变化、添加或删除，从而优化渲染性能。

6. React 中如何创建 refs？创建 refs 的方式有什么区别？
  React 中，Refs 主要用于获取和操作 DOM 元素或类组件实例，是一种逃脱 props 传递的方法。
  - 字符串 refs（不推荐，易引发问题，已逐渐被弃用趋势 ）：<input ref="myInput" /> ，在类组件中通过 this.refs.myInput 访问，存在 refs 管理不清晰、与 React 纤维架构（Fiber）兼容问题 。
  - 回调 refs：<input ref={(el) => this.myInput = el} /> ，函数会在组件挂载时传入 DOM 元素（或类组件实例），卸载时传入 null ，能更精细控制 refs 赋值时机，可用于动态 refs 场景 。
  - createRef（类组件常用 ）：这是 react 16.3 版本之后推出的，使用这种方式创建的 ref 可以在整个组件的生命周期中保持不变。在类组件构造函数中 this.myRef = React.createRef() ，然后 <input ref={this.myRef} /> ，挂载后通过 this.myRef.current 访问 DOM 或组件实例，每次渲染会重新创建（但对功能无影响，只是引用变化 ）。
  ```
  class MyComponent extends React.Component {
    constructor(props) {
      super(props);
      this.myRef = React.createRef();
    }
    componentDidMount() {
      // 组件挂载后，this.myRef.current 指向 DOM 元素
      this.myRef.current.focus();
    }

    render() {
      return <input ref={this.myRef} />;
    }
  }
  ```
  - useRef（函数组件专用 ）：const myRef = useRef(null) ，作用类似 createRef ，但 useRef 创建的对象在组件多次渲染间保持引用不变，还可用于保存任意可变值（不只是 DOM 引用 ），且能避免因闭包导致的取值问题 。
  ```
  function MyComponent() {
    const myRef = useRef(null);
    useEffect(() => {
      myRef.current.focus();
    }, []);
    return <input ref={myRef} />;
  }
  ```

7. createContext 解决了什么问题？React 中父子组件如何与子组件通信？子组件如何改变父组件的状态？
  - createContext 提供了一种跨层级组件传递数据的方式，避免了通过 props 一层层传递的繁琐。
  - 父组件可以通过 Context.Provider 提供数据，子组件通过 useContext 或 Context.Consumer 获取数据。
  - 子组件可以通过回调函数或 Context 中的状态更新函数来改变父组件的状态。

8. memo 有什么用，useMemo 和 memo 区别是什么？useCallback 和 useMemo 有什么区别？
  - `React.memo` 用于优化函数组件的渲染性能，只有当组件的 props 发生变化时才重新渲染。
  - `useMemo` 用于缓存计算结果，避免在每次渲染时都进行昂贵的计算。它返回一个缓存值，当依赖项未变化时返回上次计算的结果。
  - `useCallback` 返回一个 memoized 的回调函数，只有当依赖项变化时才会更新。它通常用于避免子组件不必要的重新渲染。
  - 区别：`useMemo` 用于缓存值，`useCallback` 用于缓存函数，两者都可以优化性能，但使用场景不同。

9. React 新旧生命周期的区别是什么？合并生命周期的理由是什么？
  - React 16.3 引入了新的生命周期方法，主要是为了更好地支持异步渲染和错误边界。
  - 新的生命周期方法包括 `getDerivedStateFromProps`、`getSnapshotBeforeUpdate` 和 `componentDidCatch`。
  - 合并生命周期的理由是为了简化组件逻辑，减少不必要的生命周期方法，提高代码可读性和可维护性。

 旧的生命周期包括：
  - `componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate` 已被标记为 “不安全”，不推荐在新代码中使用。
  - `componentDidMount`、`componentDidUpdate` 分别对应新的 `componentDidMount` 和 `componentDidUpdate`，但 `componentDidUpdate` 新增了一个参数 `prevProps`。
  - `componentWillUnmount` 保持不变。
  存在问题：在 React Fiber 架构下（异步渲染 ），这些生命周期可能被多次调用（因为渲染可中断、重启 ），若在其中写了副作用逻辑（如发请求、修改 DOM ），会导致不可预期行为 。

新的生命周期：
  - `componentDidMount` 对应 `componentDidMount`。
  - `componentDidUpdate` 对应 `componentDidUpdate`，新增了一个参数 `prevProps`。
  - `componentWillUnmount` 对应 `componentDidUnmount`。
  - `getDerivedStateFromProps` 对应 `static getDerivedStateFromProps`。
  - `getSnapshotBeforeUpdate` 对应 `getSnapshotBeforeUpdate`。

10. React 中的状态管理你如何选择？什么是状态上移？什么是状态撕裂？useState同步还是异步？
  - 状态上移：将组件内部的状态提升到最近的父组件，多个子组件共享状态时，状态上移是一种优化方式，避免多个组件维护各自的状态，提高代码复用性和可维护性。
  - 状态管理库：React 官方不推荐直接在组件内部管理状态，推荐使用状态管理库（如 Redux、Mobx、Jotai等 ），它们提供了全局状态管理、数据共享和副作用处理等功能，提高了应用的可维护性和可扩展性。
  - 状态撕裂是指在并发渲染中，由于渲染的优先级不同，可能导致应用中的不同部分看到的同一份共享状态不一致的问题。这是因为在 concurrent Mode 下，react 可以选择暂停、中断或延迟某些更新，以优先处理更重要的更新。如果你的状态更新和组件的渲染不是同步的，那么就可以出现状态撕裂的问题。
  - useState 是异步的，useReducer 是同步的，useReducer 可以避免状态撕裂问题，因为它是同步更新状态的，不会被中断。

11. 在 React 中什么是 Portal？
  - Portal 可以将子组件渲染到父组件 DOM 树之外的 DOM 节点中，通常用于实现模态框、弹出层、通知等组件。
  - 场景：实现模态框（Modal ）、提示框（Tooltip ）等，让这些组件的 DOM 脱离父组件的样式限制（如父组件有 overflow: hidden 、z-index 层级问题 ），同时仍能维持 React 组件的上下文（如上下文传递、事件冒泡到父组件 ）。
  
  如需要在模态框中展示登录表单，而登录表单组件通常位于应用的底部，这时可以使用 Portal 将模态框渲染到 body 元素下，避免遮挡底部内容。

12. 自己实现一个 Hook 的关键点在哪里？
  - 实现自定义 Hook 的关键点在于理解 React 的 Hook 规则和生命周期。
  - 自定义 Hook 必须以 use 开头，不能在条件语句或循环中调用，只能在函数组件或自定义 Hook 中调用。
  - 自定义 Hook 可以使用其他 Hook 来实现复杂的逻辑和状态管理，返回值可以是任何类型的数据。
  - 在 useEffect 、useCallback 等涉及依赖项的 Hook 中，正确设置依赖数组，避免因闭包导致取值错误（如依赖变化未更新，拿到旧状态 / 值 ）。

13. 你在实现 React 具体业务的时候 TS 类型不知道怎么设置你会怎么办？
  - 查官方类型定义：React 本身、常用库（如 react-router 、redux 等 ）都有对应的 @types/xxx 类型包，参考其组件、Hook 的类型定义写法，模仿适配自己的组件 。
  - 利用 TS 工具类型：如 React.FC（函数组件类型，包含 children 等默认类型 ）、React.ComponentProps（获取某个组件的 props 类型，可用于扩展或继承 ）、Partial（将类型属性变为可选 ）、Required（变为必须 ）等，辅助定义组件 props 、状态等类型 。
  - 逐步推导和调试：先写 any 让代码跑通，再通过 TS 报错信息，逐步细化类型；或用 console.log 打印变量，分析实际数据结构，补充类型定义；还可借助 TS 的类型断言（as ）临时解决，后续再优化 。
  - 社区和文档求助：逛 Stack Overflow 、GitHub issues 、React + TS 相关博客，搜类似场景的类型定义方案，很多常见问题已有成熟解法 。

14. React 和其他框架对比优缺点是什么？你们团队选择 React 的理由是什么？
  - 优点：
    - 组件化：React 强调组件化开发，易于复用和维护。
    - 虚拟 DOM：通过虚拟 DOM 提高渲染性能，减少直接操作真实 DOM 的开销。
    - 单向数据流：数据流向清晰，易于调试和理解应用状态。
    - 丰富的生态系统：拥有大量的第三方库和工具支持，如 React Router、Redux 等。

  - 缺点：
    - 学习曲线：对于初学者来说，理解 JSX、虚拟 DOM 和组件生命周期等概念可能需要一定时间。
    - 频繁更新：React 生态系统更新较快，需要不断学习新特性和最佳实践。
  
  - 团队选择 React 的理由：
    - 团队成员对 React 有较多经验，能够快速上手和开发。
    - React 的组件化思想符合团队的开发模式，易于协作和代码复用。
    - 社区活跃，有丰富的资源和支持，能够快速解决问题。

15. React 15 (16/17/18) 都有哪些变化？useTransition 是啥新解决了什么？
  - React 15 到 16 的主要变化是引入了 Fiber 架构，优化了渲染性能和异步渲染能力。
  - React 16 引入了错误边界（Error Boundaries）、Fragments、Portals 等新特性。
  - React 17 引入了事件系统的改进，支持多个 React 实例共存，简化了升级过程。修改事件委托机制（事件绑定到 document 改为 root 节点 ），方便多版本 React 共存；
  - React 18 引入了 Concurrent Mode（并发模式）、Suspense、useTransition 等新特性，支持更流畅的用户体验和异步数据加载。
  
  `useTransition` 是一个新的 Hook，用于处理异步状态更新，可以让你在更新状态时指定过渡效果，从而避免界面卡顿。它允许你将某些状态更新标记为“过渡”，使得这些更新可以与其他高优先级的更新并行处理，提高用户体验。

## 源码高频考题
1. Fiber 架构是什么？
  - Fiber 架构是 React 16 引入的一种新的协调算法，旨在提高 React 的渲染性能和响应能力。
  - 它通过将渲染任务分解为更小的单元（Fiber 节点），允许 React 在渲染过程中进行中断和恢复，从而支持异步渲染和更流畅的用户体验。
  - Fiber 架构的核心是将组件树转换为 Fiber 树，每个 Fiber 节点代表一个组件实例，包含该组件的状态、属性和生命周期方法等。
  - Fiber 架构的主要目标是：
    - 支持异步渲染：允许 React 在渲染过程中暂停和恢复，避免长时间阻塞主线程。
    - 提高渲染性能：通过增量渲染和优先级调度，优化组件更新的效率。
    - 更好的错误处理：支持错误边界机制，可以捕获子组件中的错误并进行处理。
  - 主要特点包括：
    - **优先级调度**：可以根据任务的优先级进行调度，确保高优先级任务优先执行。
    - **增量渲染**：可以将渲染任务分解为更小的单元，允许在渲染过程中暂停和恢复。
    - **错误边界**：支持错误边界机制，可以捕获子组件中的错误并进行处理。

2. React 中的 Diff 算法是如何工作的？为什么没有采用 vue 的双指针算法？
  - React 的 Diff 算法用于比较新旧虚拟 DOM 树，找出需要更新的部分（如节点类型不同、属性变化等 ），并生成更新补丁（如属性更新、节点替换等 ），最后将补丁应用到真实 DOM 上。
  - 新的 Diff 算法引入了“协调”（Reconciliation ）阶段和“提交”（Commit ）阶段，协调阶段找出需要更新的 Fiber 节点，提交阶段将更新应用到真实 DOM 上。
  - React 的 Diff 算法采用了 O(n) 的时间复杂度，主要基于以下几点优化：
    - 只比较同级节点，避免跨层级比较。
    - 使用唯一的 key 属性来标识列表中的元素，减少不必要的 DOM 操作。
    - 对于文本节点和组件实例，直接比较内容和类型。
  - 相比之下，Vue 的双指针算法主要用于优化列表渲染，适用于特定场景，但在 React 中，由于组件树的复杂性和异步渲染的存在，双指针算法无法直接应用。

3. React 中的合成事件是什么？为什么要使用合成事件？
  - 合成事件是 React 封装的跨浏览器事件系统，用于处理浏览器原生事件。
  - 使用合成事件的主要原因是：
    - 跨浏览器兼容性：合成事件提供了一致的 API，解决了不同浏览器对事件模型的差异。
    - 性能优化：合成事件通过事件池（Event Pooling ）机制复用事件对象，减少内存分配和垃圾回收开销。
    - 统一的事件处理：合成事件可以在 React 的生命周期中更好地集成，支持异步渲染和批量更新。
  - 合成事件的使用方式与原生事件类似，但需要通过 React 的事件处理函数（如 onClick、onChange 等）来绑定事件。

4. React 整体渲染流程请描述一下？那你能说下双缓存是在哪个阶段设置的么？优缺点是什么？
  - React 的整体渲染流程可以分为以下几个阶段：
    1. **调度（Scheduling）**：React 根据组件的状态和属性变化，决定哪些组件需要重新渲染。
    2. **协调（Reconciliation）**：React 比较新旧虚拟 DOM 树，找出需要更新的部分，并生成 Fiber 节点。
    3. **提交（Commit）**：将更新应用到真实 DOM 上，执行副作用（如 useEffect ）。
  
  - 双缓存是在协调阶段设置的。React 在协调阶段会创建一个新的 Fiber 树，并将其与当前的 Fiber 树进行比较。完成比较后，React 会将新的 Fiber 树作为当前树的双缓存，等待提交阶段应用到真实 DOM 上。
  
  - 优点：
    - 提高渲染性能：通过异步渲染和中断恢复，避免长时间阻塞主线程，提高用户体验。
    - 支持并发渲染：允许多个更新并行处理，减少卡顿现象。
  
  - 缺点：
    - 增加了复杂性：双缓存机制使得 React 的内部实现更加复杂，需要处理更多的状态和逻辑。
    - 内存开销：每次渲染都需要创建新的 Fiber 节点，可能导致内存使用增加。

5. React Scheduler 核心原理是？React 的 15/16/17/18 变化有哪些？Batching 在这个阶段里么，解决了什么原理是什么？
  - React Scheduler 是 React 的调度器，用于管理任务的优先级和执行顺序。它的核心原理是将任务分为不同的优先级，根据任务的紧急程度进行调度和执行。
  - React Scheduler 使用了时间片（Time Slicing ）技术，将渲染任务分解为更小的单元，允许在渲染过程中暂停和恢复，从而支持异步渲染和并发更新。
  
  - React 15 到 18 的变化主要包括：
    - **React 15**：引入了虚拟 DOM 和组件生命周期，优化了性能。
    - **React 16**：引入了 Fiber 架构，支持异步渲染、错误边界、Fragments 等新特性。
    - **React 17**：改进了事件系统，支持多个 React 实例共存，简化了升级过程。
    - **React 18**：引入了 Concurrent Mode、Suspense、useTransition 等新特性，支持更流畅的用户体验和异步数据加载。
  
  - Batching（批量更新）是在调度阶段实现的。它通过将多个状态更新合并为一个批次，在一次渲染中应用所有更新，从而减少不必要的重新渲染，提高性能。
  
  - Batching 的原理是使用一个队列来存储待处理的更新，当事件循环结束时，React 会将队列中的所有更新应用到组件树上，从而实现批量更新。这样可以避免多次渲染导致的性能问题。

6.  Hooks 为什么不能写在条件判断、循环体、函数体里。现在我有业务场景就是需要在里面写怎么办？
  - Hooks 不能写在条件判断、循环体或函数体内的原因是为了确保 Hooks 的调用顺序在每次渲染中保持一致。React 依赖于 Hooks 的调用顺序来正确地维护组件状态和副作用。
  - 如果 Hooks 的调用顺序不一致，React 将无法正确地关联状态和副作用，从而导致错误的行为或崩溃。
  
  - 如果业务场景需要在条件判断或循环中使用类似 Hooks 的功能，可以考虑以下几种解决方案：
    - **使用多个 Hooks**：将需要条件判断的逻辑拆分成多个 Hooks，根据条件分别调用不同的 Hooks。
    - **使用状态变量**：将条件判断的结果存储在状态变量中，然后在组件渲染时根据状态变量决定是否执行某些逻辑。
    - **自定义 Hook**：创建一个自定义 Hook，将需要的逻辑封装在其中，并在组件中调用该 Hook，而不是直接在条件判断或循环中调用。
    - **useMemo/useCallback**：如果需要缓存计算结果或回调函数，可以使用 `useMemo` 或 `useCallback` 来处理。

7. 更新状态直接在函数组件调用会造成无限循环，原因是什么，怎么监测 React 无意义渲染，监控的原理是什么？
  - 在函数组件中直接调用状态更新函数（如 `setState` 或 `useState` 的更新函数）会导致无限循环的原因是每次状态更新都会触发组件重新渲染，而在渲染过程中又调用了状态更新函数，导致再次触发渲染，从而形成循环。可以通过条件判断、useEffect 等方式避免无限循环。
  - React 会在每次渲染时检查组件的状态和属性，如果发现状态或属性发生变化，就会重新渲染组件。直接在渲染过程中调用状态更新函数会导致这种变化持续发生，从而引发无限循环。

  - 监测 React 无意义渲染可以通过以下几种方式：
    - **使用 React DevTools**：React DevTools 提供了性能分析工具，可以查看组件的渲染次数和时间，帮助识别无意义的渲染。
    - **使用 `console.log`**：在组件的渲染函数中添加 `console.log`，记录每次渲染的相关信息，如组件名称、渲染次数等。
    - **使用性能分析工具**：如 Chrome 的 Performance 面板，可以记录页面性能数据，分析组件的渲染情况。

  - 监控的原理是通过记录组件的渲染次数和时间，比较不同状态下的渲染性能，从而识别出无意义的渲染行为。通过优化代码逻辑、减少不必要的状态更新，可以提高应用性能。

8. React 如何实现自身的事件系统？什么叫合成事件？
  - React 实现自身的事件系统是通过合成事件（Synthetic Events ）来处理浏览器原生事件。合成事件是 React 封装的跨浏览器事件模型，提供了一致的 API，解决了不同浏览器对事件模型的差异。
  - 合成事件的主要作用是：
    - **跨浏览器兼容性**：合成事件提供了一致的事件处理接口，避免了不同浏览器之间的差异。
    - **性能优化**：合成事件通过事件池（Event Pooling ）机制复用事件对象，减少内存分配和垃圾回收开销。
    - **统一的事件处理**：合成事件可以在 React 的生命周期中更好地集成，支持异步渲染和批量更新。

  - 合成事件的使用方式与原生事件类似，但需要通过 React 的事件处理函数（如 onClick、onChange 等）来绑定事件。React 会在内部将这些事件转换为合成事件，并在组件树中传播。

9. React concurrent Mode 是什么？React18 是怎么实现的，它和 useTransition 有联系吗？
  - React Concurrent Mode（并发模式）是 React 18 引入的一种新特性，旨在提高应用的响应能力和用户体验。它允许 React 在渲染过程中暂停和恢复任务，从而支持更流畅的用户界面和异步数据加载。
  - Concurrent Mode 的核心思想是将渲染任务分解为更小的单元（Fiber 节点），允许 React 在渲染过程中进行中断和恢复，从而支持异步渲染和并发更新。
  - React 18 实现了 Concurrent Mode，通过新的调度器（Scheduler ）来管理任务的优先级和执行顺序。它允许开发者指定任务的优先级，并在需要时暂停和恢复任务。
  
  - `useTransition` 是 Concurrent Mode 的一部分，它允许开发者在状态更新时指定过渡效果，从而避免界面卡顿。`useTransition` 可以将某些状态更新标记为“过渡”，使得这些更新可以与其他高优先级的更新并行处理，提高用户体验。
  - `useTransition` 的使用方式类似于其他 Hook，但它返回一个包含过渡状态和更新函数的数组。开发者可以使用这个 Hook 来管理过渡状态，并在需要时调用更新函数来触发状态更新。

10. 将 Vue 换成 React 能提高 FPS 吗？请给出理由。
  - 将 Vue 换成 React 是否能提高 FPS（帧率）取决于多个因素，包括应用的复杂性、组件结构、状态管理方式等。
  - React 和 Vue 都是高性能的前端框架，具有各自的优化机制和渲染策略。React 的虚拟 DOM 和 Fiber 架构可以提供高效的渲染性能，而 Vue 的响应式系统和优化的模板编译也能实现高效渲染。
  - 如果应用在 Vue 中存在性能瓶颈（如不合理的组件嵌套、过多的状态更新等 ），迁移到 React 可能会带来性能提升，反之亦然。
  - 最终是否能提高 FPS 还需要通过实际测试和性能分析来验证。建议在迁移前进行详细的性能评估和优化，以确保最佳的用户体验。

11. React 18 有哪些新特性？
  - React 18 引入了 Concurrent Mode（并发模式），允许 React 在渲染过程中暂停和恢复任务，支持更流畅的用户界面和异步数据加载。
  - React 18 还引入了新的 Hooks 功能，如 `useId`、`useTransition`、`useDeferredValue` 等，用于优化状态更新和异步操作。

12. Lane 是什么？解决了 React 什么问题，原理是什么？
  - Lane 是 React 18 引入的一种新的调度机制，用于管理任务的优先级和执行顺序。它允许 React 将任务分为不同的优先级等级（Lanes ），并根据任务的紧急程度进行调度和执行。
  - Lane 的主要作用是：
    - **支持并发渲染**：Lane 允许 React 在渲染过程中暂停和恢复任务，从而支持异步渲染和并发更新。
    - **提高响应能力**：通过优先级调度，React 可以确保高优先级任务优先执行，提高应用的响应能力。
  
  - Lane 的原理是将任务分为多个等级，每个等级对应一个 Lane。当有新的任务需要执行时，React 会根据任务的优先级将其分配到相应的 Lane 中。调度器会根据 Lane 的优先级顺序来执行任务，从而实现高效的渲染和更新。
  - Lane 的引入使得 React 能够更好地处理复杂的渲染场景，支持异步渲染和并发更新，提高了应用的性能和用户体验，同时也简化了开发者的工作。

## 手写高频考题
1. 手写一个 useState（以 useState、useEffect、useReducer 为例 ）
(1) useState 手写简易版
```
// 模拟 React 内部状态存储，实际 React 用 Fiber 管理更复杂
let state;
let updateQueue = [];

function useState(initialValue) {
  state = state || initialValue;
  function dispatch(newValue) {
    state = newValue;
    // 模拟触发更新，执行副作用（类似 React 调度更新流程）
    updateQueue.forEach(fn => fn()); 
  }
  return [state, dispatch];
}

// 测试
const [count, setCount] = useState(0);
console.log(count); // 0
setCount(1);
console.log(count); // 1 
```
(2) useEffect 手写简易版
```
let effectQueue = [];
let isMounted = false;

function useEffect(effect, deps) {
  const hasNoDeps = !deps;
  // 模拟上一次的依赖，实际 React 会在 Fiber 节点中存储
  const prevDeps = effectQueue.length > 0 ? effectQueue[effectQueue.length - 1].deps : null; 
  const hasChangedDeps = prevDeps 
    ? deps.some((dep, index) => dep !== prevDeps[index]) 
    : true;

  if (hasNoDeps || hasChangedDeps) {
    // 卸载时执行上一次 effect 的清除函数
    if (isMounted && effectQueue.length > 0) {
      const cleanup = effectQueue[effectQueue.length - 1].cleanup;
      cleanup && cleanup();
    }
    const cleanup = effect();
    effectQueue.push({ effect, deps, cleanup });
  }

  if (!isMounted) {
    isMounted = true;
  }
}

// 模拟组件卸载（实际在 Fiber 卸载阶段触发 ）
function unmount() {
  isMounted = false;
  effectQueue.forEach(({ cleanup }) => {
    cleanup && cleanup();
  });
  effectQueue = [];
}

// 测试
useEffect(() => {
  console.log('effect 执行');
  return () => {
    console.log('effect 清除');
  };
}, [/* 依赖 */]);
```
(3) useReducer 手写简易版
```
function useReducer(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }

  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  return [state, dispatch, subscribe];
}

// 测试 reducer
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(counterReducer, { count: 0 });
dispatch({ type: 'increment' });
console.log(state.count); // 1 
```
2. React FiberNode 链表伪代码
```
// 模拟 FiberNode 结构
function FiberNode(tag, key, type) {
  this.tag = tag; // 组件类型标记（如函数组件、DOM 组件 ）
  this.key = key; // Diff 时的唯一标识
  this.type = type; // 组件类型（如 'div'、MyComponent ）
  this.return = null; // 父 Fiber 节点
  this.child = null; // 第一个子 Fiber 节点
  this.sibling = null; // 下一个兄弟 Fiber 节点
  this.pendingProps = null; // 待处理属性
  this.memoizedProps = null; // 已处理属性
  this.updateQueue = null; // 更新队列
  this.alternate = null; // 双缓存对应的另一个 Fiber（Current/WorkInProgress ）
}

// 构建 Fiber 树示例（父 -> 子 -> 兄弟 ）
const rootFiber = new FiberNode('HostRoot', null, 'Root');
const parentFiber = new FiberNode('FunctionComponent', null, ParentComponent);
const childFiber = new FiberNode('HostComponent', null, 'div');
const siblingFiber = new FiberNode('HostComponent', null, 'span');

rootFiber.child = parentFiber;
parentFiber.return = rootFiber;
parentFiber.child = childFiber;
childFiber.return = parentFiber;
childFiber.sibling = siblingFiber;
siblingFiber.return = parentFiber;
```


3. React Scheduler 涉及到核心微任务、宏任务代码输出结果考题
```
function sleep(duration) {
  const start = Date.now();
  while (Date.now() - start < duration) {}
}

function App() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    // 宏任务
    setTimeout(() => {
      console.log('setTimeout start');
      setCount(1);
      sleep(1000); 
      console.log('setTimeout end');
    }, 0);

    // 模拟 Scheduler 调度的任务（微任务或可中断任务 ）
    const performWork = () => {
      console.log('performWork start');
      setCount(2);
      sleep(500); 
      console.log('performWork end');
    };

    // 模拟 Scheduler 优先调度（实际用 requestIdleCallback 或类似逻辑 ）
    Promise.resolve().then(performWork); // 微任务
  }, []);

  console.log('render', count);
  return <div>{count}</div>;
}
```

## 同构考题
同构是指服务端与客户端代码在一套代码中运行。
1. React 的同构开发你是如何部署的？使用 Next 还是自己开发的？流式渲染是什么有什么好处？
答案 & 解析：
部署方式（以 Next.js 为例 ）：
开发阶段：运行 next dev 启动开发服务器，支持热更新、React 组件同构编写（页面组件同时支持服务端和客户端逻辑 ）。
生产部署：执行 next build 生成优化后的生产代码（包含服务端渲染逻辑、静态资源等 ），再通过 next start 启动服务端，静态资源可配置 CDN 加速。若需更灵活部署，可将构建后的产物（.next 目录 ）部署到 Node.js 服务器，或结合 Serverless 架构（如 Vercel 平台自动适配 ）。
选择 Next.js 原因：
开箱即用，集成路由、SSR/SSG（静态站点生成 ）、代码分割、自动优化等功能，无需手动搭建复杂的同构渲染、路由匹配、资源加载逻辑。若项目有极特殊需求（如深度定制服务端渲染流程、整合非标准生态 ），可能自研同构，但成本高、易踩坑，Next.js 生态成熟，优先推荐 。
流式渲染（React 18+ ）：
概念：服务端渲染时，不等待所有数据加载和组件渲染完成，而是分段、逐步将 HTML 流式传输到客户端，客户端边接收边渲染。
好处：
大幅减少首屏加载时间（用户无需等待全部内容，先看到部分渲染结果，感知上更快 ）。
降低服务端内存压力（不用一次性渲染整个页面，可分批次处理 ）。
提升交互响应性（客户端可更早开始 “水合（Hydrate）” 过程，绑定事件，让页面更快可交互 ）。
2. React 服务端渲染需要进行 Hydrate 么？哪些版本需要？据我所了解 Qwik 是去 Hydrate 的，为什么呢？
答案 & 解析：
React 服务端渲染与 Hydrate：
React 服务端渲染（SSR ）后，必须进行 Hydrate（水合 ）。因为服务端只生成静态 HTML 结构，客户端需要绑定事件、恢复组件交互能力，让客户端代码与服务端渲染的 DOM 结构 “对齐”，保证交互正常。从 React 早期版本（如 React 15 支持 SSR 起 ）到最新版，只要涉及 SSR ，都需要 Hydrate ，核心 API 是 ReactDOM.hydrateRoot（React 18+ ）或旧版 ReactDOM.hydrate 。
Qwik 去 Hydrate 的原因：
Qwik 采用 “零水合（Zero Hydration）” 架构，核心思路是：
服务端渲染时，把组件的交互逻辑（事件处理等 ）序列化为 可延迟执行的序列化代码片段，嵌入到 HTML 中。
客户端无需整体 “水合” 绑定所有事件，而是当用户与某个元素交互时，再动态加载并执行对应的交互逻辑（按需激活 ）。
这样极大减少客户端初始化时的工作量，提升首屏加载性能，尤其适合对性能极致追求的场景。但实现复杂度高，生态完善度不如 React + Next.js 成熟 。
3. React 同构渲染如果提高性能问题？你是怎么落地的，同构解决了哪些性能指标？
答案 & 解析：
性能优化落地方式：
代码层面：
用 React.memo 、useMemo 、useCallback 避免不必要的组件渲染和函数创建，减少客户端水合、渲染开销。
服务端渲染时，优化数据预取逻辑（如用 getServerSideProps 、getStaticProps 合理区分 SSR/SSG 场景 ），避免服务端渲染等待过多异步数据。
部署层面：
静态资源（JS、CSS ）通过 CDN 加速分发，减小客户端加载体积。
结合缓存策略（如服务端渲染结果缓存、CDN 缓存静态页面 ），降低重复渲染、请求成本。
架构层面：
采用增量静态再生（Incremental Static Regeneration ，Next.js 特性 ），定时或按需更新静态页面，平衡静态页面的实时性和性能。
解决的性能指标：
首屏时间（FCP ）：服务端直出 HTML ，减少客户端白屏等待，提升首次内容绘制速度。
可交互时间（TTI ）：合理的 Hydrate 优化、代码拆分，让页面更快完成事件绑定，进入可交互状态。
搜索引擎优化（SEO ）：服务端渲染的 HTML 包含完整内容，利于搜索引擎抓取，提升页面搜索排名 。
4. React 进行 Serverless 渲染时候项目需要做哪些改变？
答案 & 解析：
架构适配：
代码需无状态化，Serverless 环境下函数实例可能频繁销毁、重建，避免依赖全局状态（如全局变量存储请求上下文 ），改用请求级别的上下文传递（如 Next.js 中通过 getServerSideProps 传递请求数据 ）。
依赖管理需更严格，Serverless 函数打包时要准确包含所有依赖，避免因环境差异（如本地开发依赖与 Serverless 运行时依赖不一致 ）导致报错，可通过 serverless-webpack 等工具优化打包。
渲染流程调整：
服务端渲染逻辑需适配 Serverless 函数的冷启动特性。若冷启动时间长，可通过预加载常用模块、使用更轻量的运行时（如 Vercel 的 Edge Functions 搭配 React Server Components ）优化。
数据预取要更高效，Serverless 场景下每次函数调用可能独立，需减少数据预取的冗余，利用缓存（如 Redis 、CDN 缓存 ）降低重复请求数据库、接口的成本。
部署与配置：
静态资源需分离部署，Serverless 函数专注渲染，静态文件（JS、CSS、图片 ）上传至对象存储（如 AWS S3 ）并通过 CDN 分发，减轻函数压力。
配置 Serverless 函数的内存、超时时间，根据渲染复杂度调整（如复杂页面渲染需更多内存、更长超时，避免因资源不足或超时导致渲染失败 ）。