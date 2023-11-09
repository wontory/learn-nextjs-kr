제 2장

# CSS 스타일링

현재, 홈 페이지에는 스타일이 없습니다. 다양한 방법으로 Next.js 애플리케이션을 스타일링할 수 있는 방법을 살펴보겠습니다.

&nbsp;

> ## 이 장에서는...
>
> 다음과 같은 주제들을 다룰 예정입니다.
>
> - 애플리케이션에 전역 CSS 파일을 추가하는 방법.
> - 두 가지 다른 스타일링 방법: Tailwind와 CSS 모듈.
> - `clsx` 유틸리티 패키지를 사용하여 클래스 이름을 조건부로 추가하는 방법.

&nbsp;

---

&nbsp;

## 전역 스타일

`/app/ui` 폴더 내부를 살펴보면 `global.css`라는 파일이 있을 것입니다. 이 파일을 사용하여 애플리케이션의 **모든** 곳에 CSS 규칙을 추가할 수 있습니다. 이는 CSS 재설정 규칙, 링크와 같은 HTML 요소에 대한 전체 사이트 스타일과 같은 것입니다.

`global.css`을 애플리케이션의 어떤 구성 요소에서든 가져올 수 있지만, 일반적으로 최상위 구성 요소에 추가하는 것이 좋은 방법입니다. Next.js에서는 이를 [루트 레이아웃](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required)이라고 합니다. (나중에 자세히 다루겠습니다)

애플리케이션에 전역 스타일을 추가하려면 `/app/layout.tsx`로 이동하고 `global.css` 파일을 가져오세요:

`/app/layout.tsx`

```typescript
import '@/app/ui/global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

개발 서버가 계속 실행 중이면 변경 사항을 저장하고 브라우저에서 확인해보세요. 이제 홈 페이지가 다음과 같이 보여야 합니다:

![로고 'Acme', 설명 및 로그인 링크가 있는 스타일이 적용된 페이지입니다.](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fhome-page-with-tailwind.png&w=1920&q=75&dpl=dpl_N3SJnwZejtorvS9Z7cGJJmxsxbA9)

하지만 잠깐 기다려보세요. 우리는 CSS 규칙을 추가하지 않았는데 스타일은 어디서 왔을까요?

`global.css` 내부를 살펴보면 몇 가지 `@tailwind` 지시문을 볼 수 있습니다:

`/app/ui/global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

&nbsp;

---

&nbsp;

## Tailwind

