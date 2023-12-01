# Chapter 7. Adding Interactivity with State

Chapter 7

## 상태(State)로 상호작용 추가하기

#### 이 장에서는...

다음과 같은 주제들을 다룰 예정입니다.

* 파일 시스템 라우팅을 사용하여 대시보드 페이지 생성하기.
* 라우트 세그먼트를 생성할 때 폴더의 역할 이해하기.
* 공동 위치(colocation)가 무엇이며 어떻게 작동하는지 이해하기.
* 여러 페이지 간에 공유되는 레이아웃 생성하기.
* 부분 렌더링(partial rendering)이 무엇인지 이해하기.
* 루트 레이아웃(root layout)이 무엇이며 언제 사용해야 하는지 이해하기.

&#x20;

React로 \*\*상태(state)\*\*와 **이벤트 핸들러**를 사용하여 어떻게 상호작용을 추가하는지 살펴보겠습니다.

예를 들어, `HomePage` 컴포넌트 내부에 좋아요 버튼을 만들어 보겠습니다. 먼저 `return()` 문 내에 버튼 요소를 추가하세요.

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

      <button>Like</button>
    </div>
  );
}
```

&#x20;

#### 이벤트 수신하기

버튼을 클릭할 때 무언가를 수행하도록 하려면 `onClick` 이벤트를 사용할 수 있습니다.

```javascript
function HomePage() {
  // ...
  return (
    <div>
      {/_ ... _/}
      <button onClick={}>Like</button>
    </div>
  );
}
```

React에서 이벤트 이름은 카멜 표기법을 사용합니다. `onClick` 이벤트는 사용자 상호작용에 응답하는 데 사용할 수 있는 여러 가능한 이벤트 중 하나입니다. 예를 들어, 입력 필드의 경우 `onChange`를 사용하거나 폼의 경우 `onSubmit`를 사용할 수 있습니다.

&#x20;

#### 이벤트 처리하기

이벤트가 트리거될 때마다 해당 이벤트를 "처리"할 함수를 정의할 수 있습니다. `return` 문 앞에 `handleClick()`이라는 함수를 만들어 보세요.

```javascript
function HomePage() {
  // ...
  function handleClick() {
    console.log("좋아요 수 증가");
  }

  return (
    <div>
      {/_ ... _/}
      <button onClick={}>Like</button>
    </div>
  );
}
```

이제 `onClick` 이벤트가 트리거될 때 `handleClick` 함수를 호출할 수 있습니다.

```javascript
function HomePage() {
  // ...
  function handleClick() {
    console.log('좋아요 수 증가');
  }

  return (
    <div>
      {/_ ... _/}
      <button onClick={handleClick}>Like</button>
    </div>
  );
}
```

&#x20;

#### 상태와 훅

React에는 컴포넌트에 \*\*상태(state)\*\*와 같은 로직을 추가하는 데 사용할 수 있는 일련의 함수인 [훅(hooks)](https://react.dev/learn)이 있습니다. 상태는 일반적으로 사용자 상호작용으로 인해 시간이 지남에 따라 변경되는 UI의 정보로 생각할 수 있습니다.

![상태의 예](https://nextjs.org/\_next/image?url=%2Fstatic%2Fimages%2Flearn%2Ffoundations%2Fstate.png\&w=1920\&q=75\&dpl=dpl\_FQk1vqJFzbvQf7ciyg5D7QiENdN4)

상태로 사용자가 좋아요 버튼을 클릭한 횟수를 저장하고 증가시킬 수 있습니다. 이것이 상태를 관리하는 React 훅의 이름입니다: `useState()`

```javascript
function HomePage() {
  React.useState();
}
```

`useState()`는 배열을 반환하며, 배열의 값을 \*\*구조 분해 할당(array destructuring)\*\*를 사용하여 컴포넌트 내에서 액세스하고 사용할 수 있습니다.

```javascript
function HomePage() {
  const [] = React.useState();

  // ...
}
```

배열의 첫 번째 항목은 상태 `값`이며, 이 값을 어떤 것이든 이름으로 지을 수 있습니다. 서술적으로 명명하는 것이 권장됩니다.

```javascript
function HomePage() {
  const [likes] = React.useState();

  // ...
}
```

배열의 두 번째 항목은 값 업데이트를 위한 함수입니다. 업데이트 함수의 이름을 아무것으로나 지을 수 있지만 업데이트할 상태 변수 이름을 접두어 `set`과 사용하는 것이 일반적입니다:

```javascript
function HomePage() {
  const [likes, setLikes] = React.useState();

  // ...
}
```

또한 `likes` 상태의 초기 값을 추가할 수 있습니다. 예를 들어, 0으로 설정해 보겠습니다.

```javascript
function HomePage() {
  const [likes, setLikes] = React.useState(0);
}
```

그런 다음 상태 변수를 컴포넌트 내에서 사용하여 초기 상태가 작동하는지 확인할 수 있습니다.

```javascript
function HomePage() {
  // ...
  const [likes, setLikes] = React.useState(0);

  return (
    // ...
    <button onClick={handleClick}>좋아요({likes})</button>
  );
}
```

마지막으로, 상태 업데이트 함수인 `setLikes`를 호출할 수 있습니다. 이 함수를 `HomePage` 컴포넌트에 추가해 보겠습니다. 이전에 정의한 `handleClick()` 함수 내에 추가합니다.

```javascript
function HomePage() {
  // ...
  const [likes, setLikes] = React.useState(0);

  function handleClick() {
    setLikes(likes + 1);
  }

  return (
    <div>
      {/_ ... _/}
      <button onClick={handleClick}>좋아요({likes})</button>
    </div>
  );
}
```

이제 버튼을 클릭하면 `handleClick` 함수가 호출되고, 현재 좋아요 수 + 1을 인수로 `setLikes` 상태 업데이트 함수를 호출합니다.

> **참고:** 첫 번째 함수 매개변수로 컴포넌트에 전달되는 props와 달리 상태는 컴포넌트 내에서 초기 생성된 상태로 유지됩니다. 상태 정보를 자식 컴포넌트에 props로 전달할 수 있지만 상태를 업데이트하는 논리는 초기에 생성된 컴포넌트 내에 유지되어야 합니다.

&#x20;

#### 상태 관리

이것은 상태에 대한 간단한 소개였으며, React 애플리케이션에서 상태와 데이터 흐름을 관리하는 방법에 대해 더 알아볼 수 있습니다. 더 자세한 내용은 React 문서의 [상태: 컴포넌트의 메모리](https://react.dev/learn/state-a-components-memory), [첫 번째 훅 만나기](https://react.dev/learn/state-a-components-memory#meet-your-first-hook) 섹션을 참조하면 됩니다.

> 추가 자료:
>
> * [상태: 컴포넌트의 메모리](https://react.dev/learn/state-a-components-memory)
> * [첫 번째 훅 만나기](https://react.dev/learn/state-a-components-memory#meet-your-first-hook)
> * [이벤트 응답하기](https://react.dev/learn/responding-to-events)

&#x20;

&#x20;

&#x20;

> #### 퀴즈 시간입니다!
>
> 지식을 테스트하고 방금 배운 내용을 확인하세요.
>
> **Next.js의 레이아웃 파일의 목적은 무엇인가요?**
>
> * A: 전역 오류 핸들러 역할
> * B: 전체 애플리케이션에서 데이터를 가져오고 상태를 관리하는 역할
> * C: 여러 페이지 간에 UI를 공유하는 역할
> * D: 전체 애플리케이션의 진입점 역할
>
> &#x20;
>
> **정답 확인**
>
> **C: 여러 페이지 간에 UI를 공유하는 역할**
>
> 레이아웃 파일은 애플리케이션의 모든 페이지에서 사용할 수 있는 공유 레이아웃을 만드는 가장 좋은 방법입니다.
