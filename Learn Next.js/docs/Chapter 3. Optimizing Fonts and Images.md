제3장

# 글꼴 및 이미지 최적화

이전 장에서는 Next.js 애플리케이션을 스타일링하는 방법에 대해 배웠습니다. 사용자 정의 글꼴 및 히어로 이미지를 추가하여 홈 페이지 작업을 계속해 보겠습니다.

> ## 이 장에서는...
>
> 다음과 같은 주제들을 다룰 예정입니다.
>
> - `next/font`를 사용하여 사용자 정의 글꼴 추가하는 방법
> - `next/image`를 사용하여 이미지 추가하는 방법
> - Next.js에서 글꼴과 이미지가 어떻게 최적화되는지

---

## 왜 글꼴을 최적화해야 할까요?

글꼴은 웹사이트 디자인에서 중요한 역할을 합니다. 그러나 프로젝트에서 사용자 정의 글꼴을 사용하면 글꼴 파일을 가져오고 로드해야 하므로 성능에 영향을 미칠 수 있습니다.

[Cumulative Layout Shift](https://web.dev/cls/)는 Google이 성능 및 사용자 경험을 평가하는 데 사용하는 측정항목 중 하나입니다. 글꼴을 사용하면, 브라우저가 처음에 대체 또는 시스템 글꼴로 텍스트를 렌더링하고 로드된 후에 사용자 정의 글꼴로 교체될 때 레이아웃 시프트가 발생합니다. 이 교체로 인해 텍스트 크기, 간격 또는 레이아웃이 변경되어 주변 요소가 이동할 수 있습니다.

![페이지의 초기 로드를 보여주는 모의 UI, 사용자 정의 글꼴 로드 시 레이아웃 시프트](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Ffont-layout-shift.png&w=3840&q=75&dpl=dpl_3h1BESzeFKFcy7pGi2Svm9s7FMVm)

Next.js는 `next/font` 모듈을 사용할 때 애플리케이션에서 글꼴을 자동으로 최적화합니다. 이 모듈을 사용하면 글꼴 파일을 빌드 시 다운로드하고 다른 정적 애셋과 함께 호스팅합니다. 이렇게 하면 사용자가 애플리케이션을 방문할 때 글꼴에 대한 추가 네트워크 요청이 없으므로 성능에 영향을 미치지 않습니다.

> ### 퀴즈 시간입니다!
>
> 지금까지 배운 내용을 테스트해 보세요.
>
> **Next.js는 글꼴을 어떻게 최적화하나요?**
>
> - A: 성능을 향상시키기 위해 추가적인 네트워크 요청을 발생시킵니다.
> - B: 모든 사용자 정의 글꼴을 비활성화합니다.
> - C: 모든 글꼴을 런타임에 미리로드합니다.
> - D: 글꼴 파일을 다른 정적 애셋과 함께 호스팅하여 추가적인 네트워크 요청이 없도록 합니다.
>
> #### 정답 확인
>
> **D: 글꼴 파일을 다른 정적 애셋과 함께 호스팅하여 추가적인 네트워크 요청이 없도록 합니다.**

---

## 주요 글꼴 추가하기

이제 애플리케이션에 Google 글꼴을 추가하여 이 작업이 어떻게 수행되는지 살펴보겠습니다!

`/app/ui` 폴더에서 `fonts.ts`라는 새 파일을 만들어서 애플리케이션 전체에서 사용될 글꼴을 관리할 것입니다.

`/app/ui/fonts.ts`

```typescript
import { Inter } from 'next/font/google';
```

그런 다음, `next/font/google` 모듈에서 `Inter` 글꼴을 가져옵니다. 이것이 주요 글꼴이 될 것입니다.

`/app/ui/fonts.ts`

```typescript
import { Inter } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
```

마지막으로, `/app/layout.tsx`에서 `<body>` 요소에 글꼴을 추가합니다.

`/app/layout.tsx`

```typescript
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```

`<body>` 요소에 `Inter`를 추가함으로써 글꼴이 애플리케이션 전체에 적용됩니다. 여기서는 Tailwind의 [`antialiased`](https://tailwindcss.com/docs/font-smoothing) 클래스도 추가했습니다. 이 클래스를 사용하는 것이 필수는 아니지만 글꼴을 부드럽게 만들어줍니다.

브라우저로 이동하여 개발자 도구를 열고 `body` 요소를 선택하십시오. 이제 `Inter` 및 `Inter_Fallback`이 스타일 아래에 적용된 것을 확인할 수 있습니다. 또한 애플리케이션의 특정 요소에도 글꼴을 추가할 수 있습니다.

---

## 실습: 보조 글꼴 추가하기

이제 당신의 차례입니다! `fonts.ts` 파일에서 `Lusitana`라는 보조 글꼴을 가져와 `/app/page.tsx` 파일의 `<p>` 요소에 전달하십시오. 이전과 마찬가지로 서브셋을 지정하는 것 외에도 글꼴 두께를 지정해야합니다.

준비가 되면 아래의 코드 스니펫을 확장하여 정답을 확인하세요.

> **힌트:**
>
> - 글꼴에 어떤 두께 옵션을 전달해야 하는지 확실하지 않다면 코드 편집기에서 TypeScript 오류를 확인하세요.
> - [Google Fonts](https://fonts.google.com/) 웹사이트를 방문하여 `Lusitana`를 검색하여 사용 가능한 옵션을 확인하세요.
> - [여러 글꼴 추가](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#using-multiple-fonts) 및 [전체 옵션 목록](https://nextjs.org/docs/app/api-reference/components/font#font-function-arguments)에 대한 문서를 참조하세요.

<details>
<summary><strong>&nbsp;정답 확인</strong></summary>

`/app/ui/fonts.ts`

```typescript
import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});
```

`/app/page.tsx`

```typescript
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function Page() {
  return (
    // ...
    <p
      className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
    >
      <strong>Welcome to Acme.</strong> This is the example for the{' '}
      <a href="https://nextjs.org/learn/" className="text-blue-500">
        Next.js Learn Course
      </a>
      , brought to you by Vercel.
    </p>
    // ...
  );
}
```

</details>

마지막으로 `<AcmeLogo />` 컴포넌트도 `Lusitana`를 사용합니다. 오류를 방지하기 위해 주석 처리되어 있었으나, 이제 주석 처리를 해제할 수 있습니다.

`/app/page.tsx`

```typescript
// ...

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
        {/_ ... _/}
      </div>
    </main>
  );
}
```

좋습니다! 애플리케이션에 두 개의 사용자 정의 글꼴이 추가되었습니다! 이제 홈 페이지에 히어로 이미지를 추가해 보겠습니다.

---

## 이미지 최적화는 왜 필요한가요?

Next.js는 이미지와 같은 **정적 자산**을 최상위 [`/public`](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets) 폴더 아래에서 제공할 수 있습니다. `/public` 내부의 파일은 애플리케이션에서 참조할 수 있습니다.

`/public` 폴더 내부를 살펴보면 두 개의 이미지, `hero-desktop.png`와 `hero-mobile.png`가 있습니다. 이 두 이미지는 완전히 다르며 사용자의 기기가 데스크톱인지 모바일인지에 따라 표시됩니다.

일반적인 HTML에서는 이미지를 다음과 같이 추가합니다.

```html
<img
  src="/hero.png"
  alt="데스크톱 및 모바일 버전의 대시보드 프로젝트 스크린샷"
/>
```

그러나 이렇게 하면 다음을 수동으로 수행해야 합니다.

- 이미지가 다양한 화면 크기에 반응적으로 표시되도록 보장합니다.
- 다양한 기기에 대한 이미지 크기를 지정합니다.
- 이미지가 로드됨에 따라 레이아웃 시프트를 방지합니다.
- 뷰포트 외부에 있는 이미지를 지연로드합니다.

이미지 최적화는 웹 개발에서 큰 주제이며 그 자체로 전문 분야로 간주될 수 있습니다. 이러한 최적화를 수동으로 구현하는 대신 `next/image` 컴포넌트를 사용하여 이미지를 자동으로 최적화할 수 있습니다.

---

## `<Image>` 컴포넌트

`<Image>` 컴포넌트는 HTML `<img>` 태그의 확장이며 다음과 같은 자동 이미지 최적화 기능을 제공합니다.

- 이미지가 로드될 때 자동으로 레이아웃 시프트 방지.
- 뷰포트에 들어올 때 이미지 크기를 조절하여 작은 뷰포트 기기로 큰 이미지를 전송하지 않도록 함.
- 기본적으로 이미지를 지연로드 (이미지가 뷰포트에 진입할 때 로드).
- 브라우저가 지원하는 경우 [WebP](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#webp) 및 [AVIF](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#avif_image)와 같은 현대적인 포맷으로 이미지 제공.

---

# 데스크톱 히어로 이미지 추가

`<Image>` 컴포넌트를 사용해보겠습니다.

`/app/page.tsx` 파일 안에, [`next/image`](https://nextjs.org/docs/api-reference/next/image)에서 컴포넌트를 가져와 주석 아래에 이미지를 추가하세요:

`/app/page.tsx`

```typescript
import AcmeLogo from '@/app/ui/acme-logo';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    // ...

    <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
      {/_ 여기에 히어로 이미지 추가 _/}
      <Image
        src="/hero-desktop.png"
        width={1000}
        height={760}
        className="hidden md:block"
        alt="데스크톱 및 모바일 버전을 보여주는 대시보드 프로젝트의 스크린샷"
      />
    </div>
    //...
  );
}
```

여기서 이미지의 `width`를 `1000`으로, `height`를 `760`으로 설정하고 있습니다. 레이아웃 이동을 방지하기 위해 이미지의 `width`와 `height`를 소스 이미지와 **동일한** 종횡비로 설정하는 것이 좋습니다.

또한, 모바일 화면에서 이미지를 제거하기 위해 `hidden` 클래스를, 데스크톱 화면에서 이미지를 보여주기 위해 `md:block` 클래스를 사용하고 있습니다.

이제 홈페이지는 다음과 같아야 합니다:

![커스텀 폰트와 히어로 이미지가 있는 스타일이 적용된 홈페이지](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fhome-page-with-hero.png&w=1920&q=75&dpl=dpl_3h1BESzeFKFcy7pGi2Svm9s7FMVm)

---

## 연습: 모바일 히어로 이미지 추가

이제 여러분의 차례입니다! 방금 추가한 이미지 아래에 `mobile-hero.png`에 대한 또 다른 `<Image>` 컴포넌트를 추가하세요.

- 이미지의 `width`는 `560`이고 `height`는 `620` 픽셀로 설정하세요.
- 모바일 화면에서 보이고 데스크톱에서는 숨겨져야 합니다 - 데스크톱 및 모바일 이미지가 올바르게 교체되었는지 확인하려면 개발 도구를 사용하세요.

준비가 되었으면 아래의 코드 스니펫을 확장하여 정답을 확인하세요.

<details>
<summary><strong>&nbsp;정답 확인</strong></summary>

`/app/page.tsx`

```typescript
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    // ...
    <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
      {/* 히어로 이미지 추가 */}
      <Image
        src="/hero-desktop.png"
        width={1000}
        height={760}
        className="hidden md:block"
        alt="데스크톱 및 모바일 버전을 보여주는 대시보드 프로젝트의 스크린샷"
      />
      <Image
        src="/hero-mobile.png"
        width={560}
        height={620}
        className="block md:hidden"
        alt="모바일 버전을 보여주는 대시보드 프로젝트의 스크린샷"
      />
    </div>
    //...
  );
}
```

</details>

좋습니다! 이제 홈페이지에는 커스텀 폰트와 히어로 이미지가 있습니다.

> ### 퀴즈 시간입니다!
>
> 여러분이 방금 배운 내용을 테스트하고 학습한 내용을 확인하세요.
>
> **참/거짓: 크기를 지정하지 않은 이미지와 웹 폰트는 레이아웃 이동의 일반적인 원인입니다.**
>
> - A: 참
> - B: 거짓
>
> &nbsp;
>
> #### 정답 확인
>
> **A: 참**

---

## 추천하는 읽을거리

이러한 주제에 대해 더 알아보려면 원격 이미지 최적화 및 로컬 글꼴 파일 사용과 관련된 추가 정보를 확인하세요. 글꼴 및 이미지에 대해 더 깊게 파고들고 싶다면 다음을 참고하세요:

- [이미지 최적화 문서](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [글꼴 최적화 문서](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [이미지를 사용한 웹 성능 향상 (MDN)](https://developer.mozilla.org/en-US/docs/Learn/Performance/Multimedia)
- [웹 글꼴 (MDN)](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts)
