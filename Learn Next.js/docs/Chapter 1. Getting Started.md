# Chapter 1. Getting Started

제 1장

## 시작하기

&#x20;

***

&#x20;

### 새 프로젝트 만들기

Next.js 앱을 만들려면 터미널을 열고, [`cd`](https://developer.mozilla.org/en-US/docs/Learn/Tools\_and\_testing/Understanding\_client-side\_tools/Command\_line#basic\_built-in\_terminal\_commands) 명령어로 프로젝트를 저장할 폴더로 이동한 다음 명령을 실행하세요:

```bash
npx create-next-app@latest nextjs-dashboard --use-npm --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example"
```

이 명령은 [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app)을 사용하여 Next.js 애플리케이션을 설정하는 명령줄 인터페이스(CLI) 도구입니다. 위 명령에서는 이 강좌를 위한 [`starter example`](https://github.com/vercel/next-learn/tree/main/dashboard/starter-example)과 함께 `--example` 플래그를 사용하고 있습니다.

&#x20;

***

&#x20;

### 프로젝트 살펴보기

코드를 처음부터 작성하는 튜토리얼과 달리, 이 강좌의 대부분의 코드는 이미 작성되어 있습니다. 이것은 이미 존재하는 코드에 작업할 가능성이 높은 실제 개발을 더 잘 반영합니다.

우리의 목표는 애플리케이션 코드를 _모두_ 작성하지 않고도 Next.js의 주요 기능을 학습하는 데 도움을 주는 것입니다.

설치 후, 코드 편집기에서 프로젝트를 열고 `nextjs-dashboard`로 이동하세요.

```bash
cd nextjs-dashboard
```

프로젝트를 살펴보는 시간을 가지겠습니다.

&#x20;

#### 폴더 구조

프로젝트가 다음과 같은 폴더 구조를 가지고 있는 것을 알 수 있습니다:

![대시보드 프로젝트의 폴더 구조를 보여주는 이미지, 주요 폴더와 파일인 app, public 및 config 파일을 표시합니다.](https://nextjs.org/\_next/image?url=%2Flearn%2Fdark%2Flearn-folder-structure.png\&w=3840\&q=75\&dpl=dpl\_GBJ5KQetnKuo3B8SJxHn8Jai68Qv)

* **`/app`:** 애플리케이션의 모든 경로, 컴포넌트 및 로직을 포함하며, 대부분 여기서 작업하게 될 것입니다.
* **`/app/lib`:** 애플리케이션에서 사용되는 함수를 포함하며, 재사용 가능한 유틸리티 함수 및 데이터 가져오기 함수와 같은 것을 포함합니다.
* **`/app/ui`:** 애플리케이션의 모든 UI 컴포넌트를 포함하며, 카드, 테이블 및 양식과 같은 것을 포함합니다. 시간을 절약하기 위해 이미 이러한 컴포넌트에 스타일이 적용되어 있습니다.
* **`/public`:** 이미지와 같은 애플리케이션의 모든 정적 에셋을 포함합니다.
* **`/script/`:** 나중에 데이터베이스를 채우는 데 사용할 시드 스크립트를 포함합니다.
* **Config 파일:** 애플리케이션의 최상단에 `next.config.js`와 같은 config 파일들 또한 위치하게 됩니다. 프로젝트를 시작할 때 `create-next-app`를 사용하여 대부분의 이러한 파일이 작성되고 미리 구성되었다는 것을 알 수 있습니다. 이 강좌에서는 이러한 파일을 수정할 필요가 없습니다.

이러한 폴더를 자유롭게 살펴보세요. 아직 코드가 무엇을 하는지 모르더라도 걱정하지 마세요.

&#x20;

#### 자리 표시자(Placeholder) 데이터

사용자 인터페이스를 구축할 때 자리 표시자 데이터가 도움이 됩니다. 데이터베이스나 API가 아직 준비되지 않았다면 다음을 사용할 수 있습니다:

* JSON 형식 또는 JavaScript 객체로 된 자리 표시자 데이터 사용.
* [mockAPI](https://mockapi.io/)와 같은 써드파티 서비스 사용.

이 프로젝트에서는 `app/lib/placeholder-data.js`에 일부 자리 표시자 데이터를 제공합니다. 파일의 각 JavaScript 객체는 데이터베이스의 테이블을 나타냅니다. Invoice 테이블 예시:

`/app/lib/placeholder-data.js`

```javascript
const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  // ...
];
```

[데이터베이스 설정](https://nextjs.org/learn/dashboard-app/setting-up-your-database) 챕터에서는 이 데이터를 사용하여 데이터베이스를 _초기화_합니다(초기 데이터로 채웁니다).

&#x20;

#### TypeScript

대부분의 파일에 `.ts` 또는 `.tsx` 확장자가 있는 것도 알 수 있습니다. 이는 프로젝트가 TypeScript로 작성되었기 때문입니다. 우리는 현대 웹 환경을 반영하는 강좌를 만들고자 했습니다.

TypeScript를 몰라도 괜찮습니다. 필요한 경우 TypeScript 코드를 제공할 것입니다.

지금은 `/app/lib/definitions.ts` 파일을 살펴보세요. 여기서는 데이터베이스에서 반환될 타입을 수동으로 정의합니다. 예를 들어, Invoice 테이블에는 다음과 같은 유형이 있습니다:

`/app/lib/definitions.ts`

```typescript
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // TypeScript에서는 이것을 문자열 유니언 유형이라고 합니다.
  // 이것은 "상태" 속성이 '보류 중' 또는 '지불됨' 중 하나만 될 수 있음을 의미합니다.
  status: 'pending' | 'paid';
};
```

TypeScript를 사용하면 컴포넌트나 데이터베이스에 잘못된 데이터 형식을 전달하지 않도록 할 수 있습니다. 즉, Invoice `금액`에 `숫자` 대신 `문자열`을 전달하는 실수를 방지할 수 있습니다.

> **TypeScript 개발자의 경우:**
>
> * 데이터 형식을 수동으로 선언하고 있지만, 보다 안전하게 type을 사용하고 싶다면, 데이터베이스 스키마를 기반으로 유형을 자동 생성하는 [Prisma](https://www.prisma.io/)를 권장합니다.
> * Next.js는 프로젝트가 TypeScript를 사용하는지 감지하고 필요한 패키지 및 구성을 자동으로 설치합니다. Next.js는 코드 편집기용 [TypeScript 플러그인](https://nextjs.org/docs/app/building-your-application/configuring/typescript#typescript-plugin)도 제공하여 자동 완성 및 유형 안전성을 돕습니다.

&#x20;

***

&#x20;

### 개발 서버 실행

프로젝트의 패키지를 설치하려면 `npm i`를 실행하세요.

```bash
npm i
```

그 다음, 개발 서버를 시작하려면 `npm run dev`를 실행하세요.

```bash
npm run dev
```

`npm run dev`는 Next.js 개발 서버를 포트 `3000`에서 시작하는 명령어입니다. 작동 여부를 확인하기 위해 브라우저에서 [http://localhost:3000](http://localhost:3000/)을 열어보세요. 홈 페이지는 다음과 같아야 합니다:

![제목이 'Acme'이고 설명과 로그인 링크가 있는 스타일이 적용되지 않은 페이지.](https://nextjs.org/\_next/image?url=%2Flearn%2Fdark%2Facme-unstyled.png\&w=1920\&q=75\&dpl=dpl\_GBJ5KQetnKuo3B8SJxHn8Jai68Qv)
