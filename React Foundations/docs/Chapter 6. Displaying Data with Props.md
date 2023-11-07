제 6장

# Props로 데이터 표시하기

지금까지의 프로젝트에서는, `<Header />` 컴포넌트를 재사용하면 두 번 모두 같은 내용을 표시할 것입니다.

```javascript
function Header() {
  return <h1>Develop. Preview. Ship. 🚀</h1>;
}

function HomePage() {
  return (
    <div>
      <Header />
      <Header />
    </div>
  );
}
```

그러나 다른 텍스트를 전달하거나, 외부 소스에서 데이터를 가져오기 때문에 정보를 미리 알 수 없는 경우 어떻게 해야 할까요?

일반 HTML 요소에는 해당 요소의 동작을 변경할 수 있는 정보를 전달할 수 있는 속성이 있습니다. 예를 들어, `<img>` 요소의 `src` 속성을 변경하면 표시되는 이미지가 변경됩니다. `<a>` 태그의 `href` 속성을 변경하면 링크의 대상이 변경됩니다.

마찬가지로 React 컴포넌트에도 정보를 속성으로 전달할 수 있습니다. 이러한 것을 `props`라고 부릅니다.

![Props](https://nextjs.org/_next/image?url=%2Fstatic%2Fimages%2Flearn%2Ffoundations%2Fprops.png&w=1920&q=75&dpl=dpl_FQk1vqJFzbvQf7ciyg5D7QiENdN4)

JavaScript 함수와 유사하게, 컴포넌트가 화면에 렌더링될 때 컴포넌트의 동작이나 표시되는 것을 변경하는 사용자 정의 인수(또는 props)를 받을 수 있도록 컴포넌트를 설계할 수 있습니다. 그런 다음 부모 컴포넌트에서 이러한 props를 자식 컴포넌트로 전달할 수 있습니다.

> **참고:** React에서 데이터는 컴포넌트 트리의 아래 방향으로 흐릅니다. 이것은 *단방향 데이터 흐름*으로 언급됩니다. 다음 섹션에서 다룰 상태는 props를 통해 부모 컴포넌트에서 자식 컴포넌트로 전달될 수 있습니다.

&nbsp;

### Props 사용하기

`HomePage` 컴포넌트에서 `Header` 컴포넌트로 마치 HTML 속성을 전달하는 것처럼 사용자 정의 `title` props를 전달할 수 있습니다:

```javascript
function HomePage() {
  return (
    <div>
      <header title="React 💙" />
    </div>
  );
}
```

그리고 자식 컴포넌트인 `Header`는 이러한 props를 첫 번째 **함수 매개변수**로 받아들일 수 있습니다:

```javascript
function Header(props) {
  return <h1>Develop. Preview. Ship. 🚀</h1>;
}
```

만약 `console.log()`를 사용하여 props를 출력하면 이것이 `title` 속성을 가진 **객체**임을 확인할 수 있습니다.

```javascript
function Header(props) {
  console.log(props); // { title: "React 💙" }
  return <h1>React 💙</h1>;
}
```

props는 객체이므로 함수 매개변수 내에서 props의 값을 명시적으로 명명하기 위해 **구조 분해 할당**를 사용할 수 있습니다:

```javascript
function Header({ title }) {
  console.log(title); // "React 💙"
  return <h1>React 💙</h1>;
}
```

그런 다음 `<h1>` 태그의 내용을 title 변수로 대체할 수 있습니다.

```javascript
function Header({ title }) {
  console.log(title);
  return <h1>title</h1>;
}
```

브라우저에서 프로젝트를 열면 "title"이라는 단어가 실제로 표시됩니다. 이것은 React가 당신이 DOM에 문자열을 렌더링하려는 의도로 생각하기 때문입니다.

&nbsp;

### JSX에서 변수 사용하기

정의한 변수를 사용하려면 중괄호 `{}`를 사용할 수 있습니다. 이것은 JSX 마크업 내에서 일반 JavaScript를 직접 작성할 수 있는 특별한 JSX 구문입니다.

```javascript
function Header({ title }) {
  console.log(title);
  return <h1>{title}</h1>;
}
```

중괄호를 "JavaScript 영역"에 진입하는 방법으로 생각할 수 있습니다. 중괄호 내에는 **JavaScript 표현식**(단일 값으로 취급되는)을 추가할 수 있습니다. 예를 들면:

1. 점 표기를 통한 **객체 속성**:

```javascript
function Header(props) {
  return <h1>{props.title}</h1>;
}
```

2. **템플릿 리터럴**:

```javascript
function Header({ title }) {
  return <h1>{`Cool ${title}`}</h1>;
}
```

3. 함수의 **반환 값**:

```javascript
function createTitle(title) {
  if (title) {
    return title;
  } else {
    return 'Default title';
  }
}

function Header({ title }) {
  return <h1>{createTitle(title)}</h1>;
}
```

4. 또는 **삼항 연산자**:

```javascript
function Header({ title }) {
  return <h1>{title ? title : 'Default Title'}</h1>;
}
```

이제 title prop에 어떤 문자열이든 전달할 수 있으며, 삼항 연산자로 컴포넌트의 기본 경우를 처리했으므로 title prop을 전달하지 않을 수도 있습니다:

```javascript
function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

function HomePage() {
  return (
    <div>
      <Header />
    </div>
  );
}
```

이제 컴포넌트는 제목 prop을 받아들이며 응용 프로그램의 다른 부분에서 재사용할 수 있는 범용 제목 prop을 받아들입니다. 이제 제목만 변경하면 됩니다:

```javascript
function HomePage() {
  return (
    <div>
      <Header title="React 💙" />
      <Header title="A new title" />
    </div>
  );
}
```

&nbsp;

### 목록을 순회하는 방법

표시해야 하는 데이터를 목록으로 가지고 있는 경우가 흔합니다. 배열 메서드를 사용하면 데이터를 조작하고 서로 다른 정보를 보유한 동일한 스타일의 UI 요소를 생성할 수 있습니다.

> **참고:** React는 데이터를 가져오는 방법에 대한 지침이 없으므로 필요에 맞는 가장 좋은 솔루션을 선택할 수 있습니다. 나중에는 Next.js에서 데이터를 가져오는 방법을 다룰 것입니다. 그러나 지금은 데이터를 나타내기 위해 간단한 배열을 사용하겠습니다.

`HomePage` 컴포넌트에 이름 배열을 추가해 보겠습니다:

```javascript
function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

  return (
    <div>
      <Header title="Develop. Preview. Ship. 🚀" />
    </div>
  );
}
```

그런 다음 `array.map()` 메서드를 사용하여 배열을 순회하고 목록 항목에 이름을 매핑하는 **화살표 함수**를 사용할 수 있습니다:

```javascript
function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

  return (
    <div>
      <Header title="Develop. Preview. Ship. 🚀" />
      <ul>
        {names.map((name) => (
          <li>{name}</li>
        ))}
      </ul>
    </div>
  );
}
```

중괄호를 사용하여 "JavaScript" 및 "JSX" 영역을 오갈 수 있음을 주목하세요.

이 코드를 실행하면 React가 배열의 항목을 고유하게 식별할 수 있는 `key` prop이 누락되었다는 경고가 표시됩니다. 이는 React가 DOM에서 업데이트할 요소를 알기 위해 배열 항목을 고유하게 식별할 수 있는 정보가 필요하기 때문입니다. 현재 이름이 고유하기 때문에 key prop으로 사용할 수 있지만, 항목 ID와 같이 고유한 값이 보장되는 것으로 사용할 것을 권장합니다.

```javascript
function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

  return (
    <div>
      <Header title="Develop. Preview. Ship. 🚀" />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
```

&nbsp;

> 추가 자료:
>
> - [컴포넌트에 props 전달하기](https://react.dev/learn/passing-props-to-a-component)
> - [목록 렌더링](https://react.dev/learn/rendering-lists)
> - [조건부 렌더링](https://react.dev/learn/conditional-rendering)
