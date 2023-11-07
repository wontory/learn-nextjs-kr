Chapter 8

# React에서 Next.js로

지난 강의에서 React를 시작하는 방법에 대해 논의했습니다. 이것이 최종 코드입니다. 여기서 시작하는 경우, 이 코드를 코드 편집기의 `index.html` 파일에 붙여넣으세요.

```html
<html>
  <body>
    <div id="app"></div>

    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <script type="text/jsx">
      const app = document.getElementById("app")

      function Header({ title }) {
        return <h1>{title ? title : "Default title"}</h1>
      }

      function HomePage() {
        const names = ["Ada Lovelace", "Grace Hopper", "Margaret Hamilton"]

        const [likes, setLikes] = React.useState(0)

        function handleClick() {
          setLikes(likes + 1)
        }

        return (
          <div>
            <Header title="Develop. Preview. Ship. 🚀" />
            <ul>
              {names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>

            <button onClick={handleClick}>Like ({likes})</button>
          </div>
        )
      }

      ReactDOM.render(<HomePage />, app)
    </script>
  </body>
</html>
```

여기에서 세 가지 중요한 React 개념, **컴포넌트**, **프롭스(Props)** 및 **상태(State)** 를 소개했습니다. 이러한 개념에 대한 튼튼한 기반을 갖고 있다면 React 애플리케이션 개발을 시작하는데 도움이 될 것입니다. 더 자신감을 얻게 되면 다음과 같은 다른 React 주제도 살펴보세요.

- [React가 렌더링을 처리하는 방법](https://react.dev/learn/render-and-commit) 및 [refs(참조) 사용 방법](https://react.dev/learn/referencing-values-with-refs)
- [상태 관리 방법](https://react.dev/learn/managing-state)
- [깊게 중첩된 데이터에 대한 context(컨텍스트) 사용 방법](https://react.dev/learn/passing-data-deeply-with-context)
- `useEffect()`와 같은 [React API 훅 사용 방법](https://react.dev/reference/react)

### React 자료

해가 갈수록, React를 학습하는 데 도움이 되는 많은 강좌, 비디오 및 글들이 작성되었습니다. 학습 스타일에 맞는 자료를 추천하기 어렵지만, 유용한 참고 자료 중 하나는 [React 공식 문서](https://react.dev/)입니다. 이 공식 문서에는 주제를 연습하는 데 도움이 되는 대화형 샌드박스가 포함되어 있습니다.

React를 배우는 가장 좋은 방법은 **빌드하는 것**입니다. 기존 웹사이트에 작은 컴포넌트를 추가하기 위해 `<script>`와 지금까지 배운 내용을 점차 도입할 수 있습니다. 그러나 많은 개발자들이 React가 제공하는 사용자 및 개발자 경험이 가치 있다고 판단해 전체 프론트엔드 프로젝트를 React로 바로 작성하기도 합니다.

### React에서 Next.js로

React는 UI를 구축하는 데 능숙하지만, 완전히 기능적이며 확장 가능한 애플리케이션으로써 UI를 독립적으로 개발하기 위해서는 작업이 더 필요합니다. 좋은 소식은 Next.js가 설정 및 구성의 대부분을 처리하고 React 애플리케이션을 구축하는 데 도움이 되는 추가 기능을 가지고 있다는 것입니다.

다음으로 React에서 Next.js로 예제를 마이그레이션하고, Next.js가 어떻게 작동하는지 설명하며, Next.js의 고급 기능을 배우기 위해 도움이 되는 웹 개발 개념도 소개하겠습니다.
