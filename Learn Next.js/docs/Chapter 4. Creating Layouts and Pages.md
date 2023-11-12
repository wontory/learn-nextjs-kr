4장

# 레이아웃 및 페이지 생성

지금까지 여러분의 애플리케이션에는 홈 페이지만 있습니다. **레이아웃**과 **페이지**를 사용하여 더 많은 경로를 만드는 방법을 배워보겠습니다.

&nbsp;

> ### 이 장에서는...
>
> 다음과 같은 주제들을 다룰 예정입니다.
>
> - 파일 시스템 라우팅을 사용하여 `dashboard` 경로 만들기
> - 새 경로 세그먼트를 만들 때 폴더와 파일의 역할 이해하기
> - 여러 대시보드 페이지 간에 공유할 수 있는 중첩된 레이아웃 만들기
> - 코로케이션, 부분 렌더링 및 루트 레이아웃이 무엇인지 이해하기

&nbsp;

---

&nbsp;

## 중첩 라우팅

Next.js는 **폴더**를 사용하여 중첩된 경로를 만드는 파일 시스템 라우팅을 사용합니다. 각 폴더는 **URL 세그먼트**에 매핑되는 **경로 세그먼트**를 나타냅니다.

![폴더가 URL 세그먼트에 매핑되는 방법을 보여주는 다이어그램](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Ffolders-to-url-segments.png&w=3840&q=75&dpl=dpl_3h1BESzeFKFcy7pGi2Svm9s7FMVm)

`layout.tsx` 및 `page.tsx` 파일을 사용하여 각 경로에 대한 별도의 UI를 만들 수 있습니다.

`page.tsx`는 React 컴포넌트를 내보내는 특수한 Next.js 파일이며, 경로에 액세스할 수 있도록 하려면 반드시 필요합니다. 여러분의 애플리케이션에는 이미 `page.tsx` 파일이 있습니다: `/app/page.tsx` - `/` 경로와 연결된 홈 페이지입니다.

중첩된 경로를 만들려면 각 폴더를 서로 중첩시키고 내부에 `page.tsx` 파일을 추가하면 됩니다. 예를 들면:

![폴더를 추가하여 새로운 경로 '/dashboard'를 만드는 방법을 보여주는 다이어그램](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Fdashboard-route.png&w=3840&q=75&dpl=dpl_3h1BESzeFKFcy7pGi2Svm9s7FMVm)

`/app/dashboard/page.tsx`는 `/dashboard` 경로와 연결됩니다. 어떻게 작동하는지 확인하기 위해 페이지를 만들어 보겠습니다!

&nbsp;

---

&nbsp;

## 대시보드 페이지 생성

`/app` 안에 `dashboard`라는 새로운 폴더를 만든 다음, `dashboard` 폴더 내부에 다음 내용의 새로운 `page.tsx` 파일을 만드세요:

`/app/dashboard/page.tsx`

```typescript
export default function Page() {
  return <p>대시보드 페이지</p>;
}
```

