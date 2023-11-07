Chapter 9

# Next.js 설치하기

Next.js를 프로젝트에 추가하면, 더 이상 [unpkg.com](http://unpkg.com/)에서 `react` 및 `react-dom` 스크립트를 로드할 필요가 없습니다. 대신, Node Package Manager인 `npm`를 사용하여 이러한 패키지를 로컬로 설치할 수 있습니다.

> **참고:** 컴퓨터에 Node.js가 설치되어 있어야 합니다 ([최소 버전 요구 사항](https://nextjs.org/docs/upgrading#minimum-nodejs-version) 참조). Node.js는 [다음 위치](https://nodejs.org/en/)에서 다운로드할 수 있습니다.

이를 위해 빈 객체 `{}`를 가진 `package.json`이라는 새 파일을 만듭니다.

```json
{}
```

터미널에서 `npm install react react-dom next`를 실행합니다. 설치가 완료되면 `package.json` 파일 내에 프로젝트 종속성이 나열된 것을 확인할 수 있습니다.

```json
{
  "dependencies": {
    "next": "^12.1.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  }
}
```

또한 실제 종속성 파일을 포함하는 `node_modules`라는 새 폴더가 있음을 알 수 있습니다.

`index.html` 파일로 돌아가서 다음 코드를 삭제합니다.

1. `react` 및 `react-dom` 스크립트: 이제 NPM으로 설치했으므로 삭제합니다.
2. `<html>` 및 `<body>` 태그: Next.js가 이러한 태그를 대신 생성합니다.
3. `app` 요소와 `ReactDom.render()` 메서드와 관련된 코드: Next.js가 이를 처리합니다.
4. `Babel` 스크립트: Next.js에는 JSX를 브라우저가 이해할 수 있는 유효한 JavaScript으로 변환하는 컴파일러가 있습니다.
5. `<script type="text/jsx">` 태그를 삭제합니다.
6. `React.useState(0)` 함수에서 `React.` 부분을 삭제합니다.

위의 코드를 삭제한 후, 파일 상단에 `import { useState } from "react"`를 추가하세요. 당신의 코드는 다음과 같아야 합니다.

```javascript
import { useState } from 'react';
function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

  const [likes, setLikes] = useState(0);

  function handleClick() {
    setLikes(likes + 1);
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
  );
}
```

이제 HTML 파일에 남아있는 코드는 모두 JSX입니다. 따라서 파일 유형을 .html에서 .js 또는 .jsx로 변경할 수 있습니다.

이제 Next.js 앱으로 완전히 전환하기 위해 수행해야 할 세 가지 작업이 더 있습니다.

1. `index.js` 파일을 새로운 폴더인 `pages`로 이동합니다 (이에 대한 자세한 내용은 나중에 다루겠습니다.).
2. Next.js가 이 페이지의 주요 컴포넌트로 어떤 컴포넌트를 렌더링할지 구분할 수 있도록 주요 React 컴포넌트에 기본 내보내기(default export)를 추가합니다.

```javascript
export default function HomePage() {
  // ...
}
```

3. 개발하면서 사용할 Next.js 개발 서버를 실행하는 스크립트를 `package.json` 파일에 추가합니다.

```json
{
  "scripts": {
    "dev": "next dev"
  }
  // "dependencies": {
  // "next": "^11.1.0",
  // "react": "^17.0.2",
  // "react-dom": "^17.0.2"
  // }
}
```

### 개발 서버 실행

모든 것이 작동하는지 확인하기 위해 터미널에서 `npm run dev`를 실행하고 브라우저에서 [localhost:3000](http://localhost:3000/)로 이동하여 앱을 볼 수 있습니다. 그런 다음 코드를 약간 수정하고 저장합니다.

파일을 저장하면 브라우저가 자동으로 변경 사항을 반영하는 것을 알 수 있습니다.

이 기능을 [Fast Refresh](https://nextjs.org/docs/basic-features/fast-refresh)라고 합니다. 이를 통해 편집한 내용에 대한 즉각적인 피드백을 얻을 수 있으며 Next.js와 함께 미리 구성되어 있는 기능 중 하나입니다.

요약하면 코드는 이 상태에서...

`index.html`

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

...다음과 같이 변경되었습니다:

`pages/index.js`

```javascript
import { useState } from 'react';

function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

export default function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
  const [likes, setLikes] = useState(0);

  function handleClick() {
    setLikes(likes + 1);
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
  );
}
```

표면적으로 코드 줄이 조금 줄었을 뿐이지만 이것은 다음을 강조합니다: React는 현대적인 대화형 UI를 구축하는 데 필요한 **기본 기능**을 제공하는 **라이브러리**입니다. 그러나 여전히 UI를 애플리케이션으로 통합하는 데 몇 가지 작업이 필요합니다.

이러한 마이그레이션을 살펴보면, 당신은 이미 Next.js 사용의 이점을 느끼고 있을 수도 있습니다. 이제는 생각하지 않아도 되는 복잡한 도구 구성의 맛보기였던 Babel 스크립트가 제거되었습니다. 또한 Fast Refresh가 작동하는 것을 볼 수 있으며, 이것은 Next.js와 기대할 수 있는 많은 개발자 경험 기능 중 하나입니다.
