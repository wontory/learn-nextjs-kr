# Chapter 1. Rendering User Interface

Chapter 1

## 사용자 인터페이스 렌더링

React가 어떻게 작동하는지 이해하려면, 먼저 상호작용하는 사용자 인터페이스(UI)를 만들기 위해 브라우저가 코드를 어떻게 해석하는지 기본적인 이해가 필요합니다.

사용자가 웹 페이지를 방문하면 서버가 브라우저에 다음과 같이 보일 수 있는 HTML 파일을 반환합니다:

![HTML 파일과 DOM](https://nextjs.org/\_next/image?url=%2Fstatic%2Fimages%2Flearn%2Ffoundations%2Fhtml-to-dom.png\&w=1920\&q=75\&dpl=dpl\_68SyDasVh5cW8stCg4cSvM4vtq44)

그런 다음 브라우저는 HTML을 읽고 문서 객체 모델(DOM)을 구성합니다.

&#x20;

#### DOM이란?

DOM은 HTML 요소의 객체 표현입니다. 이는 코드와 사용자 인터페이스 간의 다리 역할을 하며 부모 및 자식 관계를 가진 트리 구조를 가지고 있습니다.

![DOM과 UI](https://nextjs.org/\_next/image?url=%2Fstatic%2Fimages%2Flearn%2Ffoundations%2Fdom-to-ui.png\&w=1920\&q=75\&dpl=dpl\_68SyDasVh5cW8stCg4cSvM4vtq44)

DOM 메서드와 JavaScript와 같은 프로그래밍 언어를 사용하여 사용자 이벤트를 듣고 사용자 인터페이스의 특정 요소를 선택, 추가, 업데이트 및 삭제함으로써 DOM을 조작할 수 있습니다. DOM 조작을 통해 특정 요소뿐만 아니라 그들의 스타일과 내용을 변경할 수도 있습니다.

다음 섹션에서 JavaScript와 DOM 메서드를 어떻게 사용할 수 있는지 살펴봅시다.

&#x20;

> 추가 자료:
>
> * [DOM 소개](https://developer.mozilla.org/docs/Web/API/Document\_Object\_Model/Introduction)
> * [Google Chrome에서 DOM 보는 방법](https://developer.chrome.com/docs/devtools/dom/)
> * [Firefox에서 DOM 보는 방법](https://developer.mozilla.org/docs/Tools/Debugger/How\_to/Highlight\_and\_inspect\_DOM\_nodes)
