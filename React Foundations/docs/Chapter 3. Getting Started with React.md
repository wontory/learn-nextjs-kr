Chapter 3

# React 시작하기

React를 프로젝트에서 사용하려면 [unpkg.com](https://unpkg.com/)이라는 외부 웹사이트에서 두 개의 React 스크립트를 불러와야 합니다:

- **react**는 핵심 React 라이브러리입니다.
- **react-dom**은 DOM과 함께 React를 사용할 수 있도록 특정한 메서드를 제공합니다.

```html
<html>
  <body>
    <div id="app"></div>

    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>

    <script type="text/javascript">
      const app = document.getElementById('app');
    </script>
  </body>
</html>
```

일반적인 JavaScript로 DOM을 직접 조작하는 대신, `react-dom`에서 제공하는 `ReactDOM.render()` 메서드를 사용하여 React에게 `<h1>` 제목을 `#app` 요소 내에 렌더링하도록 지시할 수 있습니다.

```html
<html>
  <body>
    <div id="app"></div>

    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>

    <script type="text/javascript">
      const app = document.getElementById('app');
      ReactDOM.render(<h1>Develop. Preview. Ship. 🚀</h1>, app);
    </script>
  </body>
</html>
```

그러나 이 코드를 브라우저에서 실행하려고 하면 구문 오류가 발생합니다:

![React 구문 오류](https://nextjs.org/_next/image?url=%2Fstatic%2Fimages%2Flearn%2Ffoundations%2Ferror.png&w=1920&q=75&dpl=dpl_BwAwEtN7ncXAnnwFzTiU7xDupY2g)

이것은 `<h1>...</h1>`이 유효한 JavaScript가 아니기 때문입니다. 이러한 코드는 JSX입니다.

&nbsp;

### JSX란 무엇인가요?

JSX는 JavaScript의 구문 확장으로, 익숙한 HTML과 유사한 구문을 사용하여 UI를 설명할 수 있게 해줍니다. JSX의 좋은 점은 [JSX 규칙 세 가지](https://react.dev/learn/writing-markup-with-jsx#the-rules-of-jsx)을 따르는 것 외에도 HTML과 JavaScript 외에는 새로운 기호나 구문을 배울 필요가 없다는 것입니다.

브라우저는 JSX를 기본적으로 이해하지 않으므로 JSX 코드를 일반 JavaScript로 변환하기 위해 [Babel](https://babeljs.io/)과 같은 JavaScript 컴파일러가 필요합니다.

&nbsp;

### 프로젝트에 Babel 추가하기

프로젝트에 Babel을 추가하려면 `index.html` 파일에 다음 스크립트를 복사 및 붙여넣어야 합니다:

```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

또한 Babel에 어떤 코드를 변환할지 알려야 하므로 스크립트 유형을 `type=text/jsx`로 변경해야 합니다.

```html
<html>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <!-- Babel 스크립트 -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/jsx">
      const app = document.getElementById('app');
      ReactDOM.render(<h1>Develop. Preview. Ship. 🚀</h1>, app);
    </script>
  </body>
</html>
```

그런 다음 브라우저에서 코드를 실행하여 올바르게 작동하는지 확인할 수 있습니다.

방금 작성한 **선언적** React 코드 비교:

```html
<script type="text/jsx">
  const app = document.getElementById("app")
  ReactDOM.render(<h1>Develop. Preview. Ship. 🚀</h1>, app)
</script>
```

이전 섹션에서 작성한 **명령형** JavaScript 코드:

```html
<script type="text/javascript">
  const app = document.getElementById('app');
  const header = document.createElement('h1');
  const text = 'Develop. Preview. Ship. 🚀';
  const headerContent = document.createTextNode(text);
  header.appendChild(headerContent);
  app.appendChild(header);
</script>
```

React를 사용하면 반복적인 코드를 대부분 줄일 수 있음을 알 수 있습니다.

이것이 바로 React가 하는 일입니다. React는 재사용 가능한 코드 조각을 포함하는 라이브러리로, 여기서는 UI를 업데이트하는 작업을 대신 수행합니다.

&nbsp;

> **참고**: React가 UI를 어떻게 업데이트하는지 정확히 알 필요는 없지만 더 알고 싶다면 React 문서의 [UI trees](https://react.dev/learn/preserving-and-resetting-state#the-ui-tree)와 [react-dom/server](https://react.dev/reference/react-dom/server) 섹션을 살펴보세요.

&nbsp;

> 추가 자료:
>
> - [JSX로 마크업 작성하기](https://react.dev/learn/writing-markup-with-jsx)
