## 16장

# 메타데이터 추가하기

메타데이터는 SEO와 공유 가능성에 중요한 역할을 합니다. 이 장에서는 Next.js 애플리케이션에 메타데이터를 추가하는 방법에 대해 논의하겠습니다.

&nbsp;

> ### 이번 장에서는...
>
> 다음과 같은 내용을 다룰 예정입니다.
>
> - 메타데이터?
> - 메타데이터의 종류
> - 메타데이터를 사용하여 Open Graph 이미지를 추가하는 방법
> - 메타데이터를 사용하여 파비콘을 추가하는 방법

&nbsp;

---

&nbsp;

## 메타데이터란 무엇인가요?

웹 개발에서 메타데이터는 웹페이지에 대한 추가적인 세부 정보를 제공합니다. 메타데이터는 페이지를 방문하는 사용자에게는 보이지 않습니다. 대신에 페이지의 HTML 내부에 `<head>` 요소 안에 삽입되어 작동합니다. 이 숨겨진 정보는 검색 엔진과 웹페이지의 내용을 더 잘 이해해야 하는 기타 시스템들에게 중요합니다.

&nbsp;

---

&nbsp;

## 메타데이터의 중요성은 무엇인가요?

메타데이터는 웹페이지의 SEO를 향상시키는 데 중요한 역할을 합니다. 이를 통해 검색 엔진과 소셜 미디어 플랫폼에서 웹페이지를 더 잘 접근하고 이해할 수 있게 됩니다. 적절한 메타데이터는 검색 엔진이 웹페이지를 효과적으로 색인화하도록 돕고 검색 결과에서의 순위를 높일 수 있습니다. 게다가 Open Graph와 같은 메타데이터는 소셜 미디어에서 공유된 링크의 외관을 개선하여 사용자에게 더 매력적이고 유익한 내용으로 보여줍니다.

&nbsp;

---

&nbsp;

## 메타데이터의 종류는 무엇인가요?

메타데이터에는 각각 고유한 목적을 가진 여러 종류가 있습니다. 일반적인 몇 가지 종류는 다음과 같습니다:

**타이틀 메타데이터**: 브라우저 탭에 표시되는 웹페이지의 제목을 담당합니다. 웹페이지의 내용을 이해하는 데 검색 엔진에게 중요합니다.

```html
<title>Page Title</title>
```

**설명 메타데이터**: 웹페이지 내용에 대한 간략한 개요를 제공하며 종종 검색 엔진 결과에 표시됩니다.

```html
<meta name="description" content="A brief description of the page content." />
```

**키워드 메타데이터**: 웹페이지 내용과 관련된 키워드를 포함하며 검색 엔진이 페이지를 색인화하는 데 도움을 줍니다.

```html
<meta name="keywords" content="keyword1, keyword2, keyword3" />
```

**Open Graph 메타데이터**: 소셜 미디어 플랫폼에서 웹페이지가 공유될 때 제목, 설명, 미리보기 이미지 등의 정보를 제공하여 웹페이지가 어떻게 나타날지를 개선합니다.

```html
<meta property="og:title" content="Title Here" />
<meta property="og:description" content="Description Here" />
<meta property="og:image" content="image_url_here" />
```

**파비콘 메타데이터**: 작은 아이콘인 파비콘을 웹페이지에 연결하여 브라우저의 주소 표시줄이나 탭에 표시됩니다.

```html
<link rel="icon" href="path/to/favicon.ico" />
```

&nbsp;

---

&nbsp;

## 메타데이터 추가하기

Next.js에는 애플리케이션 메타데이터를 정의할 수 있는 Metadata API가 있습니다. 애플리케이션에 메타데이터를 추가하는 두 가지 방법이 있습니다:

- **구성 기반**: `layout.js` 또는 `page.js` 파일에서 [정적 `metadata` 객체](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-object) 또는 동적 [`generateMetadata` 함수](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function)를 내보냅니다.

- **파일 기반**: Next.js에는 메타데이터 용도로 특별히 사용되는 여러 가지 특수 파일이 있습니다:
  - `favicon.ico`, `apple-icon.jpg`, `icon.jpg`: 파비콘 및 아이콘용
  - `opengraph-image.jpg` 및 `twitter-image.jpg`: 소셜 미디어 이미지용
  - `robots.txt`: 검색 엔진 크롤링에 대한 지침 제공
  - `sitemap.xml`: 웹사이트 구조에 대한 정보 제공

