# Chapter 5. Building UI with Components

Chapter 5

## 컴포넌트로 UI 구축하기

사용자 인터페이스는 **컴포넌트**라고 불리는 더 작은 구성 요소로 분해될 수 있습니다.

컴포넌트를 사용하면 독립적이고 재사용 가능한 코드 스니펫을 만들 수 있습니다. 컴포넌트를 **레고 브릭**처럼 생각한다면, 개별 브릭을 가져와서 이들을 결합하여 더 큰 구조물을 형성할 수 있습니다. UI의 일부를 업데이트해야 할 때, 특정 컴포넌트 또는 브릭을 업데이트할 수 있습니다.

![미디어 컴포넌트 예시](https://nextjs.org/\_next/image?url=%2Fstatic%2Fimages%2Flearn%2Ffoundations%2Fcomponents.png\&w=1920\&q=75\&dpl=dpl\_FQk1vqJFzbvQf7ciyg5D7QiENdN4)

이 모듈성은 애플리케이션의 규모가 커짐에 따라 코드를 관리하기 쉽도록 합니다. 왜냐하면 애플리케이션의 다른 부분을 손대지 않고 컴포넌트를 쉽게 추가, 업데이트 및 삭제할 수 있기 때문입니다.

리액트 컴포넌트의 좋은 점은 그저 자바스크립트일 뿐이라는 것입니다. 이제 우리는 자바스크립트 관점에서 리액트 컴포넌트를 어떻게 작성할 수 있는지 살펴보겠습니다:

&#x20;

#### 컴포넌트 생성

리액트에서 컴포넌트는 함수입니다. `script` 태그 내부에서 `header`라는 함수를 작성하세요:

```html
<script type="text/jsx">
  const app = document.getElementById("app")

  function header() {
  }

  ReactDOM.render(<h1>Develop. Preview. Ship. 🚀</h1>, app)
</script>
```

컴포넌트는 **UI 요소를 반환하는 함수**입니다. 함수의 반환문 내부에서 JSX를 작성할 수 있습니다:

```html
<script type="text/jsx">
  const app = document.getElementById("app")

  function header() {
     return (<h1>Develop. Preview. Ship. 🚀</h1>)
   }

  ReactDOM.render(, app)
</script>
```

이 컴포넌트를 DOM에 렌더링하려면 `ReactDOM.render()` 메서드의 첫 번째 인수로 전달하면 됩니다.:

```html
<script type="text/jsx">

  const app = document.getElementById("app")

  function header() {
     return (<h1>Develop. Preview. Ship. 🚀</h1>)
   }


   ReactDOM.render(header, app)
</script>
```

하지만, 잠깐 기다려보세요. 위의 코드를 브라우저에서 실행하려고 하면 오류가 발생합니다. 이것이 돌아가도록 하려면 두 가지 작업을 해야 합니다:

첫째, 리액트 컴포넌트는 일반 HTML 및 자바스크립트와 구별하기 위해 대문자로 시작해야 합니다.

```javascript
function Header() {
  return <h1>Develop. Preview. Ship. 🚀</h1>;
}

// 리액트 컴포넌트의 첫 글자를 대문자로 변경
ReactDOM.render(Header, app);
```

둘째, 리액트 컴포넌트를 이용하려면 일반 HTML 태그와 마찬가지로 꺾쇠 괄호 `<>`를 사용해야 합니다.

```javascript
function Header() {
  return <h1>Develop. Preview. Ship. 🚀</h1>;
}

ReactDOM.render(<Header />, app);
```

&#x20;

#### 컴포넌트 중첩

일반적으로 애플리케이션은 하나의 컴포넌트 이상의 내용을 포함합니다. 리액트 컴포넌트를 일반 HTML 요소처럼 서로 중첩할 수 있습니다.

예를 들어, `HomePage`라는 새로운 컴포넌트를 생성합니다:

```javascript
function Header() {
  return <h1>Develop. Preview. Ship. 🚀</h1>;
}
function HomePage() {
  return <div></div>;
}

ReactDOM.render(<Header />, app);
```

그런 다음 새로운 `<HomePage>` 컴포넌트 내부에 `<Header>` 컴포넌트를 중첩합니다:

```javascript
function Header() {
  return <h1>Develop. Preview. Ship. 🚀</h1>;
}

function HomePage() {
  return (
    <div>
      {/_ Header 컴포넌트를 중첩함 _/}
      <Header />
    </div>
  );
}

ReactDOM.render(<Header />, app);
```

&#x20;

#### 컴포넌트 트리

이와 같은 방식으로 리액트 컴포넌트를 중첩하여 컴포넌트 트리를 형성할 수 있습니다.

예를 들어 최상위 `HomePage` 컴포넌트는 `Header`, `Article`, `Footer` 컴포넌트를 보유할 수 있습니다. 그리고 각 컴포넌트는 자체 하위 컴포넌트를 포함하거나 그 이하로 계속 중첩시킬 수 있습니다. 예를 들어 `Header` 컴포넌트는 `Logo`, `Title`, `Navigation` 컴포넌트를 포함할 수 있습니다.

이런 모듈 형식을 통해 앱 내의 다양한 위치에서 컴포넌트를 재사용할 수 있습니다.

이제 프로젝트에서 `<HomePage>`가 최상위 컴포넌트인 경우, `ReactDOM.render()` 메서드에 이를 전달할 수 있습니다:

```javascript
function Header() {
  return <h1>Develop. Preview. Ship. 🚀</h1>;
}

function HomePage() {
  return (
    <div>
      <Header />
    </div>
  );
}

ReactDOM.render(<HomePage />, app);
```

&#x20;

> 추가 자료:
>
> * [첫 컴포넌트](https://react.dev/learn/your-first-component)
> * [컴포넌트 가져오기 및 내보내기](https://react.dev/learn/importing-and-exporting-components)