이제 개발 서버가 실행 중인지 확인하고 [http://localhost:3000/dashboard](http://localhost:3000/dashboard)을 방문해보세요. "대시보드 페이지" 텍스트가 표시되어야 합니다.

이것이 Next.js에서 다양한 페이지를 만드는 방법입니다: 새로운 경로를 만들기 위해 폴더를 생성하고 그 안에 `page` 파일을 추가하는 것입니다.

`page`라는 특별한 이름을 사용함으로써, Next.js는 UI 구성 요소, 테스트 파일 및 다른 관련 코드를 경로와 함께 [코로케이션(colocation)](https://nextjs.org/docs/app/building-your-application/routing#colocation)할 수 있습니다. `page` 파일 내부의 콘텐츠에만 공개적으로 액세스할 수 있습니다. 예를 들어 `/ui` 및 `/lib` 폴더는 여러분의 경로와 함께 `/app` 폴더 내에 *코로케이트*되어 있습니다.

&nbsp;

---

&nbsp;

## 연습: 대시보드 페이지 생성

더 많은 경로를 만드는 연습을 해보겠습니다. 대시보드에서 두 개의 추가 페이지를 만들어 보세요:

1. **고객 페이지**: 이 페이지는 [http://localhost:3000/dashboard/customers](http://localhost:3000/dashboard/customers)에서 액세스할 수 있어야 합니다. 현재는 `<p>Customers Page</p>` 요소를 반환하도록 합니다.
2. **송장 페이지**: 송장 페이지는 [http://localhost:3000/dashboard/invoices](http://localhost:3000/dashboard/invoices)에서 액세스할 수 있어야 합니다. 현재는 `<p>Invoices Page</p>` 요소를 반환하도록 합니다.

이 연습에 도전해보세요. 준비가 되면 아래의 토글을 펼쳐서 정답을 확인하세요:

<details>
<summary><strong>&nbsp;정답 확인</strong></summary>

다음과 같은 폴더 구조가 되어야 합니다:

![폴더를 추가하여 새로운 경로 '/login'를 만드는 방법을 보여주는 다이어그램](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Frouting-solution.png&w=3840&q=75&dpl=dpl_3h1BESzeFKFcy7pGi2Svm9s7FMVm)

`/dashboard/customers/page.tsx`:

```typescript
export default function Page() {
  return <p>Customers Page</p>;
}
```

`/dashboard/invoices/page.tsx`:

```typescript
export default function Page() {
  return <p>Invoices Page</p>;
}
```

</details>

&nbsp;

---

&nbsp;

## 대시보드 레이아웃 생성

대시보드에는 여러 페이지에서 공유되는 일부 형태의 네비게이션이 있습니다. Next.js에서 여러 페이지 간에 공유되는 UI를 만들려면 `layout.tsx`라는 특별한 파일을 사용할 수 있습니다. 이제 대시보드 페이지를 위한 레이아웃을 만들어 보겠습니다!

`/dashboard` 폴더 내에 `layout.tsx`라는 새로운 파일을 추가하고 다음 코드를 붙여넣으세요:

`/app/dashboard/layout.tsx`

```typescript
import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```

이 코드에는 몇 가지 중요한 점이 있으므로 하나씩 살펴보겠습니다:

먼저 `<SideNav />` 컴포넌트를 레이아웃에 가져옵니다. 이 파일에 가져온 모든 컴포넌트는 레이아웃의 일부가 됩니다.

`<Layout />` 컴포넌트는 `children` 속성을 받습니다. 이 자식 요소는 페이지거나 다른 레이아웃일 수 있습니다. 여러분의 경우 `/dashboard` 내부의 페이지는 자동으로 `<Layout />` 내에 중첩될 것입니다:

![대시보드 레이아웃이 대시보드 페이지를 자식으로 중첩하는 폴더 구조](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Fshared-layout.png&w=3840&q=75&dpl=dpl_3h1BESzeFKFcy7pGi2Svm9s7FMVm)

변경 사항을 저장하고 localhost를 확인하여 모든 것이 올바르게 작동하는지 확인하세요. 다음이 표시되어야 합니다:

![사이드네비게이션 및 주요 내용 영역이 있는 대시보드 페이지](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Fshared-layout-page.png&w=1920&q=75&dpl=dpl_3h1BESzeFKFcy7pGi2Svm9s7FMVm)

Next.js에서 레이아웃의 장점은 페이지 컴포넌트만 업데이트되고 레이아웃은 다시 렌더링되지 않는다는 것입니다. 이를 [부분 렌더링](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#3-partial-rendering)이라고 합니다:

![대시보드 레이아웃이 대시보드 페이지만 업데이트되고 다른 페이지 UI가 교체되지 않는 폴더 구조](https://nextjs.org/_next/image?url=%2Flearn%2Fdark%2Fpartial-rendering-dashboard.png&w=3840&q=75&dpl=dpl_3h1BESzeFKFcy7pGi2Svm9s7FMVm)

&nbsp;

---

&nbsp;

## 루트 레이아웃

3장에서 `Inter` 글꼴을 다른 레이아웃 `/app/layout.tsx`에 가져왔습니다. 다시 한 번 살펴보겠습니다:

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

이를 [루트 레이아웃](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required)이라고 하며 필수로 존재해야 합니다. 루트 레이아웃에 추가한 모든 UI는 애플리케이션의 **모든** 페이지에서 공유됩니다. 루트 레이아웃에는 `<html>` 및 `<body>` 태그를 수정하고 메타데이터를 추가할 수 있습니다(메타데이터에 대해서는 [나중에 자세히 알아볼 것입니다](https://nextjs.org/learn/dashboard-app/adding-metadata)).

방금 만든 레이아웃(`/app/dashboard/layout.tsx`)은 대시보드 페이지에만 해당되므로 루트 레이아웃에 어떤 UI도 추가할 필요가 없습니다.

&nbsp;

> ### 퀴즈 시간!
>
> 여러분이 방금 배운 내용을 테스트하고 학습한 내용을 확인하세요.
>
> **Next.js의 레이아웃 파일의 목적은 무엇인가요?**
>
> - A: 전역 오류 핸들러로 작동하기 위함
> - B: 데이터를 가져오고 전체 애플리케이션의 상태를 관리하기 위함
> - C: 여러 페이지 간에 UI를 공유하기 위함
> - D: 전체 애플리케이션의 진입점으로 작동하기 위함
>
> &nbsp;
>
> #### 정답 확인
>
> **C: 여러 페이지 간에 UI를 공유하기 위함**
>
> 레이아웃 파일은 모든 페이지에서 사용할 수 있는 공유 레이아웃을 만드는 가장 좋은 방법입니다.