이 파일들을 정적 메타데이터로 사용하거나 프로젝트 내에서 동적으로 생성할 수 있습니다.

이 두 가지 옵션으로 모든 페이지에 대한 `<head>` 요소를 Next.js가 자동으로 생성합니다.

&nbsp;

### 파비콘과 Open Graph 이미지

`/public` 폴더에서 `favicon.ico` 및 `opengraph-image.jpg` 이미지를 확인할 수 있습니다.

이미지를 `/app` 폴더의 루트로 이동해주세요.

이렇게 하면 Next.js가 자동으로 이 파일들을 파비콘과 OG 이미지로 인식하고 사용합니다. 개발 도구에서 애플리케이션의 `<head>` 요소를 통해 이를 확인할 수 있습니다.

> **참고:** [`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response) 생성자를 사용하여 동적 OG 이미지를 생성할 수도 있습니다.

&nbsp;

### 페이지 제목과 설명

어떤 `layout.js` 또는 `page.js` 파일에서 [`metadata` 객체](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields)를 사용하여 페이지 제목 및 설명과 같은 추가적인 페이지 정보를 포함할 수 있습니다. `layout.js`에 있는 메타데이터는 해당 레이아웃을 사용하는 모든 페이지에 상속됩니다.

루트 레이아웃에서 다음과 같은 필드를 포함하는 새 `metadata` 객체를 만들어주세요:

`/app/layout.tsx`

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout() {
  // ...
}
```

Next.js는 애플리케이션에 제목과 메타데이터를 자동으로 추가합니다.

하지만 특정 페이지에 사용자 정의 제목을 추가하려면 해당 페이지 자체에 `metadata` 객체를 추가할 수 있습니다. 중첩된 페이지의 메타데이터는 상위에서의 메타데이터를 재정의합니다.

예를 들어 `/dashboard/invoices` 페이지에서 페이지 제목을 업데이트할 수 있습니다:

`/app/dashboard/invoices/page.tsx`

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices | Acme Dashboard',
};
```

이렇게 하면 모든 페이지마다 애플리케이션 이름을 반복 정의해야 합니다. 회사 이름과 같은 변경 사항이 있으면 모든 페이지를 업데이트해야 합니다.

대신에 `metadata` 객체의 `title.template` 필드를 사용하여 페이지 제목의 템플릿을 정의할 수 있습니다. 이 템플릿에는 페이지 제목과 포함하고 싶은 다른 정보를 포함할 수 있습니다.

루트 레이아웃에서 메타데이터 객체를 업데이트하여 템플릿을 포함하도록 해주세요:

`/app/layout.tsx`

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
```

템플릿 안의 `%s`는 특정 페이지 제목으로 대체됩니다.

이제 `/dashboard/invoices` 페이지에서 페이지 제목을 추가할 수 있습니다:

`/app/dashboard/invoices/page.tsx`

```tsx
export const metadata: Metadata = {
  title: 'Invoices',
};
```

`/dashboard/invoices` 페이지로 이동하여 `<head>` 요소를 확인해보세요. 페이지 제목이 이제 `Invoices | Acme Dashboard`로 표시되어야 합니다.

&nbsp;

---

&nbsp;

## 실습: 메타데이터 추가하기

이제 메타데이터에 대해 학습했으니 다른 페이지에 제목을 추가하는 실습을 해보세요:

1. `/login` 페이지.
2. `/dashboard/` 페이지.
3. `/dashboard/customers` 페이지.
4. `/dashboard/invoices/create` 페이지.
5. `/dashboard/invoices/[id]/edit` 페이지.

Next.js Metadata API는 강력하고 유연하여 애플리케이션의 메타데이터를 완전히 제어할 수 있습니다. 여기서는 기본적인 메타데이터를 추가하는 방법을 안내했지만 `keywords`, `robots`, `canonical` 등 여러 필드를 추가할 수 있습니다. [문서](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)를 살펴보고 원하는 추가 메타데이터를 애플리케이션에 추가해보세요.