[Tailwind](https://tailwindcss.com/)는 JSX 마크업에서 바로 [유틸리티 클래스](https://tailwindcss.com/docs/utility-first)를 빠르게 작성할 수 있도록 해 개발 과정의 속도를 높이는 CSS 프레임워크입니다.

Tailwind에서는 클래스 이름을 추가하여 요소를 스타일링합니다. 예를 들어, `"text-blue-500"` 클래스를 추가하면 `<h1>` 텍스트가 파란색이 됩니다:

```html
<h1 className="text-blue-500">I'm blue!</h1>
```

CSS 스타일은 전역으로 공유되지만 각 클래스는 각 요소에 개별적으로 적용됩니다. 이는 요소를 추가하거나 삭제할 때 별도의 스타일 시트 유지나 스타일 충돌, CSS 번들 크기가 애플리케이션이 확장됨에 따라 커지는 것에 대해 걱정할 필요가 없다는 것을 의미합니다.

새 프로젝트를 시작할 때 `create-next-app`을 사용하면 Next.js가 Tailwind를 사용할 지 여부를 묻습니다. `예`를 선택하면 Next.js가 자동으로 필요한 패키지를 설치하고 애플리케이션에서 Tailwind를 구성합니다.

`/app/page.tsx`을 살펴보면 예제에서 Tailwind 클래스를 사용하는 것을 볼 수 있습니다.

`/app/page.tsx`

```typescript
import AcmeLogo from '@/app/ui/acme-logo';
import Link from 'next/link';

export default function Page() {
  return (
    // 이들은 Tailwind 클래스입니다:
    <main className="flex min-h-screen flex-col p-6">
    <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
    // ...
  )
}
```

Tailwind를 처음 사용하는 경우 걱정하지 마세요. 시간을 절약하기 위해 사용할 모든 구성 요소에 이미 스타일을 지정했습니다.

Tailwind를 사용해 봅시다! 아래 코드를 복사하여 `/app/page.tsx`의 `<p>` 요소 위에 붙여넣습니다:

```html
<div
  className="h-0 w-0 border-b-[30px] border-l-[20px] border-r-[20px] border-b-black border-l-transparent border-r-transparent"
/>
```

&nbsp;

> ### 퀴즈 시간입니다!
>
> 지식을 테스트하고 방금 배운 내용을 확인하세요.
>
> **위의 코드 스니펫을 사용하면 어떤 모양을 볼 수 있나요?**
>
> - A: 노란 별
> - B: 파란 삼각형
> - C: 검은색 삼각형
> - D: 빨간 원
>
> &nbsp;
>
> #### 정답 확인
>
> **C: 검은색 삼각형**

만약 전통적인 CSS 규칙을 작성하거나 스타일을 JSX와 분리하려는 경우 CSS 모듈이 좋은 대안입니다.

&nbsp;

---

&nbsp;

## CSS 모듈

[CSS 모듈](https://nextjs.org/docs/basic-features/built-in-css-support)을 사용하면 고유한 클래스 이름을 자동으로 생성하여 컴포넌트에 CSS를 스코프로 지정할 수 있으므로 스타일 충돌에 대해 걱정할 필요가 없습니다.

이 강좌에서는 계속해서 Tailwind를 사용할 것이지만, 어떻게 하면 CSS 모듈을 사용하여 위의 퀴즈에서 얻은 결과와 같은 결과를 얻을 수 있는지 알아보겠습니다.

`/app/ui` 내부에 `home.module.css`라는 새 파일을 만들고 다음 CSS 규칙을 추가하세요:

`/app/ui/home.module.css`

```css
.shape {
  height: 0;
  width: 0;
  border-bottom: 30px solid black;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}
```

그런 다음 `/app/page.tsx` 파일에서 스타일을 가져오고 `<div>`에 추가한 Tailwind 클래스 이름을 `styles.shape`로 바꾸세요:

`/app/page.tsx`

```typescript
import styles from '@/app/ui/home.module.css';

//...

<div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
    <div className={styles.shape}></div>;
// ...
```

변경 사항을 저장하고 브라우저에서 확인해보세요. 이전과 동일한 모양을 볼 수 있어야 합니다.

Tailwind와 CSS 모듈은 Next.js 애플리케이션을 스타일링하는 가장 일반적인 두 가지 방법입니다. 어느 쪽을 사용할지는 취향 문제입니다. 심지어 같은 애플리케이션에서 두 가지 모두 사용할 수 있습니다!

&nbsp;

> ### 퀴즈 시간입니다!
>
> 지식을 테스트하고 방금 배운 내용을 확인하세요.
>
> **CSS 모듈을 사용하는 이점 중 하나는 무엇인가요?**
>
> - A: CSS 클래스의 전역 범위를 확장하여 다른 파일 간에 관리하기 쉽게 만듭니다.
> - B: 기본적으로 CSS 클래스를 로컬 범위로 지정하여 구성 요소에 스타일 충돌의 위험을 줄이고 모듈성을 향상시키는 방법을 제공합니다.
> - C: 페이지 로딩 속도를 빠르게 하기 위해 자동으로 CSS 파일을 압축하고 최소화합니다.
>
> &nbsp;
>
> #### 정답 확인
>
> **B: 기본적으로 CSS 클래스를 로컬 범위로 지정하여 구성 요소에 스타일 충돌의 위험을 줄이고 모듈성을 향상시키는 방법을 제공합니다.**

&nbsp;

---

&nbsp;

## `clsx` 라이브러리를 사용하여 클래스명 전환하기

요소를 상태나 기타 조건에 따라 조건부로 스타일링해야 할 경우가 있을 수 있습니다.

[`clsx`](https://www.npmjs.com/package/clsx)는 클래스 이름을 쉽게 전환할 수 있게 해주는 라이브러리입니다. 자세한 내용은 [문서](https://github.com/lukeed/clsx)를 확인하는 것이 좋습니다. 하지만 기본적인 사용법은 다음과 같습니다:

- `InvoiceStatus` 컴포넌트를 만들고 `status`를 받아야 한다고 가정해 봅시다. `status`는 `'pending'` 또는 `'paid'`일 수 있습니다.
- `'paid'`인 경우 색상을 녹색으로, `'pending'`인 경우 색상을 회색으로 하고 싶습니다.

클래스를 조건부로 적용하려면 다음과 같이 `clsx`를 사용할 수 있습니다:

`/app/ui/invoices/status.tsx`

```typescript
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
)}
```

&nbsp;

> ### 퀴즈 시간입니다!
>
> 지식을 테스트하고 방금 배운 내용을 확인하세요.
>
> **코드 편집기에서 "clsx"를 검색하여 클래스 이름을 조건부로 적용하는 컴포넌트는 무엇인가요?**
>
> - A: `status.tsx` 및 `pagination.tsx`
> - B: `table.tsx` 및 `status.tsx`
> - C: `nav-links.tsx` 및 `table.tsx`
>
> &nbsp;
>
> #### 정답 확인
>
> **A: `status.tsx` 및 `pagination.tsx`**

&nbsp;

---

&nbsp;

## 다른 스타일링 솔루션

우리가 논의한 방법들 외에도, Next.js 애플리케이션을 다음과 같은 방법으로 스타일링할 수 있습니다:

- `.css` 및 `.scss` 파일을 가져올 수 있는 Sass.
- [styled-jsx](https://github.com/vercel/styled-jsx), [styled-components](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components), 그리고 [emotion](https://github.com/vercel/next.js/tree/canary/examples/with-emotion)과 같은 CSS-in-JS 라이브러리.

더 많은 정보를 원하시면 [CSS 문서](https://nextjs.org/docs/app/building-your-application/styling)를 확인해보세요.
